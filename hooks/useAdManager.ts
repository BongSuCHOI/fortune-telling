import { useState, useCallback, useEffect } from 'react';
import { TestIds } from 'react-native-google-mobile-ads';
import { useAdWatchStatus } from '@/hooks/useAdWatchStatus-new';
import { useRewardAdmob } from '@/hooks/useRewardAdmob';
import { AdWatchPeriod } from '@/types/storage';
import Logger from '@/utils/Logger';

const TAG = 'AdManager';

// 개발 환경에서는 테스트 ID, 프로덕션에서는 실제 ID 사용
const getAdUnitId = (adType: string) => {
    if (__DEV__) {
        return TestIds.REWARDED;
    }

    // 광고 유형별 실제 ID 매핑
    const adUnitIds: Record<string, string> = {
        rewarded: 'ca-app-pub-4609564891060230/2711373918',
        // 추가 광고 유형이 있다면 여기에 추가
    };

    return adUnitIds[adType] || adUnitIds.rewarded;
};

/**
 * 광고 관리자 옵션
 */
export interface AdManagerOptions {
    /** 광고 키워드 */
    keywords?: string[];
    /** 보상형 광고 ID */
    rewardedAdId?: string;
}

/**
 * 광고 요청 결과 타입
 */
export interface AdResult {
    success: boolean;
    error?: string;
}

/**
 * 광고 관리 훅 - 광고 요청 및 처리를 간소화하는 커스텀 훅
 * @param categories 관리할 광고 카테고리 배열
 * @param options 광고 관리자 옵션
 * @returns 광고 관리 상태 및 함수
 */
export function useAdManager<T extends string>(categories: T[] = [], options: AdManagerOptions = {}) {
    // 기본 옵션 설정
    const { keywords = ['fortune', 'horoscope', 'lifestyle'], rewardedAdId = getAdUnitId('rewarded') } = options;

    // 광고 상태
    const [error, setError] = useState<string | null>(null);
    const [requestCategory, setRequestCategory] = useState<string | null>(null);
    const [requestPeriod, setRequestPeriod] = useState<AdWatchPeriod | null>(null);

    // 광고 시청 상태 관리 훅
    const { watchStatus: adWatched, updateWatch, refreshWatchStatus } = useAdWatchStatus<T>(categories);

    // 리워드 광고 콜백 함수
    const rewardAdCallbacks = {
        onRewarded: useCallback(() => {
            if (requestCategory && requestPeriod) {
                updateWatch(requestCategory as T, requestPeriod);
                Logger.info(TAG, '시청 상태 업데이트', {
                    category: requestCategory,
                    period: requestPeriod,
                });
            }
        }, [requestCategory, requestPeriod, updateWatch]),

        onError: useCallback((error: Error) => {
            setError(error.message || '광고 처리 중 오류가 발생했습니다');
        }, []),
    };

    // 광고 훅 사용
    const {
        loaded,
        rewarded,
        error: adError,
        showAd,
        loadAd,
    } = useRewardAdmob(
        rewardedAdId,
        {
            keywords,
            requestNonPersonalizedAdsOnly: true,
        },
        rewardAdCallbacks
    );

    // 광고 에러 발생 시 상태 업데이트
    useEffect(() => {
        if (adError) {
            setError(adError.message);
        }
    }, [adError]);

    /**
     * 광고 시청 요청 함수
     * @param category 광고 카테고리
     * @param period 광고 시청 주기
     * @returns 성공 여부
     */
    const requestAd = useCallback(
        async (category: T, period: AdWatchPeriod): Promise<boolean> => {
            Logger.info(TAG, `광고 요청: ${category}/${period}`);

            try {
                setError(null);
                setRequestCategory(category);
                setRequestPeriod(period);

                if (loaded) {
                    showAd();
                    return true;
                } else {
                    setError('광고가 로드되지 않았습니다. 잠시 후 다시 시도하세요.');
                    Logger.warn(TAG, '광고가 로드되지 않음', { category, period });
                    return false;
                }
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다';
                setError(errorMessage);
                Logger.error(TAG, `광고 요청 에러: ${errorMessage}`, { category, period });
                return false;
            }
        },
        [loaded, showAd, updateWatch]
    );

    /**
     * 광고 시청 상태 새로고침
     */
    const refreshAdWatched = useCallback(() => {
        refreshWatchStatus();
    }, [refreshWatchStatus]);

    /**
     * 에러 상태 초기화
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        // 광고 상태
        loading: !loaded,
        loaded,
        rewarded,
        error,
        adWatched,

        // 광고 제어 함수
        requestAd,
        loadAd,
        refreshAdWatched,
        clearError,
    };
}

export default useAdManager;
