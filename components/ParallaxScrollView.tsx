import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';

import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

import type { StyleProp, ViewStyle } from 'react-native';

interface ParallaxScrollViewProps {
    containerStyle?: StyleProp<ViewStyle>;
    contentsStyle?: StyleProp<ViewStyle>;
    children: React.ReactNode;
}

export default function ParallaxScrollView({ children, containerStyle, contentsStyle }: ParallaxScrollViewProps) {
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const bottom = useBottomTabOverflow();

    return (
        <View style={[styles.container, containerStyle]}>
            <Animated.ScrollView
                ref={scrollRef}
                scrollEventThrottle={16}
                scrollIndicatorInsets={{ bottom }}
                contentContainerStyle={{ paddingBottom: bottom }}
            >
                <View style={[styles.content, contentsStyle]}>{children}</View>
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 0,
        gap: 15,
        overflow: 'hidden',
    },
});
