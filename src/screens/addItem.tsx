import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView, 
        TouchableWithoutFeedback,
        Keyboard,
        Alert,
        Dimensions,
        Platform
} from 'react-native';
import {
        Icon,
        Layout,
        Text,
        Input, 
        Datepicker,
        TopNavigationAction,
        Select,
        Button} from '@ui-kitten/components';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet } from 'react-native';
require('datejs');
import RNCalendarEvents from 'react-native-calendar-events/index.ios';
import { setAlert, setBrand, setCategory, setEXP, setTime, hideTimePicker, showTimePicker, resetForm } from '../store/actions';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import { Navigation } from 'react-native-navigation';

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
    }

})

const BackIcon = (style) : React.ReactElement => (
    <Icon {...style} name='arrow-back'/>
)

const SaveIcon = (style) : React.ReactElement => (
    <Icon {...style} name='save-outline'/>
)

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
            isTimePickerVisible,
            time } = useSelector( state => state.itemReducer );
    const dispatch = useDispatch();
    const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);

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

    const navigateBack = (): void => {
        
    };

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={navigateBack}/>
    );

    const saveEventCalendar = (expiration_date: string, alert: number): void => {
        const endDate = expiration_date;
        const alarm = expiration_date;
        console.log(expiration_date.toString());
        RNCalendarEvents.saveEvent(category, {
            startDate: expiration_date.toISOString(),
            endDate: endDate.addHours(1).toISOString(),
            title: category + brand,
            alarms: [{
                date: alarm.addHours(10).add(-alert).day().toISOString()
            }]
        }).then((status: string) => { 
            console.log(status)
            dispatch(resetForm());
        })
        .catch((err: string) => console.log(err));
        
    }

    const ownerId = firebase.auth().currentUser.uid;

    const saveItem = () => {
        firestore().collection('food_items')
            .add({
                brand: brand,
                category: category,
                expiration_date: expiration_date,
                ownerId: [ownerId]
            })
            .then((docRef) => {
                console.log("Document written with ID:", docRef.id);
                RNCalendarEvents.authorizationStatus()
                    .then((status: string) => {
                        if (status === 'authorized') {
                            saveEventCalendar(expiration_date, alert);
                        } else {
                            RNCalendarEvents.authorizeEventStore()
                                .then((status: string) => {
                                    saveEventCalendar();
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

    const SaveAction = () => (
        <TopNavigationAction icon={SaveIcon} onPress={saveItem}/>
    );

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Layout style={styles.layout}>
                {/* <Layout style={styles.inputLayout}> */}
                    <Text
                        category='h6'>
                        Brand
                    </Text>
                    <Input
                    style={styles.input} 
                    placeholder='Select the brand of the item'
                    value={brand}
                    onChangeText={(e) => dispatch(setBrand(e))}/>
                {/* </Layout> */}
                {/* <Layout style={styles.inputLayout}> */}
                    <Text
                        category='h6'>
                        Category
                    </Text>
                    <Input
                        style={styles.input} 
                        placeholder='Category'
                        value={category}
                        onChangeText={(e) => dispatch(setCategory(e))}/>                
                {/* </Layout> */}
                {/* <Layout style={styles.inputLayout}> */}
                <Text
                    category='h6'>
                    Expiration Date
                </Text>
                <Datepicker
                    style={styles.input} 
                    date={expiration_date}
                    // date={expirationDate}
                    onSelect={(e) => dispatch(setEXP(e))}/>
                {/* </Layout> */}
                <Text
                    category='h6'>
                    Alert
                </Text>
                <Select
                    style={styles.input}
                    data={AlertOptions}
                    selectedOption={selectedOption}
                    onSelect={(e) => {
                        setSelectedOption(e);
                        dispatch(setAlert(e.value));
                    }}
                />
                <Input onFocus={() => dispatch(showTimePicker())}>{time.toLocaleString()}</Input>
                <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="datetime"
                    onConfirm={(date) => dispatch(setTime(date))}
                    onCancel={() => dispatch(hideTimePicker())}
                />
                <Layout style={{flex: 1}}>

                </Layout>
            </Layout>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default addItem;