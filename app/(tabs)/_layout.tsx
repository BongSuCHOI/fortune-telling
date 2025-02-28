import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { ActiveTintColor, InactiveTintColor } from '@/constants/Colors';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: ActiveTintColor,
                tabBarInactiveTintColor: InactiveTintColor,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                animation: 'shift',
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {
                        height: 70,
                        borderTopWidth: 1,
                        elevation: 0,
                        shadowOpacity: 0,
                        shadowColor: 'transparent',
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        backgroundColor: '#fff',
                    },
                }),
                tabBarItemStyle: {
                    paddingTop: 6,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginTop: 2,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: '운세',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="sparkles"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="saju"
                options={{
                    title: '사주',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="star.circle.fill"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="setting"
                options={{
                    title: '설정',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="gearshape.fill"
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
