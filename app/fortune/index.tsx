import { useState } from 'react';
import { View, StyleSheet, Pressable, Modal } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Typography, KeepAllTypography } from '@/components/ui/Typography';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { DonutChart } from '@/components/ui/DonutChart';
import { PrimaryColor, SubTextColor } from '@/constants/Colors';

import type { IconSymbolName } from '@/components/ui/IconSymbol';

export default function FortuneDailyScreen() {
    const [abConfirmModalVisible, setAdConfirmModalVisible] = useState<boolean>(false);
    const [otherFortuneModalVisible, setOtherFortuneModalVisible] = useState<boolean>(false);
    const [pressedOtherFortuneName, setPressedOtherFortuneName] = useState<string>('');
    const [hasWatchedAds, setHasWatchedAds] = useState<boolean>(false);

    const otherFortuneData = [
        {
            name: '애정운',
            routePath: '/fortune/love',
            bgColor: '#F8C8D8',
            icon: 'heart.fill',
            iconColor: '#D1788F',
        },
        {
            name: '금전운',
            routePath: '/fortune/money',
            bgColor: '#FDE7A9',
            icon: 'wallet.bifold.fill',
            iconColor: '#D1B95B',
        },
        {
            name: '직장운',
            routePath: '/fortune/career',
            bgColor: '#B5D8B4',
            icon: 'briefcase.fill',
            iconColor: '#7FA374',
        },
        {
            name: '학업운',
            routePath: '/fortune/education',
            bgColor: '#A8CCEB',
            icon: 'graduationcap.fill',
            iconColor: '#6D9BC8',
        },
        {
            name: '건강운',
            routePath: '/fortune/health',
            bgColor: '#F8BFA5',
            icon: 'dumbbell.fill',
            iconColor: '#D68A6E',
        },
    ];

    const onAdConfirmModalClose = () => {
        setAdConfirmModalVisible(false);
        setPressedOtherFortuneName('');
    };

    const onOtherFortuneModalClose = () => {
        setOtherFortuneModalVisible(false);
        setPressedOtherFortuneName('');
    };

    const onOtherFortunePressed = (name: string) => {
        if (hasWatchedAds) {
            setOtherFortuneModalVisible(true);
        } else {
            setAdConfirmModalVisible(true);
        }
        setPressedOtherFortuneName(name);
    };

    const onWatchAds = () => {
        setAdConfirmModalVisible(false);
        // 광고 시청 로직
        setHasWatchedAds(true);
    };

    return (
        <ParallaxScrollView>
            <View style={styles.titleContainer}>
                <Typography
                    size="xxxl"
                    style={styles.titleText}
                    bold
                    text="홍길동님,"
                />
                <Typography
                    size="xxxl"
                    text="어떤 하루일까요?"
                />
            </View>
            <View style={styles.fortuneContainer}>
                <Typography
                    size="sm"
                    bold
                    description
                    style={{ marginBottom: 6 }}
                    text="02월 02일(수) 총운"
                />
                <Typography
                    size="lg"
                    bold
                    style={{ marginBottom: 12 }}
                    text="운수대통(運數大通)"
                />
                <DonutChart
                    percentage={75}
                    color={PrimaryColor}
                    style={{ marginBottom: 20 }}
                />
                <KeepAllTypography
                    size="base"
                    style={{ lineHeight: 25, color: SubTextColor }}
                    text="오늘은 운이 크게 열리는 날입니다. 예상치 못한 좋은 기회가 찾아오거나, 주변에서 도움을 받게 될 가능성이 큽니다. 작은 일이라도 정성스럽게 임하면 더 큰 행운으로 이어질 수 있습니다."
                />
            </View>
            <View style={styles.otherFortuneBannerContainer}>
                <Typography
                    size="base"
                    bold
                    style={styles.otherFortuneText}
                    text={hasWatchedAds ? '오늘의 특별한 운세를 확인해보세요!' : '오늘의 특별한 운세가 기다리고 있어요!'}
                />
                <View style={styles.otherFortuneContainer}>
                    {otherFortuneData.map(({ name, icon, iconColor, bgColor }) => (
                        <Pressable
                            key={name}
                            style={[styles.squareButton, { backgroundColor: bgColor }]}
                            onPress={() => onOtherFortunePressed(name)}
                        >
                            <IconSymbol
                                size={40}
                                name={hasWatchedAds ? (icon as IconSymbolName) : 'lock.fill'}
                                color={iconColor}
                            />
                        </Pressable>
                    ))}
                </View>
            </View>
            <View style={styles.weekMonthFortuneContainer}>
                <Typography
                    size="lg"
                    bold
                    style={styles.weekMonthFortuneText}
                    text="이번 주 운세"
                />
                <View style={styles.fortuneContainer}>
                    <Typography
                        size="sm"
                        bold
                        description
                        style={{ marginBottom: 6 }}
                        text="총운"
                    />
                    <Typography
                        size="lg"
                        bold
                        style={{ marginBottom: 12 }}
                        text="풍전등화(風前燈火)"
                    />
                    <DonutChart
                        percentage={75}
                        color={PrimaryColor}
                        style={{ marginBottom: 20 }}
                    />
                    <KeepAllTypography
                        size="base"
                        style={{ lineHeight: 25, color: SubTextColor }}
                        text="이번 주는 조심스럽게 행동해야 하는 시기입니다. 좋은 운이 따르지만, 예상치 못한 변수도 많습니다. 특히 대인관계에서 신중하게 행동하고, 불필요한 논쟁을 피하는 것이 중요합니다. 또한, 재정 관리에 신경 써야 할 필요가 있습니다. 충동적인 소비를 자제하고, 계획적인 지출을 유지하는 것이 좋습니다. 긍정적인 태도를 유지하면 주 후반에는 점차 운이 상승할 것입니다."
                    />
                </View>
            </View>
            <View style={styles.weekMonthFortuneContainer}>
                <Typography
                    size="lg"
                    bold
                    style={styles.weekMonthFortuneText}
                    text="이번 달 운세"
                />
                <View style={styles.fortuneContainer}>
                    <Typography
                        size="sm"
                        bold
                        description
                        style={{ marginBottom: 6 }}
                        text="총운"
                    />
                    <Typography
                        size="lg"
                        bold
                        style={{ marginBottom: 12 }}
                        text="태산북두(泰山北斗)"
                    />
                    <DonutChart
                        percentage={75}
                        color={PrimaryColor}
                        style={{ marginBottom: 20 }}
                    />
                    <KeepAllTypography
                        size="base"
                        style={{ lineHeight: 25, color: SubTextColor }}
                        text="이번 달은 크게 성장할 기회가 찾아오는 시기입니다. 직장이나 사업에서 중요한 기회를 잡을 가능성이 높고, 자신의 역량을 발휘할 수 있는 상황이 만들어질 것입니다. 다만, 지나친 자신감은 오히려 독이 될 수 있으니 겸손한 태도를 유지하는 것이 중요합니다. 금전적으로는 꾸준한 수익이 예상되나, 무리한 투자는 삼가는 것이 좋습니다. 인간관계에서는 신뢰가 중요한 역할을 하며, 신중한 말과 행동이 필요합니다. 건강 면에서는 스트레스 관리를 철저히 하고, 꾸준한 운동과 규칙적인 생활 습관을 유지하는 것이 중요합니다. 전반적으로 운이 좋은 흐름이므로, 주어진 기회를 잘 활용하면 만족스러운 한 달이 될 것입니다."
                    />
                </View>
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={abConfirmModalVisible}
                onRequestClose={onAdConfirmModalClose}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContents, styles.adModalContents]}>
                        <View style={styles.adModalText}>
                            <Typography
                                size="md"
                                bold
                                text="광고를 시청하시겠습니까?"
                                style={styles.adModalTitle}
                            />
                            <Typography
                                size="base"
                                bold
                                text="오늘의 모든 운세를 확인하세요!"
                                style={{ color: SubTextColor }}
                            />
                        </View>
                        <View style={[styles.modalButtons, styles.adModalButtons]}>
                            <Pressable
                                style={[styles.modalButton, { backgroundColor: '#DCCEF7' }]}
                                onPress={onAdConfirmModalClose}
                            >
                                <Typography
                                    size="base"
                                    bold
                                    text="닫기"
                                    style={styles.modalButtonText}
                                />
                            </Pressable>
                            <Pressable
                                style={styles.modalButton}
                                onPress={onWatchAds}
                            >
                                <Typography
                                    size="base"
                                    bold
                                    text="광고시청"
                                    style={styles.modalButtonText}
                                />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={otherFortuneModalVisible}
                onRequestClose={onOtherFortuneModalClose}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContents, styles.otherFortuneModalContents]}>
                        <View style={styles.otherFortuneModalText}>
                            <Typography
                                size="xl"
                                bold
                                text="오늘의 "
                            />
                            <Typography
                                size="xl"
                                bold
                                text={pressedOtherFortuneName}
                                style={styles.otherFortuneName}
                            />
                        </View>
                        <View style={styles.fortuneContainer}>
                            <Typography
                                size="lg"
                                bold
                                style={{ marginBottom: 12 }}
                                text="연리지지(連理之枝)"
                            />
                            <DonutChart
                                percentage={75}
                                color={PrimaryColor}
                                style={{ marginBottom: 20 }}
                            />
                            <KeepAllTypography
                                size="base"
                                style={{ lineHeight: 25, color: SubTextColor }}
                                text="연애운이 상승하는 날입니다. 솔로라면 새로운 인연이 생길 가능성이 크고, 커플이라면 관계가 더욱 깊어질 수 있습니다. 상대방의 말에 귀 기울이는 것이 중요합니다."
                            />
                        </View>
                        <View style={[styles.modalButtons, styles.otherFortuneModalButton]}>
                            <Pressable
                                style={styles.modalButton}
                                onPress={onOtherFortuneModalClose}
                            >
                                <Typography
                                    size="base"
                                    bold
                                    text="확인"
                                    style={styles.modalButtonText}
                                />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    titleText: {
        marginTop: 30,
        color: PrimaryColor,
    },
    fortuneContainer: {
        backgroundColor: '#F6F4FC',
        padding: 20,
        borderRadius: 10,
    },
    otherFortuneBannerContainer: {
        marginTop: 20,
    },
    otherFortuneText: {
        marginBottom: 12,
    },
    otherFortuneContainer: {
        flexDirection: 'row',
        columnGap: 15,
    },
    weekMonthFortuneContainer: {
        marginTop: 30,
    },
    weekMonthFortuneText: {
        marginBottom: 12,
    },
    squareButton: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContents: {
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        backgroundColor: PrimaryColor,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
    },
    adModalContents: {
        maxWidth: '70%',
        paddingHorizontal: 30,
        paddingVertical: 30,
    },
    adModalText: {
        alignItems: 'center',
        gap: 3,
        marginBottom: 40,
    },
    adModalTitle: {
        marginTop: 25,
        marginBottom: 10,
    },
    adModalButtons: {
        gap: 15,
    },
    otherFortuneModalContents: {
        maxWidth: '90%',
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    otherFortuneModalText: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    otherFortuneName: {
        color: PrimaryColor,
    },
    otherFortuneModalButton: {
        marginTop: 30,
    },
});
