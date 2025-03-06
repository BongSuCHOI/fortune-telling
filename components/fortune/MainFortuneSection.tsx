import { useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { useModalManager } from '@/hooks/useModalManager';

import { Typography } from '@/components/ui/Typography';
import { DonutChart } from '@/components/ui/DonutChart';
import { FortuneModal } from '@/components/modal/FortuneModal';
import { PrimaryColor, SubTextColor } from '@/constants/Colors';

import { MOCK_DAILY_TOTAL_FORTUNE_DATA } from '@/data/mockData';

const FORTUNE_MODAL_KEY = 'dailyTotalFortune';

export function MainFortuneSection() {
    // 모달 상태 관리
    const { modalVisibility, openModal, closeModal } = useModalManager();

    const dailyFortuneData = useMemo(() => {
        return MOCK_DAILY_TOTAL_FORTUNE_DATA.total;
    }, []);

    return (
        <>
            {/* 메인 운세 섹션 */}
            <View style={styles.fortuneContainer}>
                <View style={styles.titleContents}>
                    <Typography
                        size="xl"
                        style={styles.titleText}
                        bold
                        text="홍길동님,"
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
                        onPress={() => openModal(FORTUNE_MODAL_KEY)}
                    >
                        <Typography
                            size="sm"
                            bold
                            text="자세히 보기"
                        />
                    </Pressable>
                </View>
            </View>

            {/* 오늘의 총운 모달 */}
            {dailyFortuneData && (
                <FortuneModal
                    isVisible={modalVisibility[FORTUNE_MODAL_KEY] || false}
                    onClose={() => closeModal(FORTUNE_MODAL_KEY)}
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
