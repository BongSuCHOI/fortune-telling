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

interface SkeletonUiProps {
    style?: ViewStyle;
}

export const FortuneSkeletonUI: React.FC<SkeletonUiProps> = ({ style }) => {
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

export const SajuSkeletonUI: React.FC<SkeletonUiProps> = ({ style }) => {
    return (
        <View style={[styles.container, style]}>
            {/* 사주 페이지 헤더 스켈레톤 */}
            <View style={styles.sajuHeaderContainer}>
                <SkeletonLoader
                    width={120}
                    height={30}
                    style={styles.titleSkeleton}
                />
                <SkeletonLoader
                    width={220}
                    height={24}
                    style={styles.subtitleSkeleton}
                />
                <SkeletonLoader
                    width={220}
                    height={24}
                    style={styles.subtitleSkeleton}
                />
            </View>

            {/* 사주 서비스 카드 스켈레톤 */}
            <View style={styles.sajuServicesContainer}>
                {/* 서비스 카드 1 */}
                <View style={styles.serviceCardSkeleton}>
                    <View style={styles.serviceIconSkeleton}>
                        <SkeletonLoader
                            width={60}
                            height={60}
                            borderRadius={30}
                        />
                    </View>
                    <View style={styles.serviceContentSkeleton}>
                        <View>
                            <SkeletonLoader
                                width={100}
                                height={22}
                                style={styles.serviceNameSkeleton}
                            />
                            <SkeletonLoader
                                width={180}
                                height={18}
                                style={styles.serviceDescSkeleton}
                            />
                            <SkeletonLoader
                                width={80}
                                height={20}
                                borderRadius={10}
                                style={styles.freeButtonSkeleton}
                            />
                        </View>
                        <SkeletonLoader
                            width={70}
                            height={30}
                            borderRadius={15}
                        />
                    </View>
                </View>

                {/* 서비스 카드 2 */}
                <View style={styles.serviceCardSkeleton}>
                    <View style={styles.serviceIconSkeleton}>
                        <SkeletonLoader
                            width={60}
                            height={60}
                            borderRadius={30}
                        />
                    </View>
                    <View style={styles.serviceContentSkeleton}>
                        <View>
                            <SkeletonLoader
                                width={90}
                                height={22}
                                style={styles.serviceNameSkeleton}
                            />
                            <SkeletonLoader
                                width={200}
                                height={18}
                                style={styles.serviceDescSkeleton}
                            />
                            <SkeletonLoader
                                width={80}
                                height={20}
                                borderRadius={10}
                                style={styles.freeButtonSkeleton}
                            />
                        </View>
                        <SkeletonLoader
                            width={70}
                            height={30}
                            borderRadius={15}
                        />
                    </View>
                </View>

                {/* 서비스 카드 3 */}
                <View style={styles.serviceCardSkeleton}>
                    <View style={styles.serviceIconSkeleton}>
                        <SkeletonLoader
                            width={60}
                            height={60}
                            borderRadius={30}
                        />
                    </View>
                    <View style={styles.serviceContentSkeleton}>
                        <View>
                            <SkeletonLoader
                                width={110}
                                height={22}
                                style={styles.serviceNameSkeleton}
                            />
                            <SkeletonLoader
                                width={190}
                                height={18}
                                style={styles.serviceDescSkeleton}
                            />
                            <SkeletonLoader
                                width={80}
                                height={20}
                                borderRadius={10}
                                style={styles.freeButtonSkeleton}
                            />
                        </View>
                        <SkeletonLoader
                            width={70}
                            height={30}
                            borderRadius={15}
                        />
                    </View>
                </View>

                {/* 서비스 카드 4 */}
                <View style={styles.serviceCardSkeleton}>
                    <View style={styles.serviceIconSkeleton}>
                        <SkeletonLoader
                            width={60}
                            height={60}
                            borderRadius={30}
                        />
                    </View>
                    <View style={styles.serviceContentSkeleton}>
                        <View>
                            <SkeletonLoader
                                width={100}
                                height={22}
                                style={styles.serviceNameSkeleton}
                            />
                            <SkeletonLoader
                                width={185}
                                height={18}
                                style={styles.serviceDescSkeleton}
                            />
                            <SkeletonLoader
                                width={80}
                                height={20}
                                borderRadius={10}
                                style={styles.freeButtonSkeleton}
                            />
                        </View>
                        <SkeletonLoader
                            width={70}
                            height={30}
                            borderRadius={15}
                        />
                    </View>
                </View>
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
    // 사주 스켈레톤 UI 관련 스타일
    sajuHeaderContainer: {
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
        paddingHorizontal: 20,
    },
    subtitleSkeleton: {
        marginTop: 6,
    },
    sajuServicesContainer: {
        width: '100%',
        paddingHorizontal: 25,
        gap: 15,
    },
    serviceCardSkeleton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 15,
        borderColor: '#D1C4E9',
        borderWidth: 1,
    },
    serviceIconSkeleton: {
        marginRight: 16,
    },
    serviceContentSkeleton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    serviceNameSkeleton: {
        marginBottom: 8,
    },
    serviceDescSkeleton: {
        marginBottom: 8,
    },
    freeButtonSkeleton: {
        marginTop: 8,
    },
});
