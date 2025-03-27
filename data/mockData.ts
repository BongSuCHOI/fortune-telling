import type { DailyTotalFortuneData, DailyOtherFortuneData, SpecialFortuneData } from '@/types/fortune';

export const MOCK_DAILY_TOTAL_FORTUNE_DATA: DailyTotalFortuneData = {
    total: {
        title: '양호무구(良好無懼)',
        score: 75,
        summary: '순조로운 흐름 속에서도 신중함 필요',
        explanation:
            '오늘은 전반적으로 무난하고 안정적인 하루가 될 것입니다. 주변 환경이 비교적 평온하게 유지되며 큰 장애물 없이 하루를 보낼 가능성이 높습니다. 다만 지나친 자신감은 경계해야 합니다. 예상치 못한 작은 변수가 있을 수 있으므로 결정하기 전에 신중함을 유지하는 것이 중요합니다. 직관이 날카로워지는 날이므로 중요한 선택을 해야 한다면 내면의 목소리에 귀를 기울여보는 것도 좋은 방법이 될 것입니다. 지나친 걱정보다는 긍정적인 마인드를 유지하면 좋은 기운을 더욱 끌어당길 수 있습니다.',
    },
};

export const MOCK_DAILY_OTHER_FORTUNE_DATA: DailyOtherFortuneData = {
    dailyLoveFortune: {
        title: '애정충만(愛情充滿)',
        score: 85,
        explanation: '오늘은 연애운이 상승하는 날입니다. 싱글이라면 새로운 인연이 다가올 가능성이 크고, 연인과의 관계도 더욱 깊어질 수 있습니다. 다만 지나친 감정 표현은 오히려 부담을 줄 수 있으니 균형을 유지하세요.',
    },
    dailyMoneyFortune: {
        title: '재물변동(財物變動)',
        score: 60,
        explanation: '재정 상태에 변동이 있을 수 있습니다. 수입이 늘어날 가능성도 있지만, 예상치 못한 지출이 발생할 수도 있습니다. 계획적인 소비가 중요한 날이므로 충동적인 지출을 삼가고 예산을 점검하세요.',
    },
    dailyBusinessFortune: {
        title: '기회포착(機會捕捉)',
        score: 75,
        explanation: '사업 및 직장운이 상승하는 날입니다. 새로운 기회가 찾아올 가능성이 높고, 기존 업무에서도 성과를 거둘 수 있습니다. 다만 경쟁이 치열할 수 있으니 신중한 판단이 필요합니다.',
    },
    dailyStudyFortune: {
        title: '집중필요(集中必要)',
        score: 55,
        explanation: '공부운이 다소 하락하는 날입니다. 집중력이 흐트러질 수 있으니 계획을 잘 세우고 실천하는 것이 중요합니다. 외부의 유혹을 경계하고 목표를 분명히 하면 좋은 결과를 얻을 수 있습니다.',
    },
    dailyHealthFortune: {
        title: '균형유지(均衡維持)',
        score: 70,
        explanation: '건강 상태는 비교적 양호하지만 지나친 무리는 피하는 것이 좋습니다. 규칙적인 생활 습관을 유지하고 가벼운 운동을 병행하면 더욱 활력 있는 하루를 보낼 수 있습니다.',
    },
};

export const MOCK_YEAR_FORTUNE_DATA: SpecialFortuneData = {
    specialYearFortune: {
        title: '기회존재(機會存在)',
        score: 72,
        summary: '변화 속 기회를 잡아야 할 시기',
        explanation:
            '올해는 불안정한 요소가 많지만, 그 안에서 기회를 발견할 수 있는 한 해입니다. 오(午)의 기운이 강해지고, 게자리의 감성적 직관이 빛을 발하는 시기입니다. 예상치 못한 변화나 도전이 있을 수 있지만, 이를 잘 활용하면 오히려 성장의 발판이 됩니다. 호랑이띠의 대담한 성격을 살려 도전에 나선다면 좋은 결과를 기대할 수 있습니다. 그러나 조급함은 금물이며, 감정을 지나치게 앞세우면 판단력이 흐려질 수 있으니 신중함을 유지해야 합니다. 재물운은 비교적 안정적이지만, 지출이 늘어날 가능성이 있으니 계획적인 소비가 중요합니다. 인간관계에서는 새로운 인연이 들어오는 시기지만, 신뢰를 쌓는 데 시간이 필요합니다. 건강운은 기복이 있을 수 있으니 꾸준한 자기관리가 필수입니다.',
    },
};

export const MOCK_MONTH_FORTUNE_DATA: SpecialFortuneData = {
    specialMonthFortune: {
        title: '진퇴양난(進退兩難)',
        score: 64,
        summary: '결정을 내리기 어려운 시기',
        explanation:
            '이번 달은 중요한 선택의 기로에 설 가능성이 큽니다. 오(午)의 기운이 활발하여 도전하고 싶은 마음이 강하지만, 게자리의 신중한 성향이 망설이게 만들 수 있습니다. 직장과 사업에서는 새로운 기회가 보이지만, 확신이 서지 않는다면 무리한 결정을 피하는 것이 좋습니다. 재물운은 비교적 안정적이지만, 충동적인 소비는 주의해야 합니다. 대인관계에서는 오해나 갈등이 발생할 가능성이 있어 신중한 대화가 필요합니다. 건강운은 다소 기복이 있으며, 특히 피로 누적으로 인한 면역력 저하에 주의해야 합니다. 조급한 행동보다는 차분한 마음가짐이 중요한 시기입니다.',
    },
};

export const MOCK_WEEK_FORTUNE_DATA: SpecialFortuneData = {
    specialWeekFortune: {
        title: '우유부단(優柔不斷)',
        score: 62,
        summary: '결정을 내리기 어려운 한 주',
        explanation:
            '이번 주는 선택과 결정의 순간이 많아질 가능성이 큽니다. 오(午)의 활발한 에너지가 도전하고 싶은 마음을 자극하지만, 게자리의 신중한 성향이 쉽게 결정을 내리지 못하게 만들 수 있습니다. 직장이나 학업에서는 중요한 제안이 있을 수 있으나, 신중한 검토가 필요합니다. 재물운은 무난한 흐름이지만, 계획하지 않은 지출이 생길 가능성이 있어 주의해야 합니다. 인간관계에서는 감정적인 갈등이 발생할 수 있으므로 말과 행동을 조심하는 것이 중요합니다. 건강운은 스트레스와 피로 누적으로 인해 컨디션이 저하될 가능성이 있으니 충분한 휴식을 취하는 것이 필요합니다.',
    },
};
