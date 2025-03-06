import { useState } from 'react';
import type { SelectedFortune } from '@/types/fortune';

export function useFortuneSelection<T extends string, U extends string>() {
    const [selectedFortune, setSelectedFortune] = useState<SelectedFortune<T, U>>(null);
    const [hasWatchedAds, setHasWatchedAds] = useState<boolean>(false);

    const selectFortune = (fortune: SelectedFortune<T, U>) => {
        setSelectedFortune(fortune);
    };

    const markAdsWatched = () => setHasWatchedAds(true);
    const resetSelection = () => setSelectedFortune(null);

    return { selectedFortune, hasWatchedAds, selectFortune, markAdsWatched, resetSelection };
}
