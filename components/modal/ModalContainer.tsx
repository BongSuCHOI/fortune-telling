import { View, StyleSheet, Modal } from 'react-native';

import type { StyleProp, ViewStyle } from 'react-native';

interface ModalContainerProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode | React.ReactNode[];
    style?: StyleProp<ViewStyle>;
}

export function ModalContainer({ isVisible, onClose, style, children }: ModalContainerProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContents, style]}>{children}</View>
            </View>
        </Modal>
    );
}

export default ModalContainer;

// 스타일 정의
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContents: {
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});
