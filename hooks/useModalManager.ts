import { useState } from 'react';

export function useModalManager() {
    const [modalVisibility, setModalVisibility] = useState<{ [key: string]: boolean }>({});

    const openModal = (modalKey: string) => {
        setModalVisibility((prev) => ({ ...prev, [modalKey]: true }));
    };

    const closeModal = (modalKey: string) => {
        setModalVisibility((prev) => ({ ...prev, [modalKey]: false }));
    };

    return { modalVisibility, openModal, closeModal };
}
