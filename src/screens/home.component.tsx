import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Button, Divider, Layout, TopNavigation, Input, Text } from '@ui-kitten/components';
import { firebase } from '@react-native-firebase/auth';

const styles = StyleSheet.create({
  navigationTitle: {
    fontSize: 20
  }
})

export const Home = ({ navigation }) => {

const [user, setUser] = useState(null);
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loggedIn, setLoggedIn] = useState(false);

  const navigateDetails = () => {
    navigation.navigate('Details');
  };

  const register = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(e => console.log(e))
  }

  const handleLogin = () => {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#222B45' }}>
      <TopNavigation title='FoodIt' alignment='center' titleStyle={styles.navigationTitle}/>
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