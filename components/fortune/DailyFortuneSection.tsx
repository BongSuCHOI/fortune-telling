import { useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { useModalManager } from '@/hooks/useModalManager';
import { useFortuneSelection } from '@/hooks/useFortuneSelection';
import { useAdWatchStatus } from '@/hooks/useAdWatchStatus';

import { Typography } from '@/components/ui/Typography';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FortuneModal } from '@/components/modal/FortuneModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';

import { MOCK_DAILY_OTHER_FORTUNE_DATA } from '@/data/mockData';

import type { DailyFortuneCode, DailyFortuneName, DailyOtherFortuneItem } from '@/types/fortune';

import type { ConfirmModalData } from '@/types/modal';

const DAILY_FORTUNE_ITEM_DATA: DailyOtherFortuneItem[] = [
    { category: 'love', name: '애정운', icon: 'heart.fill', iconColor: '#F8C8D8' },
    { category: 'money', name: '금전운', icon: 'wallet.bifold.fill', iconColor: '#FDE7A9' },
    { category: 'business', name: '직장운', icon: 'briefcase.fill', iconColor: '#B5D8B4' },
    { category: 'study', name: '학업운', icon: 'graduationcap.fill', iconColor: '#A8CCEB' },
    { category: 'health', name: '건강운', icon: 'dumbbell.fill', iconColor: '#F8BFA5' },
];

const CONFIRM_MODAL_DATA: ConfirmModalData = {
    title: '광고를 시청하시겠습니까?',
    contents: '광고를 시청하시면 오늘 하루동안 모든 오늘의 운세를 확인할 수 있습니다!',
    confirmButtonText: '시청하기',
};

const AD_MODAL_KEY = 'dailyAd';
const FORTUNE_MODAL_KEY = 'dailyFortune';
const DAILY_FORTUNE_AD_KEY = 'dailyFortuneAd';

export function DailyFortuneSection() {
    // 모달 상태 관리
    const { modalVisibility, openModal, closeModal } = useModalManager();

    // 운세 선택 상태 관리
    const { selectedFortune, selectFortune, resetSelection } = useFortuneSelection<DailyFortuneCode, DailyFortuneName>();

    // 카테고리별 광고 상태
    const { adWatched, markAdWatched } = useAdWatchStatus<typeof DAILY_FORTUNE_AD_KEY>([DAILY_FORTUNE_AD_KEY]);

    // 선택된 운세에 따른 운세 데이터 결정
    const fortuneData = useMemo(() => {
        if (selectedFortune) {
            return MOCK_DAILY_OTHER_FORTUNE_DATA[selectedFortune.category];
        }
        return null;
    }, [selectedFortune]);

    // 운세 버튼 클릭 시 처리: 선택 상태 업데이트 후 광고 시청 여부에 따라 모달 오픈
    const onFortunePressed = (category: DailyFortuneCode, name: DailyFortuneName) => {
        selectFortune({ category, name });
        if (adWatched[DAILY_FORTUNE_AD_KEY]) {
            openModal(FORTUNE_MODAL_KEY);
        } else {
            openModal(AD_MODAL_KEY);
        }
    };

    // 광고 확인 모달 "시청하기" 클릭 시 처리 (보상형 광고 로직 호출)
    const onConfirmAd = async () => {
        // 광고 시청 확인 후 모달 닫기
        closeModal(AD_MODAL_KEY);

        try {
            // 구글 보상형 AdMob 로직 호출 (예: 광고 로드 및 표시)
            // 실제 구현 시 AdMob SDK와 연동하는 showRewardedAd 함수 호출
            // const reward = await showRewardedAd();
            const reward = true; // 테스트를 위한 더미 값

            // 보상을 성공적으로 받은 경우 상태 업데이트
            if (reward) {
                markAdWatched(DAILY_FORTUNE_AD_KEY);
                openModal(FORTUNE_MODAL_KEY);
            }
        } catch (error) {
            console.error('광고 시청 실패', error);
            // 광고 시청 실패 시 필요한 추가 로직을 구현합니다.
        }
    };

    // 광고 모달 닫기 (취소) 및 상태 초기화
    const onCloseAdModal = () => {
        closeModal(AD_MODAL_KEY);
        resetSelection();
    };

    // 운세 결과 모달 닫기 및 상태 초기화
    const onCloseFortuneModal = () => {
        closeModal(FORTUNE_MODAL_KEY);
        resetSelection();
    };

    return (
        <>
            {/* 오늘의 다른 운세 섹션 */}
            <View style={styles.dailyOtherFortunesContainer}>
                <Typography
                    size="md"
                    bold
                    style={styles.containerTitle}
                    text={'오늘의 다른 운세'}
                />
                <View style={styles.otherFortuneContents}>
                    {DAILY_FORTUNE_ITEM_DATA.map(({ category, name, icon, iconColor }) => (
                        <Pressable
                            key={category}
                            style={styles.fortuneButton}
                            onPress={() => onFortunePressed(category, name)}
                        >
                            <IconSymbol
                                size={27}
                                name={adWatched[DAILY_FORTUNE_AD_KEY] ? icon : 'lock.fill'}
                                color={iconColor}
                                style={styles.fortuneIcon}
                            />
                            <Typography
                                size="md"
                                bold
                                text={name}
                            />
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* 오늘의 다른 운세 광고 확인 모달 */}
            <ConfirmModal
                isVisible={modalVisibility[AD_MODAL_KEY] || false}
                onClose={onCloseAdModal}
                onConfirm={onConfirmAd}
                data={CONFIRM_MODAL_DATA}
            />

            {/* 오늘의 다른 운세 결과 모달 */}
            {fortuneData && (
                <FortuneModal
                    isVisible={modalVisibility[FORTUNE_MODAL_KEY] || false}
                    onClose={onCloseFortuneModal}
                    text="오늘의 "
                    pointText={selectedFortune?.name || ''}
                    data={fortuneData}
                />
            )}
        </>
    );
}

export default DailyFortuneSection;

// 스타일 정의
const styles = StyleSheet.create({
    dailyOtherFortunesContainer: {
        paddingHorizontal: 25,
        marginTop: 30,
    },
    containerTitle: {
        marginBottom: 18,
    },
    otherFortuneContents: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 21,
    },
    fortuneButton: {
        flexDirection: 'row',
        flexBasis: '48%',
        flexShrink: 1,
        gap: 10,
        paddingVertical: 12,
        borderColor: '#D1C4E9',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
    fortuneIcon: {
        marginLeft: -10,
    },
});
