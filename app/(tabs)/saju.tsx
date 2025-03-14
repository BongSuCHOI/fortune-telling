import { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { useModalManager } from '@/hooks/useModalManager';
import { useUserInfo } from '@/hooks/useUserInfo';
import { usePurchaseHistory } from '@/hooks/usePurchaseHistory';
import { useAdWatchStatus } from '@/hooks/useAdWatchStatus'; // 추가: 광고 시청 상태 관리 훅

import { ParallaxScrollView } from '@/components/ParallaxScrollView';
import { Typography } from '@/components/ui/Typography';
import { SajuSkeletonUI } from '@/components/ui/SkeletonLoader';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ModalContainer } from '@/components/modal/ModalContainer';
import { ConfirmModal } from '@/components/modal/ConfirmModal'; // 추가: 광고 확인 모달
import { FortuneModal } from '@/components/modal/FortuneModal'; // 추가: 운세 결과 모달
import { PrimaryColor, SubTextColor } from '@/constants/Colors';

import type { SajuItem } from '@/types/saju';
import type { FortuneData } from '@/types/fortune'; // 추가: 운세 데이터 타입
import type { ConfirmModalData } from '@/types/modal'; // 추가: 확인 모달 데이터 타입

// 사주 광고 관련 상수
const AD_MODAL_KEY = 'sajuAd';
const PREVIEW_MODAL_KEY = 'sajuPreview';
const SAJU_PREVIEW_AD_KEY = 'sajuAd_';

// 광고 확인 모달 데이터
const CONFIRM_MODAL_DATA: ConfirmModalData = {
    title: '광고를 시청하시겠습니까?',
    contents: '광고를 시청하시면 무료로 간단한 사주 요약을 확인할 수 있습니다!',
    confirmButtonText: '시청하기',
};

// 사주별 무료 요약 정보 (광고 시청 후 보여줄 데이터)
const SAJU_PREVIEW_DATA: Record<string, FortuneData> = {
    traditional: {
        title: '정통사주 간단 미리보기',
        explanation: '당신의 사주에는 특별한 성격과 재능의 기운이 보입니다. 재능을 발휘하면 큰 성취를 이룰 수 있으나, 좀 더 깊은 분석이 필요합니다. 상세한 사주 분석을 통해 자신의 운명을 완전히 이해하실 수 있습니다.',
        score: 75,
    },
    compatibility: {
        title: '궁합사주 간단 미리보기',
        explanation: '두 분의 궁합에는 흥미로운 상호작용이 보입니다. 서로를 보완하는 부분도 있고 도전이 필요한 부분도 있습니다. 상세 분석을 통해 더 행복한 관계를 위한 인사이트를 얻으실 수 있습니다.',
        score: 70,
    },
    career: {
        title: '직업사주 간단 미리보기',
        explanation: '당신은 특정 분야에서 뛰어난 재능을 가진 것으로 보입니다. 직업과 관련된 운의 흐름이 보이며, 적합한 직업 방향이 암시됩니다. 상세 분석을 통해 정확한 직업 방향과 시기를 알아보세요.',
        score: 80,
    },
    yearly: {
        title: '연간사주 간단 미리보기',
        explanation: '올해는 당신에게 중요한 변화의 시기가 될 것으로 보입니다. 특히 특정 월에 기회와 도전이 함께 찾아올 수 있습니다. 월별 상세 분석을 통해 올해를 더 현명하게 준비하세요.',
        score: 65,
    },
};

// 사주 서비스 아이템 데이터
const SAJU_SERVICE_DATA: SajuItem[] = [
    {
        code: 'traditional',
        name: '정통사주',
        description: '사주팔자를 통한 정확한 운세 분석',
        modalDescription: [
            '사주팔자는 태어난 년, 월, 일, 시를 기준으로 천간과 지지를 조합하여 사람의 운명을 풀이하는 동양철학의 핵심입니다.',
            '정통사주는 당신의 사주를 통해 타고난 성격, 재능, 운명의 흐름을 분석하여 현재와 미래의 길흉화복을 정확히 예측합니다.',
            'AI 기반 정밀 분석으로 운명의 비밀을 밝혀보세요.',
            '*해당 사주는 영구 구매 상품입니다.*',
        ],
        price: 12900,
        icon: 'sparkles',
        iconColor: '#5D3FD3',
        purchaseType: 'permanent', // 영구 구매 상품
    },
    {
        code: 'compatibility',
        name: '궁합사주',
        description: '연인과의 운명적 궁합을 분석',
        modalDescription: [
            '궁합사주는 두 사람의 사주를 바탕으로 관계의 강점과 약점을 분석합니다.',
            '진정한 사랑과 파트너십을 이해하고 싶다면 궁합사주를 확인해보세요.',
            'AI 기반의 심층 분석으로 서로의 운명적 궁합을 확인하고 더 행복한 관계를 위한 지혜를 얻으세요.',
            '*해당 사주는 매 궁합마다 구매해야하는 상품입니다.*',
        ],
        price: 8900,
        icon: 'heart.fill',
        iconColor: '#F8C8D8',
        purchaseType: 'single-use', // 일회성 구매 상품
    },
    {
        code: 'career',
        name: '직업사주',
        description: '최적의 직업 방향과 시기 분석',
        modalDescription: [
            '직업사주는 당신의 타고난 재능과 적성에 맞는 직업군을 분석하고, 직업 운의 흐름을 풀이합니다.',
            '현재 직업의 발전 가능성, 이직 시기, 재물운과 성공 가능성까지 종합적으로 분석하여 최적의 커리어 방향을 제시합니다.',
            '당신의 천직을 발견하고 성공적인 직업 생활을 위한 인사이트를 얻으세요.',
            '*년도가 변경되면 구매 기록이 초기화됩니다.*',
        ],
        price: 10900,
        icon: 'briefcase.fill',
        iconColor: '#B5D8B4',
        purchaseType: 'annual', // 연간 갱신 상품
    },
    {
        code: 'yearly',
        name: '연간사주',
        description: '올해의 운세와 흐름을 분석',
        modalDescription: [
            '연간사주는 올해의 운세를 월별로 상세히 분석하여 한 해 동안의 기회와 도전을 미리 파악할 수 있게 해줍니다.',
            '건강, 재물, 사랑, 커리어 등 다양한 영역에서의 운세 흐름을 파악하고, 중요한 시기와 주의해야 할 시기를 알려드립니다.',
            '한 해를 현명하게 계획하고 행운의 기회를 최대한 활용하세요.',
            '*년도가 변경되면 구매 기록이 초기화됩니다.*',
        ],
        price: 11900,
        icon: 'calendar',
        iconColor: '#A8CCEB',
        purchaseType: 'annual', // 연간 갱신 상품
    },
];

export default function SajuScreen() {
    // 사용자 정보 관리 훅
    const { userInfo, loading, redirectIfUserInfoMissing } = useUserInfo();

    // 구매 내역 관리 훅
    const { isPurchased, markAsPurchased, resetAnnualPurchases, removePurchaseHistory } = usePurchaseHistory();

    // 모달 상태 관리
    const { modalVisibility, openModal, closeModal } = useModalManager();

    // 광고 시청 상태 관리 훅
    const adCategories = SAJU_SERVICE_DATA.map((service) => `${SAJU_PREVIEW_AD_KEY}${service.code}`);
    const { adWatched, markAdWatched, resetAdWatchedStatus } = useAdWatchStatus<(typeof adCategories)[number]>(adCategories);

    // 선택된 사주 서비스
    const [selectedService, setSelectedService] = useState<SajuItem | null>(null);

    // 선택된 미리보기 서비스 (광고 시청용)
    const [selectedPreview, setSelectedPreview] = useState<{ code: string; name: string } | null>(null);

    // 애플리케이션 시작 시 연간 구매 상태 확인
    useEffect(() => {
        // 앱 시작 시 연간 구매를 확인하고 필요시 초기화
        resetAnnualPurchases();
    }, [resetAnnualPurchases]);

    // 서비스 선택 처리 함수
    const handleServicePress = (service: SajuItem) => {
        setSelectedService(service);
        openModal('sajuDetail');
    };

    // 결제 처리 함수 (실제 구현은 결제 모듈 연동 필요)
    const handlePayment = () => {
        closeModal('sajuDetail');

        if (selectedService) {
            // 구매 완료 처리
            markAsPurchased(selectedService.code, selectedService.purchaseType);
        }

        // 결제 성공 모달 표시
        openModal('paymentSuccess');

        // 실제로는 결제 처리 후 API 호출하여 결과 받아오기
        // ...
    };

    // 결제 성공 모달 닫기
    const handlePaymentSuccessClose = () => {
        closeModal('paymentSuccess');
        setSelectedService(null);
    };

    // 광고 시청 처리 함수
    const handleWatchAd = (service: SajuItem) => {
        setSelectedPreview({
            code: service.code,
            name: service.name,
        });
        openModal(AD_MODAL_KEY);
    };

    // 광고 확인 모달에서 광고 시청 동의
    const onConfirmAd = async () => {
        closeModal(AD_MODAL_KEY);

        try {
            // 구글 보상형 AdMob 로직 호출 (예: 광고 로드 및 표시)
            // 실제 구현 시 AdMob SDK와 연동하는 showRewardedAd 함수 호출
            // const reward = await showRewardedAd();
            const reward = true; // 테스트를 위한 더미 값

            if (reward && selectedPreview) {
                const adKey = `${SAJU_PREVIEW_AD_KEY}${selectedPreview.code}` as (typeof adCategories)[number];
                markAdWatched(adKey);
                openModal(PREVIEW_MODAL_KEY);
            }
        } catch (error) {
            console.error('광고 시청 실패', error);
        }
    };

    // 광고 모달 닫기 (취소) 및 상태 초기화
    const onCloseAdModal = () => {
        closeModal(AD_MODAL_KEY);
        setSelectedPreview(null);
    };

    // 미리보기 모달 닫기 및 상태 초기화
    const onClosePreviewModal = () => {
        closeModal(PREVIEW_MODAL_KEY);
        setSelectedPreview(null);
    };

    // 특정 서비스의 광고 시청 여부 확인
    const isAdWatched = (serviceCode: string): boolean => {
        const adKey = `${SAJU_PREVIEW_AD_KEY}${serviceCode}`;
        return adWatched[adKey] || false;
    };

    // 사용자 정보가 없을 경우 리다이렉트
    if (!loading && !userInfo) {
        redirectIfUserInfoMissing();
    }

    // 로딩 중일 때 스켈레톤 UI 표시
    if (loading || !userInfo) {
        return <SajuSkeletonUI />;
    }

    return (
        <ParallaxScrollView>
            {/* 사주 페이지 헤더 */}
            <View style={styles.headerContainer}>
                <Typography
                    size="xl"
                    style={styles.headerTitle}
                    bold
                    text={`${userInfo.name}님`}
                />
                <Typography
                    size="lg"
                    style={styles.headerSubtitle}
                    text="사주 전문 AI로 당신만의"
                />
                <Typography
                    size="lg"
                    style={styles.headerSubtitle}
                    text="특별한 사주를 만나보세요!"
                />
            </View>

            {/* 사주 서비스 목록 */}
            <View style={styles.servicesContainer}>
                {SAJU_SERVICE_DATA.map((service) => {
                    const purchased = isPurchased(service.code);
                    const adViewed = isAdWatched(service.code);

                    return (
                        <Pressable
                            key={service.code}
                            style={[styles.serviceCard, purchased && styles.purchasedServiceCard]}
                            onPress={() => handleServicePress(service)}
                        >
                            <View style={[styles.serviceIconContainer, purchased && styles.purchasedIconContainer]}>
                                <IconSymbol
                                    size={32}
                                    name={service.icon}
                                    color={service.iconColor}
                                />
                                {purchased && (
                                    <View style={styles.purchasedBadgeContainer}>
                                        <IconSymbol
                                            size={16}
                                            name="checkmark.circle.fill"
                                            color="white"
                                        />
                                    </View>
                                )}
                            </View>
                            <View style={styles.serviceContent}>
                                <View style={styles.serviceTextContainer}>
                                    <Typography
                                        size="md"
                                        bold
                                        text={service.name}
                                        style={styles.serviceName}
                                    />
                                    <Typography
                                        size="sm"
                                        text={service.description}
                                        style={styles.serviceDescription}
                                    />

                                    {/* 무료로 보기 버튼 - 구매하지 않았고 이미 광고를 보지 않은 경우에만 표시 */}
                                    {!purchased && !adViewed && (
                                        <Pressable
                                            style={styles.freePreviewButton}
                                            onPress={() => handleWatchAd(service)}
                                        >
                                            <IconSymbol
                                                size={12}
                                                name="play.circle"
                                                color="#3A9E75"
                                                style={{ marginRight: 3 }}
                                            />
                                            <Typography
                                                size="xs"
                                                text="무료 체험"
                                                style={styles.freePreviewText}
                                            />
                                        </Pressable>
                                    )}

                                    {/* 이미 광고를 본 경우, "미리보기 보기" 버튼 표시 */}
                                    {!purchased && adViewed && (
                                        <Pressable
                                            style={[styles.freePreviewButton, styles.previewViewButton]}
                                            onPress={() => {
                                                setSelectedPreview({
                                                    code: service.code,
                                                    name: service.name,
                                                });
                                                openModal(PREVIEW_MODAL_KEY);
                                            }}
                                        >
                                            <IconSymbol
                                                size={12}
                                                name="eye.fill"
                                                color="#5D3FD3"
                                                style={{ marginRight: 4 }}
                                            />
                                            <Typography
                                                size="xs"
                                                text="무료 체험"
                                                style={styles.previewViewText}
                                            />
                                        </Pressable>
                                    )}
                                </View>
                                <View style={[styles.priceContainer, purchased && styles.purchasedPriceContainer]}>
                                    {purchased ? (
                                        <Typography
                                            size="sm"
                                            bold
                                            text="구매완료"
                                            style={styles.purchasedText}
                                        />
                                    ) : (
                                        <Typography
                                            size="sm"
                                            bold
                                            text={`${service.price.toLocaleString()}원`}
                                            style={styles.priceText}
                                        />
                                    )}
                                </View>
                            </View>
                        </Pressable>
                    );
                })}
            </View>

            {/* 사주 서비스 상세 모달 */}
            {selectedService && (
                <ModalContainer
                    style={styles.detailModalContainer}
                    isVisible={modalVisibility['sajuDetail'] || false}
                    onClose={() => closeModal('sajuDetail')}
                >
                    <View style={styles.modalHeader}>
                        <IconSymbol
                            size={40}
                            name={selectedService.icon}
                            color={PrimaryColor}
                            style={styles.modalIcon}
                        />
                        <Typography
                            size="xl"
                            bold
                            text={selectedService.name}
                            style={styles.modalTitle}
                        />
                    </View>

                    <View style={styles.modalContent}>
                        {selectedService.modalDescription.map((desc, index) => (
                            <Typography
                                key={index}
                                size="base"
                                text={desc}
                                style={styles.modalDescription}
                            />
                        ))}

                        <View style={styles.priceDetailContainer}>
                            <Typography
                                size="base"
                                text="가격:"
                                bold
                                style={styles.priceLabel}
                            />
                            <Typography
                                size="lg"
                                bold
                                text={isPurchased(selectedService.code) ? '구매완료' : `${selectedService.price.toLocaleString()}원`}
                                style={styles.modalPriceText}
                            />
                        </View>
                    </View>

                    <View style={styles.modalButtonContainer}>
                        <Pressable
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={() => closeModal('sajuDetail')}
                        >
                            <Typography
                                size="base"
                                bold
                                text="닫기"
                                style={styles.buttonText}
                            />
                        </Pressable>
                        {!isPurchased(selectedService.code) ? (
                            <Pressable
                                style={[styles.modalButton, styles.payButton]}
                                onPress={handlePayment}
                            >
                                <Typography
                                    size="base"
                                    bold
                                    text="결제하기"
                                    style={styles.payButtonText}
                                />
                            </Pressable>
                        ) : (
                            <Pressable
                                style={[styles.modalButton, styles.viewButton]}
                                onPress={() => {
                                    closeModal('sajuDetail');
                                    // TODO: 결과 보기 기능 구현
                                }}
                            >
                                <Typography
                                    size="base"
                                    bold
                                    text="결과 보기"
                                    style={styles.viewButtonText}
                                />
                            </Pressable>
                        )}
                    </View>
                </ModalContainer>
            )}

            {/* 광고 확인 모달 */}
            <ConfirmModal
                isVisible={modalVisibility[AD_MODAL_KEY] || false}
                onClose={onCloseAdModal}
                onConfirm={onConfirmAd}
                data={CONFIRM_MODAL_DATA}
            />

            {/* 사주 미리보기 모달 */}
            {selectedPreview && (
                <FortuneModal
                    isVisible={modalVisibility[PREVIEW_MODAL_KEY] || false}
                    onClose={onClosePreviewModal}
                    text={selectedPreview.name}
                    pointText=" 무료 미리보기"
                    data={SAJU_PREVIEW_DATA[selectedPreview.code]}
                />
            )}

            {/* 결제 성공 모달 */}
            {selectedService && (
                <ModalContainer
                    style={styles.successModalContainer}
                    isVisible={modalVisibility['paymentSuccess'] || false}
                    onClose={handlePaymentSuccessClose}
                >
                    <View style={styles.successIconContainer}>
                        <IconSymbol
                            size={60}
                            name="checkmark.circle.fill"
                            color={PrimaryColor}
                        />
                    </View>

                    <Typography
                        size="lg"
                        bold
                        text="결제 완료!"
                        style={styles.successTitle}
                    />

                    <Typography
                        size="base"
                        text={`${selectedService.name} 분석이 곧 준비됩니다.`}
                        style={styles.successMessage}
                    />

                    <Pressable
                        style={styles.successButton}
                        onPress={handlePaymentSuccessClose}
                    >
                        <Typography
                            size="base"
                            bold
                            text="확인"
                            style={styles.successButtonText}
                        />
                    </Pressable>
                </ModalContainer>
            )}
        </ParallaxScrollView>
    );
}

// 스타일 정의
const styles = StyleSheet.create({
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F4FC',
        paddingTop: 90,
        paddingBottom: 40,
    },
    headerTitle: {
        color: PrimaryColor,
        marginBottom: 10,
    },
    headerSubtitle: {
        color: SubTextColor,
    },
    servicesContainer: {
        padding: 25,
        gap: 15,
    },
    serviceCard: {
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        borderColor: '#D1C4E9',
        borderWidth: 1,
        marginBottom: 15,
    },
    purchasedServiceCard: {
        borderColor: PrimaryColor,
        borderWidth: 2,
        backgroundColor: 'rgba(93, 63, 211, 0.05)',
    },
    serviceIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(209, 196, 233, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        position: 'relative',
    },
    purchasedIconContainer: {
        backgroundColor: 'rgba(93, 63, 211, 0.15)',
    },
    purchasedBadgeContainer: {
        position: 'absolute',
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: PrimaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        top: -5,
        right: -5,
    },
    serviceContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    serviceTextContainer: {
        flex: 1,
    },
    serviceName: {
        marginBottom: 4,
    },
    serviceDescription: {
        color: SubTextColor,
    },
    priceContainer: {
        backgroundColor: 'rgba(93, 63, 211, 0.1)',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 15,
    },
    purchasedPriceContainer: {
        backgroundColor: PrimaryColor,
    },
    priceText: {
        color: PrimaryColor,
    },
    purchasedText: {
        color: 'white',
    },
    detailModalContainer: {
        width: '90%',
        padding: 20,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    modalIcon: {
        marginBottom: 10,
    },
    modalTitle: {
        color: PrimaryColor,
    },
    modalContent: {
        backgroundColor: '#F6F4FC',
        padding: 20,
        borderRadius: 10,
        marginBottom: 24,
    },
    modalDescription: {
        color: SubTextColor,
        lineHeight: 22,
        marginBottom: 15,
    },
    priceDetailContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10,
    },
    priceLabel: {
        color: SubTextColor,
        marginRight: 10,
    },
    modalPriceText: {
        color: PrimaryColor,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: PrimaryColor,
    },
    payButton: {
        backgroundColor: PrimaryColor,
    },
    viewButton: {
        backgroundColor: '#3A9E75',
    },
    buttonText: {
        color: PrimaryColor,
    },
    payButtonText: {
        color: 'white',
    },
    viewButtonText: {
        color: 'white',
    },
    successModalContainer: {
        width: '80%',
        padding: 30,
        alignItems: 'center',
    },
    successIconContainer: {
        marginBottom: 20,
    },
    successTitle: {
        marginBottom: 10,
    },
    successMessage: {
        textAlign: 'center',
        color: SubTextColor,
        marginBottom: 30,
    },
    successButton: {
        backgroundColor: PrimaryColor,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    successButtonText: {
        color: 'white',
    },
    freePreviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        backgroundColor: 'rgba(58, 158, 117, 0.1)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    freePreviewText: {
        color: '#3A9E75',
    },
    previewViewButton: {
        backgroundColor: 'rgba(93, 63, 211, 0.1)',
    },
    previewViewText: {
        color: '#5D3FD3',
    },
});
