import { Link, Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';

import { Typography } from '@/components/ui/Typography';

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Oops!' }} />
            <View style={styles.container}>
                <Typography
                    size="lg"
                    text="This screen doesn't exist."
                />
                <Link
                    href="/"
                    style={styles.link}
                >
                    <Typography
                        size="lg"
                        bold
                        text="Go to home screen!"
                    />
                </Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
});
