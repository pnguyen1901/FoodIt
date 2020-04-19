import React, { useCallback, useEffect, useState } from 'react';
import {
    SafeAreaView,
    FlatList,
    KeyboardAvoidingView,
    Dimensions,
    Platform,
    Alert,
    ImageStyle,
    StyleSheet
} from 'react-native';
import { Divider, 
    Icon, 
    Layout, 
    Text, 
    Button,
    List,
    ListItem, 
    IconElement
} from '@ui-kitten/components';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Navigation } from 'react-native-navigation';
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import { useSelector, useDispatch } from 'react-redux';


const BackIcon = (style: ImageStyle): IconElement => (
    <Icon {...style} name='arrow-back' />
  );
  
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF' //dark mode: '#222B45'
    },
    taskLayout: {
      flex: 6,
      justifyContent: 'center'
    },
    addButton: {
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
    topNavIcon: {
  
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold'
    },
  })
  
  const PlusIcon = () : React.ReactElement => (
    <Icon style={{ height: 25, width: 25}} name='plus-outline'/>
  );
  
  const MenuIcon = (style) : React.ReactElement => (
    <Icon {...style} name='more-horizontal'/>
  );
  
  const UserIcon = (style) : React.ReactElement => (
    <Icon {...style} name='person' />
  );
  
  const LogoutIcon = (style) => (
    <Icon {...style} name='log-out'/>
  );
  
  const ShareIcon = (style) => (
    <Icon {...style} name='share'/>
  )



const Items: ItemComponentType = ({
    componentId,
}): JSX.Element => {
    const [user, setUser] = useState(null);
    const [data, setData] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const dispatch = useDispatch();
  
    const toggleMenu = () => {
      setMenuVisible(!menuVisible);
    }
    
    const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);

    // equivalent to componentDidMount
    // see - https://stackoverflow.com/questions/53945763/componentdidmount-equivalent-on-a-react-function-hooks-component
    // and - https://stackoverflow.com/questions/53120972/how-to-call-loading-function-with-react-useeffect-only-once
    useEffect(() => {
        Dimensions.addEventListener('change', () => {
            getStatusBarHeight();
        });

        getStatusBarHeight();

        // equivalent to componentWillUnmount
        // return () => {};
    }, [componentId]);

    useNavigationButtonPress(({ buttonId, componentId }) => {
        if (buttonId === 'add_button_id') {
          showAddItem();
        }
    }, componentId);

    const getStatusBarHeight = async () => {
        const navConstants = await Navigation.constants();

        // for more info - https://stackoverflow.com/a/48759750
        if (Platform.OS === 'ios') {
            setKeyboardVerticalOffset(navConstants.statusBarHeight + navConstants.topBarHeight);
        }
    };


    let foodItemsRef = firestore().collection('food_items');
  
    useEffect(() => {
      const unsubscribe = firebase.auth()
                .onAuthStateChanged((user) => {
                  setUser(user);
                  if (user) {
                    foodItemsRef.where('ownerId', 'array-contains', firebase.auth().currentUser.uid).orderBy('expiration_date', "asc")
                    .get()
                    .then((querySnapshot) => {
                      const documents = querySnapshot.docs.map(doc => {
                        const document = doc.data();
                        document.id = doc.id;
                        return document;
                      });
                      setData(documents);
                    }).catch(err => {
                      console.log(err);
                  })
                }
            })
      unsubscribe();
      }, [user])
  
    const SignOut = () : void => {
      firebase.auth().signOut().then(() => {
        // dispatch(setLoggedIn(false));
        
      }).catch((err) => {
        Alert.alert(err);
      })
    }
    
    const showAddItem = () => {
        Navigation.showModal({
            stack: {
              children: [
                {
                  component: {
                    name: 'addItem',
                    id: 'addItem',
                    options: {
                      topBar: {
                        title: {
                          text: 'New Item'
                        },
                        leftButtons: [
                          {
                            id: 'cancel_add_item_button_id',
                            text: 'Cancel'
                          }
                        ],
                        rightButtons: [
                          {
                            id: 'save_item_button_id',
                            text: 'Add'
                          }
                        ]
                      },
                    }
                  }
                }
              ]
            }
          });
    }

    const shareItem = (user_id: string) => {
      foodItemsRef.where('ownerId', 'array-contains', firebase.auth().currentUser.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(doc => {
            foodItemsRef.doc(doc.id).update({
              ownerId: firebase.firestore.FieldValue.arrayUnion(user_id)
            }).then(res => {
              console.log()
            }).catch(err => {
              Alert.alert(err);
            })
          })
        })
        .catch(err => {
          console.log(err);
        })
    }
  
    const deleteItem = (documentId: string): void => {
      console.log(documentId);
      foodItemsRef
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
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled
                keyboardVerticalOffset={keyboardVerticalOffset}
            >
                <Layout style={styles.taskLayout}>
                <List 
                    data={data}
                    renderItem={renderItem}
                />
                {/* <Button
                    status='info' 
                    onPress={() => shareItem('m4MjlNjHMbMj6xOdgVjq8lf80l62')}
                    // onPress={() => nodejs.channel.send('EXP: 04/01/2020')}
                    style={styles.button} icon={ShareIcon}/> */}
                </Layout>
            </KeyboardAvoidingView>
      </SafeAreaView>
    );
};

Items.options = () => ({
    topBar: {
        visible: true,
        title: {
            text: 'Items',
        },
        largeTitle: {
          visible: true
        },
        rightButtons: [{
            id: 'add_button_id',
            systemItem: 'add'
        }],
    },
});

export default Items;