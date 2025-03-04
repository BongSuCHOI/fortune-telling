import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

import type { StyleProp, ViewStyle } from 'react-native';

interface DonutChartProps {
    percentage: number;
    color: string;
    size?: number; // 차트 크기 조정 가능
    strokeWidth?: number;
    style?: StyleProp<ViewStyle>;
}

export function DonutChart({
    percentage,
    color,
    style,
    size = 120, // 차트 크기 설정
    strokeWidth = 12, // 선 두께
}: DonutChartProps) {
    const radius = (size - strokeWidth) / 2; // 반지름 계산
    const circumference = 2 * Math.PI * radius;
    const progress = (percentage / 100) * circumference;

    return (
        <View style={[{ alignItems: 'center', margin: 10 }, style]}>
            <Svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
            >
                {/* 배경 원 */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E0E0E0"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* 진행률 원 */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${size / 2},${size / 2}`}
                />
                {/* 중앙 숫자 */}
                <SvgText
                    x={size / 2 - 1}
                    y={size / 2 + 16}
                    textAnchor="middle"
                    fontSize={size * 0.3}
                    fontWeight="bold"
                    fill={color}
                >
                    {percentage}
                </SvgText>
            </Svg>
        </View>
    );
}
