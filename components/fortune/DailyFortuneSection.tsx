import { useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { useModalManager } from '@/hooks/useModalManager';
import { useServiceSelection } from '@/hooks/useServiceSelection';
import { useAdManager } from '@/hooks/useAdManager';

import { Typography } from '@/components/ui/Typography';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FortuneModal } from '@/components/modal/FortuneModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import { FORTUNE_MODAL_KEYS } from '@/constants/ModalKeys';

import { MOCK_DAILY_OTHER_FORTUNE_DATA } from '@/data/mockData';

import type { DailyOtherFortuneItem } from '@/types/fortune';
import type { ConfirmModalData } from '@/types/modal';

const DAILY_FORTUNE_ITEM_DATA: DailyOtherFortuneItem[] = [
    { category: 'dailyLoveFortune', name: '애정운', adPeriod: 'daily', icon: 'heart.fill', iconColor: '#F8C8D8' },
    { category: 'dailyMoneyFortune', name: '금전운', adPeriod: 'daily', icon: 'wallet.bifold.fill', iconColor: '#FDE7A9' },
    { category: 'dailyBusinessFortune', name: '직장운', adPeriod: 'daily', icon: 'briefcase.fill', iconColor: '#B5D8B4' },
    { category: 'dailyStudyFortune', name: '학업운', adPeriod: 'daily', icon: 'graduationcap.fill', iconColor: '#A8CCEB' },
    { category: 'dailyHealthFortune', name: '건강운', adPeriod: 'daily', icon: 'dumbbell.fill', iconColor: '#F8BFA5' },
];

const CONFIRM_MODAL_DATA: ConfirmModalData = {
    title: '광고를 시청하시겠습니까?',
    contents: '광고를 시청하시면 오늘 하루동안 모든 오늘의 운세를 확인할 수 있습니다!',
    confirmButtonText: '시청하기',
};

const DAILY_OTHER_FORTUNE_AD_KEY = 'dailyOtherFortuneAd';

/**
 * 오늘의 다른 운세(애정/금전/직장/학업/건강) 섹션 컴포넌트
 * 각각의 운세를 확인하기 위해 1일 1회 통합 광고 시청이 필요합니다.
 * 1일 1회 통합 광고 시청을 통해 오늘의 다른 운세를 전부 확인할 수 있습니다.
 * 광고 시청 후 운세를 확인할 수 있는 모달을 띄우는 컴포넌트입니다.
 */
export function DailyFortuneSection() {
    // 모달 상태 관리
    const { modalVisibility, openModal, closeModal } = useModalManager();

    // 운세 선택 상태 관리
    const { selectedService, selectService, resetService } = useServiceSelection<DailyOtherFortuneItem>();

    // 광고 관리
    const { adWatched, requestAd, loading } = useAdManager<typeof DAILY_OTHER_FORTUNE_AD_KEY>([DAILY_OTHER_FORTUNE_AD_KEY]);

    // 선택된 운세에 따른 운세 데이터 결정
    const fortuneData = useMemo(() => {
        if (selectedService) {
            return MOCK_DAILY_OTHER_FORTUNE_DATA[selectedService.category];
        }
        return null;
    }, [selectedService]);

    // 운세 버튼 클릭 시 처리: 선택 상태 업데이트 후 광고 시청 여부에 따라 모달 오픈
    const onFortunePressed = (item: DailyOtherFortuneItem) => {
        selectService(item);
        if (adWatched[DAILY_OTHER_FORTUNE_AD_KEY]) {
            openModal(FORTUNE_MODAL_KEYS.DAILY_OTHER_FORTUNE_RESULT);
        } else {
            openModal(FORTUNE_MODAL_KEYS.DAILY_FORTUNE_AD_CONFIRM);
        }
    };

    // 광고 확인 모달 "시청하기" 클릭 시 처리 (보상형 광고 로직 호출)
    const onConfirmAd = async () => {
        closeModal(FORTUNE_MODAL_KEYS.DAILY_FORTUNE_AD_CONFIRM);

        if (!selectedService) return;

        const success = await requestAd(DAILY_OTHER_FORTUNE_AD_KEY, selectedService.adPeriod);
        if (success) {
            openModal(FORTUNE_MODAL_KEYS.DAILY_OTHER_FORTUNE_RESULT);
        }
    };

    // 광고 모달 닫기 (취소) 및 상태 초기화
    const onCloseAdModal = () => {
        closeModal(FORTUNE_MODAL_KEYS.DAILY_FORTUNE_AD_CONFIRM);
        resetService();
    };

    // 운세 결과 모달 닫기 및 상태 초기화
    const onCloseFortuneModal = () => {
        closeModal(FORTUNE_MODAL_KEYS.DAILY_OTHER_FORTUNE_RESULT);
        resetService();
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
                    {DAILY_FORTUNE_ITEM_DATA.map((item) => (
                        <Pressable
                            key={item.category}
                            style={styles.fortuneButton}
                            onPress={() => onFortunePressed(item)}
                            disabled={loading} // 광고 로딩 중 버튼 비활성화
                        >
                            <IconSymbol
                                size={27}
                                name={adWatched[DAILY_OTHER_FORTUNE_AD_KEY] ? item.icon : 'lock.fill'}
                                color={item.iconColor}
                                style={styles.fortuneIcon}
                            />
                            <Typography
                                size="md"
                                bold
                                text={item.name}
                            />
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* 오늘의 다른 운세 광고 확인 모달 */}
            <ConfirmModal
                isVisible={modalVisibility[FORTUNE_MODAL_KEYS.DAILY_FORTUNE_AD_CONFIRM] || false}
                onClose={onCloseAdModal}
                onConfirm={onConfirmAd}
                data={CONFIRM_MODAL_DATA}
            />

            {/* 오늘의 다른 운세 결과 모달 */}
            {fortuneData && (
                <FortuneModal
                    isVisible={modalVisibility[FORTUNE_MODAL_KEYS.DAILY_OTHER_FORTUNE_RESULT] || false}
                    onClose={onCloseFortuneModal}
                    text="오늘의 "
                    pointText={selectedService?.name || ''}
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
