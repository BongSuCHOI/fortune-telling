import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';

interface SkeletonProps {
    width: number | `${number}%` | 'auto';
    height: number | `${number}%` | 'auto';
    borderRadius?: number;
    style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ width, height, borderRadius = 4, style }) => {
    // 애니메이션 값
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        // 애니메이션 순환 설정
        const pulseAnimation = Animated.sequence([
            Animated.timing(opacity, {
                toValue: 0.6,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0.3,
                duration: 800,
                useNativeDriver: true,
            }),
        ]);

        // 애니메이션 무한 반복
        Animated.loop(pulseAnimation).start();

        return () => {
            // 컴포넌트 언마운트 시 애니메이션 중지
            opacity.stopAnimation();
        };
    }, []);

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width,
                    height,
                    borderRadius,
                    opacity,
                },
                style,
            ]}
        />
    );
};

interface FortuneSkeletonProps {
    style?: ViewStyle;
}

export const FortuneSkeletonUI: React.FC<FortuneSkeletonProps> = ({ style }) => {
    return (
        <View style={[styles.container, style]}>
            {/* 타이틀 영역 스켈레톤 */}
            <View style={styles.titleContainer}>
                <SkeletonLoader
                    width={150}
                    height={28}
                    style={styles.titleSkeleton}
                />
                <SkeletonLoader
                    width={200}
                    height={28}
                    style={styles.titleSkeleton}
                />
            </View>

            {/* 도넛 차트 스켈레톤 */}
            <View style={styles.chartContainer}>
                <View style={styles.donutSkeleton}>
                    <SkeletonLoader
                        width={150}
                        height={150}
                        borderRadius={75}
                    />
                </View>

                {/* 텍스트 영역 스켈레톤 */}
                <SkeletonLoader
                    width={180}
                    height={24}
                    style={styles.textSkeleton}
                />
                <SkeletonLoader
                    width={250}
                    height={18}
                    style={styles.textSkeleton}
                />
                <SkeletonLoader
                    width={250}
                    height={18}
                    style={styles.textSkeleton}
                />

                {/* 버튼 스켈레톤 */}
                <SkeletonLoader
                    width={120}
                    height={40}
                    borderRadius={20}
                    style={styles.buttonSkeleton}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F4FC',
        paddingTop: 90,
        paddingBottom: 40,
        width: '100%',
    },
    skeleton: {
        backgroundColor: '#E1D9F0',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 25,
    },
    titleSkeleton: {
        marginBottom: 10,
    },
    chartContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    donutSkeleton: {
        marginBottom: 40,
    },
    textSkeleton: {
        marginBottom: 10,
    },
    buttonSkeleton: {
        marginTop: 30,
    },
});
