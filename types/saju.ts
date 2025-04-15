import type { IconSymbolName } from '@/components/ui/IconSymbol';
import type { AdWatchPeriod, purchasePeriod } from '@/types/storage';

export type SajuItemCode = 'sajuTraditional' | 'sajuCompatibility' | 'sajuCareer' | 'sajuMonthly' | 'sajuYearly';
export type SajuItemName = '정통사주' | '궁합사주' | '직업사주' | '월간사주' | '연간사주';

export interface SajuItem {
    category: SajuItemCode;
    name: SajuItemName;
    description: string;
    modalDescription: string[];
    price: number;
    icon: IconSymbolName;
    iconColor: string;
    adPeriod: AdWatchPeriod;
    purchasePeriod: purchasePeriod;
}
