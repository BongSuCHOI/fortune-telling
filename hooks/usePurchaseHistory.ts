import { useCallback, useEffect } from 'react';

import useAsyncStorage from '@/hooks/useAsyncStorage';
import { hasTimeExpired } from '@/constants/TimeConstants';

import type { PurchaseInfo, purchasePeriod, PurchaseHistoryState } from '@/types/storage';

/**
 * 서비스 구매 내역을 관리하는 훅
 * 주기별(일회성, 월간, 연간, 영구) 구매 상태를 관리
 * @param categories 관리할 구매 카테고리 배열
 */
export function usePurchaseHistory<T extends string>(categories: T[]) {
    const { data: purchaseHistory, updateData, refreshData, removeData } = useAsyncStorage('PurchaseHistory');

    console.log(purchaseHistory);

    // 서비스 구매 상태 및 유효성 체크
    const hasPurchaseExpired = useCallback((purchaseInfo: PurchaseInfo): boolean => {
        if (!purchaseInfo || !purchaseInfo.purchased || !purchaseInfo.purchasedAt) {
            return false;
        }

        return hasTimeExpired(purchaseInfo.purchasedAt, purchaseInfo.period);
    }, []);

    // 주기가 경과한 구매 상태 자동 만료 처리
    useEffect(() => {
        if (!purchaseHistory) return;

        let needsUpdate = false;
        const updatedData = { ...purchaseHistory };

        // 모든 서비스를 순회하며 만료된 구매 상태 확인
        Object.entries(updatedData).forEach(([serviceCode, info]) => {
            if (hasPurchaseExpired(info)) {
                updatedData[serviceCode] = {
                    ...info,
                    purchased: false, // 만료된 구매 상태는 false로 변경
                };
                needsUpdate = true;
            }
        });

        // 만료된 상태가 있다면 업데이트
        if (needsUpdate) {
            updateData(updatedData);
        }
    }, [purchaseHistory, hasPurchaseExpired, updateData]);

    // 기본적으로 모든 카테고리가 false(구매 안함)로 초기화된 상태를 반환
    const purchased = categories.reduce((acc, category) => {
        // 구매 정보가 있고 유효하면 true, 그렇지 않으면 false
        const purchaseInfo = purchaseHistory?.[category];
        acc[category] = purchaseInfo ? purchaseInfo.purchased && !hasPurchaseExpired(purchaseInfo) : false;
        return acc;
    }, {} as Record<T, boolean>);

    // 서비스 구매 상태 업데이트
    const updatePurchased = useCallback(
        (serviceCode: T, period: purchasePeriod) => {
            const purchaseInfo: PurchaseInfo = {
                purchased: true,
                purchasedAt: Date.now(),
                period,
            };

            const updatedData: Partial<PurchaseHistoryState> = { [serviceCode]: purchaseInfo };
            updateData(updatedData);
        },
        [updateData]
    );

    // 특정 서비스의 구매 주기 변경
    const updatePurchasePeriod = useCallback(
        (serviceCode: string, period: purchasePeriod) => {
            if (!purchaseHistory || !purchaseHistory[serviceCode]) return;

            const currentInfo = purchaseHistory[serviceCode];
            const updatedInfo: PurchaseInfo = {
                ...currentInfo,
                period,
            };

            const updatedData: Partial<PurchaseHistoryState> = { [serviceCode]: updatedInfo };
            updateData(updatedData);
        },
        [purchaseHistory, updateData]
    );

    // 특정 서비스의 구매 정보 가져오기
    const getPurchaseInfo = useCallback(
        (serviceCode: string): PurchaseInfo | null => {
            return purchaseHistory?.[serviceCode] || null;
        },
        [purchaseHistory]
    );

    // 모든 구매 상태를 초기화하는 함수
    const resetAllPurchaseStatus = useCallback(() => {
        if (!purchaseHistory) return;

        const resetData = categories.reduce((acc, category) => {
            if (purchaseHistory[category]) {
                acc[category] = {
                    purchased: false,
                    purchasedAt: 0,
                    period: purchaseHistory[category].period,
                };
            }
            return acc;
        }, {} as Record<string, PurchaseInfo>);
        updateData(resetData);
    }, [categories, purchaseHistory, updateData]);

    // 특정 서비스의 구매 상태 초기화
    const resetServicePurchase = useCallback(
        (serviceCode: string) => {
            if (!purchaseHistory || !purchaseHistory[serviceCode]) return;

            const currentInfo = purchaseHistory[serviceCode];
            const resetInfo: PurchaseInfo = {
                purchased: false,
                purchasedAt: 0,
                period: currentInfo.period,
            };

            const updatedData: Partial<PurchaseHistoryState> = { [serviceCode]: resetInfo };
            updateData(updatedData);
        },
        [purchaseHistory, updateData]
    );

    return {
        purchased,
        updatePurchased,
        resetAllPurchaseStatus,
        resetServicePurchase,
        updatePurchasePeriod,
        hasPurchaseExpired,
        purchaseHistory,
        getPurchaseInfo,
        refreshPurchaseHistory: refreshData,
        removePurchaseHistory: removeData,
        // 세부 정보 접근을 위한 추가 속성
        purchaseHistoryDetails: purchaseHistory,
    };
}

export default usePurchaseHistory;
