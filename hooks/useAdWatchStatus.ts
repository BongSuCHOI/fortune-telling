import { useState } from 'react';

export function useAdWatchStatus<T extends string>(keys: T[]) {
    if (!keys || keys.length === 0) {
        throw new Error('Requires an array of keys.');
    }

    const initialState = keys.reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<T, boolean>);

    const [adWatchedMap, setAdWatchedMap] = useState<Record<T, boolean>>(initialState);

    // 함수들을 더 간결하게 정의
    const markAdWatched = (key: T) => {
        setAdWatchedMap((prev) => ({ ...prev, [key]: true }));
    };

    const resetAdWatched = (key: T) => {
        setAdWatchedMap((prev) => ({ ...prev, [key]: false }));
    };

    // 여러 키를 한번에 초기화하는 유틸리티 함수 추가
    const resetAllAdWatched = () => {
        setAdWatchedMap(initialState);
    };

    return {
        adWatched: adWatchedMap,
        markAdWatched,
        resetAdWatched,
        resetAllAdWatched,
    };
}
