import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, Input, Text } from '@ui-kitten/components';
import { ImageOverlay } from './extra/image-overlay.component';
import {
  EyeIcon,
  EyeOffIcon,
  FacebookIcon,
  GoogleIcon,
  PersonIcon,
  TwitterIcon,
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
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

type SignInNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignIn'
>

type SignInProps = {
  navigation: SignInNavigationProp
}


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

  async function createNewUser(result: object) {

    const docRef = await firestore().collection('users').add({
      user_id: result.id,
      user_name: result.name,
      user_email: result.email
    });

    if(docRef.id) {
      console.log("Document written with ID: " + docRef.id);
    }

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
      <ImageOverlay
        style={styles.container}
        source={require('./assets/image-background.jpg')}>
        <View style={styles.headerContainer}>
          <Text
            category='h1'
            status='control'>
            Hello
          </Text>
          <Text
            style={styles.signInLabel}
            category='s1'
            status='control'>
            Sign in to your account
          </Text>
        </View>
        <View style={styles.formContainer}>
          <Input
            status='control'
            placeholder='Email'
            icon={PersonIcon}
            value={email}
            onChangeText={setEmail}
          />
          <Input
            style={styles.passwordInput}
            status='control'
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
              status='control'
              onPress={onForgotPasswordButtonPress}>
              Forgot your password?
            </Button>
          </View>
        </View>
        <Button
          style={styles.signInButton}
          size='giant'
          onPress={onSignInButtonPress}>
          SIGN IN
        </Button>
        <View style={styles.socialAuthContainer}>
          <Text
            style={styles.socialAuthHintText}
            status='control'>
            Or Sign In using Social Media
          </Text>
          <View style={styles.socialAuthButtonsContainer}>
            <Button
              appearance='ghost'
              status='control'
              size='giant'
              icon={GoogleIcon}
            />
            <Button
              appearance='ghost'
              status='control'
              size='giant'
              icon={FacebookIcon}
              onPress={() => 
                onFacebookButtonPress()
                  .then(() => {
                    //Create response callback.
                  _responseInfoCallback = (error: Object, result: Object) => {
                    if (error) {
                      console.log('Error fetching data: ' + error.toString());
                    } else {
                      createNewUser(result).catch((error) => {
                        console.log('Error creating new user: ' + error.toString());
                      })
                    }
                  }

                  // Create a graph request asking for user information with a callback to handle the response.
                  const infoRequest = new GraphRequest(
                    '/me?fields=id,name,email',
                    null,
                    this._responseInfoCallback,
                  );
                  // Start the graph request.
                  new GraphRequestManager().addRequest(infoRequest).start();
                  }).catch((error) => {
                    console.log(error);
                  })
              }
            />
            <Button
              appearance='ghost'
              status='control'
              size='giant'
              icon={TwitterIcon}
            />
          </View>
        </View>
        <Button
          style={styles.signUpButton}
          appearance='ghost'
          status='control'
          onPress={onSignUpButtonPress}>
          Don't have an account? Sign Up
        </Button>
      </ImageOverlay>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    minHeight: 216,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
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
    marginTop: 32,
  },
  socialAuthButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  socialAuthHintText: {
    alignSelf: 'center',
    marginBottom: 16,
  },
});

