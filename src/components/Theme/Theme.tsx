'use strict';

import * as React from 'react';
import {Appearance, useColorScheme} from 'react-native-appearance';
import {ColorValue} from 'react-native/Libraries/StyleSheet/StyleSheet';

export type FoodItTheme = {
    LabelColor: ColorValue,
    SecondaryLabelColor: ColorValue,
    TertiaryLabelColor: ColorValue,
    QuaternaryLabelColor: ColorValue,
    PlaceholderTextColor: ColorValue,
    SystemBackgroundColor: ColorValue,
    SecondarySystemBackgroundColor: ColorValue,
    TertiarySystemBackgroundColor: ColorValue,
    GroupedBackgroundColor: ColorValue,
    SecondaryGroupedBackgroundColor: ColorValue,
    TertiaryGroupedBackgroundColor: ColorValue,
    SystemFillColor: ColorValue,
    SecondarySystemFillColor: ColorValue,
    TertiarySystemFillColor: ColorValue,
    QuaternarySystemFillColor: ColorValue,
    SeparatorColor: ColorValue,
    OpaqueSeparatorColor: ColorValue,
    LinkColor: ColorValue,
    SystemPurpleColor: ColorValue,
    ToolbarColor: ColorValue,
};

export const LightTheme = {
    LabelColor: '#000000',
    SecondaryLabelColor: '#3c3c43',
    TertiaryLabelColor: '#3c3c43',
    QuaternaryLabelColor: '#3c3c43',
    PlaceholderTextColor: '#3c3c43',
    SystemBackgroundColor: '#ffffff',
    SecondarySystemBackgroundColor: '#ffffff',
    TertiarySystemBackgroundColor: '#ffffff',
    GroupedBackgroundColor: '#f2f2f7',
    SecondaryGroupedBackgroundColor: '#f2f2f7',
    TertiaryGroupedBackgroundColor: '#f2f2f7',
    SystemFillColor: '#787880',
    SecondarySystemFillColor: '#787880',
    TertiarySystemFillColor: '#767680',
    QuaternarySystemFillColor: '#747480',
    SeparatorColor: '#3c3c43',
    OpaqueSeparatorColor: '#c6c6c8',
    LinkColor: '#007aff',
    SystemPurpleColor: '#af52de',
    ToolbarColor: '#e9eaed',
};

export const DarkTheme = {
    LabelColor: '#ffffffff',
    SecondaryLabelColor: '#ebebf599',
    TertiaryLabelColor: '#ebebf54c',
    QuaternaryLabelColor: '#ebebf528',
    PlaceholderTextColor: '#ebebf54c',
    SystemBackgroundColor: '#000000ff',
    SecondarySystemBackgroundColor: '#1c1c1eff',
    TertiarySystemBackgroundColor: '#2c2c2eff',
    GroupedBackgroundColor: '#000000ff',
    SecondaryGroupedBackgroundColor: '#1c1c1eff',
    TertiaryGroupedBackgroundColor: '#2c2c2eff',
    SystemFillColor: '#7878805b',
    SecondarySystemFillColor: '#78788051',
    TertiarySystemFillColor: '#7676803d',
    QuaternarySystemFillColor: '#7676802d',
    SeparatorColor: '#54545899',
    OpaqueSeparatorColor: '#38383aff',
    LinkColor: '#0984ffff',
    SystemPurpleColor: '#bf5af2ff',
    ToolbarColor: '#3c3c43ff',
};

export const themes = {light: LightTheme, dark: DarkTheme};

export const ThemeContext: React.Context<FoodItTheme> = React.createContext(
    Appearance.getColorScheme() === 'dark' ? themes.dark : themes.light,
);