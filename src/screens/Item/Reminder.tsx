import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView, 
        TouchableWithoutFeedback,
        Keyboard,
        Dimensions,
        Platform,
        StyleSheet,
        Text
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Cell from '../../components/cell/Cell';
import CellGroup from '../../components/cell/CellGroup';
import { useColorScheme } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';
import { RootState } from '../../store/rootReducer';
import { setAlert } from '../../store/item/actions';
import { ITEM } from '../../screens';

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
    { text: '1 day before', value: 1 },
    { text: '2 days before', value: 2  },
    { text: '3 days before', value: 3  },
    { text: '4 days before', value: 4  },
    { text: '1 week before', value: 7  },
]


const Reminder: ReminderComponentType = ({
    componentId,
}): JSX.Element => {

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


    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.GroupedBackgroundColor}]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <>
                <CellGroup header={true} footer={true} theme={theme}>
                    {AlertOptions.map((option, index) => (
                        <Cell key={index}
                            title={option.text}
                            onPress={() => { 
                                dispatch(setAlert(option))
                                Navigation.pop(componentId);
                            }}
                        />                        
                    ))}
                </CellGroup>
                </> 
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

Reminder.options = () => ({
    topBar: {
        title: {
            text: 'Alert'
        },
        },
    bottomTabs: {
        visible: false
    }
})


export default Reminder;
