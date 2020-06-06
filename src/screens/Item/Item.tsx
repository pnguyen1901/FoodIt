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
import { ActionSheet } from 'react-native-ui-lib';
import firestore from '@react-native-firebase/firestore';
require('datejs');
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import { Navigation } from 'react-native-navigation';
import Cell from '../../components/cell/Cell';
import CellGroup from '../../components/cell/CellGroup';
import { useColorScheme } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';
import { RootState } from '../../store/rootReducer';
import { setExpDate, setBrand, setCategory, setNotes, toggleActionSheet } from '../../store/item/actions';
import { REMINDER } from '../../screens';
import RNCalendarEvents from 'react-native-calendar-events/index.ios';
import { AlertOptionType } from '../Item/Reminder';


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


const Item: ItemComponentType = ({
    componentId,
}): JSX.Element => {

    const [isTimePickerVisible, setTimePickerVisible] = useState(false);
    const { id,
            expiration_date, 
            brand,
            category,
            alert,
            notes,
            eventId,
            showActionSheet
            } = useSelector((state: RootState) => state.item );
    const dispatch = useDispatch();
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


    const saveItem = (eventId: string, expiration_date: Date, alert: AlertOptionType, notes: string, id: string): void => {
        // Remove existing event and create a new event
        //RNCalendarEvents.removeEvent(eventId)
        console.log(expiration_date);
        expiration_date.setHours(10,0o0,0o0,0o0)
        const endDate = new Date(expiration_date.getTime());
        const alarm = new Date(expiration_date.getTime());
        console.log(expiration_date);
        RNCalendarEvents.saveEvent(brand + ' ' + category + ' expires soon!', {
            id: eventId,
            startDate: expiration_date.toISOString(),
            endDate: endDate.addHours(1).toISOString(),
            alarms: [{
                date: new Date(alarm.setDate(alarm.getDate() - alert.value)).toISOString()
            }],
            notes: notes
        }).then((eventId: string) => {
            console.log(`exp date after being manipulated: ${expiration_date}`) 
            console.log(eventId)
            firestore().collection('food_items').doc(id)
                .update({
                    brand: brand,
                    category: category,
                    expiration_date: expiration_date,
                    notes: notes,
                    alert: alert,
                    eventId: eventId
                })
                .then((res) => {
                    console.log("Document successfully updated!");
                    Navigation.pop(componentId)
                })
                .catch((err) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", err);
                })
        })
        .catch((err: string) => console.log(err));
    }

    const handleSaveItem = () => {
            RNCalendarEvents.authorizationStatus()
                    .then((status: string) => {
                        if (status === 'authorized') {
                            if (expiration_date.hasOwnProperty("_seconds")) {
                                saveItem(eventId ,new Date(expiration_date.seconds*1000), alert, notes, id);
                            }
                            else {
                                saveItem(eventId , expiration_date, alert, notes, id);
                            }
                        } else {
                            RNCalendarEvents.authorizeEventStore()
                                .then((status: string) => {
                                    if (expiration_date.hasOwnProperty("_seconds")) {
                                        saveItem(eventId ,new Date(expiration_date.seconds*1000), alert, notes, id);
                                    }
                                    else {
                                        saveItem(eventId , expiration_date, alert, notes, id);
                                    }
                                })
                                .catch((err: string) => {
                                    Alert.alert(err);
                                })
                        }
                }).catch((err: string) => {
                    Alert.alert(err);
                })
    };


    useNavigationButtonPress(({ buttonId }) => {
        if (buttonId === 'edit_item_button') {
            handleSaveItem();
        }

    })

    const onAlertPressed = () => {
        Navigation.push(componentId, {
            component: {
                name: REMINDER
            }
        })
    }

    let foodItemsRef = firestore().collection('food_items');

    const handleDeleteItem = (documentId: string): void => {
        console.log(documentId);
        foodItemsRef
            .doc(documentId)
            .delete()
            .then(() => {
                Alert.alert('Item deleted!');
                Navigation.pop(componentId);
            })
            .catch((err) => {
                console.log(err);
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
                <CellGroup header={true} footer={true} theme={theme}>
                    <Cell
                        onPress={() => dispatch(toggleActionSheet())}
                        title={'Delete Item'}
                        deleteButton={true}
                    />
                </CellGroup>
                <ActionSheet
                    //title='Title'
                    message='Are you sure you want to delete this item?'
                    showCancelButton={Platform.OS === 'ios' ? true : false}
                    cancelButtonIndex={3}
                    destructiveButtonIndex={0}
                    options={[
                        {label: 'Delete Item', onPress: () => handleDeleteItem(id)},
                    ]}
                    visible={showActionSheet}
                    useNativeIOS
                    onDismiss={() => dispatch(toggleActionSheet())}
                /> 
                </>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

Item.options = () => ({
    topBar: {
        title: {
            text: 'Item Details'
        },
        rightButtons: [
            {
            id: 'edit_item_button',
            text: 'Save'
            }
        ]
        },
    bottomTabs: {
        visible: false
    }
})


export default Item;
