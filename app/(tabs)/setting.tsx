import { View, StyleSheet } from 'react-native';

export default function SettingScreen() {
    return <View style={styles.titleContainer}>{/* Future components will go here */}</View>;
}

const styles = StyleSheet.create({
    titleContainer: {
        alignItems: 'flex-start',
    },
    todayFortuneContainer: {
        marginTop: 30,
    },
    fortuneBannerContainer: {},
});
