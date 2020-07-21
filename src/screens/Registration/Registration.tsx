import React, { useState } from 'react';
import { SafeAreaView, 
    TouchableOpacity,
    TouchableWithoutFeedback, View, Keyboard, StyleSheet, Text, TextInput } from 'react-native';
import Cell from '../../components/cell/Cell';
import CellGroup from '../../components/cell/CellGroup';
import { useColorScheme } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';
import { requestUserPermission } from '../LogIn/LogIn';
import { setEmail, setPassword, setName, setPhoneNumber, resetSignUpForm } from '../../store/user/actions';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { Toast } from 'react-native-ui-lib';
import { setMainRoot } from '../../App';
import { useDispatch } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import { openURL } from '../../screens/Settings/Settings';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { setPasswordVisibilty } from '../../store/user/actions';


const Registration: RegistrationComponentType = (
    props
) => {

    var userId = props.userId;
    const signUpWithEmail = props.signUpWithEmail;
    const colorScheme = useColorScheme();
    const theme = themes[colorScheme];
    const { name, email, phoneNumber, password, showPassword } = useSelector((state: RootState) => state.user.present);
    const dispatch = useDispatch();

    const onHandleUserWithEmail = () => {
        return dispatch => {
            return firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then(() => {
                        console.log('User signed in')
                        userId = firebase.auth().currentUser?.uid;
                        dispatch(registerUser(userId))
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

    const registerUser = (userId) => {
        
        return dispatch => {
            return firestore().collection('users').doc(userId).set({
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
        

    }

    useNavigationButtonPress(({ buttonId }) => {
        if (buttonId === 'cancel') {
            Navigation.dismissModal(props.componentId)
            // Reset sign up form
            dispatch(resetSignUpForm())
        }
    })

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.GroupedBackgroundColor}]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.layout}>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={[styles.textInput, 
                                { color: theme.SecondaryLabelColor, 
                                backgroundColor: theme.SecondarySystemBackgroundColor,
                                borderColor: theme.OpaqueSeparatorColor  
                                }]}
                            placeholder='Email: name@domain.com'
                            value={email}
                            textContentType='emailAddress'
                            autoCompleteType='email'
                            onChangeText={(text) => dispatch(setEmail(text))}
                            autoCapitalize='none'
                        />
                        <View style={[styles.textInput, 
                                {
                                display: 'flex',
                                flexDirection: 'row',  
                                backgroundColor: theme.SecondarySystemBackgroundColor,
                                borderColor: theme.OpaqueSeparatorColor  
                                }]}>
                            <TextInput
                            style={{color: theme.SecondaryLabelColor, flex: 1, fontSize: 17, fontWeight: '500'}}
                            placeholder='Password: Minimum 8 characters'
                            value={password}
                            textContentType='newPassword'
                            autoCompleteType='password'
                            secureTextEntry={!showPassword}
                            onChangeText={(text) => dispatch(setPassword(text))}
                            autoCapitalize='none'
                            />
                            {!showPassword 
                            ? <FontAwesome5 onPress={() => dispatch(setPasswordVisibilty())} color={theme.LabelColor} size={16} name="eye"/>
                            : <FontAwesome5 onPress={() => dispatch(setPasswordVisibilty())} color={theme.LabelColor} size={16} name="eye-slash"/>
                            }
                        </View>
                        <TextInput
                            style={[styles.textInput, 
                                { color: theme.SecondaryLabelColor, 
                                backgroundColor: theme.SecondarySystemBackgroundColor,
                                borderColor: theme.OpaqueSeparatorColor  
                                }]}
                            placeholder='Name'
                            value={name}
                            textContentType={'name'}
                            autoCompleteType={'name'}
                            autoCapitalize={'words'}
                            onChangeText={(text) => dispatch(setName(text))}
                        />
                        <TextInput
                            style={[styles.textInput, 
                                { color: theme.SecondaryLabelColor, 
                                backgroundColor: theme.SecondarySystemBackgroundColor,
                                borderColor: theme.OpaqueSeparatorColor  
                                }]}
                            placeholder='Phone Number'
                            textContentType={'telephoneNumber'}
                            autoCompleteType={'tel'}
                            value={phoneNumber}
                            onChangeText={(text) => dispatch(setPhoneNumber(text))}
                            autoCapitalize='none'
                        />
                        <View style={{ marginTop: 20 }}>
                            <TouchableOpacity
                                onPress={() => openURL('https://www.iubenda.com/privacy-policy/79904545')}
                            >
                                <Text style={[styles.privacyPolicyText, {color: theme.LinkColor}]}>
                                    View Privacy Policy
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {/* <CellGroup header="Email" inputValue={email} required={true} footer={true} theme={theme}>
                            <Cell 
                                textInput={true}
                                value={email}
                                onInputChange={setEmail}
                                textContentType={'emailAddress'}
                                autoCompleteType={'email'}
                                autoCapitalize={'none'}
                            />
                        </CellGroup>
                        { signUpWithEmail ?
                        <CellGroup header="Password" inputValue={password} required={true} footer={true} theme={theme}>
                            <Cell 
                                textInput={true}
                                secureTextEntry={!showPassword}
                                password={true}
                                value={password}
                                textContentType={'newPassword'}
                                autoCompleteType={'password'}
                                onInputChange={setPassword}
                                autoCapitalize={'none'}
                            />
                        </CellGroup>
                        : null
                        }
                        <CellGroup header="Name" inputValue={name} required={true} footer={true} theme={theme}>
                            <Cell 
                                textInput={true}
                                value={name}
                                onInputChange={setName}
                                textContentType={'name'}
                                autoCompleteType={'name'}
                                autoCapitalize={'words'}
                            />
                        </CellGroup>
                        <CellGroup header="Phone Number" inputValue={phoneNumber} required={true} footer={true} theme={theme}>
                            <Cell 
                                textInput={true}
                                value={phoneNumber}
                                textContentType={'telephoneNumber'}
                                autoCompleteType={'tel'}
                                onInputChange={setPhoneNumber}
                            />
                        </CellGroup> */}
                    </View>
                    <Toast
                        //renderAttachment={this.renderAboveToast}
                        visible={name !== '' && email !== '' && phoneNumber !== ''}
                        position={'bottom'}
                        backgroundColor={theme.SystemBackgroundColor}
                    >
                        <View>
                            <TouchableOpacity 
                                onPress={() => { 
                                    signUpWithEmail ? dispatch(onHandleUserWithEmail()) : dispatch(registerUser(userId))
                                }}
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
            text: 'Sign Up'
        },
        leftButtons: [
            {
                id: 'cancel',
                text: 'Cancel'
            }
        ]
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
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20
    },
    textInput: {
        fontSize: 17,
        fontWeight: "500",
        borderWidth: .7,
        borderStyle: "solid",
        borderRadius: 3,
        marginBottom: 16,
        paddingTop: 10,
        paddingRight: 15,
        paddingBottom: 10,
        paddingLeft: 15,
    },
    privacyPolicyText: {
        textAlign: 'center',
        fontSize: 16
    }

})

export default Registration;