import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView, 
        TouchableWithoutFeedback,
        Keyboard,
        Alert,
        Dimensions,
        Platform,
        StyleSheet,
        Text,
        View
} from 'react-native';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
require('datejs');
//import RNCalendarEvents from 'react-native-calendar-events/index.ios';
import {
    setBrand,
    setCategory,
    setExpDate,
    cancelAddItem,
    setNotes,
    resetForm
} from '../../store/item/actions';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import { Navigation } from 'react-native-navigation';
import Cell from '../../components/cell/Cell';
import CellGroup from '../../components/cell/CellGroup';
import { useColorScheme } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';
import { RootState } from '../../store/rootReducer';
import { REMINDER } from '../../screens';
import { AlertOptionType } from '../Item/Reminder';

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


const addItem: addItemComponentType = (props): JSX.Element => {

    const { componentId } = props;
    const {  
            alert,
            brand,
            category,
            notes,
            expiration_date
    } = useSelector((state: RootState) => state.item );
    const dispatch = useDispatch();
    const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);
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


    const getStatusBarHeight = async () => {
        const navConstants = await Navigation.constants();

        // for more info - https://stackoverflow.com/a/48759750
        if (Platform.OS === 'ios') {
            setKeyboardVerticalOffset(navConstants.statusBarHeight + navConstants.topBarHeight);
        }
    };

    useNavigationButtonPress(({ buttonId }) => {
        if (buttonId === 'cancel_add_item_button_id') {
            dispatch(cancelAddItem());
            Navigation.dismissAllModals();
        }

        if (buttonId === 'save_item_button_id') {
            handleSaveItem();
        }
    })


    const saveItem = (expiration_date: Date, alert: AlertOptionType, notes: string): void => {
        expiration_date.setHours(10,0o0,0o0,0o0)
        // const endDate = new Date(expiration_date.getTime());
        // const alarm = new Date(expiration_date.getTime());
        // console.log(expiration_date.toString());
        // RNCalendarEvents.saveEvent(brand + ' ' + category + ' expires soon!', {
        //     startDate: expiration_date.toISOString(),
        //     endDate: endDate.addHours(1).toISOString(),
        //     alarms: [{
        //         date: new Date(alarm.setDate(alarm.getDate() - alert.value)).toISOString()
        //     }],
        //     notes: notes
        // }).then((eventId: string) => {
        //     console.log(`exp date after being manipulated: ${expiration_date}`) 
        //     console.log(eventId)
            firestore().collection('food_items')
            .add({
                brand: brand,
                category: category,
                notes: notes,
                alert: alert,
                expiration_date: expiration_date,
                ownerId: [ownerId],
                // eventId: eventId
            })
            .then((docRef) => {
                console.log("Document written with ID:", docRef.id);
                dispatch(resetForm());
                Alert.alert('Item added!')
                setTimeout(() => { 
                    Navigation.dismissAllModals();
                }, 1000)
            })
            .catch((error) => {
                Alert.alert("Error adding document:", error);
            })
        // })
        // .catch((err: string) => console.log(err));
    }

    const ownerId = firebase.auth().currentUser?.uid;

    const handleSaveItem = () => {
            // RNCalendarEvents.authorizationStatus()
            //         .then((status: string) => {
            //             if (status === 'authorized') {
                            if (expiration_date.hasOwnProperty("_seconds")) {
                                saveItem(new Date(expiration_date.seconds*1000), alert, notes);
                            }
                            else {
                                saveItem(expiration_date, alert, notes);
                            }
                //         } else {
                //             RNCalendarEvents.authorizeEventStore()
                //                 .then((status: string) => {
                //                     if (expiration_date.hasOwnProperty("_seconds")) {
                //                         saveItem(new Date(expiration_date.seconds*1000), alert, notes);
                //                     }
                //                     else {
                //                         saveItem(expiration_date, alert, notes);
                //                     }
                //                 })
                //                 .catch((err: string) => {
                //                     Alert.alert(err);
                //                 })
                //         }
                // }).catch((err: string) => {
                //     Alert.alert(err);
                // })
    };

    const onAlertPressed = () => {
        Navigation.push(componentId, {
            component: {
                name: REMINDER
            }
        })
    }

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.GroupedBackgroundColor}]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
                <CellGroup header={true} footer={true} theme={theme}>
                    <Cell 
                        textInput={true}
                        placeholder={'Brand'}
                        value={brand}
                        onInputChange={setBrand}
                    />
                    <Cell 
                        textInput={true}
                        placeholder={'Category'}
                        value={category}
                        onInputChange={setCategory}
                    />
                    <Cell 
                        textInput={true}
                        placeholder={'Notes'}
                        multiline={true}
                        height={150}
                        value={notes}
                        onInputChange={setNotes}
                    />
                </CellGroup>
                <CellGroup header={true} footer={true} theme={theme}>
                    <Cell 
                        title={'Expires'} 
                        right={
                            <Text style={[styles.opaqueText, {color: theme.LabelColor}]}>
                            {
                            expiration_date.hasOwnProperty("_seconds") === true
                            ? new Date(expiration_date._seconds*1000).toLocaleDateString()
                            : expiration_date.toLocaleDateString()}
                            </Text>}
                        onPress={() => setTimePickerVisible(true)}
                    />
                    <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    isDarkModeEnabled={colorScheme === 'light' ? false : true}
                    mode="date"
                    onConfirm={(date) => { 
                        dispatch(setExpDate(date))
                        setTimePickerVisible(false)
                    }}
                    onCancel={() => setTimePickerVisible(false)}
                    />
                    <Cell 
                        title={'Remind me'} 
                        right={
                            <Text style={[styles.opaqueText, {color: theme.LabelColor}]}>
                                {alert.text}
                            </Text>}
                        onPress={onAlertPressed}
                        more={true}
                    />
                </CellGroup>
                </View> 
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default addItem;