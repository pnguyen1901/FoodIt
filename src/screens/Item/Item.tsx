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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import { Navigation } from 'react-native-navigation';
import Cell from '../../components/cell/Cell';
import CellGroup from '../../components/cell/CellGroup';
import { useColorScheme } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';
import { RootState } from '../../store/rootReducer';
import { setExpDate } from '../../store/selecteditem/actions';
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


const Item: ItemComponentType = ({
    componentId,
}): JSX.Element => {

    const [isTimePickerVisible, setTimePickerVisible] = useState(false);
    const { expiration_date, 
            brand,
            category,
            alert
            } = useSelector((state: RootState) => state.selectedItem );
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

    })

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
                        placeholder={'Brand & Category'}
                        value={brand + ' ' + category}
                    />
                    <Cell 
                        textInput={true}
                        placeholder={'Notes'}
                        value={''}
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
                                {alert}
                            </Text>}
                        onPress={onAlertPressed}
                        more={true}
                    />
                </CellGroup>
                <CellGroup header={true} footer={true} theme={theme}>
                    <Cell
                        title={'Delete Item'}
                        deleteButton={true}
                    />
                </CellGroup>
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
