import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    SafeAreaView,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import { Navigation } from 'react-native-navigation';
import { useColorScheme } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';
import Cell from '../../components/cell/Cell';
import CellGroup from '../../components/cell/CellGroup';
import CellIcon from '../../components/cell/CellIcon';
import { INVITECONTACTS } from '../../screens';
import { useNavigationButtonPress, useNavigationSearchBarUpdate } from 'react-native-navigation-hooks';
import { FadeInView } from '../../components/Theme/Theme';

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
        //justifyContent: 'space-between',
        flexDirection: 'column',
    },
    opaqueText: {
        fontFamily: 'System',
        fontWeight: '400',
        fontSize: 20,
        letterSpacing: -0.37,
        padding: 20
    },
    searchResults: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

})



const shareItem: ShareItemComponentType  = (props): JSX.Element => {

    const { componentId } = props;
    const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);
    const colorScheme = useColorScheme();
    const theme = themes[colorScheme];
    const [results, setResults] = useState<Array<object>>([])

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

    useNavigationButtonPress(({ buttonId }) => {
        if (buttonId === 'cancel_share_item_button') {
            Navigation.dismissModal(componentId)
        }
    })

    useNavigationSearchBarUpdate((e) => {
        firestore().collection('users')
            .where('user_phonenumber', '==' , e.text)
            .get()
            .then((querySnapshot) => {
                const data: Array<object> = []
                querySnapshot.forEach(doc => {
                    data.push(doc.data())
                    
                })
                setResults(data)
            })
            .catch(err => {
                console.log(err)
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
                    name: INVITECONTACTS,
                    id: 'invite_contacts'
                }
            })
        }
    
    let foodItemsRef = firestore().collection('food_items')

    const shareItem = (user_id: string) => {
        foodItemsRef.where('ownerId', 'array-contains', firebase.auth().currentUser?.uid)
            .get()
            .then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                foodItemsRef.doc(doc.id).update({
                ownerId: firebase.firestore.FieldValue.arrayUnion(user_id)
                }).then(res => {
                console.log()
                }).catch(err => {
                Alert.alert(err);
                })
            })
            })
            .catch(err => {
            console.log(err);
            })
    }

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.GroupedBackgroundColor}]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.layout}>
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
                            title="Send app download invitation"
                            onPress={() => openContacts()}
                        />
                    </CellGroup>
                    {
                        results.length === 0 
                        ? (
                            <View style={styles.searchResults}>
                                <Text style={[styles.opaqueText, {color: theme.PlaceholderTextColor}]}>It looks like no one in your contacts has a FoodIt account yet.</Text>
                            </View>
                        )
                        : (
                            <FadeInView>
                                <CellGroup header="Results" footer={true} theme={theme}>
                                    {results.map((item, index) => (
                                    <Cell
                                        key={index}
                                        title={item.user_name}
                                        //onPress={() => openContacts()}
                                    />
                                    ))}
                                </CellGroup>
                            </FadeInView>
                        )
                    }
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