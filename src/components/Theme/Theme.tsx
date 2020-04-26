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
    SystemBackgroundColor: '#f2f2f7',
    SecondarySystemBackgroundColor: '#ffffff',
    TertiarySystemBackgroundColor: '#ffffff',
    GroupedBackgroundColor: '#f2f2f7',
    SecondaryGroupedBackgroundColor: '#ffffff',
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
    LabelColor: '#ffffff',
    SecondaryLabelColor: '#ebebf5',
    TertiaryLabelColor: '#ebebf5',
    QuaternaryLabelColor: '#ebebf5',
    PlaceholderTextColor: '#ebebf5',
    SystemBackgroundColor: '#000000',
    SecondarySystemBackgroundColor: '#1c1c1e',
    TertiarySystemBackgroundColor: '#2c2c2e',
    GroupedBackgroundColor: '#000000',
    SecondaryGroupedBackgroundColor: '#1c1c1e',
    TertiaryGroupedBackgroundColor: '#2c2c2e',
    SystemFillColor: '#787880',
    SecondarySystemFillColor: '#787880',
    TertiarySystemFillColor: '#767680',
    QuaternarySystemFillColor: '#767680',
    SeparatorColor: '#545458',
    OpaqueSeparatorColor: '#38383a',
    LinkColor: '#0984ff',
    SystemPurpleColor: '#bf5af2',
    ToolbarColor: '#3c3c43',
};

export const themes = {light: LightTheme, dark: DarkTheme};
// let theme;
// const subscription = Appearance.addChangeListener(({colorScheme}) => {
//     theme = colorScheme;
// })

export const ThemeContext: React.Context<FoodItTheme> = React.createContext(
    Appearance.getColorScheme() === 'dark' ? themes.dark : themes.light,
);