import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    SafeAreaView,
    ScrollView,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Navigation } from 'react-native-navigation';
import { useColorScheme } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';
import Cell from '../../components/cell/Cell';
import CellGroup from '../../components/cell/CellGroup';
import { RootState } from '../../store/rootReducer';
import { Toast } from 'react-native-ui-lib';
import { firebase } from '@react-native-firebase/auth';
import axios, { AxiosResponse } from 'axios';
import Config from 'react-native-config';


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
    sendLinkButton: {
        marginTop: 10,
        marginBottom: 30,
        marginHorizontal: 30,
        borderRadius: 10
    },
    sendLinkButtonText: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingHorizontal: 30,
        textAlign: 'center',
        fontSize: 20
    }

})

const Contacts: ContactsComponentType  = (props): JSX.Element => {

    const { componentId } = props;
    const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);
    const [checked, setChecked] = useState([-1]);
    const contacts = useSelector((state: RootState) => state.user.contacts);
    const showActionSheet = useSelector((state: RootState) => state.item.showActionSheet);
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
        // if cell already selected will return a number other than -1.
        const currentIndex = checked.indexOf(value);
        // use spread operator to clone the array object to avoid directly mutate the originial array.
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }
        setChecked(newChecked)
    }

    async function sendInvitationLink () {
        return firebase.auth().currentUser?.getIdToken()
            .then((token: string) => {
                return axios.get('https://us-central1-' + Config.GC_PROJECT_ID + '.cloudfunctions.net/sendTwillioMessages/messages', {
                    headers: { Authorization: 'Bearer ' + token }
                })
            })
            .then((response: AxiosResponse) => {
                if (response.data.success === true) {
                    Alert.alert('link sent!')
                } else {
                    Alert.alert('encountered error. Please try again.')
                }
            })
    }


    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.GroupedBackgroundColor}]}>
            <ScrollView>
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
            </ScrollView>
            <Toast
                //renderAttachment={this.renderAboveToast}
                visible={checked.length > 1 ? true: false}
                position={'bottom'}
                backgroundColor={theme.SystemBackgroundColor}
            >
                <View>
                    <TouchableOpacity 
                        onPress={() => sendInvitationLink()}
                        style={[styles.sendLinkButton, {backgroundColor: theme.SecondarySystemBackgroundColor}]}>
                        <Text style={[styles.sendLinkButtonText, {color: theme.Blue}]}>Send invitation link</Text>
                    </TouchableOpacity>
                </View>
            </Toast>
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