import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Typography } from '@/components/Typography';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function FortuneScreen() {
    return (
        <ParallaxScrollView>
            <View style={styles.titleContainer}>
                <Typography
                    size="xxl"
                    style={{ marginTop: 30 }}
                    bold
                >
                    홍길동님,
                </Typography>
                <Typography size="xxl">어제 하루는 어떠셨나요?</Typography>
            </View>
            <View style={styles.todayFortuneContainer}>
                <Typography
                    size="sm"
                    bold
                    description
                    style={{ marginBottom: 5 }}
                >
                    02월 02일(수)
                </Typography>
                <Typography
                    size="xl"
                    bold
                    style={{ marginBottom: 10 }}
                >
                    운수대통(運數大通)
                </Typography>
                <Typography size="base">오늘은 운이 크게 열리는 날입니다. 예상치 못한 좋은 기회가 찾아오거나, 주변에서 도움을 받게 될 가능성이 큽니다. 작은 일이라도 정성스럽게 임하면 더 큰 행운으로 이어질 수 있습니다.</Typography>
            </View>
            <View style={styles.fortuneBannerContainer}>
                <Pressable onPress={() => useRouter().push('/fortune/love')}>
                    <IconSymbol
                        size={28}
                        name="heart.fill"
                        color={'black'}
                    />
                    <Typography
                        size="xl"
                        bold
                    >
                        애정운
                    </Typography>
                </Pressable>
            </View>
            {/* 애정 금전 직장 학업 건강 */}
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        alignItems: 'flex-start',
    },
    todayFortuneContainer: {
        marginTop: 30,
    },
    fortuneBannerContainer: {},
});
