import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

import { useUserInfo } from '@/hooks/useUserInfo';

import { Typography, KeepAllTypography } from '@/components/ui/Typography';
import { ParallaxScrollView } from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { PrimaryColor, SubTextColor } from '@/constants/Colors';

import type { UserInfo } from '@/types/storage';

export default function UserInfoRegistrationScreen() {
    // 사용자 정보 관리 훅
    const { setUserInfo } = useUserInfo();

    // 사용자 정보 상태
    const [name, setName] = useState<string>('');
    const [hanjaName, setHanjaName] = useState<string>(''); // 한자이름 상태 추가
    const [birthDate, setBirthDate] = useState(new Date());
    const [birthTime, setBirthTime] = useState(new Date());
    const [solarLunar, setSolarLunar] = useState<'solar' | 'lunar'>('solar');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [isTimeUnknown, setIsTimeUnknown] = useState(false); // 생시 모름 상태 추가
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    // 날짜 선택기 표시 상태
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // 띠와 별자리는 생일에 따라 자동 계산
    const getZodiacAnimal = (date: Date) => {
        const year = date.getFullYear();
        const animals = ['원숭이', '닭', '개', '돼지', '쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양'];
        return animals[year % 12];
    };

    const getZodiacSign = (date: Date) => {
        const month = date.getMonth() + 1;
        const day = date.getDate();

        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '물병자리';
        if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return '물고기자리';
        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '양자리';
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '황소자리';
        if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '쌍둥이자리';
        if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '게자리';
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '사자자리';
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '처녀자리';
        if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return '천칭자리';
        if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return '전갈자리';
        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return '궁수자리';
        return '염소자리';
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setBirthDate(selectedDate);
        }
    };

    const handleTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setBirthTime(selectedTime);
        }
    };

    const formatDate = (date: Date) => {
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    const formatTime = (date: Date) => {
        return `${date.getHours()}시 ${date.getMinutes()}분`;
    };

    const getDeviceId = async () => {
        if (Platform.OS === 'android') {
            return Application.getAndroidId();
        } else if (Platform.OS === 'ios') {
            return await Application.getIosIdForVendorAsync();
        } else {
            return null;
        }
    };

    // 입력값 유효성 검증
    const validateForm = (): boolean => {
        const errors: string[] = [];

        if (!name.trim()) {
            errors.push('이름을 입력해주세요.');
        }

        if (!solarLunar) {
            errors.push('양력/음력을 선택해주세요.');
        }

        if (!gender) {
            errors.push('성별을 선택해주세요.');
        }

        setValidationErrors(errors);
        return errors.length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert('입력 오류', validationErrors.join('\n'));
            return;
        }

        // 사용자 ID 생성
        const deviceId = await getDeviceId();
        if (!deviceId) {
            Alert.alert('오류', '기기 ID를 가져오는 데 실패했습니다.');
            return;
        }

        // YYYY-MM-DD 형식으로 생년월일 포맷팅
        const formattedBirthDate = `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`;

        // 생시 포맷팅 (HH:MM 형식 또는 'unknown')
        let formattedBirthTime: string | 'unknown' = 'unknown';
        if (!isTimeUnknown) {
            formattedBirthTime = `${String(birthTime.getHours()).padStart(2, '0')}:${String(birthTime.getMinutes()).padStart(2, '0')}`;
        }

        // UserInfo 객체 생성
        const userInfo: UserInfo = {
            id: deviceId,
            name,
            hanjaName: hanjaName.trim() || undefined, // 한자이름이 있는 경우에만 포함
            birthDate: formattedBirthDate,
            birthTime: formattedBirthTime,
            calendarType: solarLunar,
            gender: gender, // 기본값 설정 (validation에서 이미 체크했으므로 실제로는 null이 아님)
            zodiacAnimal: getZodiacAnimal(birthDate),
            zodiacSign: getZodiacSign(birthDate),
        };

        // 저장소에 사용자 정보 저장
        setUserInfo(userInfo);

        // 다음 화면으로 이동
        router.replace('/(tabs)');
    };

    // 생시 모름 토글 함수
    const toggleTimeUnknown = () => {
        setIsTimeUnknown(!isTimeUnknown);
    };

    return (
        <ParallaxScrollView
            containerStyle={styles.container}
            contentsStyle={styles.contentContainer}
        >
            <View style={styles.headerContainer}>
                <View style={styles.title}>
                    <KeepAllTypography
                        size="xxl"
                        bold
                        text="포춘텔링의 AI 기반 운세와 사주를 경험하기 위해서 초기 사용자님의 간단한 정보가 필요해요!"
                        style={styles.titleText}
                    />
                </View>
                <View style={styles.subtitle}>
                    <KeepAllTypography
                        size="sm"
                        text="개인정보는 별도의 서버에 저장되지 않으며, 오직 사용자님의 기기에 저장되어 운세를 제공하는 데에만 사용됩니다."
                        style={styles.subtitleText}
                    />
                </View>
            </View>

            {/* 이름 입력 */}
            <View style={styles.inputGroup}>
                <Typography
                    size="md"
                    bold
                    text="이름"
                    style={styles.label}
                />
                <TextInput
                    style={[styles.input, !name.trim() && validationErrors.length > 0 && styles.inputError]}
                    value={name}
                    onChangeText={setName}
                    placeholder="이름을 입력해주세요!"
                    placeholderTextColor="#999"
                />
            </View>

            {/* 한자이름 입력 (선택) */}
            <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                    <Typography
                        size="md"
                        bold
                        text="한자이름"
                        style={styles.label}
                    />
                    <Typography
                        size="sm"
                        text="(선택사항)"
                        style={styles.optionalText}
                    />
                </View>
                <TextInput
                    style={styles.input}
                    value={hanjaName}
                    onChangeText={setHanjaName}
                    placeholder="한자 이름을 입력해주세요"
                    placeholderTextColor="#999"
                />
            </View>

            {/* 생년월일 입력 */}
            <View style={styles.inputGroup}>
                <Typography
                    size="md"
                    bold
                    text="생년월일"
                    style={styles.label}
                />
                <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Typography
                        size="base"
                        text={formatDate(birthDate)}
                    />
                    <IconSymbol
                        name="calendar"
                        size={20}
                        color="#666"
                    />
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={birthDate}
                        mode="date"
                        display="spinner"
                        onChange={handleDateChange}
                    />
                )}
            </View>

            {/* 생시(태어난 시간) 입력 */}
            <View style={styles.inputGroup}>
                <Typography
                    size="md"
                    bold
                    text="생시(태어난 시간)"
                    style={styles.label}
                />
                <View style={styles.timeInputContainer}>
                    {!isTimeUnknown ? (
                        <TouchableOpacity
                            style={[styles.dateInput, styles.timeInput]}
                            onPress={() => setShowTimePicker(true)}
                            disabled={isTimeUnknown}
                        >
                            <Typography
                                size="base"
                                text={formatTime(birthTime)}
                            />
                            <IconSymbol
                                name="clock.fill"
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>
                    ) : (
                        <View style={[styles.dateInput, styles.timeInput, styles.unknownTime]}>
                            <Typography
                                size="base"
                                text="모름"
                                style={styles.unknownTimeText}
                            />
                        </View>
                    )}
                    <TouchableOpacity
                        style={styles.unknownButton}
                        onPress={toggleTimeUnknown}
                    >
                        <View style={[styles.radioCircle, isTimeUnknown && styles.radioCircleActive]} />
                        <Typography
                            size="base"
                            text="모름"
                        />
                    </TouchableOpacity>
                </View>
                {showTimePicker && !isTimeUnknown && (
                    <DateTimePicker
                        value={birthTime}
                        mode="time"
                        display="spinner"
                        onChange={handleTimeChange}
                    />
                )}
            </View>

            {/* 양력/음력 선택 */}
            <View style={styles.inputGroup}>
                <Typography
                    size="md"
                    bold
                    text="양력/음력"
                    style={styles.label}
                />
                <View style={[styles.radioGroup, !solarLunar && validationErrors.length > 0 && styles.radioGroupError]}>
                    <TouchableOpacity
                        style={[styles.radioButton, solarLunar === 'solar' && styles.radioButtonActive]}
                        onPress={() => setSolarLunar('solar')}
                    >
                        <View style={[styles.radioCircle, solarLunar === 'solar' && styles.radioCircleActive]} />
                        <Typography
                            size="base"
                            text="양력"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.radioButton, solarLunar === 'lunar' && styles.radioButtonActive]}
                        onPress={() => setSolarLunar('lunar')}
                    >
                        <View style={[styles.radioCircle, solarLunar === 'lunar' && styles.radioCircleActive]} />
                        <Typography
                            size="base"
                            text="음력"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* 성별 선택 */}
            <View style={styles.inputGroup}>
                <Typography
                    size="md"
                    bold
                    text="성별"
                    style={styles.label}
                />
                <View style={[styles.radioGroup, !gender && validationErrors.length > 0 && styles.radioGroupError]}>
                    <TouchableOpacity
                        style={[styles.radioButton, gender === 'male' && styles.radioButtonActive]}
                        onPress={() => setGender('male')}
                    >
                        <View style={[styles.radioCircle, gender === 'male' && styles.radioCircleActive]} />
                        <Typography
                            size="base"
                            text="남성"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.radioButton, gender === 'female' && styles.radioButtonActive]}
                        onPress={() => setGender('female')}
                    >
                        <View style={[styles.radioCircle, gender === 'female' && styles.radioCircleActive]} />
                        <Typography
                            size="base"
                            text="여성"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* 띠 표시 (자동 계산) */}
            <View style={styles.inputGroup}>
                <Typography
                    size="md"
                    bold
                    text="띠"
                    style={styles.label}
                />
                <View style={styles.infoDisplay}>
                    <Typography
                        size="base"
                        text={getZodiacAnimal(birthDate)}
                    />
                </View>
            </View>

            {/* 별자리 표시 (자동 계산) */}
            <View style={styles.inputGroup}>
                <Typography
                    size="md"
                    bold
                    text="별자리"
                    style={styles.label}
                />
                <View style={styles.infoDisplay}>
                    <Typography
                        size="base"
                        text={getZodiacSign(birthDate)}
                    />
                </View>
            </View>

            {/* 제출 버튼 */}
            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
            >
                <Typography
                    size="md"
                    bold
                    text="등록하고 운세 확인하기"
                    style={styles.submitButtonText}
                />
            </TouchableOpacity>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        padding: 24,
        paddingBottom: 40,
    },
    headerContainer: {
        paddingTop: 60,
        paddingBottom: 30,
    },
    title: {
        marginBottom: 0,
    },
    titleText: {
        color: PrimaryColor,
    },
    subtitle: {
        marginTop: 30,
    },
    subtitleText: {
        color: SubTextColor,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1C4E9',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    inputError: {
        borderColor: PrimaryColor,
    },
    dateInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D1C4E9',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    timeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    timeInput: {
        flex: 1,
        marginRight: 10,
    },
    unknownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        gap: 8,
    },
    unknownButtonActive: {
        backgroundColor: '#EDE7F6',
    },
    unknownTime: {
        backgroundColor: '#F6F4FC',
    },
    unknownTimeText: {
        color: SubTextColor,
    },
    radioGroup: {
        flexDirection: 'row',
        gap: 20,
    },
    radioGroupError: {
        borderColor: PrimaryColor,
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    radioButtonActive: {
        // 활성화 스타일 (필요시 추가)
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D1C4E9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioCircleActive: {
        backgroundColor: '#F6F4FC',
        borderWidth: 5,
        borderColor: PrimaryColor,
    },
    infoDisplay: {
        borderWidth: 1,
        borderColor: '#D1C4E9',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F6F4FC',
    },
    submitButton: {
        backgroundColor: PrimaryColor,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    submitButtonText: {
        color: 'white',
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    optionalText: {
        color: SubTextColor,
    },
});
