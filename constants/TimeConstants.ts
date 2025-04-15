// 시간 관련 상수 정의
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;
export const ONE_WEEK_MS = 7 * ONE_DAY_MS;
export const ONE_MONTH_MS = 30 * ONE_DAY_MS;
export const ONE_YEAR_MS = 365 * ONE_DAY_MS;

/**
 * 특정 기간이 현재 시간 기준을 초과했는지 확인하는 유틸리티 함수
 * @param timestamp 타임스탬프
 * @param period 유효 기간 타입
 * @returns 유효 여부
 */
export function hasTimeExpired(timestamp: number, period: string): boolean {
    if (!timestamp) {
        return true;
    }

    const now = new Date();
    const purchaseDate = new Date(timestamp);

    switch (period) {
        case 'daily': {
            // 다음날 자정에 만료
            const expiryDate = new Date(purchaseDate);
            expiryDate.setDate(purchaseDate.getDate() + 1);
            expiryDate.setHours(0, 0, 0, 0);
            return now >= expiryDate;
        }
        case 'weekly': {
            // 다음 월요일 자정에 만료
            const expiryDate = new Date(purchaseDate);
            const dayOfWeek = purchaseDate.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
            const daysUntilNextMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek; // 일요일이면 1일 추가, 아니면 다음 월요일까지 계산
            expiryDate.setDate(purchaseDate.getDate() + daysUntilNextMonday);
            expiryDate.setHours(0, 0, 0, 0);
            return now >= expiryDate;
        }
        case 'monthly': {
            // 다음달 1일 자정에 만료
            const expiryDate = new Date(purchaseDate);
            expiryDate.setMonth(purchaseDate.getMonth() + 1);
            expiryDate.setDate(1);
            expiryDate.setHours(0, 0, 0, 0);
            return now >= expiryDate;
        }
        case 'annual': {
            // 내년 1월 1일 자정에 만료
            const expiryDate = new Date(purchaseDate);
            expiryDate.setFullYear(purchaseDate.getFullYear() + 1);
            expiryDate.setMonth(0);
            expiryDate.setDate(1);
            expiryDate.setHours(0, 0, 0, 0);
            return now >= expiryDate;
        }
        case 'permanent':
            return false;
        case 'single-use':
            // 단일 사용은 항상 true (매번 재구매 해야함)
            return true;
        default:
            return true;
    }
}
