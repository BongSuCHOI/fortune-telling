import { useState } from 'react';
import { View, StyleSheet, Pressable, Modal } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Typography, KeepAllTypography } from '@/components/ui/Typography';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { DonutChart } from '@/components/ui/DonutChart';
import { PrimaryColor, SecondaryColor, SubTextColor } from '@/constants/Colors';

import type { IconSymbolName } from '@/components/ui/IconSymbol';

export default function FortuneScreen() {
    // ============== 오늘의 총운 관련 상태 ==============
    const [mainFortuneModalVisible, setMainFortuneModalVisible] = useState<boolean>(false);

    // ============== 오늘의 다른 운세 관련 상태 ==============
    const [dailyAdConfirmModalVisible, setDailyAdConfirmModalVisible] = useState<boolean>(false);
    const [dailyFortuneModalVisible, setDailyFortuneModalVisible] = useState<boolean>(false);
    const [selectedDailyFortuneName, setSelectedDailyFortuneName] = useState<string>('');
    const [hasDailyWatchedAds, setHasDailyWatchedAds] = useState<boolean>(false);

    // ============== 특별 운세 관련 상태 ==============
    // 특별 운세 광고 시청 상태 관리 (개별적으로 관리)
    const [specialFortuneAdState, setSpecialFortuneAdState] = useState<{ [key: string]: boolean }>({
        신년: false,
        '이번 주': false,
        '이번 달': false,
    });

    // 특별 운세 모달 상태 관리
    const [specialFortuneModalVisible, setSpecialFortuneModalVisible] = useState<boolean>(false);
    const [specialAdConfirmModalVisible, setSpecialAdConfirmModalVisible] = useState<boolean>(false);
    const [selectedSpecialFortuneName, setSelectedSpecialFortuneName] = useState<string>('');

    // ============== 데이터 정의 ==============
    // 오늘의 다른 운세 데이터
    const dailyFortuneData = [
        {
            name: '애정운',
            icon: 'heart.fill',
            iconColor: '#F8C8D8',
        },
        {
            name: '금전운',
            icon: 'wallet.bifold.fill',
            iconColor: '#FDE7A9',
        },
        {
            name: '직장운',
            icon: 'briefcase.fill',
            iconColor: '#B5D8B4',
        },
        {
            name: '학업운',
            icon: 'graduationcap.fill',
            iconColor: '#A8CCEB',
        },
        {
            name: '건강운',
            icon: 'dumbbell.fill',
            iconColor: '#F8BFA5',
        },
    ];

    // 특별 운세 데이터
    const specialFortuneData = [
        {
            name: '신년',
            routePath: '/fortune/newyear',
            icon: 'star.fill',
            iconColor: SecondaryColor,
            description: '새해의 운세',
        },
        {
            name: '이번 주',
            icon: 'clock.fill',
            iconColor: SecondaryColor,
            description: '주간 운세',
        },
        {
            name: '이번 달',
            icon: 'calendar',
            iconColor: SecondaryColor,
            description: '월간 운세',
        },
    ];

    // ============== 오늘의 총운 관련 함수 ==============
    // 오늘의 총운 모달 표시
    const onMainFortuneDetailPressed = () => {
        setMainFortuneModalVisible(true);
    };

    // 오늘의 총운 모달 닫기
    const onMainFortuneModalClose = () => {
        setMainFortuneModalVisible(false);
    };

    // ============== 오늘의 다른 운세 관련 함수 ==============
    // 오늘의 다른 운세 광고 확인 모달 닫기
    const onDailyAdConfirmModalClose = () => {
        setDailyAdConfirmModalVisible(false);
        setSelectedDailyFortuneName('');
    };

    // 오늘의 다른 운세 모달 닫기
    const onDailyFortuneModalClose = () => {
        setDailyFortuneModalVisible(false);
        setSelectedDailyFortuneName('');
    };

    // 오늘의 다른 운세 버튼 클릭 처리
    const onDailyFortunePressed = (name: string) => {
        if (hasDailyWatchedAds) {
            setDailyFortuneModalVisible(true);
        } else {
            setDailyAdConfirmModalVisible(true);
        }
        setSelectedDailyFortuneName(name);
    };

    // 오늘의 다른 운세 광고 시청
    const onWatchDailyAds = () => {
        setDailyAdConfirmModalVisible(false);
        // 광고 시청 로직 (구현 필요)
        setHasDailyWatchedAds(true);
        // 광고 시청 후 바로 오늘의 다른 운세 모달 표시
        setDailyFortuneModalVisible(true);
    };

    // ============== 특별 운세 관련 함수 ==============
    // 특별 운세 모달 닫기
    const onSpecialFortuneModalClose = () => {
        setSpecialFortuneModalVisible(false);
        setSelectedSpecialFortuneName('');
    };

    // 특별 운세 광고 확인 모달 닫기
    const onSpecialAdConfirmModalClose = () => {
        setSpecialAdConfirmModalVisible(false);
        setSelectedSpecialFortuneName('');
    };

    // 특별 운세 버튼 클릭 처리
    const onSpecialFortunePressed = (name: string) => {
        if (specialFortuneAdState[name]) {
            setSpecialFortuneModalVisible(true);
        } else {
            setSpecialAdConfirmModalVisible(true);
        }
        setSelectedSpecialFortuneName(name);
    };

    // 특별 운세 광고 시청
    const onWatchSpecialAds = () => {
        setSpecialAdConfirmModalVisible(false);
        // 광고 시청 로직 (구현 필요)
        setSpecialFortuneAdState((prev) => ({
            ...prev,
            [selectedSpecialFortuneName]: true,
        }));
        // 광고 시청 후 바로 특별 운세 모달 표시
        setSpecialFortuneModalVisible(true);
    };

    return (
        <ParallaxScrollView>
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
                        text="안정속진(安定速進)"
                    />
                    <Typography
                        size="base"
                        style={{ color: SubTextColor }}
                        text="차분하게 나아가면 성과를 얻는다."
                    />
                    <Pressable
                        style={styles.fortuneDetailButton}
                        onPress={onMainFortuneDetailPressed}
                    >
                        <Typography
                            size="sm"
                            bold
                            text="자세히 보기"
                        />
                    </Pressable>
                </View>
            </View>

            {/* 오늘의 다른 운세 섹션 */}
            <View style={styles.otherFortuneBannerContainer}>
                <Typography
                    size="md"
                    bold
                    style={styles.otherFortuneText}
                    text={'오늘의 다른 운세'}
                />
                <View style={styles.otherFortuneContainer}>
                    {dailyFortuneData.map(({ name, icon, iconColor }) => (
                        <Pressable
                            key={name}
                            style={styles.squareButton}
                            onPress={() => onDailyFortunePressed(name)}
                        >
                            <IconSymbol
                                size={27}
                                name={hasDailyWatchedAds ? (icon as IconSymbolName) : 'lock.fill'}
                                color={iconColor}
                                style={styles.otherFortuneIcon}
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

            {/* 특별 운세 섹션 */}
            <View style={[styles.otherFortuneBannerContainer, styles.specialFortuneBannerContainer]}>
                <Typography
                    size="md"
                    bold
                    style={styles.otherFortuneText}
                    text={'특별 운세'}
                />
                <View style={styles.specialFortuneContainer}>
                    {specialFortuneData.map(({ name, icon, iconColor, description }) => (
                        <Pressable
                            key={name}
                            style={styles.specialFortuneButton}
                            onPress={() => onSpecialFortunePressed(name)}
                        >
                            <View style={styles.specialFortuneIconContainer}>
                                <IconSymbol
                                    size={32}
                                    name={specialFortuneAdState[name] ? (icon as IconSymbolName) : 'lock.fill'}
                                    color={iconColor}
                                />
                            </View>
                            <View style={styles.specialFortuneTextContainer}>
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

            {/* 오늘의 총운 모달 */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={mainFortuneModalVisible}
                onRequestClose={onMainFortuneModalClose}
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
                                text="총운"
                                style={styles.otherFortuneName}
                            />
                        </View>
                        <View style={styles.modalFortuneContainer}>
                            <Typography
                                size="lg"
                                bold
                                style={{ marginBottom: 20 }}
                                text="안정속진(安定速進)"
                            />
                            <DonutChart
                                percentage={72}
                                strokeWidth={9}
                                color={PrimaryColor}
                                style={{ marginBottom: 30 }}
                            />
                            <KeepAllTypography
                                size="base"
                                style={{ lineHeight: 25, color: SubTextColor }}
                                text="오늘은 전반적으로 안정적인 기운이 감돌고 있습니다. 서두르지 않고 침착하게 행동한다면 원하는 결과를 얻을 수 있을 것입니다. 특히 중요한 결정이나 판단을 해야 할 때는 충분히 고민하고 신중하게 결정하세요. 갑작스러운 변화보다는 꾸준함이 중요한 날입니다. 주변 사람들과의 관계에서도 조급함보다는 이해와 배려가 필요합니다. 오늘 하루를 차분하게 보내면 내일은 더 밝은 하루가 될 것입니다."
                            />
                        </View>
                        <View style={[styles.modalButtons, styles.otherFortuneModalButton]}>
                            <Pressable
                                style={styles.modalButton}
                                onPress={onMainFortuneModalClose}
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

            {/* 오늘의 다른 운세 광고 확인 모달 */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={dailyAdConfirmModalVisible}
                onRequestClose={onDailyAdConfirmModalClose}
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
                                text="광고를 시청하시면 오늘 하루동안 모든 오늘의 운세를 확인할 수 있습니다!"
                                style={{ color: SubTextColor }}
                            />
                        </View>
                        <View style={[styles.modalButtons, styles.adModalButtons]}>
                            <Pressable
                                style={[styles.modalButton, { backgroundColor: '#DCCEF7' }]}
                                onPress={onDailyAdConfirmModalClose}
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
                                onPress={onWatchDailyAds}
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

            {/* 오늘의 다른 운세 결과 모달 */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={dailyFortuneModalVisible}
                onRequestClose={onDailyFortuneModalClose}
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
                                text={selectedDailyFortuneName}
                                style={styles.otherFortuneName}
                            />
                        </View>
                        <View style={styles.modalFortuneContainer}>
                            <Typography
                                size="lg"
                                bold
                                style={{ marginBottom: 20 }}
                                text="연리지지(連理之枝)"
                            />
                            <DonutChart
                                percentage={75}
                                strokeWidth={9}
                                color={PrimaryColor}
                                style={{ marginBottom: 30 }}
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
                                onPress={onDailyFortuneModalClose}
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

            {/* 특별 운세 광고 확인 모달 */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={specialAdConfirmModalVisible}
                onRequestClose={onSpecialAdConfirmModalClose}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContents, styles.adModalContents]}>
                        <View style={styles.adModalText}>
                            <Typography
                                size="md"
                                bold
                                text={`${selectedSpecialFortuneName} 운세를 확인하시겠습니까?`}
                                style={styles.adModalTitle}
                            />
                            <Typography
                                size="base"
                                bold
                                text="광고를 시청하시면 해당 특별 운세를 확인할 수 있습니다!"
                                style={{ color: SubTextColor }}
                            />
                        </View>
                        <View style={[styles.modalButtons, styles.adModalButtons]}>
                            <Pressable
                                style={[styles.modalButton, { backgroundColor: '#DCCEF7' }]}
                                onPress={onSpecialAdConfirmModalClose}
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
                                onPress={onWatchSpecialAds}
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

            {/* 특별 운세 결과 모달 */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={specialFortuneModalVisible}
                onRequestClose={onSpecialFortuneModalClose}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContents, styles.otherFortuneModalContents]}>
                        <View style={styles.otherFortuneModalText}>
                            <Typography
                                size="xl"
                                bold
                                text={selectedSpecialFortuneName}
                                style={styles.otherFortuneName}
                            />
                            <Typography
                                size="xl"
                                bold
                                text=" 운세"
                            />
                        </View>
                        <View style={styles.modalFortuneContainer}>
                            <Typography
                                size="lg"
                                bold
                                style={{ marginBottom: 20 }}
                                text="길운가득(吉運加得)"
                            />
                            <DonutChart
                                percentage={85}
                                strokeWidth={9}
                                color={PrimaryColor}
                                style={{ marginBottom: 30 }}
                            />
                            <KeepAllTypography
                                size="base"
                                style={{ lineHeight: 25, color: SubTextColor }}
                                text="새해에는 도전적인 일을 시작하는 것이 좋습니다. 새로운 만남이 있을 수 있으며, 재정적으로도 안정을 찾게 될 것입니다. 건강에 신경쓰면 더욱 활기찬 한 해가 될 것입니다."
                            />
                        </View>
                        <View style={[styles.modalButtons, styles.otherFortuneModalButton]}>
                            <Pressable
                                style={styles.modalButton}
                                onPress={onSpecialFortuneModalClose}
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

// 스타일 정의
const styles = StyleSheet.create({
    // 메인 운세 스타일
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

    // 운세 공통 컨테이너 스타일
    otherFortuneBannerContainer: {
        paddingHorizontal: 25,
        marginTop: 30,
    },
    otherFortuneText: {
        marginBottom: 18,
    },

    // 오늘의 다른 운세 스타일
    otherFortuneContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 21,
    },
    squareButton: {
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
    otherFortuneIcon: {
        marginLeft: -10,
    },

    // 특별 운세 스타일
    specialFortuneBannerContainer: {
        marginBottom: 45,
    },
    specialFortuneContainer: {
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
    specialFortuneIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(209, 196, 233, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    specialFortuneTextContainer: {
        flex: 1,
    },
    specialFortuneTitle: {
        marginBottom: 4,
    },
    specialFortuneDescription: {
        color: SubTextColor,
    },

    // 모달 공통 스타일
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 모달 배경 반투명 처리
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
    modalFortuneContainer: {
        alignItems: 'center',
        backgroundColor: '#F6F4FC',
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderRadius: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        backgroundColor: PrimaryColor,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
    },

    // 광고 모달 스타일
    adModalContents: {
        maxWidth: '75%',
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
        marginBottom: 15,
    },
    adModalButtons: {
        gap: 15,
    },

    // 운세 결과 모달 스타일
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
