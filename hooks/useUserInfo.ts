import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import useAsyncStorage from '@/hooks/useAsyncStorage';
import { UserInfo } from '@/types/storage';

/**
 * 사용자 정보를 관리하는 훅
 * 새로운 useAsyncStorage 훅을 사용하여 구현
 */
export function useUserInfo() {
    const router = useRouter();

    const { data: userInfo, loading, error, setData: setUserInfo, updateData, removeData, refreshData } = useAsyncStorage('UserInfo');

    // 사용자 정보 업데이트
    const updateUserInfo = useCallback(
        (info: Partial<UserInfo>) => {
            updateData(info);
        },
        [updateData]
    );

    // 사용자 정보가 없을 경우 알림 표시 및 리다이렉트
    const redirectIfUserInfoMissing = useCallback(() => {
        Alert.alert('사용자 정보를 찾을 수 없습니다.', '원활한 서비스 이용을 위해 사용자 정보 등록 페이지로 이동합니다.\n문제가 지속될 경우 고객센터로 문의 바랍니다.', [{ text: '확인', onPress: () => router.replace('/(auth)') }]);
    }, [router]);

    return {
        userInfo,
        loading,
        error,
        setUserInfo,
        updateUserInfo,
        removeUserInfo: removeData,
        refreshUserInfo: refreshData,
        redirectIfUserInfoMissing,
    };
}

export default useUserInfo;
