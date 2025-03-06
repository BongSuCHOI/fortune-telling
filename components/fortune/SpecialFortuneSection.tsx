import { useState, useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { useModalManager } from '@/hooks/useModalManager';
import { useFortuneSelection } from '@/hooks/useFortuneSelection';

import { Typography } from '@/components/ui/Typography';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FortuneModal } from '@/components/modal/FortuneModal';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import { SecondaryColor, SubTextColor } from '@/constants/Colors';

import { MOCK_YEAR_FORTUNE_DATA, MOCK_MONTH_FORTUNE_DATA, MOCK_WEEK_FORTUNE_DATA } from '@/data/mockData';

import type { SpecialFortuneCode, SpecialFortuneName, SpecialFortuneItem } from '@/types/fortune';
import type { ConfirmModalData } from '@/types/modal';

const SPECIAL_FORTUNE_ITEM_DATA: SpecialFortuneItem[] = [
    { category: 'year', name: '올해', icon: 'star.fill', iconColor: SecondaryColor, description: '새해의 운세' },
    { category: 'month', name: '이번 달', icon: 'calendar', iconColor: SecondaryColor, description: '월간 운세' },
    { category: 'week', name: '이번 주', icon: 'clock.fill', iconColor: SecondaryColor, description: '주간 운세' },
];

const CONFIRM_MODAL_DATA: ConfirmModalData = {
    title: '광고를 시청하시겠습니까?',
    contents: '광고를 시청하시면 오늘 하루동안 모든 오늘의 운세를 확인할 수 있습니다!',
    confirmButtonText: '시청하기',
};

const AD_MODAL_KEY = 'specialAd';
const FORTUNE_MODAL_KEY = 'specialFortune';

export function SpecialFortuneSection() {
    // 모달 상태 관리
    const { modalVisibility, openModal, closeModal } = useModalManager();

    // 특별 운세 선택 상태 관리
    const { selectedFortune, selectFortune, resetSelection } = useFortuneSelection<SpecialFortuneCode, SpecialFortuneName>();

    // 카테고리별 광고 시청 여부 관리
    const [specialFortuneAdState, setSpecialFortuneAdState] = useState<Record<SpecialFortuneCode, boolean>>({
        year: false,
        month: false,
        week: false,
    });

    // 선택된 운세에 따른 운세 데이터 결정
    const fortuneData = useMemo(() => {
        if (!selectedFortune) return null;
        const { category } = selectedFortune;
        switch (category) {
            case 'year':
                return MOCK_YEAR_FORTUNE_DATA[category];
            case 'month':
                return MOCK_MONTH_FORTUNE_DATA[category];
            case 'week':
                return MOCK_WEEK_FORTUNE_DATA[category];
            default:
                return null;
        }
    }, [selectedFortune]);

    // 운세 버튼 클릭 시 처리: 선택 상태 업데이트 후 광고 시청 여부에 따라 모달 오픈
    const onFortunePressed = (category: SpecialFortuneCode, name: SpecialFortuneName) => {
        selectFortune({ category, name });
        if (specialFortuneAdState[category]) {
            openModal(FORTUNE_MODAL_KEY);
        } else {
            openModal(AD_MODAL_KEY);
        }
    };

    // 광고 확인 모달 "시청하기" 클릭 시 처리 (보상형 광고 로직 호출)
    const onConfirmAd = async () => {
        closeModal(AD_MODAL_KEY);
        try {
            // 구글 보상형 AdMob 로직 호출 (예: 광고 로드 및 표시)
            // 실제 구현 시 AdMob SDK와 연동하는 showRewardedAd 함수 호출
            // const reward = await showRewardedAd();
            const reward = true; // 테스트를 위한 더미 값

            if (reward && selectedFortune) {
                setSpecialFortuneAdState((prev) => ({ ...prev, [selectedFortune.category]: true }));
                openModal(FORTUNE_MODAL_KEY);
            }
        } catch (error) {
            console.error('광고 시청 실패', error);
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
            {/* 특별 운세 섹션 */}
            <View style={styles.specialFortunesContainer}>
                <Typography
                    size="md"
                    bold
                    style={styles.containerTitle}
                    text={'특별 운세'}
                />
                <View style={styles.specialFortuneContents}>
                    {SPECIAL_FORTUNE_ITEM_DATA.map(({ category, name, icon, iconColor, description }) => (
                        <Pressable
                            key={category}
                            style={styles.specialFortuneButton}
                            onPress={() => onFortunePressed(category, name)}
                        >
                            <View style={styles.specialFortuneIconContents}>
                                <IconSymbol
                                    size={32}
                                    name={specialFortuneAdState[category] ? icon : 'lock.fill'}
                                    color={iconColor}
                                />
                            </View>
                            <View style={styles.specialFortuneTextContents}>
                                <Typography
                                    size="md"
                                    bold
                                    text={name}
                                    style={styles.specialFortuneTitle}
                                />
                                <Typography
                                    size="sm"
                                    text={description}
                                    style={styles.specialFortuneDescription}
                                />
                            </View>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* 특별 운세 광고 확인 모달 */}
            <ConfirmModal
                isVisible={modalVisibility[AD_MODAL_KEY] || false}
                onClose={onCloseAdModal}
                onConfirm={onConfirmAd}
                data={CONFIRM_MODAL_DATA}
            />

            {/* 특별 운세 결과 모달 */}
            {fortuneData && (
                <FortuneModal
                    isVisible={modalVisibility[FORTUNE_MODAL_KEY] || false}
                    onClose={onCloseFortuneModal}
                    pointText={`${selectedFortune?.name || ''} 운세`}
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
