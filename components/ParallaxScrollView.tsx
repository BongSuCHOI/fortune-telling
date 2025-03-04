import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';

import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

export default function ParallaxScrollView({ children }: { children: React.ReactNode }) {
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const bottom = useBottomTabOverflow();

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                ref={scrollRef}
                scrollEventThrottle={16}
                scrollIndicatorInsets={{ bottom }}
                contentContainerStyle={{ paddingBottom: bottom }}
            >
                <View style={styles.content}>{children}</View>
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
