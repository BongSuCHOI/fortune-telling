import { AdWatchPeriod } from '@/types/storage';

/**
 * AdManager - 앱 전체의 광고 관련 로직을 중앙화하는 유틸리티
 * 실제 구현 시에는 AdMob 또는 다른 광고 SDK와 연동
 */

/**
 * 보상형 광고 요청 시 반환될 결과 타입
 */
export interface AdResult {
    success: boolean;
    error?: string;
}

/**
 * 광고 시청 API 객체
 * 실제 구현에서는 AdMob이나 다른 광고 SDK를 연동
 */
class AdManager {
    // 광고 시청 요청 상태
    private adRequested: boolean = false;

    // 테스트 목적으로 항상 성공하는 광고 응답
    private testMode: boolean = true;

    // 광고 요청 이벤트 콜백
    private onAdRequested?: () => void;

    // 광고 완료 이벤트 콜백
    private onAdCompleted?: (result: AdResult) => void;

    /**
     * 보상형 광고 시청 요청
     * 실제 구현에서는 AdMob 또는 다른 SDK의 API 호출
     */
    public async showRewardedAd(category: string, period: AdWatchPeriod): Promise<AdResult> {
        // 이미 광고 요청 중이면 중복 요청 방지
        if (this.adRequested) {
            return {
                success: false,
                error: 'Another ad request is in progress',
            };
        }

        this.adRequested = true;

        if (this.onAdRequested) {
            this.onAdRequested();
        }

        try {
            // 실제 광고 SDK 연동 시 여기에 구현
            // 테스트 모드에서는 1초 지연 후 성공 반환
            if (this.testMode) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const result: AdResult = { success: true };

                if (this.onAdCompleted) {
                    this.onAdCompleted(result);
                }

                return result;
            }

            // 실제 AdMob SDK 호출 예시 (실제 코드는 다름)

            // const reward = await AdMob.requestRewardedAd({
            //     adUnitId: this.getAdUnitIdForCategory(category, period),
            // });

            // const result = { success: reward !== null };

            // if (this.onAdCompleted) {
            //     this.onAdCompleted(result);
            // }

            // return result;

            // 임시 구현 (테스트 모드가 아니면 실패)
            const result: AdResult = {
                success: false,
                error: 'Ad SDK not implemented yet',
            };

            if (this.onAdCompleted) {
                this.onAdCompleted(result);
            }

            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const result: AdResult = {
                success: false,
                error: errorMessage,
            };

            if (this.onAdCompleted) {
                this.onAdCompleted(result);
            }

            return result;
        } finally {
            this.adRequested = false;
        }
    }

    /**
     * 광고 요청 이벤트 구독
     */
    public setOnAdRequested(callback: () => void): void {
        this.onAdRequested = callback;
    }

    /**
     * 광고 완료 이벤트 구독
     */
    public setOnAdCompleted(callback: (result: AdResult) => void): void {
        this.onAdCompleted = callback;
    }

    /**
     * 테스트 모드 설정
     */
    public setTestMode(enabled: boolean): void {
        this.testMode = enabled;
    }
}

// 싱글톤 인스턴스 생성
export const adManager = new AdManager();

export default adManager;
