import { useCallback } from 'react';

import useAsyncStorage from '@/hooks/useAsyncStorage';

import type { PurchaseInfo, PurchaseType } from '@/types/storage';

// 서비스 구매 내역을 관리하는 훅
export function usePurchaseHistory() {
    const { data: purchaseHistory, updateData, refreshData, removeData } = useAsyncStorage('PurchaseHistory');

    // 서비스 구매 상태 및 유효성 체크
    const isPurchased = useCallback(
        (serviceCode: string) => {
            if (!purchaseHistory || !purchaseHistory[serviceCode] || !purchaseHistory[serviceCode].purchased) {
                return false;
            }

            const purchaseInfo = purchaseHistory[serviceCode];
            const currentYear = new Date().getFullYear();
            const purchaseYear = new Date(purchaseInfo.purchaseDate).getFullYear();

            // 구매 유형별 유효성 검사
            switch (purchaseInfo.type) {
                case 'permanent': // 영구 구매는 항상 유효
                    return true;
                case 'single-use': // 단일 사용은 이미 사용했으면 무효
                    return false; // 실제로는 결과 조회 후 만료 처리 로직이 필요
                case 'annual': // 연간 구매는 해당 연도만 유효
                    return currentYear === purchaseYear;
                default:
                    return false;
            }
        },
        [purchaseHistory]
    );

    // 서비스 구매 상태 업데이트
    const markAsPurchased = useCallback(
        (serviceCode: string, purchaseType: PurchaseType = 'permanent') => {
            const purchaseInfo: PurchaseInfo = {
                purchased: true,
                type: purchaseType,
                purchaseDate: Date.now(),
            };

            const updatedData = { [serviceCode]: purchaseInfo };
            updateData(updatedData);
        },
        [updateData]
    );

    // 모든 연간 구매 리셋 (연도가 변경되었을 때 호출)
    const resetAnnualPurchases = useCallback(() => {
        if (!purchaseHistory) return;

        const updatedHistory = { ...purchaseHistory };
        const currentYear = new Date().getFullYear();

        // 모든 구매 내역을 순회하며 연간 구매만 확인
        Object.keys(updatedHistory).forEach((serviceCode) => {
            const purchaseInfo = updatedHistory[serviceCode];
            if (purchaseInfo.type === 'annual') {
                const purchaseYear = new Date(purchaseInfo.purchaseDate).getFullYear();
                // 이전 연도의 구매라면 구매 상태를 false로 변경
                if (purchaseYear < currentYear) {
                    updatedHistory[serviceCode] = {
                        ...purchaseInfo,
                        purchased: false,
                    };
                }
            }
        });

        updateData(updatedHistory);
    }, [purchaseHistory, updateData]);

    // 특정 서비스의 구매 정보 가져오기
    const getPurchaseInfo = useCallback(
        (serviceCode: string): PurchaseInfo | null => {
            return purchaseHistory?.[serviceCode] || null;
        },
        [purchaseHistory]
    );

    return {
        isPurchased,
        markAsPurchased,
        purchaseHistory,
        resetAnnualPurchases,
        getPurchaseInfo,
        refreshPurchaseHistory: refreshData,
        removePurchaseHistory: removeData,
    };
}

export default usePurchaseHistory;
