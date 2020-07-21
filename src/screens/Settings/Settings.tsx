import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView, StyleSheet, Linking, Alert } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Cell from '../../components/cell/Cell';
import CellGroup from '../../components/cell/CellGroup';
import CellIcon from '../../components/cell/CellIcon';
import { useColorScheme, ColorSchemeName } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';
import { ACCOUNT, ABOUT } from '../../screens';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { setName, setEmail } from '../../store/user/actions';
import { RootState } from '../../store/rootReducer';

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

export  const openURL = async (url: string) => {
        // Checking if the link is supported for links with custom URL scheme.
        const supported = await Linking.canOpenURL(url)

        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert("Can't open this link. Pleas try again.")
        }

}

const Settings: SettingsComponentType = ({
    componentId,
}): JSX.Element => {

    // const theme = useSelector(state => state.itemReducer.theme);
    const [isChecked, setChecked] = useState<boolean>(false);
    const onCheckedChange = (isChecked: boolean): void => {
        setChecked(isChecked);
    }
    const colorScheme: ColorSchemeName = useColorScheme();
    const theme = themes[colorScheme];
    const dispatch = useDispatch()
    const { name } = useSelector((state: RootState) => state.user.present);

    const onProfilePressed = (name: string) => {

        Navigation.push(componentId, {
            component: {
                name: name
            }
        })
    }

    const onAboutPressed = () => {
        Navigation.push(componentId, {
            component: {
                name: ABOUT
            }
        })
    }

    // use mergeOptions to dynamically set bottomTabs color
    useEffect(() => {
        Navigation.mergeOptions(componentId, {
            bottomTabs: {
            backgroundColor: theme.SecondarySystemBackgroundColor
        }
        });
    })

    useEffect(() => {
        firestore()
        .collection('users')
        .doc(firebase.auth().currentUser?.uid)
        .get()
        .then((doc) => {
            dispatch(setName(doc.data().user_name))
            dispatch(setEmail(doc.data().user_email))
        }) 
    }, [])

    return (
        <SafeAreaView style={[styles.container, 
                            { backgroundColor: theme.GroupedBackgroundColor }]}>
            <CellGroup footer={true} theme={theme}>
                <Cell
                    left={<CellIcon
                    source={require('../../assets/icons/32/user.png')}
                    size={55}
                    backgroundColor={theme.Grey}
                    userProfile={true}
                    />}
                    title={name ? name : 'User Name'}
                    subtitle="Profile, Membership"
                    onPress={() => onProfilePressed(ACCOUNT)}
                    userProfile={true}
                    more={true}
                />
            </CellGroup>
            {/* <CellGroup header={true} footer={true}  theme={theme}>
                <Cell
                    left={<CellIcon
                    source={require('../../assets/icons/32/settings.png')}
                    size={26}
                    backgroundColor={theme.Green}
                    />}
                    title="General"
                    onPress={'this.onGeneralPress'}
                    more={true}
                />
            </CellGroup> */}
            <CellGroup header={true} theme={theme}>
                <Cell
                    title="About"
                    left={<CellIcon
                    backgroundColor={theme.Blue}
                    source={require('../../assets/icons/32/help-filled.png')}
                    size={22}
                    />}
                    more={true}
                    onPress={onAboutPressed}
                />
                {/* <Cell
                    title="Rate this app"
                    left={<CellIcon
                    source={require('../../assets/icons/32/star.png')}
                    backgroundColor={theme.Yellow}
                    size={22}
                    />}
                    onPress={'this.onDonatePress'}
                    more={true}
                /> */}
                <Cell
                    title="Privacy Policy"
                    left={<CellIcon
                    source={require('../../assets/icons/32/privacy-filled.png')}
                    backgroundColor={theme.Green}
                    size={22}
                    />}
                    onPress={() => openURL('https://www.iubenda.com/privacy-policy/79904545')}
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