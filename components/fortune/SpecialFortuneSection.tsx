import { useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { useModalManager } from '@/hooks/useModalManager';
import { useServiceSelection } from '@/hooks/useServiceSelection';
import { useAdManager } from '@/hooks/useAdManager';

import { Typography } from '@/components/ui/Typography';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FortuneModal } from '@/components/modal/FortuneModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import { SecondaryColor, SubTextColor } from '@/constants/Colors';
import { FORTUNE_MODAL_KEYS } from '@/constants/ModalKeys';

import { MOCK_YEAR_FORTUNE_DATA, MOCK_MONTH_FORTUNE_DATA, MOCK_WEEK_FORTUNE_DATA } from '@/data/mockData';

import type { SpecialFortuneCode, SpecialFortuneItem } from '@/types/fortune';
import type { ConfirmModalData } from '@/types/modal';

const SPECIAL_YEAR_FORTUNE_AD_KEY: SpecialFortuneCode = 'specialYearFortune';
const SPECIAL_MONTH_FORTUNE_AD_KEY: SpecialFortuneCode = 'specialMonthFortune';
const SPECIAL_WEEK_FORTUNE_AD_KEY: SpecialFortuneCode = 'specialWeekFortune';

const SPECIAL_FORTUNE_ITEM_DATA: SpecialFortuneItem[] = [
    { category: SPECIAL_YEAR_FORTUNE_AD_KEY, name: '올해', adPeriod: 'annual', icon: 'star.fill', iconColor: SecondaryColor, description: '새해의 운세' },
    { category: SPECIAL_MONTH_FORTUNE_AD_KEY, name: '이번 달', adPeriod: 'monthly', icon: 'calendar', iconColor: SecondaryColor, description: '월간 운세' },
    { category: SPECIAL_WEEK_FORTUNE_AD_KEY, name: '이번 주', adPeriod: 'weekly', icon: 'clock.fill', iconColor: SecondaryColor, description: '주간 운세' },
];

const CONFIRM_MODAL_DATA: ConfirmModalData = {
    title: '광고를 시청하시겠습니까?',
    contents: '광고를 시청하시면 해당 특별 운세를 확인할 수 있습니다!',
    confirmButtonText: '시청하기',
};

/**
 * 특별 운세는 연도, 월, 주 단위로 나뉘어져 있으며,
 * 각각의 운세를 확인하기 위해 년/월/주 마다 1회씩 개별 광고 시청이 필요합니다.
 * 광고 시청 후 운세를 확인할 수 있는 모달을 띄우는 컴포넌트입니다.
 */
export function SpecialFortuneSection() {
    // 모달 상태 관리
    const { modalVisibility, openModal, closeModal } = useModalManager();

    // 특별 운세 선택 상태 관리
    const { selectedService, selectService, resetService } = useServiceSelection<SpecialFortuneItem>();

    // 광고 관리 훅
    const { adWatched, requestAd, loading } = useAdManager<SpecialFortuneCode>([SPECIAL_YEAR_FORTUNE_AD_KEY, SPECIAL_MONTH_FORTUNE_AD_KEY, SPECIAL_WEEK_FORTUNE_AD_KEY]);

    // 선택된 운세에 따른 운세 데이터 결정
    const fortuneData = useMemo(() => {
        if (!selectedService) return null;
        const { category } = selectedService;
        switch (category) {
            case SPECIAL_YEAR_FORTUNE_AD_KEY:
                return MOCK_YEAR_FORTUNE_DATA[category];
            case SPECIAL_MONTH_FORTUNE_AD_KEY:
                return MOCK_MONTH_FORTUNE_DATA[category];
            case SPECIAL_WEEK_FORTUNE_AD_KEY:
                return MOCK_WEEK_FORTUNE_DATA[category];
            default:
                return null;
        }
    }, [selectedService]);

    // 운세 버튼 클릭 시 처리: 선택 상태 업데이트 후 광고 시청 여부에 따라 모달 오픈
    const onFortunePressed = (item: SpecialFortuneItem) => {
        selectService(item);
        if (adWatched[item.category]) {
            openModal(FORTUNE_MODAL_KEYS.SPECIAL_FORTUNE_RESULT);
        } else {
            openModal(FORTUNE_MODAL_KEYS.SPECIAL_FORTUNE_AD_CONFIRM);
        }
    };

    // 광고 확인 모달 "시청하기" 클릭 시 처리 (보상형 광고 로직 호출)
    const onConfirmAd = async () => {
        closeModal(FORTUNE_MODAL_KEYS.SPECIAL_FORTUNE_AD_CONFIRM);

        if (!selectedService) return;

        const success = await requestAd(selectedService.category, selectedService.adPeriod);
        if (success) {
            openModal(FORTUNE_MODAL_KEYS.SPECIAL_FORTUNE_RESULT);
        }
    };

    // 광고 모달 닫기 (취소) 및 상태 초기화
    const onCloseAdModal = () => {
        closeModal(FORTUNE_MODAL_KEYS.SPECIAL_FORTUNE_AD_CONFIRM);
        resetService();
    };

    // 운세 결과 모달 닫기 및 상태 초기화
    const onCloseFortuneModal = () => {
        closeModal(FORTUNE_MODAL_KEYS.SPECIAL_FORTUNE_RESULT);
        resetService();
    };

    return (
        <>
            {/* 특별 운세 섹션 */}
            <View style={styles.specialFortunesContainer}>
                <Typography
                    size="md"
                    bold
                    style={styles.containerTitle}
                    text={'특별 운세'}
                />
                <View style={styles.specialFortuneContents}>
                    {SPECIAL_FORTUNE_ITEM_DATA.map((item) => (
                        <Pressable
                            key={item.category}
                            style={styles.specialFortuneButton}
                            onPress={() => onFortunePressed(item)}
                            disabled={loading} // 광고 로딩 중 버튼 비활성화
                        >
                            <View style={styles.specialFortuneIconContents}>
                                <IconSymbol
                                    size={32}
                                    name={adWatched[item.category] ? item.icon : 'lock.fill'}
                                    color={item.iconColor}
                                />
                            </View>
                            <View style={styles.specialFortuneTextContents}>
                                <Typography
                                    size="md"
                                    bold
                                    text={item.name}
                                    style={styles.specialFortuneTitle}
                                />
                                <Typography
                                    size="sm"
                                    text={item.description}
                                    style={styles.specialFortuneDescription}
                                />
                            </View>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* 특별 운세 광고 확인 모달 */}
            <ConfirmModal
                isVisible={modalVisibility[FORTUNE_MODAL_KEYS.SPECIAL_FORTUNE_AD_CONFIRM] || false}
                onClose={onCloseAdModal}
                onConfirm={onConfirmAd}
                data={CONFIRM_MODAL_DATA}
            />

            {/* 특별 운세 결과 모달 */}
            {fortuneData && (
                <FortuneModal
                    isVisible={modalVisibility[FORTUNE_MODAL_KEYS.SPECIAL_FORTUNE_RESULT] || false}
                    onClose={onCloseFortuneModal}
                    pointText={`${selectedService?.name || ''} 운세`}
                    data={fortuneData}
                />
            )}
        </>
    );
}

export default SpecialFortuneSection;

// 스타일 정의
const styles = StyleSheet.create({
    specialFortunesContainer: {
        paddingHorizontal: 25,
        marginTop: 30,
        marginBottom: 45,
    },
    containerTitle: {
        marginBottom: 18,
    },
    specialFortuneContents: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 21,
    },
    specialFortuneButton: {
        flexDirection: 'row',
        alignItems: 'center',
        flexBasis: '48%',
        flexShrink: 1,
        padding: 15,
        borderRadius: 12,
        borderColor: '#D1C4E9',
        borderWidth: 1,
    },
    specialFortuneIconContents: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(209, 196, 233, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    specialFortuneTextContents: {
        flex: 1,
    },
    specialFortuneTitle: {
        marginBottom: 4,
    },
    specialFortuneDescription: {
        color: SubTextColor,
    },
});
