import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageCategory, StorageDataMap } from '@/types/storage';

/**
 * 범용 AsyncStorage 관리 훅
 * 카테고리별로 데이터를 저장/조회/삭제할 수 있는 기능 제공
 */
export function useAsyncStorage<T extends StorageCategory>(category: T) {
    const [data, setData] = useState<StorageDataMap[T] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // 스토리지 키 생성
    const storageKey = `@FortuneTellingApp:${category}`;

    // 데이터 로드
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const value = await AsyncStorage.getItem(storageKey);
            if (value !== null) {
                setData(JSON.parse(value) as StorageDataMap[T]);
            }
            setError(null);
        } catch (e) {
            setError(e instanceof Error ? e : new Error('Failed to load data'));
        } finally {
            setLoading(false);
        }
    }, [storageKey]);

    // 데이터 저장
    const saveData = useCallback(
        async (newData: StorageDataMap[T]) => {
            try {
                await AsyncStorage.setItem(storageKey, JSON.stringify(newData));
                setData(newData);
                setError(null);
                return true;
            } catch (e) {
                setError(e instanceof Error ? e : new Error('Failed to save data'));
                return false;
            }
        },
        [storageKey]
    );

    // 데이터 업데이트 (기존 데이터에 병합)
    const updateData = useCallback(
        async (partialData: Partial<StorageDataMap[T]>) => {
            try {
                const currentData = data || ({} as StorageDataMap[T]);
                const updatedData = {
                    ...currentData,
                    ...partialData,
                } as StorageDataMap[T];

                await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData));
                setData(updatedData);
                setError(null);
                return true;
            } catch (e) {
                setError(e instanceof Error ? e : new Error('Failed to update data'));
                return false;
            }
        },
        [data, storageKey]
    );

    // 데이터 삭제
    const removeData = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(storageKey);
            setData(null);
            setError(null);
            return true;
        } catch (e) {
            setError(e instanceof Error ? e : new Error('Failed to remove data'));
            return false;
        }
    }, [storageKey]);

    // 초기 데이터 로드
    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        data,
        loading,
        error,
        setData: saveData,
        updateData,
        removeData,
        refreshData: loadData,
    };
}

export default useAsyncStorage;
