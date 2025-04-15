import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { AppState, AppStateStatus, Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

import { useUserInfo } from '@/hooks/useUserInfo';
import Logger from '@/utils/Logger';

const TAG = 'App';

// 에셋 로딩이 완료되기 전에 스플래시 화면이 자동으로 숨겨지지 않도록 합니다.
SplashScreen.preventAutoHideAsync();

// 앱 정보 수집
const appVersion = Constants.expoConfig?.version || '1.0.0';
const buildNumber =
    Platform.select({
        ios: Constants.expoConfig?.ios?.buildNumber,
        android: Constants.expoConfig?.android?.versionCode?.toString(),
    }) || '1';

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    // 로깅 시스템 초기화 상태 추적
    const [logInitialized, setLogInitialized] = useState(false);

    const { userInfo, loading: userInfoLoading } = useUserInfo();

    // 앱 상태 변경 모니터링 및 로깅
    useEffect(() => {
        const initializeAppLog = async () => {
            try {
                const deviceInfo = {
                    brand: Device.brand,
                    modelName: Device.modelName,
                    osName: Device.osName,
                    osVersion: Device.osVersion,
                    deviceType: Device.deviceType,
                };

                // 앱 시작 시 기본 정보 로깅
                Logger.info(TAG, '포춘텔링 앱 시작', {
                    appVersion: `${appVersion} (${buildNumber})`,
                    platform: Platform.OS,
                    device: deviceInfo,
                });
            } catch (error) {
                Logger.error(TAG, '앱 로그 초기화 중 오류 발생', { error });
            } finally {
                setLogInitialized(true);
            }
        };

        initializeAppLog();

        // 앱 상태 변화 감지 및 로깅
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            Logger.debug(TAG, `앱 상태 변화: ${nextAppState}`);

            if (nextAppState === 'active') {
                Logger.event('APP', 'FOREGROUND');
            } else if (nextAppState === 'background') {
                Logger.event('APP', 'BACKGROUND');
            } else if (nextAppState === 'inactive') {
                Logger.event('APP', 'INACTIVE');
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    // 사용자 정보 로딩 시 로깅
    useEffect(() => {
        if (!userInfoLoading && userInfo) {
            Logger.info(TAG, '사용자 정보 로드됨', {
                userId: userInfo.id,
                hasUserInfo: true,
            });
        }
    }, [userInfo, userInfoLoading]);

    // 에러 바운더리 로깅을 위한 전역 에러 핸들러 설정
    useEffect(() => {
        const errorHandler = (error: Error, isFatal?: boolean) => {
            Logger.error(TAG, `전역 에러 발생${isFatal ? ' (치명적)' : ''}`, {
                name: error.name,
                message: error.message,
                stack: error.stack,
            });
        };

        // React Native의 전역 에러 핸들러 설정
        const originalHandler = ErrorUtils.getGlobalHandler();

        ErrorUtils.setGlobalHandler((error, isFatal) => {
            errorHandler(error, isFatal);
            originalHandler(error, isFatal);
        });

        return () => {
            ErrorUtils.setGlobalHandler(originalHandler);
        };
    }, []);

    useEffect(() => {
        const hideStartupScreen = async () => {
            // 폰트, 사용자 정보, 로그 초기화가 모두 완료되면 스플래시 화면을 숨깁니다.
            if (loaded && !userInfoLoading && logInitialized) {
                try {
                    await SplashScreen.hideAsync();
                    Logger.debug(TAG, '스플래시 화면 숨김 완료');
                } catch (error) {
                    console.warn('스플래시 화면 숨김 실패:', error);
                    Logger.warn(TAG, '스플래시 화면 숨김 실패', { error });
                }
            }
        };

        hideStartupScreen();
    }, [loaded, userInfoLoading, logInitialized]);

    // 로딩 중인 경우 스플래시 화면을 계속 표시합니다.
    if (!loaded || userInfoLoading || !logInitialized) {
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
