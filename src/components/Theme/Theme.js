'use strict';

import * as React from 'react';
import {Appearance} from 'react-native-appearance';
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
    ...
};

export const LightTheme = {
    LabelColor: '#000000ff',
    SecondaryLabelColor: '#3c3c4399',
    TertiaryLabelColor: '#3c3c434c',
    QuaternaryLabelColor: '#3c3c432d',
    PlaceholderTextColor: '#3c3c434c',
    SystemBackgroundColor: '#ffffffff',
    SecondarySystemBackgroundColor: '#f2f2f7ff',
    TertiarySystemBackgroundColor: '#ffffffff',
    GroupedBackgroundColor: '#f2f2f7ff',
    SecondaryGroupedBackgroundColor: '#ffffffff',
    TertiaryGroupedBackgroundColor: '#f2f2f7ff',
    SystemFillColor: '#78788033',
    SecondarySystemFillColor: '#78788028',
    TertiarySystemFillColor: '#7676801e',
    QuaternarySystemFillColor: '#74748014',
    SeparatorColor: '#3c3c4349',
    OpaqueSeparatorColor: '#c6c6c8ff',
    LinkColor: '#007affff',
    SystemPurpleColor: '#af52deff',
    ToolbarColor: '#e9eaedff',
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