import type { IconSymbolName } from '@/components/ui/IconSymbol';

export interface FortuneData {
    title: string;
    summary?: string;
    explanation: string;
    score: number;
}

export type DailyFortuneCode = 'love' | 'money' | 'business' | 'study' | 'health';

export type DailyFortuneName = '애정운' | '금전운' | '직장운' | '학업운' | '건강운';

export type SpecialFortuneCode = 'year' | 'week' | 'month';

export type SpecialFortuneName = '올해' | '이번 주' | '이번 달';

export type SelectedFortune<T extends string, U extends string> = {
    category: T;
    name: U;
} | null;

export interface DailyTotalFortuneData {
    total: FortuneData;
}

export type DailyOtherFortuneData = Record<DailyFortuneCode, FortuneData>;

export type SpecialFortuneData = Partial<Record<SpecialFortuneCode, FortuneData>>;

export interface FortuneIcon {
    icon: IconSymbolName;
    iconColor: string;
}

export interface DailyOtherFortuneItem extends FortuneIcon {
    category: DailyFortuneCode;
    name: DailyFortuneName;
}

export interface SpecialFortuneItem extends FortuneIcon {
    category: SpecialFortuneCode;
    name: SpecialFortuneName;
    description: string;
}
