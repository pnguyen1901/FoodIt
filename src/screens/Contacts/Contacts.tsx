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
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Navigation } from 'react-native-navigation';
import { useColorScheme } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';
import Cell from '../../components/cell/Cell';
import CellGroup from '../../components/cell/CellGroup';
import CellIcon from '../../components/cell/CellIcon';
import { RootState } from '../../store/rootReducer';

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

const Contacts: ContactsComponentType  = (props): JSX.Element => {

    const { componentId } = props;
    const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);
    const [checked, setChecked] = useState([-1]);
    const contacts = useSelector((state: RootState) => state.user.contacts);
    const dispatch = useDispatch();
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
                        id: 'cancel_contacts_button',
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

    const handleToggle = (value: number) => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value)
            console.log(newChecked)
        } else {
            newChecked.splice(currentIndex, 1)
            console.log(newChecked)
        }

        setChecked(newChecked)
    }


    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.GroupedBackgroundColor}]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <CellGroup footer={true} theme={theme}>
                        {
                            contacts.map((contact: any, index: number) => (
                                <Cell
                                    key={index}
                                    title={contact.givenName + ' ' + contact.familyName}
                                    onPress={() => handleToggle(index)}
                                    primarySystemBackgroundColor={true}
                                    radioButton={true}
                                    selected={checked.indexOf(index) !== -1}
                                    size={22}
                                />                                
                            ))
                        }

                    </CellGroup>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

Contacts.options = () => ({
    topBar: {
        title: {
            text: 'Contacts'
        },
        searchBar: true,
        searchBarHiddenWhenScrolling: false,
        searchBarPlaceholder: ''
    },
    bottomTabs: {
        visible: false
    }
})

export default Contacts;