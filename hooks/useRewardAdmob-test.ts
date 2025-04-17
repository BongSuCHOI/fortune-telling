import { useState, useEffect, useCallback, useRef } from 'react';
import { RewardedAd, RequestOptions, RewardedAdEventType, AdEventType, TestIds } from 'react-native-google-mobile-ads';

import Logger from '@/utils/Logger';

const TAG = 'useRewardAdmob';

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-4609564891060230/2711373918';

export function useRewardAdmob(options: RequestOptions = {}) {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [rewarded, setRewarded] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const rewardedRef = useRef<RewardedAd | null>(null);
    const subscriptionsRef = useRef<(() => void)[]>([]);

    // useEffect(() => {
    //     const newRewarded = RewardedAd.createForAdRequest(adUnitId, options);
    //     rewardedRef.current = newRewarded;

    //     newRewarded.load();
    // }, [options]);

    useEffect(() => {
        console.log('first')
        const newRewarded = RewardedAd.createForAdRequest(adUnitId, options);
        rewardedRef.current = newRewarded;

        // 광고 로드 성공 이벤트 리스너
        const unsubscribeLoaded = newRewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
            console.log('광고를 로드했습니다.');
            setLoaded(true);
        });

        // 광고 보상 획득 이벤트 리스너
        const unsubscribeEarned = newRewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
            console.log('사용자가 보상을 획득했습니다:', reward);
            setRewarded(true);
        });

        // 광고가 닫힌 후 자동으로 새 광고 인스턴스 생성 및 로드
        const unsubscribeClosed = newRewarded.addAdEventListener(AdEventType.CLOSED, () => {
            console.log('광고가 닫혔습니다.');
            setLoaded(false);
        });

        // 광고 오류 이벤트 리스너
        const unsubscribeFailed = newRewarded.addAdEventListener(AdEventType.ERROR, (error) => {
            setError(error.message);
            Logger.error(TAG, '광고 에러 발생:', error);
        });

        newRewarded.load();

        return () => {
            unsubscribeLoaded();
            unsubscribeEarned();
            unsubscribeClosed();
            unsubscribeFailed();
        };
    }, [options]);

    const showAd = useCallback(() => {
        if (loaded && rewardedRef.current) {
            // 광고를 보여주기 전에 보상 상태 초기화
            setRewarded(false);
            // 광고 실행
            rewardedRef.current.show();
            // 광고 로드 후 보상 상태 초기화
            setLoaded(false);
        } else {
            Logger.warn(TAG, '광고가 아직 로드되지 않았습니다.');
        }
    }, [loaded]);

    // // 광고 인스턴스를 생성하고 이벤트 리스너를 등록하는 함수
    // const initializeAd = useCallback(() => {
    //     // 이전에 등록된 이벤트 구독 해제
    //     subscriptionsRef.current.forEach((unsub) => unsub && unsub());
    //     subscriptionsRef.current = [];

    //     const newRewarded = RewardedAd.createForAdRequest(adUnitId, options);

    //     // 광고 로드 성공 이벤트 리스너
    //     const unsubscribeLoaded = newRewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
    //         console.log('광고를 로드했습니다.');
    //         setLoaded(true);
    //     });

    //     // 광고 보상 획득 이벤트 리스너
    //     const unsubscribeEarned = newRewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
    //         console.log('사용자가 보상을 획득했습니다:', reward);
    //         setRewarded(true);
    //     });

    //     // 광고가 닫힌 후 자동으로 새 광고 인스턴스 생성 및 로드
    //     const unsubscribeClosed = newRewarded.addAdEventListener(AdEventType.CLOSED, () => {
    //         console.log('광고가 닫혔습니다.');
    //         setLoaded(false);
    //         initializeAd();
    //     });

    //     // 광고 오류 이벤트 리스너
    //     const unsubscribeFailed = newRewarded.addAdEventListener(AdEventType.ERROR, (error) => {
    //         setError(error.message);
    //         Logger.error(TAG, '광고 에러 발생:', error);
    //     });

    //     // 이벤트 구독 해제 함수를 저장
    //     subscriptionsRef.current = [unsubscribeLoaded, unsubscribeEarned, unsubscribeClosed, unsubscribeFailed];

    //     // 광고 로드 시작
    //     newRewarded.load();

    //     rewardedRef.current = newRewarded;
    // }, [adUnitId, options]);

    // useEffect(() => {
    //     initializeAd();

    //     // 컴포넌트 언마운트 시 모든 이벤트 구독을 해제하여 메모리 누수를 방지합니다.
    //     return () => {
    //         subscriptionsRef.current.forEach((unsub) => unsub && unsub());
    //     };
    // }, [initializeAd]);

    // const showAd = useCallback(() => {
    //     if (loaded && rewardedRef.current) {
    //         // 광고를 보여주기 전에 보상 상태 초기화
    //         setRewarded(false);
    //         // 광고 실행
    //         rewardedRef.current.show();
    //         // 광고 로드 후 보상 상태 초기화
    //         setLoaded(false);
    //     } else {
    //         Logger.warn(TAG, '광고가 아직 로드되지 않았습니다.');
    //     }
    // }, [loaded]);

    return { loaded, rewarded, error, showAd };
}

export default useRewardAdmob;
