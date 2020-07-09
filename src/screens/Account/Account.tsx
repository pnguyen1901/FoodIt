import React, { useEffect, useState } from 'react';
import Cell from '../../components/cell/Cell';
import CellGroup from '../../components/cell/CellGroup';
import { LOGIN } from '../../screens';
import { useColorScheme } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';
import { 
    SafeAreaView, 
    StyleSheet, 
    Platform, 
    Dimensions,
    Text,
    Alert
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { firebase } from '@react-native-firebase/auth';
import { setLoginRoot } from '../../App';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    doneButton: {
        color: '#A1A1A1',
        fontWeight: 'bold'
    }
})

const DoneButton = () => (
    <Text style={styles.doneButton}>Done</Text>
)

const Account: AccountComponentType = ({
    componentId
}) => {
    
    const colorScheme = useColorScheme();
    const theme = themes[colorScheme];
    const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);
    const { name, email } = useSelector((state: RootState) => state.user); 

    useEffect(() => {
        Dimensions.addEventListener('change', () => {
            getStatusBarHeight();
        });

        getStatusBarHeight();

    }, [componentId]);


    const getStatusBarHeight = async () => {
        const navConstants = await Navigation.constants();

        // for more info - https://stackoverflow.com/a/48759750
        if (Platform.OS === 'ios') {
            setKeyboardVerticalOffset(navConstants.statusBarHeight + navConstants.topBarHeight);
        }
    };

    const SignOut = () : void => {
        firebase.auth().signOut().then(() => {
          // dispatch(setLoggedIn(false));
            setLoginRoot();
        }).catch((err) => {
            Alert.alert(err);
        })
    }

    return (
        <SafeAreaView style={[styles.container, {
            backgroundColor: theme.GroupedBackgroundColor
        }]}>
            <CellGroup header={'name'} theme={theme}>
                <Cell 
                    textInput={true}
                    value={name}
                />
            </CellGroup>
            <CellGroup header={'email'} theme={theme}>
                <Cell 
                    textInput={true}
                    value={email}
                />
            </CellGroup>
            <CellGroup header={'subcription'} theme={theme}>
                <Cell 
                    title={'Free'}
                    subtitle={'Upgrade'}
                    more={true}
                />
            </CellGroup>
            <CellGroup header={true} footer={true} theme={theme}>
                <Cell
                    onPress={SignOut} 
                    title={'Sign Out'}
                    signOutButton={true}
                />
            </CellGroup>
        </SafeAreaView>
    )
}

Account.options = () => ({
    topBar: {
        visible: true,
        title: {
            text: 'Account Settings'
        },
        rightButtons: [{
            id: 'save_account_settings',
            systemItem: 'done'
        }]
    }
})

export default Account;