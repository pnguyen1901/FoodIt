import React from 'react';
import { SafeAreaView, 
    TouchableOpacity,
    TouchableWithoutFeedback, View, Keyboard, StyleSheet, Text, TextInput, Alert } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';
import { firebase } from '@react-native-firebase/auth';
import { setEmail } from '../../store/user/actions';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { useDispatch } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import { setLoginRoot } from '../../App';


const ForgotPassword: ForgotPasswordComponentType = (
    props
) => {

    const colorScheme = useColorScheme();
    const theme = themes[colorScheme];
    const { email } = useSelector((state: RootState) => state.user.present);
    const dispatch = useDispatch();


    useNavigationButtonPress(({ buttonId }) => {
        if (buttonId === 'cancel') {
            Navigation.dismissModal(props.componentId)
            // Reset sign up form
            dispatch(setEmail(''))
        }
    })

    const onContinueButtonPress = () => {
        firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                Alert.alert('Email sent', 'Please check your mailbox for a reset password email.', [
                    {
                        text: 'ok',
                        style: 'default',
                        onPress: () => setLoginRoot()
                    },  
                ])
                }
            )
            .catch(() => Alert.alert('Encountered error sending email. Please make sure you enter a correct email.'))
    }

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.GroupedBackgroundColor}]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.layout}>
                    <View style={styles.formContainer}>
                        <Text style={[styles.titleText, {color: theme.LabelColor}]}>
                            Enter the email that you used to sign up for FoodIt account.
                        </Text>
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
                        <View>
                            <TouchableOpacity
                                onPress={() => onContinueButtonPress()}
                                style={styles.continueButton}
                            >
                                <Text style={styles.continueText}>Continue</Text>
                            </TouchableOpacity>          
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

ForgotPassword.options = () => ({
    topBar: {
        title: {
            text: 'Forgot Password'
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
    titleText: {
        fontSize: 16,
        marginBottom: 15
    },
    continueButton: {
        marginTop: 10,
        backgroundColor: '#4340de',
        alignItems: 'center',
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10
    },
    continueText: {
        color: '#ffffff',
        fontSize: 17
    },

})

export default ForgotPassword;