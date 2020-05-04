import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Cell from '../../components/cell/Cell';
import CellGroup from '../../components/cell/CellGroup';
import CellIcon from '../../components/cell/CellIcon';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useColorScheme } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';
import { ACCOUNT } from '../../screens';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    settingLayout: {
        flex: 1
    },
    navigationTitle: {
        fontSize: 20,
    },
    more: {
        opacity: 0.65
    }
})

const settings = [
    {
        mediaUrl: require('../../assets/icons/32/paint-palette-filled.png'),
        title: 'Theme'
    },
    {
        mediaUrl: require('../../assets/icons/32/heart.png'),
        title: 'Rate'
    },

]

const userIcon = <FontAwesome5 name={'user-circle'}/>

const Settings: SettingsComponentType = ({
    componentId,
}): JSX.Element => {

    // const theme = useSelector(state => state.itemReducer.theme);
    const [isChecked, setChecked] = useState<boolean>(false);
    const onCheckedChange = (isChecked: boolean): void => {
        setChecked(isChecked);
    }
    const colorScheme = useColorScheme();
    const theme = themes[colorScheme];

    const onItemPressed = (name: string) => {

        Navigation.push(componentId, {
            component: {
                name: name
            }
        })
    }

    return (
        <SafeAreaView style={[styles.container, 
                            { backgroundColor: theme.GroupedBackgroundColor }]}>
            <CellGroup footer={true} theme={theme}>
                <Cell
                    left={<CellIcon
                    source={require('../../assets/icons/32/user.png')}
                    size={55}
                    backgroundColor="#8e8e93"
                    userProfile={true}
                    />}
                    title="Phat Nguyen"
                    subtitle="Profile, Membership"
                    onPress={() => onItemPressed(ACCOUNT)}
                    userProfile={true}
                    more={true}
                />
            </CellGroup>
            <CellGroup header={true} footer={true}  theme={theme}>
                <Cell
                    left={<CellIcon
                    source={require('../../assets/icons/32/settings.png')}
                    size={26}
                    backgroundColor="#8e8e93"
                    />}
                    title="General"
                    onPress={'this.onGeneralPress'}
                    more={true}
                />
                <Cell
                    left={<CellIcon
                    backgroundColor="#157dfa"
                    source={require('../../assets/icons/32/font-size-filled.png')}
                    size={19}
                    />}
                    title="Appearance"
                    onPress={'this.onAppearancePress'}
                    more={true}
                />
                <Cell
                    left={<CellIcon
                    backgroundColor="#34c759"
                    source={require('../../assets/icons/32/paint-palette-filled.png')}
                    size={19}
                    />}
                    title="Theme"
                    onPress={'this.onThemePress'}
                    more={true}
                />
            </CellGroup>
            <CellGroup header={true} theme={theme}>
                <Cell
                    title="About"
                    left={<CellIcon
                    backgroundColor="#157dfa"
                    source={require('../../assets/icons/32/help-filled.png')}
                    size={20}
                    />}
                    more={true}
                    onPress={'this.onAboutPress'}
                />
                <Cell
                    title="Rate this app"
                    left={<CellIcon
                    source={require('../../assets/icons/32/star.png')}
                    backgroundColor="#ffcc00"
                    size={22}
                    />}
                    onPress={'this.onDonatePress'}
                    more={true}
                />
                <Cell
                    title="Refer a friend"
                    left={<CellIcon
                    source={require('../../assets/icons/32/heart.png')}
                    backgroundColor="#fc3259"
                    size={22}
                    />}
                    onPress={'this.onRatePress'}
                    more={true}
                />
            </CellGroup>
        </SafeAreaView>
    )
}

Settings.options = () => ({
    topBar: {
        visible: true,
        title: {
            text: 'Settings'
        },
        largeTitle: {
            visible: true
        },
        backButton: {
            title: 'Settings'
        }
    }
})

export default Settings;