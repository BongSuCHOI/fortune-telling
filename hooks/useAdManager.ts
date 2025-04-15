import { useState, useCallback } from 'react';
import { adManager, AdResult } from '@/utils/AdManager';
import { useAdWatchStatus } from '@/hooks/useAdWatchStatus';
import { AdWatchPeriod } from '@/types/storage';
import Logger from '@/utils/Logger';

const TAG = 'AdManager';

/**
 * 광고 관리 훅 - 광고 요청 및 처리를 간소화하는 커스텀 훅
 * @param categories 관리할 광고 카테고리 배열
 */
export function useAdManager<T extends string>(categories: T[]) {
    // 광고 로딩 상태
    const [loading, setLoading] = useState<boolean>(false);
    // 광고 에러 상태
    const [error, setError] = useState<string | null>(null);

    // 광고 시청 상태 훅
    const { adWatched, updateAdWatched } = useAdWatchStatus<T>(categories);

    /**
     * 광고 시청 요청 함수
     * 광고 시청 후 성공 시 상태를 업데이트 함
     */
    const requestAd = useCallback(
        async (category: T, period: AdWatchPeriod): Promise<boolean> => {
            Logger.info(TAG, `광고 요청: ${category}/${period}`);

            try {
                setLoading(true);
                setError(null);

                // 광고 요청
                const result: AdResult = await adManager.showRewardedAd(category, period);

                if (result.success) {
                    // 광고 시청 성공 시 상태 업데이트
                    updateAdWatched(category, period);
                    Logger.event(TAG, '광고 시청 성공', { category, period });
                    return true;
                } else {
                    // 광고 시청 실패 시 에러 상태 업데이트
                    const errorMsg = result.error || '광고를 불러오는데 실패했습니다';
                    setError(errorMsg);
                    Logger.event(TAG, '광고 시청 실패', { category, period, error: errorMsg });
                    return false;
                }
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다';
                setError(errorMessage);
                Logger.error(TAG, `광고 요청 에러: ${errorMessage}`, { category, period });
                return false;
            } finally {
                setLoading(false);
            }
        },
        [updateAdWatched, loading, setLoading, setError]
    );

    return {
        loading,
        error,
        adWatched,
        requestAd,
        clearError: () => setError(null),
    };
}

export default useAdManager;
