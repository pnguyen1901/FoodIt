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

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' />
);

const data = new Array(4).fill({
  title: 'Title for Item',
  description: 'Description for item'
})

export const DetailsScreen = ({ navigation }) => {
  const [user, setUser] = useState('');

  useEffect(() => {
    firebase
      .auth()
      .onAuthStateChanged(user => {
        setUser(user);
      })
  });

  const renderItemAccessory = (style) => (
    <Button onPress={() => navigation.navigate('item-screen')}  style={style}>EDIT</Button>
  );
  
  const renderItemIcon = (style) => (
    <Icon {...style} name='person'/>
  );

  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${item.title} ${index + 1}`}
      description={`${item.description} ${index + 1}`}
      icon={renderItemIcon}
      accessory={renderItemAccessory}
    />
  )

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation title='MyApp' alignment='center'/>
      <Divider/>
      <Layout style={{flex:1 ,justifyContent: 'center'}}>
        <List 
          data={data}
          renderItem={renderItem}
        />
        <Text>{user.email}</Text>
      </Layout>
    </SafeAreaView>
  );
};