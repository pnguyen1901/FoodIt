import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { Button, Divider, Layout, TopNavigation, Input, Text } from '@ui-kitten/components';
import auth, { firebase } from '@react-native-firebase/auth';

export const HomeScreen = ({ navigation }) => {

const [initializing, setInitializing] = useState(true);
const [user, setUser] = useState();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loggedIn, setLoggedIn] = useState(false);

  const navigateDetails = () => {
    navigation.navigate('Details');
  };

  register = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(e => console.log(e))
  }

  handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => setLoggedIn(true))
      .catch(e => console.log(e))
  }

  useEffect(() => {
    firebase
      .auth().onAuthStateChanged(user => {
        setUser(user);
        setLoggedIn(true);
      })
  })

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation title='FoodIt' alignment='center'/>
      <Divider/>
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Input 
          placeholder='Email'
          value={email}
          onChangeText={setEmail} />
        <Input 
          placeholder='Password'
          value={password}
          onChangeText={setPassword} />
        { loggedIn 
        ? <Text>Welcome, {user.email}</Text>
        : <Text>Please log in</Text> }
        <Button onPress={() => handleLogin()}>Login</Button>
      </Layout>
    </SafeAreaView>
  );
};