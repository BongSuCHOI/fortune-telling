import { useState } from 'react';
import type { SelectedFortune } from '@/types/fortune';

export function useFortuneSelection<T extends string, U extends string>() {
    const [selectedFortune, setSelectedFortune] = useState<SelectedFortune<T, U>>(null);

    const selectFortune = (fortune: SelectedFortune<T, U>) => {
        setSelectedFortune(fortune);
    };

    const resetSelection = () => setSelectedFortune(null);

    return { selectedFortune, selectFortune, resetSelection };
}
