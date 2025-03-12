// 저장소 카테고리 타입 정의
export type StorageCategory = 'UserInfo' | 'AdWatched';

// 사용자 정보 타입 정의
export interface UserInfo {
    id: string; // 사용자 ID (UUID)
    name: string; // 사용자 이름
    hanjaName?: string; // 한자 이름 (선택적)
    birthDate: string; // YYYY-MM-DD 형식 (생년월일)
    birthTime: string | 'unknown'; // HH:MM 형식/모름 (생시)
    calendarType: 'solar' | 'lunar'; // 양력/음력/모름
    gender: 'male' | 'female'; // 성별
    zodiacAnimal: string; // 띠
    zodiacSign: string; // 별자리
}

// 광고 시청 상태 타입 정의
export interface AdWatchedState {
    [key: string]: boolean;
}

// 카테고리별 데이터 타입 매핑
export interface StorageDataMap {
    UserInfo: UserInfo;
    AdWatched: AdWatchedState;
}
