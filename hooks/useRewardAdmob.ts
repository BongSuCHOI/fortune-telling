import { useEffect, useCallback, useState } from 'react';
import { useRewardedAd, RequestOptions } from 'react-native-google-mobile-ads';
import Logger from '@/utils/Logger';

const TAG = 'useRewardAdmob';

export interface RewardAdCallbacks {
    /** 광고 로드 성공 시 호출될 콜백 */
    onLoaded?: () => void;
    /** 광고 보상 획득 시 호출될 콜백 */
    onRewarded?: () => void;
    /** 광고 닫힘 시 호출될 콜백 */
    onClosed?: () => void;
    /** 광고 에러 발생 시 호출될 콜백 */
    onError?: (error: Error) => void;
}

/**
 * 보상형 광고를 관리하는 훅
 * @param adUnitId 광고 단위 ID
 * @param options 광고 요청 옵션
 * @param callbacks 광고 이벤트 콜백 함수들
 * @returns 광고 상태 및 제어 함수
 */
export function useRewardAdmob(adUnitId: string, options: RequestOptions = {}, callbacks: RewardAdCallbacks = {}) {
    // 광고 라이브러리 훅 사용
    const { isLoaded, isOpened, isClosed, isEarnedReward, load, show, error } = useRewardedAd(adUnitId, options);

    // 광고 자동 재로드 상태
    const [autoReload, setAutoReload] = useState(true);

    // 컴포넌트 마운트 시 광고 로드
    useEffect(() => {
        load();
    }, [load]);

    // 광고 상태 변화에 따른 콜백 처리 및 로깅
    useEffect(() => {
        if (isLoaded) {
            Logger.info(TAG, '광고 로드 완료');
            callbacks.onLoaded?.();
        }
    }, [isLoaded, callbacks.onLoaded]);

    useEffect(() => {
        if (isEarnedReward) {
            Logger.info(TAG, '광고 보상 획득');
            callbacks.onRewarded?.();
        }
    }, [isEarnedReward, callbacks.onRewarded]);

    useEffect(() => {
        if (isClosed && autoReload) {
            callbacks.onClosed?.();
            // 광고가 닫힌 후 새 광고 자동 로드
            const timer = setTimeout(() => {
                load();
            }, 500);
            return () => clearTimeout(timer);
        } else if (isClosed) {
            callbacks.onClosed?.();
        }
    }, [isClosed, load, autoReload, callbacks.onClosed]);

    useEffect(() => {
        if (error) {
            Logger.error(TAG, '광고 에러 발생', { error });
            callbacks.onError?.(error);
        }
    }, [error, callbacks.onError]);

    // 광고를 보여주는 함수
    const showAd = useCallback(() => {
        if (isLoaded) {
            show();
        } else {
            Logger.warn(TAG, '광고 로드되지 않음, 표시할 수 없음');
        }
    }, [isLoaded, show]);

    // 광고 자동 재로드 설정 함수
    const setAutoReloadAd = useCallback((enabled: boolean) => {
        setAutoReload(enabled);
        Logger.debug(TAG, `광고 자동 재로드 ${enabled ? '활성화' : '비활성화'}`);
    }, []);

    // 명확한 이름으로 반환값 구성
    return {
        loaded: isLoaded,
        opened: isOpened,
        closed: isClosed,
        rewarded: isEarnedReward,
        error,
        loadAd: load,
        showAd,
        setAutoReloadAd,
    };
}

export default useRewardAdmob;
