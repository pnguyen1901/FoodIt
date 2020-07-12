import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View, Alert, Text, TextInput, Button,
  KeyboardAvoidingView, TouchableWithoutFeedback, Platform, 
  Keyboard, Image, TouchableOpacity
} from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import { firebase } from '@react-native-firebase/auth';
import { setLoggedIn } from '../../store/actions';
import {  
          LoginManager, 
          AccessToken,
          GraphRequest,
          GraphRequestManager } from 'react-native-fbsdk';
import {
          GoogleSignin,
          } from '@react-native-community/google-signin';
import appleAuth, {
            AppleAuthRequestScope,
            AppleAuthRequestOperation,
          } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { themes } from '../../components/Theme/Theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { setMainRoot } from '../../App';
import { RootState } from 'src/store/rootReducer';
import messaging from '@react-native-firebase/messaging';
import AuthorizationStatus from '@react-native-firebase/messaging';
import { Navigation } from 'react-native-navigation';
import { REGISTRATION } from '../../screens';
import { setEmail, setName } from '../../store/user/actions';

//Set up Google sign in usage with for default options: you get user email and basic profile info.
GoogleSignin.configure();


interface UserType {
  name?: string,
  familyName?: string,
  givenName?: string,
  fullName?: string,
  email: string
}

export async function saveTokenToDatabase(token: string) {
  // Assume user is already signed in
  const userId = firebase.auth().currentUser?.uid

  // Add the token to the users datastore
  await firestore()
    .collection('users')
    .doc(userId)
    .update({
      tokens: firestore.FieldValue.arrayUnion(token)
    })
    .catch((error: string) => {
      console.log('Error updating device token: ', error)
    })
}

export async function requestUserPermission() {
  
  const authStatus = await messaging().requestPermission();
  // const enabled =
  // authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL;

  if (authStatus) {
    // get the device token
    messaging()
    .getToken()
    .then((token: string) => {
      return saveTokenToDatabase(token)
    })
    .catch((error: string) => {
      console.log('Error writing token to the database: ', error)
    })
  }
  else {
    console.log(authStatus)
  }
}


interface userResponseType {
    fullName?: string,
    familyName?: string,
    givenName?: string,
    name?: string,
    email: string
}

const LogIn: LogInComponentType = ({
  componentId
}): JSX.Element => {

  const colorScheme = useColorScheme();
  const theme = themes[colorScheme];
  const [email, setUserEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);
  const loggedIn = useSelector((state: RootState ) => state.item.loggedIn);
  const dispatch = useDispatch();


  const onPasswordIconPress = (): void => {
    setPasswordVisible(!passwordVisible);
  };


  function createNewUser(user: UserType, signInMethod: string) {
    return dispatch => {
      console.log(user)
      const userId = firebase.auth().currentUser?.uid;

      return firestore()
        .collection('users')
        .doc(userId)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            const user_name =  signInMethod === 'Facebook' 
            ? user.name 
            : ( signInMethod === 'Google' 
                ? user.familyName + ' ' + user.givenName 
                : user.fullName);
        
            const user_email = user.email;
            
            dispatch(setName(user_name))
            dispatch(setEmail(user_email))
        
            setTimeout(() => { Navigation.showModal({
              stack: {
                children: [
                  {
                    component: {
                      name: REGISTRATION,
                      id: 'registration',
                      passProps: {
                        userId: userId
                      },
                    }
                  }
                ]
              }
            })
            }, 50)

          } else {
              console.log('User already existed.');
              requestUserPermission()
              setMainRoot();
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  async function onAppleButtonPress() {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
    })
  
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
                //setMainRoot();
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
                  console.log('signing user');
                  dispatch(createNewUser(user, 'Google'));
                  //setMainRoot();
                })
                .catch(err => {
                  console.log(err);
                }) 
  }

  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  
    if (result.isCancelled) {
      console.log('User cancelled the login process');
    }
  
    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
  
    if (!data) {
      console.log('Something went wrong obtaining access token');
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
        setMainRoot();
        dispatch(setLoggedIn(true));
      })
      .catch(e => {
        Alert.alert(e);
      })
  }

  useEffect(() => {
    firebase
      .auth().onAuthStateChanged((user) => {
        //user ? navigation.navigate('Main') : null 
      })
  })

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={styles.container}
          >
          <View style={styles.headerContainer}>
            {/* <Text
              category='h1'
              status='primary'>
              Hello
            </Text> */}
            <View style={styles.avatar} >
              <Image
                style={{height: 80, width: 80}}
                source={require('./assets/Icon-1024.png')}/>              
            </View>
          </View>
          <View style={styles.socialAuthContainer}>
              <View style={{display: 'flex'}}>
                <TouchableOpacity 
                  style={styles.GoogleButton}
                  onPress={() => {
                    onGoogleButtonPress()
                  }}                
                >
                  <FontAwesome5 color={'#ffffff'} name={'google'} size={16} brand />
                  <Text style={styles.socialSignInText}>Sign In With Google</Text>
                </TouchableOpacity>                
              </View>
              <View>
                <TouchableOpacity
                  style={styles.FaceBookButton}
                  onPress={() => 
                    onFacebookButtonPress()
                      .then(() => {
                        //Create response callback.
                      // Create a graph request asking for user information with a callback to handle the response.
                      const infoRequest = new GraphRequest(
                        '/me?fields=name,email',
                        null,
                        (error, result: userResponseType) => {
                          if (error) {
                            console.log('Error fetching data: ' + error.toString());
                          } else {
                            dispatch(createNewUser(result, 'Facebook'))
                            //setMainRoot();
                          }
                        },
                      );
                      // Start the graph request.
                      new GraphRequestManager().addRequest(infoRequest).start();
                      }).catch((error) => {
                        console.log(error);
                      })
                  }                  
                >
                  <FontAwesome5 color={'#ffffff'} name={'facebook'} size={16} brand />
                  <Text style={styles.socialSignInText}>Sign In With Facebook</Text>
                </TouchableOpacity>                
              </View>
              <View>
                <TouchableOpacity
                  style={[styles.AppleButton, {backgroundColor: theme.LabelColor}]}
                  onPress={() => onAppleButtonPress()}
                >
                  <FontAwesome5 color={theme.SystemBackgroundColor} name={'apple'} size={16} brand />
                  <Text style={[styles.socialSignInText, {color: theme.SystemBackgroundColor}]}>Sign In With Apple</Text>
                </TouchableOpacity>  
            </View>
          </View>         
          <View style={styles.formContainer}>
            <View>
              <Text style={{color: theme.LabelColor, textAlign: 'center', marginTop: 10, marginBottom: 10}}>
                - Or -
              </Text>
              <Text style={{color: theme.LabelColor, textAlign: 'center', marginBottom: 15}}>
                SIGN IN WITH EMAIL
              </Text>
            </View> 
            <TextInput
              style={[styles.textInput, 
                { color: theme.SecondaryLabelColor, 
                  backgroundColor: theme.SecondarySystemBackgroundColor,
                  borderColor: theme.OpaqueSeparatorColor  
                }]}
              placeholder='Email'
              value={email}
              onChangeText={setUserEmail}
            />
            <TextInput
              style={[styles.textInput, 
                { color: theme.SecondaryLabelColor, 
                  backgroundColor: theme.SecondarySystemBackgroundColor,
                  borderColor: theme.OpaqueSeparatorColor  
                }]}
              placeholder='Password'
              value={password}
              secureTextEntry={!passwordVisible}
              onChangeText={setPassword}
            />
            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity>
                <Text style={[styles.forgotPasswordText, {color: theme.LabelColor}]}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={onSignInButtonPress}
                style={styles.signInButton}
              >
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>          
            </View>
            <View style={{marginTop: 20}}>
              <TouchableOpacity>
                <Text style={{color: theme.LinkColor, textAlign: 'center', fontSize: 16}}>
                  Don't Have An Account? Sign Up
                </Text>
              </TouchableOpacity>
            </View>                        
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

LogIn.options = () => ({
  topBar: {
    visible: false
  }
})

export default LogIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#ffffff'
  },
  avatar: {
    display: 'flex',
    marginTop: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  headerContainer: {
    flex: .5,
    //minHeight: 216,
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
  signInButton: {
    marginTop: 10,
    backgroundColor: '#4340de',
    alignItems: 'center',
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10
  },
  signInText: {
    color: '#ffffff',
    fontSize: 17
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  forgotPasswordButton: {
    paddingHorizontal: 0,
  },
  forgotPasswordText: {
    fontSize: 16,
    textDecorationLine: "underline",
    opacity: 0.5
  },
  signUpButton: {
    marginVertical: 12,
  },
  socialAuthContainer: {
    // alignItems adjusts the horizontal alignment
    display: 'flex',
    marginHorizontal: 8,
    textAlign: 'left'
  },
  GoogleButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: 8,
    backgroundColor: '#DB4437',
    borderRadius: 5,
    borderColor: '#fff',
    padding: 10,
  },
  FaceBookButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: 8,
    backgroundColor: '#3b5998',
    borderRadius: 5,
    borderColor: '#fff',
    padding: 10
  },
  AppleButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: 8,
    borderRadius: 5,
    borderColor: '#fff',
    padding: 10
  },
  socialSignInText: {
    color: '#ffffff', 
    marginLeft: 10, 
    flexGrow: 1,
    fontSize: 16
  },
  socialAuthHintText: {
    alignSelf: 'center',
    marginBottom: 16,
  },
});

