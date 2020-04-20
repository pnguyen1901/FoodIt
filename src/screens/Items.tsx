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
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Navigation } from 'react-native-navigation';
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import { useSelector, useDispatch } from 'react-redux';
import {AnimatableManager, 
    ThemeManager, 
    Colors, 
    BorderRadiuses, 
    ListItem, 
    Text,
    Drawer,
    View
} from 'react-native-ui-lib';
import * as Animatable from 'react-native-animatable';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { setDeleteItem } from '../store/actions';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF' //dark mode: '#222B45'
    },
    taskLayout: {
      flex: 6,
      justifyContent: 'center'
    },
    image: {
      width: 54,
      height: 54,
      borderRadius: BorderRadiuses.br20,
      marginHorizontal: 14,
    },
    border: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: ThemeManager.dividerColor,
    },
  })
  

const Items: ItemComponentType = ({
    componentId,
}): JSX.Element => {
    const [user, setUser] = useState(null);
    const [data, setData] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const [showRightItems, setShowRightItems] = useState(true);
    const dispatch = useDispatch();
    const deleteItem = useSelector(state => state.itemReducer.deleteItem);
  
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
  
    const handleDeleteItem = (documentId: string): void => {
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
    
    const ITEMS = {
      delete: {icon: require('../assets/icons/delete.png'), 
              text: 'Delete', 
              background: Colors.red30,
              onPress: () => handleDeleteItem(deleteItem)
            }
    }

    const keyExtractor = item => item.id;

    const drawerProps = {
      bounciness: 5,
      itemsIconSize: 20
    };

    if (showRightItems) {
      drawerProps.rightItems = [ITEMS.delete];
    }


    const renderRow = (row: object, id: number) => {
  
      return (
        <Drawer key={id}
        {...drawerProps} 
        onSwipeableRightOpen={() => dispatch(setDeleteItem(row.id))}>
          <View bg-grey80 paddingH-20 paddingV-10 row centerV style={{borderBottomWidth: 1, borderColor: Colors.grey60}}>
            <View marginL-20>
              <Text text65>{row.brand + ' ' + row.category}</Text>
              <Text text80 marginT-2>
                Expired by: {new Date(row.expiration_date.seconds*1000).toLocaleDateString()}
              </Text>
            </View>
          </View> 
        </Drawer>  
      );
    }


    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled
                keyboardVerticalOffset={keyboardVerticalOffset}
            >
                <FlatList
                  data={data}
                  renderItem={({item, index}) => renderRow(item, index)}
                  keyExtractor={keyExtractor}
                />
                {/* <Button
                    status='info' 
                    onPress={() => shareItem('m4MjlNjHMbMj6xOdgVjq8lf80l62')}
                    // onPress={() => nodejs.channel.send('EXP: 04/01/2020')}
                    style={styles.button} icon={ShareIcon}/> */}
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
        searchBar: true,
        searchBarHiddenWhenScrolling: false,
    },
});

export default Items;