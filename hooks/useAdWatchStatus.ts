import { useCallback, useEffect } from 'react';
import useAsyncStorage from '@/hooks/useAsyncStorage';
import { AdWatchedState, AdWatchInfo, AdWatchPeriod } from '@/types/storage';

/**
 * 광고 시청 상태를 관리하는 훅
 * 주기별(일별, 주별, 월별, 영구) 광고 시청 상태를 관리
 */
export function useAdWatchStatus<T extends string>(categories: T[]) {
    const { data: adWatchedData, updateData, refreshData, removeData } = useAsyncStorage('AdWatched');

    // console.log(adWatchedData);
    // removeData();

    // 현재 시간 기준으로 광고 시청 상태가 유효한지 검사하는 함수
    const isAdWatchValid = useCallback((adInfo?: AdWatchInfo): boolean => {
        if (!adInfo || !adInfo.watched || !adInfo.watchedAt) return false;

        const now = Date.now();
        const watchedTime = adInfo.watchedAt;

        switch (adInfo.period) {
            case 'daily':
                // 하루 지났는지 확인 (24시간)
                const oneDayMs = 24 * 60 * 60 * 1000;
                return now - watchedTime < oneDayMs;

            case 'weekly':
                // 일주일 지났는지 확인 (7일)
                const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
                return now - watchedTime < oneWeekMs;

            case 'monthly':
                // 한달 지났는지 확인 (30일)
                const oneMonthMs = 30 * 24 * 60 * 60 * 1000;
                return now - watchedTime < oneMonthMs;

            case 'yearly':
                // 1년 지났는지 확인 (365일)
                const oneYearMs = 365 * 24 * 60 * 60 * 1000;
                return now - watchedTime < oneYearMs;

            case 'permanent':
                // 영구적으로 유효
                return true;

            default:
                return false;
        }
    }, []);

    // 주기가 경과한 광고 시청 상태 자동 초기화
    useEffect(() => {
        if (!adWatchedData) return;

        let needsUpdate = false;
        const updatedData = { ...adWatchedData };

        // 모든 카테고리를 순회하며 만료된 광고 시청 상태 확인
        Object.keys(updatedData).forEach((category) => {
            const adInfo = updatedData[category];
            if (adInfo && adInfo.watched && !isAdWatchValid(adInfo)) {
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
            updateData(updatedData);
        }
    }, [adWatchedData, isAdWatchValid, updateData]);

    // 기본적으로 모든 카테고리가 false(광고 시청 안함)로 초기화된 상태를 반환
    const adWatched = categories.reduce((acc, category) => {
        // 광고 시청 정보가 있고 유효하면 true, 그렇지 않으면 false
        const adInfo = adWatchedData?.[category];
        acc[category] = adInfo ? adInfo.watched && isAdWatchValid(adInfo) : false;
        return acc;
    }, {} as Record<T, boolean>);

    // 특정 카테고리의 광고 시청 상태를 변경하는 함수
    const markAdWatched = useCallback(
        (category: T, period: AdWatchPeriod) => {
            const adInfo: AdWatchInfo = {
                watched: true,
                watchedAt: Date.now(),
                period,
            };
            const updatedData: Partial<AdWatchedState> = { [category]: adInfo };
            updateData(updatedData);
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
    const resetAdWatchedStatus = useCallback(() => {
        if (!adWatchedData) return;

        const resetData = categories.reduce((acc, category) => {
            acc[category] = {
                watched: false,
                period: adWatchedData[category].period,
            };
            return acc;
        }, {} as Record<string, AdWatchInfo>);
        updateData(resetData);
    }, [categories, updateData]);

    // 특정 카테고리의 광고 시청 상태 초기화
    const resetCategoryAdWatched = useCallback(
        (category: T) => {
            if (!adWatchedData) return;

            const resetInfo: AdWatchInfo = {
                watched: false,
                period: adWatchedData[category].period,
            };
            const updatedData: Partial<AdWatchedState> = { [category]: resetInfo };
            updateData(updatedData);
        },
        [adWatchedData, updateData]
    );

    return {
        adWatched,
        markAdWatched,
        resetAdWatchedStatus,
        resetCategoryAdWatched,
        updateAdWatchPeriod,
        refreshAdWatchedStatus: refreshData,
        // 세부 정보 접근을 위한 추가 속성
        adWatchedDetails: adWatchedData,
    };
}

export default useAdWatchStatus;
