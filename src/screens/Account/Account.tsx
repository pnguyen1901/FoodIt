import React, { useEffect, useState } from 'react';
import Cell from '../../components/cell/Cell';
import CellGroup from '../../components/cell/CellGroup';
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
import firestore from '@react-native-firebase/firestore';
import { setLoginRoot } from '../../App';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { setName, setEmail } from '../../store/user/actions';
import { useNavigationButtonPress } from 'react-native-navigation-hooks';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    doneButton: {
        color: '#A1A1A1',
        fontWeight: 'bold'
    }
})


const Account: AccountComponentType = ({
    componentId
}) => {
    
    const colorScheme = useColorScheme();
    const theme = themes[colorScheme];
    const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);
    const { name, email } = useSelector((state: RootState) => state.user); 
    const dispatch = useDispatch();

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
            dispatch(setEmail(''));
            dispatch(setName(''));
            setLoginRoot();
        }).catch((err) => {
            Alert.alert(err);
        })
    }

    const handleSave = () => {
        const userId = firebase.auth().currentUser?.uid;
        
        firestore()
            .collection('users')
            .doc(userId)
            .update({
                user_name: name,
                user_email: email
            })
    }

    const onEditingMode = () => {
        console.log('editing')
        Navigation.mergeOptions(componentId, {
            topBar: {
                leftButtons: [
                    { 
                        id: 'cancel',
                        text: 'Cancel'
                    }
                ],
                rightButtons: [{
                    id: 'save',
                    text: 'Save',
                    enabled: name !== '' && email !== ''
                }]
            }
        })
    }


    if (name === '' || email === '') {
        Navigation.mergeOptions(componentId, {
            topBar: {
                rightButtons: [{
                    id: 'save',
                    text: 'Save',
                    enabled: false
                }]
            }
        })
    }

    useNavigationButtonPress(({ buttonId }) => {
        if (buttonId === 'save') {
            handleSave()
        }
    })

    return (
        <SafeAreaView style={[styles.container, {
            backgroundColor: theme.GroupedBackgroundColor
        }]}>
            <CellGroup header={'name'} theme={theme}>
                <Cell 
                    textInput={true}
                    value={name}
                    onInputChange={setName}
                    onPress={onEditingMode}
                />
            </CellGroup>
            <CellGroup header={'email'} theme={theme}>
                <Cell 
                    textInput={true}
                    value={email}
                    onInputChange={setEmail}
                    onPress={onEditingMode}
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
    }
})

export default Account;