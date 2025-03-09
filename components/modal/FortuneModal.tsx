import { View, StyleSheet, Pressable, ScrollView } from 'react-native';

import { ModalContainer } from '@/components/modal/ModalContainer';
import { Typography, KeepAllTypography } from '@/components/ui/Typography';
import { DonutChart } from '@/components/ui/DonutChart';
import { PrimaryColor, SubTextColor } from '@/constants/Colors';

import type { FortuneData } from '@/types/fortune';

interface FortuneModalProps {
    isVisible: boolean;
    onClose: () => void;
    text?: string;
    pointText: string;
    data: FortuneData;
}

export function FortuneModal({ isVisible, onClose, text = '', pointText, data }: FortuneModalProps) {
    const { title, explanation, score } = data;

    return (
        <ModalContainer
            style={styles.fortuneModalContainer}
            isVisible={isVisible}
            onClose={onClose}
        >
            <View style={styles.modalTitle}>
                <Typography
                    size="xl"
                    bold
                    text={text}
                />
                <Typography
                    size="xl"
                    bold
                    text={pointText}
                    style={styles.pointTitleText}
                />
            </View>
            <View style={styles.fortuneContents}>
                <Typography
                    size="lg"
                    bold
                    style={{ marginBottom: 20 }}
                    text={title}
                />
                <DonutChart
                    percentage={score}
                    strokeWidth={9}
                    color={PrimaryColor}
                    style={{ marginBottom: 30 }}
                />
                <ScrollView>
                    <KeepAllTypography
                        size="base"
                        style={{ lineHeight: 25, color: SubTextColor }}
                        text={explanation}
                    />
                </ScrollView>
            </View>
            <View style={styles.modalButtons}>
                <Pressable
                    style={styles.modalButton}
                    onPress={onClose}
                >
                    <Typography
                        size="base"
                        bold
                        text="확인"
                        style={styles.modalButtonText}
                    />
                </Pressable>
            </View>
        </ModalContainer>
    );
}

export default FortuneModal;

// 스타일 정의
const styles = StyleSheet.create({
    fortuneModalContainer: {
        maxWidth: '90%',
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    modalTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    pointTitleText: {
        color: PrimaryColor,
    },
    fortuneContents: {
        alignItems: 'center',
        backgroundColor: '#F6F4FC',
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderRadius: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginTop: 30,
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        backgroundColor: PrimaryColor,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
    },
});
