import { RewardedAd, RewardedAdEventType, TestIds, AdEventType } from 'react-native-google-mobile-ads';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { AdWatchPeriod } from '@/types/storage';
import Logger from '@/utils/Logger';
import { useAdWatchStatus } from '@/hooks/useAdWatchStatus';

const TAG = 'AdManager';

/**
 * 보상형 광고 요청 시 반환될 결과 타입
 */
export interface AdResult {
    success: boolean;
    error?: string;
}

/**
 * 광고 관리 훅 - 광고 요청 및 처리를 간소화하는 커스텀 훅
 * @param categories 관리할 광고 카테고리 배열
 */
export function useAdManager<T extends string>(categories: T[]) {
    // 광고 시청 상태 관련 훅
    const { adWatched, updateAdWatched } = useAdWatchStatus<T>(categories);

    // 광고 로딩 상태
    const [loading, setLoading] = useState<boolean>(false);
    // 광고 에러 상태
    const [error, setError] = useState<string | null>(null);
    // 광고 요청 상태
    const [adRequested, setAdRequested] = useState<boolean>(false);
    // 광고 로드 상태
    const [adLoaded, setAdLoaded] = useState<boolean>(false);
    // 테스트 모드
    const [testMode, setTestMode] = useState<boolean>(__DEV__);
    // 현재 로드된 광고
    const [rewardedAd, setRewardedAd] = useState<RewardedAd | null>(null);

    // 광고 아이디 - 개발 환경에서는 테스트 ID, 프로덕션에서는 실제 ID 사용
    const adUnitId = useMemo(() => (__DEV__ ? TestIds.REWARDED : 'ca-app-pub-4609564891060230/2711373918'), []);
    // 광고 키워드
    const adKeywords = useMemo(() => ['fortune', 'horoscope', 'lifestyle', 'investment'], []);

    /**
     * 광고를 로드하는 메서드
     * @returns Promise<boolean> 광고 로드 성공 여부
     */
    const loadRewardedAd = useCallback(async (): Promise<boolean> => {
        return new Promise((resolve) => {
            // 기존 광고 리스너 정리
            rewardedAd?.removeAllListeners();

            // 새 광고 생성
            const newRewardedAd = RewardedAd.createForAdRequest(adUnitId, {
                keywords: adKeywords,
                requestNonPersonalizedAdsOnly: true,
            });

            setRewardedAd(newRewardedAd);

            // 광고 로드 성공 이벤트 리스너
            const loadedListener = newRewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
                Logger.info(TAG, '광고 로드 성공');
                loadedListener();
                failedToLoadListener();
                setAdLoaded(true);
                resolve(true);
            });

            // 광고 로드 실패 이벤트 리스너
            const failedToLoadListener = newRewardedAd.addAdEventListener(RewardedAdEventType.ERROR, (error) => {
                Logger.error(TAG, '광고 로드 실패', error);
                loadedListener();
                failedToLoadListener();
                setAdLoaded(false);
                resolve(false);
            });

            // 광고 로드 시작
            newRewardedAd.load();
        });
    }, [adUnitId, adKeywords, rewardedAd]);

    /**
     * 보상형 광고 시청 요청
     * 실제 구현에서는 AdMob 또는 다른 SDK의 API 호출
     */
    const showRewardedAd = useCallback(
        async (category: string, period: AdWatchPeriod): Promise<AdResult> => {
            Logger.info(TAG, `보상형 광고 요청: ${category}/${period}`);

            // 이미 광고 요청 중이면 중복 요청 방지
            if (adRequested) {
                Logger.warn(TAG, '이미 진행 중인 광고 요청이 있습니다', { category, period });
                return {
                    success: false,
                    error: 'Another ad request is in progress',
                };
            }

            setAdRequested(true);
            setLoading(true);

            try {
                // 테스트 모드에서는 1초 지연 후 성공 반환
                if (testMode) {
                    if (__DEV__) {
                        Logger.debug(TAG, '테스트 모드에서 광고 요청 시뮬레이션', { category, period });
                    }

                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    const result: AdResult = { success: true };

                    Logger.info(TAG, '광고 요청 완료: 성공', { category, period });
                    return result;
                }

                // 실제 광고 구현
                // 광고가 로드되지 않았으면 로드 먼저 실행
                if (!adLoaded || !rewardedAd) {
                    const loaded = await loadRewardedAd();
                    if (!loaded) {
                        Logger.warn(TAG, '광고 로드 실패', { category, period });
                        const result: AdResult = {
                            success: false,
                            error: 'Failed to load ad',
                        };
                        return result;
                    }
                }

                return new Promise<AdResult>((resolve) => {
                    if (!rewardedAd) {
                        resolve({ success: false, error: 'No ad available' });
                        return;
                    }

                    // 리스너 먼저 설정
                    const earnedRewardListener = rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
                        Logger.info(TAG, '광고 보상 획득', { category, period });
                        const result: AdResult = { success: true };

                        // 모든 리스너 제거
                        earnedRewardListener();
                        closedListener();
                        errorListener();

                        resolve(result);
                    });

                    const closedListener = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
                        Logger.info(TAG, '광고 닫힘', { category, period });
                        // 사용자가 보상을 받기 전에 광고를 닫았을 수 있음
                        // EARNED_REWARD가 먼저 발생했다면 이미 resolve 되었을 것

                        earnedRewardListener();
                        closedListener();
                        errorListener();

                        // 이미 resolve 되지 않았다면 실패로 처리
                        const result: AdResult = {
                            success: false,
                            error: 'User closed the ad before earning reward',
                        };

                        resolve(result);
                    });

                    const errorListener = rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
                        Logger.error(TAG, '광고 표시 중 오류 발생', { category, period, error });

                        earnedRewardListener();
                        closedListener();
                        errorListener();

                        const result: AdResult = {
                            success: false,
                            error: error.message || 'Error showing ad',
                        };

                        resolve(result);
                    });

                    // 광고 표시
                    rewardedAd.show();
                });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                Logger.error(TAG, `광고 요청 중 오류 발생: ${errorMessage}`, {
                    category,
                    period,
                    error,
                });

                return {
                    success: false,
                    error: errorMessage,
                };
            } finally {
                setAdRequested(false);
                setLoading(false);
            }
        },
        [adRequested, adLoaded, loadRewardedAd, rewardedAd, testMode]
    );

    /**
     * 광고 시청 요청 함수
     * 광고 시청 후 성공 시 상태를 업데이트 함
     */
    const requestAd = useCallback(
        async (category: T, period: AdWatchPeriod): Promise<boolean> => {
            if (loading) {
                Logger.warn(TAG, '이미 광고 요청 중입니다');
                return false;
            }

            setError(null);

            try {
                // 광고 요청
                const result = await showRewardedAd(category, period);

                if (result.success) {
                    // 광고 시청 성공 시 상태 업데이트
                    updateAdWatched(category, period);
                    Logger.event(TAG, '광고 시청 성공', { category, period });

                    // 다음 광고를 위해 미리 로드
                    setTimeout(() => {
                        loadRewardedAd();
                    }, 1000);

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
            }
        },
        [loading, showRewardedAd, updateAdWatched]
    );

    // 컴포넌트 마운트 시 광고 미리 로드
    useEffect(() => {
        async function preloadAd() {
            try {
                await loadRewardedAd();
                Logger.info(TAG, '광고 사전 로드 성공');
            } catch (e) {
                Logger.error(TAG, '광고 사전 로드 중 오류 발생', e);
            }
        }

        preloadAd();

        // 컴포넌트 언마운트 시 이벤트 리스너 정리
        return () => {
            rewardedAd?.removeAllListeners();
        };
    }, [loadRewardedAd, rewardedAd]);

    return {
        loading,
        error,
        adWatched,
        adLoaded,
        requestAd,
        loadAd: loadRewardedAd,
        clearError: useCallback(() => setError(null), []),
        setTestMode: useCallback((enabled: boolean) => {
            setTestMode(enabled);
            Logger.info(TAG, `테스트 모드 ${enabled ? '활성화' : '비활성화'}`);
        }, []),
    };
}

export default useAdManager;
