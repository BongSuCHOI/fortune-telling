import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useUserInfo } from '@/hooks/useUserInfo';

// 에셋 로딩이 완료되기 전에 스플래시 화면이 자동으로 숨겨지지 않도록 합니다.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    const { userInfo, loading: userInfoLoading } = useUserInfo();

    useEffect(() => {
        // 폰트와 사용자 정보가 모두 로드되면 스플래시 화면을 숨깁니다.
        if (loaded && !userInfoLoading) {
            SplashScreen.hideAsync();
        }
    }, [loaded, userInfoLoading]);

    // 로딩 중이거나 사용자 정보가 로드되지 않은 경우 스플래시 화면을 숨기지 않습니다.
    if (!loaded || userInfoLoading) {
        return null;
    }

    return (
        <>
            <Stack
                screenOptions={{
                    headerTitle: '',
                    headerShadowVisible: false,
                }}
            >
                <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                    redirect={!!userInfo}
                />
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar
                style="auto"
                backgroundColor="white"
            />
        </>
    );
}
