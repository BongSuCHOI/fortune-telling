/**
 * 앱 전체에서 사용되는 광고 키 상수를 정의합니다.
 * 이를 통해 광고 키의 중복 방지 및 일관된 관리가 가능합니다.
 */

// 일별 운세 관련 광고 키
export const DAILY_FORTUNE_AD_KEYS = {
    // 오늘의 총운 광고 키
    DAILY_TOTAL_FORTUNE: 'dailyTotalFortuneAd',

    // 오늘의 다른 운세 통합 광고 키 (애정/금전/직장/학업/건강)
    DAILY_OTHER_FORTUNE: 'dailyOtherFortuneAd',
};

// 특별 운세 관련 광고 키
export const SPECIAL_FORTUNE_AD_KEYS = {
    // 올해 운세 광고 키
    SPECIAL_YEAR_FORTUNE: 'specialYearFortune',

    // 이번 달 운세 광고 키
    SPECIAL_MONTH_FORTUNE: 'specialMonthFortune',

    // 이번 주 운세 광고 키
    SPECIAL_WEEK_FORTUNE: 'specialWeekFortune',
};

// 사주 관련 광고 키
export const SAJU_AD_KEYS = {
    // 정통 사주 광고 키
    SAJU_TRADITIONAL: 'sajuTraditional',

    // 궁합 사주 광고 키
    SAJU_COMPATIBILITY: 'sajuCompatibility',

    // 직업 사주 광고 키
    SAJU_CAREER: 'sajuCareer',

    // 월간 사주 광고 키
    SAJU_MONTHLY: 'sajuMonthly',

    // 연간 사주 광고 키
    SAJU_YEARLY: 'sajuYearly',
};
