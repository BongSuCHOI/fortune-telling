import { useCallback } from 'react';
import useAsyncStorage from '@/hooks/useAsyncStorage';
import { AdWatchedState } from '@/types/storage';

/**
 * 광고 시청 상태를 관리하는 훅
 * 새로운 useAsyncStorage 훅을 사용하여 구현
 */
export function useAdWatchStatus<T extends string>(categories: T[]) {
    const { data: adWatchedData, updateData, refreshData } = useAsyncStorage('AdWatched');

    // 기본적으로 모든 카테고리가 false(광고 시청 안함)로 초기화된 상태를 반환
    const adWatched = categories.reduce((acc, category) => {
        acc[category] = adWatchedData?.[category] || false;
        return acc;
    }, {} as Record<T, boolean>);

    // 특정 카테고리의 광고 시청 상태를 변경하는 함수
    const markAdWatched = useCallback(
        (category: T) => {
            const updatedData: Partial<AdWatchedState> = { [category]: true };
            updateData(updatedData);
        },
        [updateData]
    );

    // 모든 광고 시청 상태를 초기화하는 함수
    const resetAdWatchedStatus = useCallback(() => {
        const resetData = categories.reduce((acc, category) => {
            acc[category] = false;
            return acc;
        }, {} as Record<T, boolean>);

        updateData(resetData);
    }, [categories, updateData]);

    return {
        adWatched,
        markAdWatched,
        resetAdWatchedStatus,
        refreshAdWatchedStatus: refreshData,
    };
}

export default useAdWatchStatus;
