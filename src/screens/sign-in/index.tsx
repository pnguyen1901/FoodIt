import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, Input, Text, Layout, Avatar } from '@ui-kitten/components';
import { ImageOverlay } from './extra/image-overlay.component';
import {
  EyeIcon,
  EyeOffIcon,
  FacebookIcon,
  GoogleIcon,
  PersonIcon,
  AppleIcon
} from './extra/icons';
import { KeyboardAvoidingView } from './extra/3rd-party';
import { firebase } from '@react-native-firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigations/BottomNavigation';
import { setLoggedIn } from '../../store/actions';
import { LoginManager, 
          AccessToken,
          GraphRequest,
          GraphRequestManager } from 'react-native-fbsdk';
import {
          GoogleSignin,
          GoogleSigninButton,
          statusCodes,
          } from '@react-native-community/google-signin';
import appleAuth, {
            AppleAuthRequestScope,
            AppleAuthRequestOperation,
            AppleButton
          } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { create } from 'react-test-renderer';

type SignInNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignIn'
>

type SignInProps = {
  navigation: SignInNavigationProp
}

//Set up Google sign in usage with for default options: you get user email and basic profile info.
GoogleSignin.configure();

export default ({ navigation }: SignInProps): React.ReactElement => {

  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);
  const loggedIn = useSelector(state => state.itemReducer.loggedIn);
  const dispatch = useDispatch();

  const onSignUpButtonPress = (): void => {
    navigation && navigation.navigate('SignUp4');
  };

  const onForgotPasswordButtonPress = (): void => {
    navigation && navigation.navigate('ForgotPassword');
  };

  const onPasswordIconPress = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  async function createNewUser(user: object, signInMethod: string) {

    const user_id = firebase.auth().currentUser.uid;

    const doc = await firestore().collection('users')
      .where('user_id', '==', user_id).get();
      
    if (doc.empty) {

      const docRef = await firestore().collection('users').add({
        user_id : user_id,
        // getting user name from response object is slightly different between Facebook, Google and Apple.
        user_name : signInMethod === 'Facebook' 
                      ? user.name 
                      : ( signInMethod === 'Google' 
                          ? user.familyName + ' ' + user.givenName 
                          : user.fullName),
        user_email : user.email
      });

      if(docRef.id) {
        console.log("Document written with ID: " + docRef.id);
      }      
    } else {
        console.log('User already existed.');
    }
  }

  async function onAppleButtonPress() {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
    });
  
    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw 'Apple Sign-In failed - no identify token returned';
    }
  
    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
  
    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential)
              .then(() => {
                createNewUser(appleAuthRequestResponse, 'Apple');
              })
              .catch(err => {
                console.log(err);
              });
  }

  async function onGoogleButtonPress() {

    // Get the users ID token
    const { idToken, user } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential)
                .then(() =>  {
                  createNewUser(user, 'Google');
                })
                .catch(err => {
                  console.log(err);
                }) 
  }

  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
  
    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
  
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
  
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }

  const onSignInButtonPress = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        dispatch(setLoggedIn(true));
        navigation.navigate('Items');
      })
      .catch(e => {
        Alert.alert(e);
      })
  }

  useEffect(() => {
    firebase
      .auth().onAuthStateChanged((user) => {
        user ? navigation.navigate('Main') : null 
      })
  })

  return (
    <KeyboardAvoidingView>
      <Layout
        style={styles.container}
        >
        <View style={styles.headerContainer}>
          {/* <Text
            category='h1'
            status='primary'>
            Hello
          </Text> */}
          <Avatar 
            style={styles.avatar} 
            shape='rounded'
            size='giant' 
            source={require('./assets/Icon-1024.png')}/>
          <Text
            style={styles.signInLabel}
            category='s1'
            status='primary'>
            Sign in to your account
          </Text>
        </View>
        <View style={styles.formContainer}>
          <Input
            placeholder='Email'
            icon={PersonIcon}
            value={email}
            onChangeText={setEmail}
          />
          <Input
            style={styles.passwordInput}
            status='basic'
            placeholder='Password'
            icon={passwordVisible ? EyeIcon : EyeOffIcon}
            value={password}
            secureTextEntry={!passwordVisible}
            onChangeText={setPassword}
            onIconPress={onPasswordIconPress}
          />
          <View style={styles.forgotPasswordContainer}>
            <Button
              style={styles.forgotPasswordButton}
              appearance='ghost'
              status='primary'
              onPress={onForgotPasswordButtonPress}>
              Forgot your password?
            </Button>
          </View>
        </View>
        <Button
          style={styles.signInButton}
          size='large'
          onPress={onSignInButtonPress}>
          SIGN IN
        </Button>
        <View style={styles.socialAuthContainer}>
          <Text
            style={styles.socialAuthHintText}
            status='primary'>
            Or Sign In using Social Media
          </Text>
          <View style={styles.socialAuthButtonsContainer}>
            <Button
              style={styles.GoogleButton}
              size='medium'
              icon={GoogleIcon}
              onPress={() => {
                onGoogleButtonPress()
              }}
            >Sign in With Google</Button>
            <Button
              style={styles.FaceBookButton}
              size='medium'
              icon={FacebookIcon}
              onPress={() => 
                onFacebookButtonPress()
                  .then(() => {
                    //Create response callback.
                  _responseInfoCallback = (error: Object, result: Object) => {
                    if (error) {
                      console.log('Error fetching data: ' + error.toString());
                    } else {
                      createNewUser(result, 'Facebook').catch((error) => {
                        console.log('Error creating new user: ' + error.toString());
                      })
                    }
                  }
                  // Create a graph request asking for user information with a callback to handle the response.
                  const infoRequest = new GraphRequest(
                    '/me?fields=name,email',
                    null,
                    this._responseInfoCallback,
                  );
                  // Start the graph request.
                  new GraphRequestManager().addRequest(infoRequest).start();
                  }).catch((error) => {
                    console.log(error);
                  })
              }
            >Sign in With Facebook</Button>
            <Button
              style={styles.AppleButton}
              size='medium'
              onPress={() => onAppleButtonPress()}
            >
              Sign in With Apple
            </Button>
          </View>
        </View>
        <Button
          style={styles.signUpButton}
          appearance='ghost'
          status='primary'
          onPress={onSignUpButtonPress}>
          Don't have an account? Sign Up
        </Button>
      </Layout>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  avatar: {
    height: 80,
    width: 80,
    marginTop: 20,
    marginBottom: 10
  },
  headerContainer: {
    flex: 1,
    minHeight: 216,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  signInLabel: {
    marginTop: 16,
  },
  passwordInput: {
    marginTop: 16,
  },
  signInButton: {
    marginHorizontal: 16,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  forgotPasswordButton: {
    paddingHorizontal: 0,
  },
  signUpButton: {
    marginVertical: 12,
  },
  socialAuthContainer: {
    flex: 1,
    marginTop: 32,
  },
  socialAuthButtonsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginHorizontal: 16,
  },
  GoogleButton: {
    marginBottom: 8,
    marginHorizontal: 8,
    backgroundColor: '#DB4437',
    borderRadius: 10,
    borderColor: '#fff'
  },
  FaceBookButton: {
    marginBottom: 8,
    marginHorizontal: 8,
    backgroundColor: '#3b5998',
    borderRadius: 10,
    borderColor: '#fff',
  },
  AppleButton: {
    marginBottom: 8,
    marginHorizontal: 8,
    backgroundColor: '#000000',
    borderRadius: 10,
    borderColor: '#fff'
  },
  socialAuthHintText: {
    alignSelf: 'center',
    marginBottom: 16,
  },
});

