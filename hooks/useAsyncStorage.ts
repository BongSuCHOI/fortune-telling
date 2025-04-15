import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageCategory, StorageDataMap } from '@/types/storage';
import Logger from '@/utils/Logger';

const TAG = 'AsyncStorage';
const STORAGE_TIMEOUT = 5000; // 5초 타임아웃

/**
 * 비동기 작업에 타임아웃 적용
 */
const withTimeout = (promise: Promise<any>, ms: number, errorMsg: string): Promise<any> => {
    // 타임아웃 프로미스 생성
    const timeout = new Promise((_, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id);
            reject(new Error(`${errorMsg} - ${ms}ms 타임아웃 초과`));
        }, ms);
    });

    // 프로미스와 타임아웃 중 먼저 완료되는 것을 반환
    return Promise.race([promise, timeout]);
};

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
            // 타임아웃 적용
            const value = await withTimeout(AsyncStorage.getItem(storageKey), STORAGE_TIMEOUT, `${category} 데이터 로드 중 타임아웃`);

            if (value !== null) {
                try {
                    const parsedData = JSON.parse(value) as StorageDataMap[T];
                    setData(parsedData);
                } catch (parseError) {
                    // JSON 파싱 오류 처리
                    Logger.error(TAG, `데이터 파싱 실패: ${category}`, {
                        error: parseError instanceof Error ? parseError.message : '알 수 없는 오류',
                        value: value.substring(0, 100), // 긴 데이터는 일부만 로그
                    });
                    setError(parseError instanceof Error ? parseError : new Error('Failed to parse data'));
                    setData(null);
                }
            } else {
                setData(null);
            }
            setError(null);
        } catch (e) {
            const errorMsg = e instanceof Error ? e.message : '알 수 없는 오류';
            Logger.error(TAG, `데이터 로드 실패: ${category}`, { error: errorMsg });
            setError(e instanceof Error ? e : new Error('Failed to load data'));
        } finally {
            setLoading(false);
        }
    }, [storageKey, category]);

    // 데이터 저장
    const saveData = useCallback(
        async (newData: StorageDataMap[T]) => {
            Logger.info(TAG, `데이터 저장: ${category}`);

            try {
                const jsonValue = JSON.stringify(newData);

                // 타임아웃 적용
                await withTimeout(AsyncStorage.setItem(storageKey, jsonValue), STORAGE_TIMEOUT, `${category} 데이터 저장 중 타임아웃`);

                setData(newData);
                setError(null);
                return true;
            } catch (e) {
                const errorMsg = e instanceof Error ? e.message : '알 수 없는 오류';
                Logger.error(TAG, `데이터 저장 실패: ${category}`, { error: errorMsg });
                setError(e instanceof Error ? e : new Error('Failed to save data'));
                return false;
            }
        },
        [storageKey, category]
    );

    // 데이터 업데이트 (기존 데이터에 병합)
    const updateData = useCallback(
        async (partialData: Partial<StorageDataMap[T]>) => {
            Logger.info(TAG, `데이터 업데이트: ${category}`);

            try {
                const currentData = data || ({} as StorageDataMap[T]);
                const updatedData = {
                    ...currentData,
                    ...partialData,
                } as StorageDataMap[T];

                const jsonValue = JSON.stringify(updatedData);

                // 타임아웃 적용
                await withTimeout(AsyncStorage.setItem(storageKey, jsonValue), STORAGE_TIMEOUT, `${category} 데이터 업데이트 중 타임아웃`);

                setData(updatedData);
                setError(null);
                return true;
            } catch (e) {
                const errorMsg = e instanceof Error ? e.message : '알 수 없는 오류';
                Logger.error(TAG, `데이터 업데이트 실패: ${category}`, { error: errorMsg });
                setError(e instanceof Error ? e : new Error('Failed to update data'));
                return false;
            }
        },
        [data, storageKey, category]
    );

    // 데이터 삭제
    const removeData = useCallback(async () => {
        Logger.info(TAG, `데이터 삭제: ${category}`);

        try {
            // 타임아웃 적용
            await withTimeout(AsyncStorage.removeItem(storageKey), STORAGE_TIMEOUT, `${category} 데이터 삭제 중 타임아웃`);

            setData(null);
            setError(null);
            return true;
        } catch (e) {
            const errorMsg = e instanceof Error ? e.message : '알 수 없는 오류';
            Logger.error(TAG, `데이터 삭제 실패: ${category}`, { error: errorMsg });
            setError(e instanceof Error ? e : new Error('Failed to remove data'));
            return false;
        }
    }, [storageKey, category]);

    // 초기 데이터 로드
    useEffect(() => {
        loadData().catch((e) => {
            Logger.error(TAG, `초기 데이터 로드 중 캐치되지 않은 오류: ${category}`, {
                error: e instanceof Error ? e.message : '알 수 없는 오류',
            });
            // 로딩 상태가 무한히 지속되는 것을 방지
            setLoading(false);
        });
    }, [loadData, category]);

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
