import type { IconSymbolName } from '@/components/ui/IconSymbol';
import type { PurchaseType } from '@/types/storage';

export type SajuItemCode = 'traditional' | 'compatibility' | 'career' | 'yearly';
export type SajuItemName = '정통사주' | '궁합사주' | '직업사주' | '연간사주';

export interface SajuItem {
    code: SajuItemCode;
    name: SajuItemName;
    description: string;
    modalDescription: string[];
    price: number;
    icon: IconSymbolName;
    iconColor: string;
    purchaseType: PurchaseType;
}
