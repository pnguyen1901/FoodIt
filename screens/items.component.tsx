import React, { useEffect, useState} from 'react';
import { SafeAreaView, 
        ImageStyle,
        Animated,
        Image,
        StyleSheet,
        TouchableHighlight,
        TouchableOpacity } from 'react-native';
import { Divider, 
        Icon, 
        Layout, 
        Text, 
        TopNavigation, 
        Button,
        List,
        ListItem, 
        IconElement} from '@ui-kitten/components';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack'; 
import { RootStackParamList } from '../navigations/BottomNavigation';
import nodejs from 'nodejs-mobile-react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

type ItemsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Items'
>;


type ItemProps = {
  navigation: ItemsScreenNavigationProp,
  style: React.CSSProperties,
}

const BackIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='arrow-back' />
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222B45'
  },
  taskLayout: {
    flex: 6,
    justifyContent: 'center'
  },
  button: {
    height: 60,
    width: 60,
    borderRadius: 30,
    position: "absolute",
    bottom: 10,
    right: 10,
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  navigationTitle: {
    fontSize: 20
  },
  plusIcon: {
    fontSize: 20
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  },
})

const PlusIcon = () : React.ReactElement => (
  <Icon style={{ height: 25, width: 25}} name='plus-outline'/>
);

export const Items: React.FC<ItemProps> = ({ navigation }) => {
  const [user, setUser] = useState();
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
      const documents = querySnapshot.docs.map(doc => {
        const document = doc.data();
        document.id = doc.id;
        return document;
      });
      setData(documents);
    });

  });

  const deleteItem = (documentId: string): void => {
    console.log(documentId);
    firestore()
      .collection('food_items')
      .doc(documentId)
      .delete()
      .then(() => {
        console.log('Item deleted');
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const TrashIcon = (style: ImageStyle): IconElement => (
    <Icon {...style} name='trash-2'/>
  )

  const renderItemAccessory = (props): React.ReactElement => {
    
    const { style, item } = props;
    
    return (
      <Button 
      style={style} 
      icon={TrashIcon} 
      status='danger' 
      size='small' 
      appearance='outline'
      onPress={() => deleteItem(item.id)}></Button>
    )
  };
  
  const PriceTagIcon = (style: ImageStyle): IconElement => (
    <Icon {...style} name='pricetags-outline'/>
  );

  type renderItemProps = {
    item: {
      brand: string,
      category: string,
      expiration_date: Date,
      id: string
    },
    index: number
  }

  const renderItem = ({ item, index }: renderItemProps): React.ReactElement => {
  
  const id = item.id;
  
  return (
    <ListItem
      title={`${item.brand} ${item.category}`}
      description={`Expired by: ${new Date(item.expiration_date.seconds*1000).toLocaleDateString()}`}
      // icon={PriceTagIcon}
      accessory={() => {
        
        return (
          <Button 
          icon={TrashIcon} 
          status='danger' 
          size='small' 
          appearance='outline'
          onPress={() => deleteItem(id)}></Button>
        )
      }}
      titleStyle={styles.title}
    />
  )}

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation title='ITEMS' alignment='center' titleStyle={styles.navigationTitle}/>
      <Divider/>
      <Layout style={styles.taskLayout}>
        <List 
          data={data}
          renderItem={renderItem}
        />
        <Button
          status='info' 
          onPress={() => navigation.navigate('AddItem')}
          // onPress={() => nodejs.channel.send('EXP: 04/01/2020')}
          style={styles.button} icon={PlusIcon}/>
      </Layout>
    </SafeAreaView>
  );
};