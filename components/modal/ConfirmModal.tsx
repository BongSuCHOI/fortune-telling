import { View, StyleSheet, Pressable } from 'react-native';

import { ModalContainer } from '@/components/modal/ModalContainer';
import { Typography } from '@/components/ui/Typography';
import { PrimaryColor, SubTextColor } from '@/constants/Colors';

import type { ConfirmModalData } from '@/types/modal';

interface FortuneModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    data: ConfirmModalData;
}

export function ConfirmModal({ isVisible, onClose, onConfirm, data }: FortuneModalProps) {
    const { title, contents, confirmButtonText } = data;

    return (
        <ModalContainer
            style={styles.confirmModalContainer}
            isVisible={isVisible}
            onClose={onClose}
        >
            <View style={styles.confirmModalText}>
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
                    style={[styles.modalButton, { backgroundColor: '#DCCEF7' }]}
                    onPress={onClose}
                >
                    <Typography
                        size="base"
                        bold
                        text="닫기"
                        style={styles.modalButtonText}
                    />
                </Pressable>
                <Pressable
                    style={styles.modalButton}
                    onPress={onConfirm}
                >
                    <Typography
                        size="base"
                        bold
                        text={confirmButtonText}
                        style={styles.modalButtonText}
                    />
                </Pressable>
            </View>
        </ModalContainer>
    );
}

export default ConfirmModal;

// 스타일 정의
const styles = StyleSheet.create({
    confirmModalContainer: {
        maxWidth: '75%',
        paddingHorizontal: 30,
        paddingVertical: 30,
    },
    confirmModalText: {
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
    modalButtonText: {
        color: 'white',
    },
});
