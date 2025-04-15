import { AdWatchPeriod } from '@/types/storage';
import Logger from '@/utils/Logger';

const TAG = 'AdManager';

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

    // 초기화 여부
    private initialized: boolean = false;

    constructor() {
        // 생성자에서 로그를 출력하지 않음
    }

    /**
     * 지연 초기화 메서드
     * 실제로 필요할 때만 초기화를 수행함
     */
    private initialize() {
        if (!this.initialized) {
            // 개발 환경에서만 초기화 로그
            if (__DEV__) {
                Logger.debug(TAG, '광고 관리자 초기화');
            }
            this.initialized = true;
        }
    }

    /**
     * 보상형 광고 시청 요청
     * 실제 구현에서는 AdMob 또는 다른 SDK의 API 호출
     */
    public async showRewardedAd(category: string, period: AdWatchPeriod): Promise<AdResult> {
        // 메서드가 호출될 때 초기화
        this.initialize();
        Logger.info(TAG, `보상형 광고 요청: ${category}/${period}`);

        // 이미 광고 요청 중이면 중복 요청 방지
        if (this.adRequested) {
            Logger.warn(TAG, '이미 진행 중인 광고 요청이 있습니다', { category, period });
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
                if (__DEV__) {
                    Logger.debug(TAG, '테스트 모드에서 광고 요청 시뮬레이션', { category, period });
                }

                await new Promise((resolve) => setTimeout(resolve, 1000));
                const result: AdResult = { success: true };

                if (this.onAdCompleted) {
                    this.onAdCompleted(result);
                }

                // 광고 결과 로그
                Logger.info(TAG, '광고 요청 완료: 성공', { category, period });
                return result;
            }

            // 실제 AdMob SDK 호출 예시 (실제 코드는 다름)

            // Logger.debug(TAG, 'AdMob SDK 호출 시작', { category, adUnitId: this.getAdUnitIdForCategory(category, period) });
            // const reward = await AdMob.requestRewardedAd({
            //     adUnitId: this.getAdUnitIdForCategory(category, period),
            // });
            //
            // const result = { success: reward !== null };
            // Logger.info(TAG, `AdMob 광고 요청 완료: ${result.success ? '성공' : '실패'}`, { category, period });
            //
            // if (this.onAdCompleted) {
            //     this.onAdCompleted(result);
            //     Logger.debug(TAG, '광고 완료 콜백 실행됨', { result });
            // }
            //
            // return result;

            // 임시 구현 (테스트 모드가 아니면 실패)
            Logger.warn(TAG, 'SDK가 구현되지 않았습니다 - 광고 요청 실패', { category, period });

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
            Logger.error(TAG, `광고 요청 중 오류 발생: ${errorMessage}`, {
                category,
                period,
                error,
            });

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
        // 메서드가 호출될 때 초기화
        this.initialize();
        this.onAdRequested = callback;
    }

    /**
     * 광고 완료 이벤트 구독
     */
    public setOnAdCompleted(callback: (result: AdResult) => void): void {
        // 메서드가 호출될 때 초기화
        this.initialize();
        this.onAdCompleted = callback;
    }

    /**
     * 테스트 모드 설정
     */
    public setTestMode(enabled: boolean): void {
        // 메서드가 호출될 때 초기화
        this.initialize();
        this.testMode = enabled;
        Logger.info(TAG, `테스트 모드 ${enabled ? '활성화' : '비활성화'}`);
    }
}

// 싱글톤 인스턴스 생성 - 생성만 하고 초기화는 실제 사용 시점으로 지연
export const adManager = new AdManager();

export default adManager;
