import { useState } from 'react';

export function useFortuneModal(initialState = false) {
    const [isVisible, setIsVisible] = useState(initialState);
    const open = () => setIsVisible(true);
    const close = () => setIsVisible(false);

    return { isVisible, open, close };
}
