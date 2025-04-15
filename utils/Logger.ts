/**
 * Logger 유틸리티
 * 애플리케이션 전반에서 일관된 로깅을 제공하는 모듈
 */

import { Platform } from 'react-native';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
    level: LogLevel;
    tag: string;
    message: string;
    timestamp: string;
    data?: any;
}

// 로그 레벨 우선순위
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

// 로그 저장 설정
const LOG_HISTORY_SIZE = 100; // 메모리에 보관할 최근 로그 개수
const logHistory: LogEntry[] = [];

// 기본 로깅 구성
const defaultConfig = {
    // 개발 모드에서는 debug 이상, 프로덕션 모드에서는 info 이상 로그만 활성화
    minLevel: __DEV__ ? 'debug' : ('info' as LogLevel),
    // 콘솔 출력 활성화 여부
    consoleOutput: true,
    // 특정 태그에 대한 로그 레벨 오버라이드 (특정 모듈만 더 자세히/간략히 기록)
    tagOverrides: {} as Record<string, LogLevel>,
    // 원격 로깅 활성화 여부
    remoteLogging: false,
};

// 현재 로깅 구성
let config = { ...defaultConfig };

/**
 * 날짜 포맷팅 함수
 */
const formatDate = (date: Date): string => {
    return date.toISOString();
};

/**
 * 깊은 복사를 수행하는 함수 (structuredClone 대체)
 */
const deepCopy = (obj: any): any => {
    // null이나 undefined 또는 원시 값이면 그대로 반환
    if (obj === null || obj === undefined || typeof obj !== 'object') {
        return obj;
    }

    // Date 객체인 경우 새 Date 객체 생성
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }

    // 배열인 경우 요소를 깊은 복사하여 새 배열 생성
    if (Array.isArray(obj)) {
        return obj.map((item) => deepCopy(item));
    }

    // 순환 참조를 방지하는 방법은 여기서 구현하지 않음 (단순한 로깅 용도로는 불필요)

    // 일반 객체인 경우 모든 속성을 깊은 복사하여 새 객체 생성
    const copy: Record<string, any> = {};

    try {
        Object.keys(obj).forEach((key) => {
            copy[key] = deepCopy(obj[key]);
        });
    } catch (error) {
        // 복사 중 오류가 발생하면 원본 반환 (예: DOM 노드 등)
        return obj;
    }

    return copy;
};

/**
 * 로그 항목을 생성하는 함수
 */
const createLogEntry = (level: LogLevel, tag: string, message: string, data?: any): LogEntry => {
    return {
        level,
        tag,
        message,
        timestamp: formatDate(new Date()),
        data: data ? deepCopy(data) : undefined,
    };
};

/**
 * 로그 레벨 체크 함수
 * 현재 설정된 최소 로그 레벨 및 태그 오버라이드에 따라 로그 표시 여부 결정
 */
const shouldLog = (level: LogLevel, tag: string): boolean => {
    // 태그별 오버라이드가 있는 경우 해당 설정 적용
    const tagMinLevel = config.tagOverrides[tag];
    const effectiveMinLevel = tagMinLevel || config.minLevel;

    // 레벨 우선순위 비교
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[effectiveMinLevel];
};

/**
 * 로그 저장 함수 (히스토리에 보관)
 */
const storeLog = (entry: LogEntry) => {
    // 로그 히스토리 크기 제한
    if (logHistory.length >= LOG_HISTORY_SIZE) {
        logHistory.shift();
    }
    logHistory.push(entry);
};

/**
 * 콘솔에 로그 출력 함수
 */
const printToConsole = (entry: LogEntry) => {
    // 콘솔 출력이 비활성화되어 있으면 무시
    if (!config.consoleOutput) return;

    const { level, tag, message, data } = entry;
    const prefix = `[${tag}]`;

    switch (level) {
        case 'debug':
            console.debug(prefix, message, data || '');
            break;
        case 'info':
            console.info(prefix, message, data || '');
            break;
        case 'warn':
            console.warn(prefix, message, data || '');
            break;
        case 'error':
            console.error(prefix, message, data || '');
            break;
    }
};

/**
 * 로깅 메인 함수
 * 로그를 생성하고 콘솔에 출력하며 저장함
 */
const log = (level: LogLevel, tag: string, message: string, data?: any) => {
    // 현재 설정에 따라 로그 출력 여부 결정
    if (!shouldLog(level, tag)) return;

    const entry = createLogEntry(level, tag, message, data);

    // 콘솔에 출력
    printToConsole(entry);

    // 로그 히스토리에 저장
    storeLog(entry);

    // 원격 로깅이 활성화되어 있고 중요 로그인 경우 원격으로 전송
    if (config.remoteLogging && (level === 'error' || level === 'warn')) {
        sendToRemoteLogging(entry);
    }
};

/**
 * 외부 로깅 서비스로 전송하는 함수 (향후 구현)
 * Firebase Crashlytics, Sentry 등과 연동
 */
const sendToRemoteLogging = (entry: LogEntry) => {
    // 프로덕션 환경에서만 적용되도록 구현할 예정
    if (!__DEV__) {
        // 향후 구현
        // 예: Crashlytics.log(`${entry.tag}: ${entry.message}`);
        // 예: Sentry.captureMessage(`${entry.tag}: ${entry.message}`, { level: entry.level, extra: entry.data });
    }
};

/**
 * 공통 기능 외 플랫폼별 특화 기능 구현
 */
const platform = {
    ios: {
        // iOS 특화 로깅 함수 (향후 확장)
    },
    android: {
        // Android 특화 로깅 함수 (향후 확장)
    },
    common: {
        // 공통 기능
    },
}[Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'common'];

/**
 * 외부에 노출되는 로거 객체
 */
const Logger = {
    debug: (tag: string, message: string, data?: any) => log('debug', tag, message, data),
    info: (tag: string, message: string, data?: any) => log('info', tag, message, data),
    warn: (tag: string, message: string, data?: any) => log('warn', tag, message, data),
    error: (tag: string, message: string, data?: any) => log('error', tag, message, data),

    // 앱의 중요 이벤트 로깅 (분석 목적)
    event: (category: string, action: string, data?: any) => {
        log('info', 'EVENT', `${category}:${action}`, data);
        // 향후 분석 도구 연동 (Google Analytics, Firebase Analytics 등)
    },

    // 사용자 행동 추적 - (아직 등록 안했음 후에 추가)
    userAction: (action: string, data?: any) => {
        log('info', 'USER', action, data);
    },

    // API 호출 추적 - 프로덕션에서는 오류만 로깅 (아직 등록 안했음 후에 추가)
    api: {
        request: (endpoint: string, params?: any) => {
            // 개발 환경에서만 모든 API 요청 로깅
            if (__DEV__) {
                log('debug', 'API', `REQUEST ${endpoint}`, params);
            }
        },
        success: (endpoint: string, responseData?: any) => {
            // 개발 환경에서만 성공 응답 로깅
            if (__DEV__) {
                log('info', 'API', `SUCCESS ${endpoint}`, responseData);
            }
        },
        error: (endpoint: string, error: any) => {
            // 에러는 항상 로깅
            log('error', 'API', `ERROR ${endpoint}`, error);
        },
    },

    // 성능 측정 - (아직 등록 안했음 후에 추가)
    perf: {
        start: (label: string) => {
            const startTime = Date.now();
            return {
                end: () => {
                    const duration = Date.now() - startTime;
                    // 개발 환경에서는 디버그 레벨로, 프로덕션에서는 오래 걸린 작업만 info 레벨로 로깅
                    if (__DEV__) {
                        log('debug', 'PERF', `${label}: ${duration}ms`);
                    } else if (duration > 1000) {
                        // 1초 이상 걸린 작업만 프로덕션에서 로깅
                        log('info', 'PERF', `${label}: ${duration}ms`);
                    }
                    return duration;
                },
            };
        },
    },

    // 로그 설정 구성 변경
    configure: (newConfig: Partial<typeof config>) => {
        config = { ...config, ...newConfig };
        // 설정 변경 로그 (중요 설정 변경 이벤트)
        if (__DEV__) {
            log('info', 'LOGGER', '로깅 설정 변경됨', {
                minLevel: config.minLevel,
                consoleOutput: config.consoleOutput,
                remoteLogging: config.remoteLogging,
                tagOverrideCount: Object.keys(config.tagOverrides).length,
            });
        }
    },

    // 특정 태그의 로깅 레벨만 변경
    setTagLevel: (tag: string, level: LogLevel | null) => {
        if (level === null) {
            // null인 경우 해당 태그의 오버라이드 제거
            const { [tag]: _, ...rest } = config.tagOverrides;
            config.tagOverrides = rest;
        } else {
            config.tagOverrides = {
                ...config.tagOverrides,
                [tag]: level,
            };
        }
    },

    // 로그 내보내기 (문제 해결/지원 요청 시 유용)
    exportLogs: (): LogEntry[] => {
        return [...logHistory];
    },

    // 특정 태그의 로그만 필터링
    filterByTag: (tag: string): LogEntry[] => {
        return logHistory.filter((entry) => entry.tag === tag);
    },

    // 로그 초기화
    clearLogs: () => {
        logHistory.length = 0;
    },

    // 플랫폼별 특화 기능
    ...platform,
};

export default Logger;
