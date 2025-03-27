import type { IconSymbolName } from '@/components/ui/IconSymbol';
import type { AdWatchPeriod } from '@/types/storage';

export interface FortuneData {
    title: string;
    summary?: string;
    explanation: string;
    score: number;
}

export type DailyOtherFortuneCode = 'dailyLoveFortune' | 'dailyMoneyFortune' | 'dailyBusinessFortune' | 'dailyStudyFortune' | 'dailyHealthFortune';

export type DailyOtherFortuneName = '애정운' | '금전운' | '직장운' | '학업운' | '건강운';

export type SpecialFortuneCode = 'specialYearFortune' | 'specialWeekFortune' | 'specialMonthFortune';

export type SpecialFortuneName = '올해' | '이번 주' | '이번 달';

export type SelectedFortune<T extends string, U extends string> = {
    category: T;
    adPeriod: AdWatchPeriod;
    name: U;
} | null;

export interface DailyTotalFortuneData {
    total: FortuneData;
}

export type DailyOtherFortuneData = Record<DailyOtherFortuneCode, FortuneData>;

export type SpecialFortuneData = Partial<Record<SpecialFortuneCode, FortuneData>>;

export interface FortuneIcon {
    icon: IconSymbolName;
    iconColor: string;
}

export interface DailyOtherFortuneItem extends FortuneIcon {
    category: DailyOtherFortuneCode;
    name: DailyOtherFortuneName;
    adPeriod: AdWatchPeriod;
}

export interface SpecialFortuneItem extends FortuneIcon {
    category: SpecialFortuneCode;
    name: SpecialFortuneName;
    description: string;
    adPeriod: AdWatchPeriod;
}
