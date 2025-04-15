import { useCallback, useEffect } from 'react';
import useAsyncStorage from '@/hooks/useAsyncStorage';
import { hasTimeExpired } from '@/constants/TimeConstants';
import Logger from '@/utils/Logger';
import { AdWatchedState, AdWatchInfo, AdWatchPeriod } from '@/types/storage';

const TAG = 'AdWatchStatus';

/**
 * 광고 시청 상태를 관리하는 훅
 * 주기별(일별, 주별, 월별, 연간, 영구) 광고 시청 상태를 관리
 * @param categories 관리할 광고 카테고리 배열
 */
export function useAdWatchStatus<T extends string>(categories: T[]) {
    const { data: adWatchedData, updateData, refreshData, removeData } = useAsyncStorage('AdWatched');

    // 광고 시청 상태 및 유효성 체크
    const hasAdWatchExpired = useCallback((adInfo: AdWatchInfo): boolean => {
        if (!adInfo || !adInfo.watched) {
            return true;
        }
        const isExpired = hasTimeExpired(adInfo.watchedAt, adInfo.period);
        if (isExpired) {
            Logger.debug(TAG, `광고 시청 만료 확인: ${isExpired ? '만료됨' : '유효함'}`, {
                period: adInfo.period,
                watchedAt: new Date(adInfo.watchedAt).toISOString(),
            });
        }
        return isExpired;
    }, []);

    // 주기가 경과한 광고 시청 상태 자동 초기화
    useEffect(() => {
        if (!adWatchedData) return;

        let needsUpdate = false;
        const updatedData = { ...adWatchedData };

        // 모든 카테고리를 순회하며 만료된 광고 시청 상태 확인
        Object.entries(updatedData).forEach(([category, adInfo]) => {
            if (hasAdWatchExpired(adInfo)) {
                // 만료된 상태 갱신
                updatedData[category] = {
                    ...adInfo,
                    watched: false,
                };
                needsUpdate = true;
            }
        });

        // 만료된 상태가 있다면 업데이트
        if (needsUpdate) {
            Logger.info(TAG, '만료된 광고 시청 상태 자동 갱신');
            updateData(updatedData);
        }
    }, [adWatchedData, hasAdWatchExpired, updateData]);

    // 기본적으로 모든 카테고리가 false(광고 시청 안함)로 초기화된 상태를 반환
    const adWatched = categories.reduce((acc, category) => {
        // 광고 시청 정보가 있고 유효하면 true, 그렇지 않으면 false
        const adInfo = adWatchedData?.[category];
        acc[category] = adInfo ? adInfo.watched && !hasAdWatchExpired(adInfo) : false;
        return acc;
    }, {} as Record<T, boolean>);

    // 광고 시청 상태 업데이트
    const updateAdWatched = useCallback(
        (category: T, period: AdWatchPeriod) => {
            Logger.info(TAG, `광고 시청 상태 업데이트: ${category}`, { period });

            const adInfo: AdWatchInfo = {
                watched: true,
                watchedAt: Date.now(),
                period,
            };
            const updatedData: Partial<AdWatchedState> = { [category]: adInfo };

            try {
                updateData(updatedData);
                Logger.event(TAG, '광고 시청 상태 업데이트 성공', { category, period });
            } catch (error) {
                Logger.error(TAG, `광고 시청 상태 업데이트 실패: ${category}`, { error });
            }
        },
        [updateData]
    );

    // 특정 카테고리의 광고 시청 주기를 변경하는 함수
    const updateAdWatchPeriod = useCallback(
        (category: T, period: AdWatchPeriod) => {
            const currentInfo = adWatchedData?.[category];
            if (!currentInfo) return;

            const updatedInfo: AdWatchInfo = {
                ...currentInfo,
                period,
            };
            const updatedData: Partial<AdWatchedState> = { [category]: updatedInfo };
            updateData(updatedData);
        },
        [adWatchedData, updateData]
    );

    // 모든 광고 시청 상태를 초기화하는 함수
    const resetAllAdWatchedStatus = useCallback(() => {
        if (!adWatchedData) return;

        const resetData = categories.reduce((acc, category) => {
            acc[category] = {
                watched: false,
                watchedAt: 0,
                period: adWatchedData[category]?.period || 'daily',
            };
            return acc;
        }, {} as Record<string, AdWatchInfo>);
        updateData(resetData);
    }, [categories, adWatchedData, updateData]);

    // 특정 카테고리의 광고 시청 상태 초기화
    const resetCategoryAdWatched = useCallback(
        (category: T) => {
            if (!adWatchedData) return;

            const resetInfo: AdWatchInfo = {
                watched: false,
                watchedAt: 0,
                period: adWatchedData[category]?.period || 'daily',
            };
            const updatedData: Partial<AdWatchedState> = { [category]: resetInfo };
            updateData(updatedData);
        },
        [adWatchedData, updateData]
    );

    return {
        adWatched,
        updateAdWatched,
        resetAllAdWatchedStatus,
        resetCategoryAdWatched,
        updateAdWatchPeriod,
        refreshAdWatchedStatus: refreshData,
        removeAdWatchedStatus: removeData,
        // 세부 정보 접근을 위한 추가 속성
        adWatchedDetails: adWatchedData,
    };
}

export default useAdWatchStatus;
