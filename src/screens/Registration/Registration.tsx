import React from 'react';
import { SafeAreaView, 
    TouchableOpacity,
    TouchableWithoutFeedback, View, Keyboard, StyleSheet, Text } from 'react-native';
import Cell from '../../components/cell/Cell';
import CellGroup from '../../components/cell/CellGroup';
import { useColorScheme } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';
import firestore from '@react-native-firebase/firestore';
import { requestUserPermission } from '../LogIn/LogIn';
import { setEmail, setName, setPhoneNumber } from '../../store/user/actions';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { Toast } from 'react-native-ui-lib';
import { setMainRoot } from '../../App';

const Registration: RegistrationComponentType = (
    props
) => {

    const { userId } = props
    const colorScheme = useColorScheme();
    const theme = themes[colorScheme];
    const { name, email, phoneNumber } = useSelector((state: RootState) => state.user);

    const registerUser = () => {
        firestore().collection('users').doc(userId).set({
            user_id : userId,
            // getting user name from response object is slightly different between Facebook, Google and Apple.
            user_name : name,
            user_email : email,
            user_phonenumber: phoneNumber,
            tokens: []
        })
        .then(() => {
            console.log("Document successfully written!");
            requestUserPermission()
            setMainRoot()
        })
        .catch((error:string) => {
            console.log("Error writing document: ", error);
        })
    }

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.GroupedBackgroundColor}]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.layout}>
                    <View>
                        <CellGroup header="Name" inputValue={name} required={true} footer={true} theme={theme}>
                            <Cell 
                                textInput={true}
                                value={name}
                                onInputChange={setName}
                            />
                        </CellGroup>
                        <CellGroup header="Email" inputValue={email} required={true} footer={true} theme={theme}>
                            <Cell 
                                textInput={true}
                                value={email}
                                onInputChange={setEmail}
                            />
                        </CellGroup>
                        <CellGroup header="Phone Number" inputValue={phoneNumber} required={true} footer={true} theme={theme}>
                            <Cell 
                                textInput={true}
                                value={phoneNumber}
                                onInputChange={setPhoneNumber}
                            />
                        </CellGroup>
                    </View>
                    <Toast
                        //renderAttachment={this.renderAboveToast}
                        visible={name !== '' && email !== '' && phoneNumber !== ''}
                        position={'bottom'}
                        backgroundColor={theme.SystemBackgroundColor}
                    >
                        <View>
                            <TouchableOpacity 
                                onPress={() => registerUser()}
                                style={[styles.continueButton, {backgroundColor: theme.SecondarySystemBackgroundColor}]}>
                                <Text style={[styles.continueButtonText, {color: theme.Blue}]}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </Toast>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

Registration.options = () => ({
    topBar: {
        title: {
            text: 'Registration'
        }
    }
})

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
        // justifyContent: 'space-between',
        // flexDirection: 'column',
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
    continueButton: {
        marginTop: 10,
        marginBottom: 30,
        marginHorizontal: 30,
        borderRadius: 10
    },
    continueButtonText: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingHorizontal: 30,
        textAlign: 'center',
        fontSize: 20
    }

})

export default Registration;