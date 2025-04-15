import { useState } from 'react';

export function useServiceSelection<T>() {
// export function useServiceSelection<T extends string, U extends string>() {
    // 선택된 서비스
    const [selectedService, setSelectedService] = useState<T | null>(null);

    // 서비스 선택
    const selectService = (service: T) => {
        setSelectedService(service);
    };

    // 선택 초기화
    const resetService = () => setSelectedService(null);

    return {
        selectedService,
        selectService,
        resetService,
    };
}
