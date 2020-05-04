import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView, 
        TouchableWithoutFeedback,
        Keyboard,
        Alert,
        Dimensions,
        Platform,
        StyleSheet
} from 'react-native';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
require('datejs');
import RNCalendarEvents from 'react-native-calendar-events/index.ios';
import { setAlert, setBrand, setCategory, setEXP, setTime, hideTimePicker, showTimePicker, resetForm } from '../../store/actions';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import { Navigation } from 'react-native-navigation';
import Cell from '../../components/cell/Cell';
import CellGroup from '../../components/cell/CellGroup';
import { useColorScheme } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';


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
            Navigation.dismissAllModals();
        }

        if (buttonId === 'save_item_button_id') {
            saveItem();
        }
    })

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

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.SystemBackgroundColor}]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <CellGroup header={true} footer={true} theme={theme}>
                    <Cell 
                        textInput={true}
                        placeholder={'Brand'}
                    />
                    <Cell 
                        textInput={true}
                        placeholder={'Category'}
                    />
                    <Cell 
                        textInput={true}
                        placeholder={'Expiration Date'}
                    />
                    <Cell 
                        textInput={true}
                        placeholder={'Remind me'}
                    />
                </CellGroup> 
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default addItem;