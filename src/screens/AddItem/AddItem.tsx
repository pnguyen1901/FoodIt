import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView, 
        TouchableWithoutFeedback,
        Keyboard,
        Alert,
        Dimensions,
        Platform,
        StyleSheet,
        Text
} from 'react-native';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
require('datejs');
import RNCalendarEvents from 'react-native-calendar-events/index.ios';
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


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#EDF1F7' //dark mode'#101426'
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


const AlertOptions = [
    { text: '2 days before', value: 2 }, 
    { text: '3 days before', value: 3 },
    { text: '1 week before', value: 7 }
]


const addItem: addItemComponentType = ({
    componentId,
}): JSX.Element => {

    const [selectedOption, setSelectedOption] = useState(null);
    const { expiration_date, 
            alert,
            brand,
            category,
            notes,
            time } = useSelector((state: RootState) => state.item );
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

    useEffect(() => {
        const listener = Navigation.events().registerNavigationButtonPressedListener(
            () => {
            // do things
            }
        );
        return () => listener.remove();
    }, []);

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
            saveItem();
        }
    })

    const saveEventCalendar = (expiration_date: string, alert: number, notes: string): void => {
        const endDate = expiration_date;
        const alarm = expiration_date;
        console.log(expiration_date.toString());
        RNCalendarEvents.saveEvent(category, {
            startDate: expiration_date.toISOString(),
            endDate: endDate.addHours(1).toISOString(),
            title: category + brand,
            alarms: [{
                date: alarm.addHours(10).add(-alert).day().toISOString()
            }],
            notes: notes
        }).then((status: string) => { 
            console.log(status)
            dispatch(resetForm());
            Navigation.dismissAllModals();
        })
        .catch((err: string) => console.log(err));
        
    }

    const ownerId = firebase.auth().currentUser.uid;

    const saveItem = () => {
        firestore().collection('food_items')
            .add({
                brand: brand,
                category: category,
                notes: notes,
                alert: alert,
                expiration_date: expiration_date,
                ownerId: [ownerId]
            })
            .then((docRef) => {
                console.log("Document written with ID:", docRef.id);
                RNCalendarEvents.authorizationStatus()
                    .then((status: string) => {
                        if (status === 'authorized') {
                            saveEventCalendar(expiration_date, alert.value, notes);
                        } else {
                            RNCalendarEvents.authorizeEventStore()
                                .then((status: string) => {
                                    saveEventCalendar(expiration_date, alert.value, notes);
                                })
                                .catch((err: string) => {
                                    Alert.alert(err);
                                })
                        }
                }).catch((err: string) => {
                    Alert.alert(err);
                })
            })
            .catch((error) => {
                console.log("Error adding document:", error);
            })
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <>
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
                            ? new Date(expiration_date.seconds*1000).toLocaleDateString()
                            : expiration_date.toLocaleDateString()}
                            </Text>}
                        onPress={() => setTimePickerVisible(true)}
                    />
                    <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    isDarkModeEnabled={colorScheme === 'light' ? false : true}
                    mode="datetime"
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
                </> 
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default addItem;