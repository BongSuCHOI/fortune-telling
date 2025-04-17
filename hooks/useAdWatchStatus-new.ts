import { useCallback } from 'react';
import useAsyncStorage from '@/hooks/useAsyncStorage';
import { hasTimeExpired } from '@/constants/TimeConstants';
import Logger from '@/utils/Logger';
import { AdWatchedState, AdWatchInfo, AdWatchPeriod } from '@/types/storage';

const TAG = 'AdWatchStatus';

/**
 * 광고 시청 상태를 관리하는 훅
 * 주기별(일별, 주별, 월별, 연간, 영구) 광고 시청 상태를 관리
 * @param categories 관리할 광고 카테고리 배열
 * @returns 광고 상태 관리 함수들
 */
export function useAdWatchStatus<T extends string>(categories: T[] = []) {
    const { data: adWatchedData, updateData, refreshData, removeData } = useAsyncStorage('AdWatched');

    // 광고 시청 상태 존재 체크
    const hasCategory = useCallback(
        (category: T): boolean => {
            return !!adWatchedData?.[category];
        },
        [adWatchedData]
    );

    // 광고 시청 유효성 체크
    const isExpired = useCallback(
        (category: T): boolean => {
            const adInfo = adWatchedData?.[category];

            // 없으면 만료처리
            if (!adInfo || !adInfo.watched) {
                return true;
            }

            const expired = hasTimeExpired(adInfo.watchedAt, adInfo.period);
            if (expired) {
                resetExpired(category, adInfo);
                Logger.debug(TAG, `광고 시청 만료 확인: ${expired ? '만료됨' : '유효함'}`, {
                    category,
                    period: adInfo.period,
                    watchedAt: new Date(adInfo.watchedAt).toISOString(),
                });
            }

            return expired;
        },
        [adWatchedData]
    );

    // 광고 시청 상태 업데이트
    const updateWatch = useCallback(
        (category: T, period: AdWatchPeriod) => {
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

    // 주기가 경과한 광고 시청 상태 초기화
    const resetExpired = useCallback(
        (category: T, adWatchInfo: AdWatchInfo) => {
            const adInfo: AdWatchInfo = {
                ...adWatchInfo,
                watched: false,
            };
            const updatedData: Partial<AdWatchedState> = { [category]: adInfo };
            updateData(updatedData);
        },
        [updateData]
    );

    // 모든 카테고리의 시청 상태 체크
    const getWatchStatus = useCallback(() => {
        const result: Record<string, boolean> = {};

        if (categories.length && adWatchedData) {
            categories.forEach((category) => {
                result[category] = !isExpired(category);
            });
        }

        return result;
    }, [categories, adWatchedData, isExpired]);

    return {
        // 광고 시청 상태 데이터
        watchedData: adWatchedData,
        // 광고 시청 상태 함수
        hasCategory,
        isExpired,
        updateWatch,
        resetExpired,
        // 모든 카테고리의 시청 상태 (미만료 = true)
        watchStatus: getWatchStatus(),
        // 스토리지 제어
        refreshWatchStatus: refreshData,
        removeWatchStatus: removeData,
    };
}

export default useAdWatchStatus;
