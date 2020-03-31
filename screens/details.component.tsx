import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { Divider, 
        Icon, 
        Layout, 
        Text, 
        TopNavigation, 
        Button,
        List,
        ListItem } from '@ui-kitten/components';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet } from 'react-native'; 

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222B45'
  },
  taskLayout: {
    flex: 1,
    justifyContent: 'center'
  },
  buttonLayout: {
    flex: 1
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    position: "absolute",
    bottom: 10,
    right: 10
  },
  navigationTitle: {
    fontSize: 20
  }
})

const PlusIcon = (style) => (
  <Icon {...style} name='plus-outline'/>
);

export const DetailsScreen = ({ navigation }) => {
  const [user, setUser] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    firebase
      .auth()
      .onAuthStateChanged(user => {
        setUser(user);
      });
    
    

    firestore()
    .collection('food_items').where('ownerId', '==', firebase.auth().currentUser.uid)
    .get()
    .then((querySnapshot) => {
      const documents = querySnapshot.docs.map(doc => doc.data());
      setData(documents);
    });

  });


  const renderItemAccessory = (style) => (
    <Button style={style}>Edit</Button>
  );
  
  const renderItemIcon = (style) => (
    <Icon {...style} name='person'/>
  );

  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${item.brand} ${item.category}`}
      description={`Expired by: ${new Date(item.expiration_date.seconds*1000).toLocaleDateString()}`}
      icon={renderItemIcon}
      accessory={renderItemAccessory}
    />
  )

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation title='Items' alignment='center' titleStyle={styles.navigationTitle}/>
      <Divider/>
      <Layout style={styles.taskLayout}>
        <List 
          data={data}
          renderItem={renderItem}
        />
      </Layout>
      <Layout style={styles.buttonLayout}>
        <Button 
          // onPress={() => navigation.navigate('camera-screen')}
          onPress={() => navigation.navigate('add-item-screen')}
          style={styles.button} icon={PlusIcon}/>
      </Layout>
    </SafeAreaView>
  );
};