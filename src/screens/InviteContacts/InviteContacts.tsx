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
import Contacts from 'react-native-contacts';
import { getContacts } from '../../store/user/actions';
import { useNavigationSearchBarUpdate, useNavigationSearchBarCancelPress } from 'react-native-navigation-hooks';


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

const InviteContacts: InviteContactsComponentType  = (props): JSX.Element => {

    const { componentId } = props;
    const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);
    const [checked, setChecked] = useState([]);
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

    const loadContacts = () => {
        Contacts.getAll((err, contacts) => {
            if (err === "denied") {
                Alert.alert('Permission to access contacts was denied')
            } else {
                dispatch(getContacts(contacts))
            }
        })
    }

    const handleSearch = (text:string) => {
        const phoneNumberRegex = /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
        const emailAddressRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        if (text === "" || text === null) {
            loadContacts()
        } else if (phoneNumberRegex.test(text)) {
            Contacts.getContactsByPhoneNumber(text, (err, contacts) => {
                dispatch(getContacts(contacts))
            })
        } else if (emailAddressRegex.test(text)) {
            Contacts.getContactsByEmailAddress(text, (err, contacts) => {
                dispatch(getContacts(contacts))
            })
        } else {
            Contacts.getContactsMatchingString(text, (err, contacts) => {
                dispatch(getContacts(contacts))
            })
        }
    }

    useNavigationSearchBarUpdate((e) => {
        handleSearch(e.text)
    })

    async function sendInvitationLink (checked: Array<number>) {
        return firebase.auth().currentUser?.getIdToken()
            .then((token: string) => {
                const data: Array<string> = []
                checked.forEach((item: number) => {
                    contacts[item].phoneNumbers.forEach((number: {label: string, number: string}) => {
                        data.push(number['number'])
                    })
                })
                const headers = {
                    withCredentials: true,
                    headers: { Authorization: 'Bearer ' + token }
                }
                console.log(data)
                return axios.post('https://us-central1-' + Config.GC_PROJECT_ID + '.cloudfunctions.net/sendTwillioMessages/messages', {recipients: data}, headers)
            })
            .then((response: AxiosResponse) => {
                if (response.data.success === true) {
                    Alert.alert('link sent!')
                    setChecked([])
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
                        onPress={() => sendInvitationLink(checked)}
                        style={[styles.sendLinkButton, {backgroundColor: theme.SecondarySystemBackgroundColor}]}>
                        <Text style={[styles.sendLinkButtonText, {color: theme.Blue}]}>Send invitation link</Text>
                    </TouchableOpacity>
                </View>
            </Toast>
        </SafeAreaView>
    )
}

InviteContacts.options = () => ({
    topBar: {
        title: {
            text: 'Send Invite'
        },
        searchBar: true,
        searchBarHiddenWhenScrolling: false,
        searchBarPlaceholder: 'phone number, email address, name'
    },
    bottomTabs: {
        visible: false
    }
})

export default InviteContacts;