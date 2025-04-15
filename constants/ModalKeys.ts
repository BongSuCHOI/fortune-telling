/**
 * 앱 전체에서 사용되는 모달 키 상수를 정의합니다.
 * 이를 통해 모달 키의 중복 방지 및 일관된 관리가 가능합니다.
 */

// 운세 관련 모달 키
export const FORTUNE_MODAL_KEYS = {
    // 광고 확인 모달 키
    DAILY_FORTUNE_AD_CONFIRM: 'dailyFortuneAdConfirm',
    SPECIAL_FORTUNE_AD_CONFIRM: 'specialFortuneAdConfirm',

    // 결과 보기 모달 키
    DAILY_FORTUNE_RESULT: 'dailyFortuneResult',
    DAILY_OTHER_FORTUNE_RESULT: 'dailyOtherFortuneResult',
    SPECIAL_FORTUNE_RESULT: 'specialFortuneResult',
};

// 사주 관련 모달 키
export const SAJU_MODAL_KEYS = {
    // 광고 확인 모달 키
    SAJU_AD_CONFIRM: 'sajuAdConfirm',

    // 서비스 정보 모달 키
    SAJU_DETAIL: 'sajuDetail',

    // 결과 및 미리보기 모달 키
    SAJU_PREVIEW: 'sajuPreview',
    SAJU_RESULT: 'sajuResult',

    // 결제 관련 모달 키
    SAJU_PAYMENT: 'sajuPayment',
    SAJU_PAYMENT_SUCCESS: 'sajuPaymentSuccess',
};

// 공통 모달 키
export const COMMON_MODAL_KEYS = {
    ERROR: 'error',
    CONFIRM: 'confirm',
    NOTIFICATION: 'notification',
};
