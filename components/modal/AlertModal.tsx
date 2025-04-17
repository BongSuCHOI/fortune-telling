import { View, StyleSheet, Pressable } from 'react-native';

import { ModalContainer } from '@/components/modal/ModalContainer';
import { Typography } from '@/components/ui/Typography';
import { PrimaryColor, SubTextColor } from '@/constants/Colors';

import type { AlertModalData } from '@/types/modal';

interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
    data: AlertModalData;
}

export function AlertModal({ isVisible, onClose, data }: ModalProps) {
    const { title, contents } = data;

    return (
        <ModalContainer
            style={styles.modalContainer}
            isVisible={isVisible}
            onClose={onClose}
        >
            <View style={styles.modalText}>
                <Typography
                    size="md"
                    bold
                    text={title}
                    style={styles.titleText}
                />
                <Typography
                    size="base"
                    bold
                    text={contents}
                    style={{ color: SubTextColor }}
                />
            </View>
            <View style={styles.modalButtons}>
                <Pressable
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={onClose}
                >
                    <Typography
                        size="base"
                        bold
                        text="확인"
                        style={styles.confirmButtonText}
                    />
                </Pressable>
            </View>
        </ModalContainer>
    );
}

export default AlertModal;

// 스타일 정의
const styles = StyleSheet.create({
    modalContainer: {
        maxWidth: '75%',
        paddingHorizontal: 30,
        paddingVertical: 30,
    },
    modalText: {
        alignItems: 'center',
        gap: 3,
        marginBottom: 40,
    },
    titleText: {
        marginTop: 25,
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        gap: 15,
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        backgroundColor: PrimaryColor,
        width: '100%',
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: PrimaryColor,
    },
    confirmButtonText: {
        color: 'white',
    },
});
