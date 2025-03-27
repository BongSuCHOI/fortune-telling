import { useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { useModalManager } from '@/hooks/useModalManager';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useFortuneSelection } from '@/hooks/useFortuneSelection';
import { useAdWatchStatus } from '@/hooks/useAdWatchStatus';

import { Typography } from '@/components/ui/Typography';
import { DonutChart } from '@/components/ui/DonutChart';
import { FortuneSkeletonUI } from '@/components/ui/SkeletonLoader';
import { FortuneModal } from '@/components/modal/FortuneModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import { PrimaryColor, SubTextColor } from '@/constants/Colors';

import { MOCK_DAILY_TOTAL_FORTUNE_DATA } from '@/data/mockData';

import type { ConfirmModalData } from '@/types/modal';

const CONFIRM_MODAL_DATA: ConfirmModalData = {
    title: '광고를 시청하시겠습니까?',
    contents: '광고를 시청하시면 상세한 오늘의 총운 결과를 확인할 수 있습니다!',
    confirmButtonText: '시청하기',
};

const AD_CONFIRM_MODAL_KEY = 'dailyTotalConfirmAd';
const FORTUNE_CONTENT_MODAL_KEY = 'dailyTotalFortuneContent';
const DAILY_TOTAL_FORTUNE_AD_KEY = 'dailyTotalFortuneAd';

/**
 * 오늘의 메인 운세 섹션 컴포넌트
 * 오늘의 총운 요약과 사자성어, 점수는 1일 1회 접속시 API 요청을 통해 무료로 제공됩니다.
 * 오늘의 총운을 자세하게 확인하기 위해 1일 1회 광고 시청이 필요합니다.
 * 광고 시청 후 운세를 확인할 수 있는 모달을 띄우는 컴포넌트입니다.
 */
export function MainFortuneSection() {
    // 사용자 정보 관리 훅
    const { userInfo, loading, redirectIfUserInfoMissing } = useUserInfo();

    // 모달 상태 관리
    const { modalVisibility, openModal, closeModal } = useModalManager();

    // 광고 상태
    const { adWatched, markAdWatched } = useAdWatchStatus<typeof DAILY_TOTAL_FORTUNE_AD_KEY>([DAILY_TOTAL_FORTUNE_AD_KEY]);

    const dailyFortuneData = useMemo(() => {
        return MOCK_DAILY_TOTAL_FORTUNE_DATA.total;
    }, []);

    // 자세히 보기 버튼 클릭 시 처리: 선택 상태 업데이트 후 광고 시청 여부에 따라 모달 오픈
    const onDetailViewPressed = () => {
        if (adWatched[DAILY_TOTAL_FORTUNE_AD_KEY]) {
            openModal(FORTUNE_CONTENT_MODAL_KEY);
        } else {
            openModal(AD_CONFIRM_MODAL_KEY);
        }
    };

    // 광고 확인 모달 "시청하기" 클릭 시 처리 (보상형 광고 로직 호출)
    const onConfirmAd = async () => {
        // 광고 시청 확인 후 모달 닫기
        closeModal(AD_CONFIRM_MODAL_KEY);

        try {
            // 구글 보상형 AdMob 로직 호출 (예: 광고 로드 및 표시)
            // 실제 구현 시 AdMob SDK와 연동하는 showRewardedAd 함수 호출
            // const reward = await showRewardedAd();
            const reward = true; // 테스트를 위한 더미 값

            // 보상을 성공적으로 받은 경우 상태 업데이트
            if (reward) {
                markAdWatched(DAILY_TOTAL_FORTUNE_AD_KEY, 'daily');
                openModal(FORTUNE_CONTENT_MODAL_KEY);
            }
        } catch (error) {
            console.error('광고 시청 실패', error);
            // 광고 시청 실패 시 필요한 추가 로직을 구현합니다.
        }
    };

    // 광고 모달 닫기 (취소) 및 상태 초기화
    const onCloseAdModal = () => {
        closeModal(AD_CONFIRM_MODAL_KEY);
    };

    // 운세 결과 모달 닫기 및 상태 초기화
    const onCloseFortuneModal = () => {
        closeModal(FORTUNE_CONTENT_MODAL_KEY);
    };

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
                        percentage={72}
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
                        onPress={onDetailViewPressed}
                    >
                        <Typography
                            size="sm"
                            bold
                            text="자세히 보기"
                        />
                    </Pressable>
                </View>
            </View>

            {/* 오늘의 다른 운세 광고 확인 모달 */}
            <ConfirmModal
                isVisible={modalVisibility[AD_CONFIRM_MODAL_KEY] || false}
                onClose={onCloseAdModal}
                onConfirm={onConfirmAd}
                data={CONFIRM_MODAL_DATA}
            />

            {/* 오늘의 총운 모달 */}
            {dailyFortuneData && (
                <FortuneModal
                    isVisible={modalVisibility[FORTUNE_CONTENT_MODAL_KEY] || false}
                    onClose={onCloseFortuneModal}
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
