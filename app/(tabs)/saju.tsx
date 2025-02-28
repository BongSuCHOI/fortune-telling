import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Typography, KeepAllTypography } from '@/components/Typography';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { PrimaryColor } from '@/constants/Colors';

import type { Href } from 'expo-router';
import type { IconSymbolName } from '@/components/ui/IconSymbol';

export default function SajuScreen() {
    const router = useRouter();

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
            <View style={styles.todayFortuneContainer}>
                <Typography
                    size="sm"
                    bold
                    description
                    style={{ marginBottom: 5 }}
                    text="02월 02일(수) 총운"
                />
                <Typography
                    size="xl"
                    bold
                    style={{ marginBottom: 12 }}
                    text="운수대통(運數大通)"
                />
                <KeepAllTypography
                    size="base"
                    style={{ lineHeight: 27 }}
                    text="오늘은 운이 크게 열리는 날입니다. 예상치 못한 좋은 기회가 찾아오거나, 주변에서 도움을 받게 될 가능성이 큽니다. 작은 일이라도 정성스럽게 임하면 더 큰 행운으로 이어질 수 있습니다."
                />
            </View>
            <View style={styles.otherFortuneBannerContainer}>
                <Typography
                    size="base"
                    bold
                    style={styles.otherFortuneText}
                    text="오늘의 다른 운세도 확인해보세요!"
                />
                <View style={styles.otherFortuneContainer}>
                    {otherFortuneData.map((data) => (
                        <Pressable
                            key={data.name}
                            style={[styles.squareButton, { backgroundColor: data.bgColor }]}
                            onPress={() => router.push(data.routePath as Href)}
                        >
                            <IconSymbol
                                size={40}
                                name={data.icon as IconSymbolName}
                                color={data.iconColor}
                            />
                        </Pressable>
                    ))}
                </View>
            </View>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        alignItems: 'flex-start',
    },
    titleText: {
        marginTop: 30,
        color: PrimaryColor,
    },
    todayFortuneContainer: {
        marginTop: 20,
    },
    otherFortuneBannerContainer: {
        marginTop: 30,
    },
    otherFortuneText: {
        marginBottom: 12,
    },
    otherFortuneContainer: {
        flexDirection: 'row',
        columnGap: 15,
    },
    squareButton: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
