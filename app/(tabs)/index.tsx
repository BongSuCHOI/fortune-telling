import ParallaxScrollView from '@/components/ParallaxScrollView';
import { MainFortuneSection } from '@/components/fortune/MainFortuneSection';
import { DailyFortuneSection } from '@/components/fortune/DailyFortuneSection';
import { SpecialFortuneSection } from '@/components/fortune/SpecialFortuneSection';

export default function FortuneScreen() {
    return (
        <ParallaxScrollView>
            {/* 메인 운세 섹션 */}
            <MainFortuneSection />

            {/* 오늘의 다른 운세 섹션 */}
            <DailyFortuneSection />

            {/* 특별 운세 섹션 */}
            <SpecialFortuneSection />
        </ParallaxScrollView>
    );
}
