import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    SafeAreaView,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
    Platform,
    StyleSheet,
    NativeModules,
    Text
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Navigation } from 'react-native-navigation';
import { useColorScheme } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';
import Cell from '../../components/cell/Cell';
import CellGroup from '../../components/cell/CellGroup';
import CellIcon from '../../components/cell/CellIcon';
import { CONTACTS } from '../../screens';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topNavigation: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    layout: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
        padding: 20,
        marginBottom: -40
    },
    inputLayout: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        alignItems: 'center'
    },
    input: {
        // marginLeft: 20,
        marginTop: 10,
        marginBottom: 30,
    },
    opaqueText: {
        fontFamily: 'System',
        fontWeight: '400',
        fontSize: 17,
        letterSpacing: -0.37,
        opacity: 0.5,
    },

})

const shareItem: ShareItemComponentType  = (props): JSX.Element => {

    const { componentId } = props;
    const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);
    const colorScheme = useColorScheme();
    const theme = themes[colorScheme];

    useEffect(() => {
        Dimensions.addEventListener('change', () => {
            getStatusBarHeight();
        });

        getStatusBarHeight();

        // equivalent to componentWillUnmount
        // return () => {};
    }, [componentId]);

    useEffect(() => {
        Navigation.mergeOptions(componentId, {
            topBar: {
                rightButtons: [
                    {
                        id: 'cancel_share_item_button',
                        systemItem: 'stop'

                    }
                ],
                rightButtonColor: theme.SecondaryLabelColor
            }
        })
    })

    const getStatusBarHeight = async () => {
        const navConstants = await Navigation.constants();

        // for more info - https://stackoverflow.com/a/48759750
        if (Platform.OS === 'ios') {
            setKeyboardVerticalOffset(navConstants.statusBarHeight + navConstants.topBarHeight);
        }
    };

    const openContacts = () => {
        Navigation.push(componentId, {
                component: {
                    name: CONTACTS,
                    id: 'contacts'
                }
            })
        }


    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.GroupedBackgroundColor}]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <CellGroup footer={true} theme={theme}>
                        <Cell
                            left={<CellIcon
                                source={require('../../assets/icons/32/heart.png')}
                                size={22}
                                backgroundColor={theme.Pink}
                            />}
                            title="Share the items with your family."
                            subtitle="They need to download the app and register an account to view the list items."
                            numberOfLines={3}
                        />
                    </CellGroup>
                    <CellGroup footer={true} theme={theme}>
                        <Cell
                            left={<CellIcon
                                source={require('../../assets/icons/telegram-app-50.png')}
                                size={22}
                                
                            />}
                            title="Send invitation"
                            onPress={() => openContacts()}
                        />
                    </CellGroup>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

shareItem.options = () => ({
    topBar: {
        title: {
            text: 'Share Items'
        },
        searchBar: true,
        searchBarHiddenWhenScrolling: false,
        searchBarPlaceholder: 'phone number'
    }
})

export default shareItem;