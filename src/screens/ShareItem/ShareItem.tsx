import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    SafeAreaView,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
    Platform,
    StyleSheet,
    Text
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Navigation } from 'react-native-navigation';
import { useColorScheme } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';

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

const shareItem: ShareItemComponentType  = (props): JSX.Element => {

    const { componentId } = props;
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

    const getStatusBarHeight = async () => {
        const navConstants = await Navigation.constants();

        // for more info - https://stackoverflow.com/a/48759750
        if (Platform.OS === 'ios') {
            setKeyboardVerticalOffset(navConstants.statusBarHeight + navConstants.topBarHeight);
        }
    };

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.GroupedBackgroundColor}]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <Text></Text>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

shareItem.options = () => ({
    topBar: {
        title: {
            text: 'Add People'
        },
        searchBar: true,
        searchBarHiddenWhenScrolling: false,
        searchBarPlaceholder: 'phone number'
    }
})

export default shareItem;