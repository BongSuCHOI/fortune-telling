import React, { useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { useModalManager } from '@/hooks/useModalManager';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useAdManager } from '@/hooks/useAdManager';
import { AdWatchPeriod } from '@/types/storage';

import { Typography } from '@/components/ui/Typography';
import { DonutChart } from '@/components/ui/DonutChart';
import { FortuneSkeletonUI } from '@/components/ui/SkeletonLoader';
import { FortuneModal } from '@/components/modal/FortuneModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import { AlertModal } from '@/components/modal/AlertModal';
import { PrimaryColor, SubTextColor } from '@/constants/Colors';
import { FORTUNE_MODAL_KEYS } from '@/constants/ModalKeys';

import { MOCK_DAILY_TOTAL_FORTUNE_DATA } from '@/data/mockData';

import type { ConfirmModalData, AlertModalData } from '@/types/modal';

const CONFIRM_MODAL_DATA: ConfirmModalData = {
    title: '광고를 시청하시겠습니까?',
    contents: '광고를 시청하시면 상세한 오늘의 총운 결과를 확인할 수 있습니다!',
    confirmButtonText: '시청하기',
};

const YET_MODAL_DATA: AlertModalData = {
    title: '광고를 준비중입니다.',
    contents: '잠시 후 다시 시도해주세요.',
};

const ERROR_MODAL_DATA: AlertModalData = {
    title: '광고 에러 발생',
    contents: '문제가 발생했습니다. 다시 시도해주세요.',
};

const DAILY_TOTAL_FORTUNE_AD_KEY = 'dailyTotalFortuneAd';

export function MainFortuneSection() {
    // 모달 관리 훅
    const { openModal, closeModal, modalVisibility } = useModalManager();

    // 사용자 정보 관리 훅
    const { userInfo, loading, redirectIfUserInfoMissing } = useUserInfo();

    // 광고 관리 훅 - 테스트 모드 설정 및 키워드 전달
    const {
        loaded: adLoaded,
        loading: adLoading,
        rewarded: adRewarded,
        error: adError,
        adWatched,
        requestAd,
    } = useAdManager<typeof DAILY_TOTAL_FORTUNE_AD_KEY>([DAILY_TOTAL_FORTUNE_AD_KEY], {
        keywords: ['fortune', 'horoscope', 'lifestyle', 'today', 'daily'],
    });

    // 운세 데이터
    const dailyFortuneData = useMemo(() => {
        return MOCK_DAILY_TOTAL_FORTUNE_DATA.total;
    }, []);

    // 운세 보기 버튼 클릭 핸들러
    const handleViewFortune = useCallback(() => {
        // 이미 광고를 봤다면 바로 결과 모달 표시
        if (adWatched?.[DAILY_TOTAL_FORTUNE_AD_KEY]) {
            openModal(FORTUNE_MODAL_KEYS.DAILY_FORTUNE_RESULT);
        } else {
            // 광고를 봐야 하는 경우 광고 확인 모달 표시
            openModal(FORTUNE_MODAL_KEYS.DAILY_FORTUNE_AD_CONFIRM);
        }
    }, [adWatched, openModal]);

    // 광고 확인 모달에서 "시청하기" 클릭 처리
    const handleAdConfirm = useCallback(async () => {
        // 광고 확인 모달 닫기
        closeModal(FORTUNE_MODAL_KEYS.DAILY_FORTUNE_AD_CONFIRM);

        if (adLoaded) {
            try {
                await requestAd(DAILY_TOTAL_FORTUNE_AD_KEY, 'daily' as AdWatchPeriod);
                if (adError) {
                    openModal(FORTUNE_MODAL_KEYS.DAILY_FORTUNE_AD_ERROR);
                }
            } catch (error) {
                openModal(FORTUNE_MODAL_KEYS.DAILY_FORTUNE_AD_ERROR);
            }
        } else {
            openModal(FORTUNE_MODAL_KEYS.DAILY_FORTUNE_AD_YET);
        }
    }, [adLoaded, adError, closeModal, openModal, requestAd]);

    // 주요 로직: 광고가 보상을 지급했을 때 결과 모달 표시
    useEffect(() => {
        if (adRewarded) {
            // 약간의 지연 후 모달 표시 (사용자 경험 개선)
            const timer = setTimeout(() => {
                openModal(FORTUNE_MODAL_KEYS.DAILY_FORTUNE_RESULT);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [adRewarded, openModal]);

    // 사용자 정보가 없을 경우 리다이렉트
    if (!loading && !userInfo) {
        redirectIfUserInfoMissing();
    }

    // 로딩 중일 때 스켈레톤 UI 표시
    if (loading || !userInfo) {
        return <FortuneSkeletonUI />;
    }

    return (
        <>
            {/* 메인 운세 섹션 */}
            <View style={styles.fortuneContainer}>
                <View style={styles.titleContents}>
                    <Typography
                        size="xl"
                        style={styles.titleText}
                        bold
                        text={`${userInfo.name}님`}
                    />
                    <Typography
                        size="xl"
                        text="오늘은 어떤 하루일까요?"
                    />
                </View>
                <View style={styles.fortuneContents}>
                    <DonutChart
                        percentage={dailyFortuneData.score}
                        color={PrimaryColor}
                        size={150}
                        strokeWidth={9}
                        style={{ marginBottom: 40 }}
                    />
                    <Typography
                        size="lg"
                        bold
                        style={{ marginBottom: 10 }}
                        text={dailyFortuneData.title}
                    />
                    <Typography
                        size="base"
                        style={{ color: SubTextColor }}
                        text={dailyFortuneData.summary}
                    />
                    <Pressable
                        style={styles.fortuneDetailButton}
                        onPress={handleViewFortune}
                    >
                        <Typography
                            size="sm"
                            bold
                            text={adWatched?.[DAILY_TOTAL_FORTUNE_AD_KEY] ? '자세히 보기' : '광고 후 자세히 보기'}
                        />
                    </Pressable>
                </View>
            </View>

            {/* 오늘의 총운 광고 확인 모달 */}
            <ConfirmModal
                isVisible={modalVisibility[FORTUNE_MODAL_KEYS.DAILY_FORTUNE_AD_CONFIRM] || false}
                onClose={() => closeModal(FORTUNE_MODAL_KEYS.DAILY_FORTUNE_AD_CONFIRM)}
                onConfirm={handleAdConfirm}
                data={CONFIRM_MODAL_DATA}
            />

            {/* 오늘의 총운 광고 준비 모달 */}
            <AlertModal
                isVisible={modalVisibility[FORTUNE_MODAL_KEYS.DAILY_FORTUNE_AD_YET] || false}
                onClose={() => closeModal(FORTUNE_MODAL_KEYS.DAILY_FORTUNE_AD_YET)}
                data={YET_MODAL_DATA}
            />

            {/* 오늘의 총운 광고 에러 모달 */}
            <AlertModal
                isVisible={modalVisibility[FORTUNE_MODAL_KEYS.DAILY_FORTUNE_AD_ERROR] || false}
                onClose={() => closeModal(FORTUNE_MODAL_KEYS.DAILY_FORTUNE_AD_ERROR)}
                data={ERROR_MODAL_DATA}
            />

            {/* 오늘의 총운 결과 모달 */}
            {dailyFortuneData && (
                <FortuneModal
                    isVisible={modalVisibility[FORTUNE_MODAL_KEYS.DAILY_FORTUNE_RESULT] || false}
                    onClose={() => closeModal(FORTUNE_MODAL_KEYS.DAILY_FORTUNE_RESULT)}
                    text="오늘의 "
                    pointText="총운"
                    data={dailyFortuneData}
                />
            )}
        </>
    );
}

export default MainFortuneSection;

// 스타일 정의
const styles = StyleSheet.create({
    fortuneContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F4FC',
        paddingTop: 90,
        paddingBottom: 40,
    },
    titleContents: {
        alignItems: 'center',
        marginBottom: 25,
    },
    titleText: {
        color: PrimaryColor,
        marginBottom: 3,
    },
    fortuneContents: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    fortuneDetailButton: {
        marginTop: 30,
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 100,
        backgroundColor: 'white',
        borderColor: '#D1C4E9',
        borderWidth: 1,
    },
});
