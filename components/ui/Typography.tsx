import { View, Text, type TextProps, StyleSheet } from 'react-native';

export type TypographyProps = TextProps & {
    text?: string;
    size?: 'base' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
    bold?: boolean;
    description?: boolean;
    underline?: boolean;
};

export function Typography({ text = '', style, size = 'base', bold = false, description = false, underline = false, ...rest }: TypographyProps) {
    return (
        <Text
            style={[
                size === 'base' ? styles.base : undefined,
                size === 'xs' ? styles.xs : undefined,
                size === 'sm' ? styles.sm : undefined,
                size === 'md' ? styles.md : undefined,
                size === 'lg' ? styles.lg : undefined,
                size === 'xl' ? styles.xl : undefined,
                size === 'xxl' ? styles.xxl : undefined,
                size === 'xxxl' ? styles.xxxl : undefined,
                bold ? { fontWeight: 500 } : undefined,
                description ? { color: '#888' } : undefined,
                underline ? { textDecorationLine: 'underline' } : undefined,
                style,
            ]}
            {...rest}
        >
            {text}
        </Text>
    );
}

export function KeepAllTypography({ text = '', style, size = 'base', bold = false, description = false, underline = false, ...rest }: TypographyProps) {
    return (
        <View style={[{ flexDirection: 'row', flexWrap: 'wrap' }]}>
            {text?.split(' ').map((word, index) => (
                <Text
                    key={`${word}-${index}`}
                    style={[
                        size === 'base' ? styles.base : undefined,
                        size === 'xs' ? styles.xs : undefined,
                        size === 'sm' ? styles.sm : undefined,
                        size === 'md' ? styles.md : undefined,
                        size === 'lg' ? styles.lg : undefined,
                        size === 'xl' ? styles.xl : undefined,
                        size === 'xxl' ? styles.xxl : undefined,
                        size === 'xxxl' ? styles.xxxl : undefined,
                        bold ? { fontWeight: 500 } : undefined,
                        description ? { color: '#888' } : undefined,
                        underline ? { textDecorationLine: 'underline' } : undefined,
                        style,
                    ]}
                    {...rest}
                >
                    {word}{' '}
                </Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        fontSize: 16,
        lineHeight: 20.8,
    },
    xs: {
        fontSize: 12,
        lineHeight: 15.6,
    },
    sm: {
        fontSize: 14,
        lineHeight: 18.2,
    },
    md: {
        fontSize: 18,
        lineHeight: 23.4,
    },
    lg: {
        fontSize: 20,
        lineHeight: 26,
    },
    xl: {
        fontSize: 24,
        lineHeight: 31.2,
    },
    xxl: {
        fontSize: 28,
        lineHeight: 36.4,
    },
    xxxl: {
        fontSize: 32,
        lineHeight: 41.6,
    },
});
