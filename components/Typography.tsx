import { Text, type TextProps, StyleSheet } from 'react-native';

export type TypographyProps = TextProps & {
    size?: 'base' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
    bold?: boolean;
    description?: boolean;
};

export function Typography({ style, size = 'base', bold = false, description = false, ...rest }: TypographyProps) {
    return (
        <Text
            style={[
                size === 'base' ? styles.base : undefined,
                size === 'sm' ? styles.sm : undefined,
                size === 'md' ? styles.md : undefined,
                size === 'lg' ? styles.lg : undefined,
                size === 'xl' ? styles.xl : undefined,
                size === 'xxl' ? styles.xxl : undefined,
                size === 'xxxl' ? styles.xxxl : undefined,
                bold ? { fontWeight: 500 } : undefined,
                description ? { color: '#999' } : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    base: {
        fontSize: 16,
        lineHeight: 20.8,
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
