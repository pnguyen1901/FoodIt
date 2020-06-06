import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    FlatList,
    KeyboardAvoidingView,
    Dimensions,
    Platform,
    Alert,
    Image,
    StyleSheet,
    TouchableHighlight
} from 'react-native';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Navigation } from 'react-native-navigation';
import { useNavigationSearchBarUpdate, useNavigationSearchBarCancelPress } from 'react-native-navigation-hooks';
import { useSelector, useDispatch } from 'react-redux';
import { 
    ThemeManager, 
    Colors, 
    Text,
    Drawer,
    View
} from 'react-native-ui-lib';
import { setDeleteItem, removeDeleteItem } from '../../store/actions';
import { themes } from '../../components/Theme/Theme';
import { useColorScheme } from 'react-native-appearance';
import { selectItem, turnOnSearchMode, turnOffSearchMode } from '../../store/item/actions';
import { ITEM } from '../../screens';
import { RootState } from 'src/store/rootReducer';
import nodejs from 'nodejs-mobile-react-native';
import algoliasearch from 'algoliasearch';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF' //dark mode: '#222B45'
    },
    taskLayout: {
      flex: 6,
      justifyContent: 'center'
    },
    right: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end'
    },
    more: {
      opacity: 0.65
    },
    border: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: ThemeManager.dividerColor,
    },
  })
  
const Items: ItemsComponentType = ({
    componentId,
}): JSX.Element => {

    const [user, setUser] = useState(null);
    const [data, setData] = useState([]);
    const [showRightItems, setShowRightItems] = useState(true);
    const deleteItem = useSelector((state: RootState ) => state.item.deleteItem);
    const searchMode = useSelector((state: RootState) => state.item.searchMode);
    const colorScheme = useColorScheme();
    const theme = themes[colorScheme];

    // actions
    const dispatch = useDispatch();
    
    const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);

    useEffect(() => {
        nodejs.start('main.js');
        // nodejs.channel.addListener(
        //   'message',
        //   (msg) => {
        //     console.log('From node: ' + msg);
        //   },
        //   this 
        // );
    }); 

    useEffect(() => {
        Dimensions.addEventListener('change', () => {
            getStatusBarHeight();
        });

        getStatusBarHeight();
    }, [componentId]);

    // useNavigationButtonPress(({ buttonId, componentId }) => {
    //     if (buttonId === 'add_button_id') {
    //       showAddItem();
    //     }
    // }, componentId);

    const getStatusBarHeight = async () => {
        const navConstants = await Navigation.constants();

        // for more info - https://stackoverflow.com/a/48759750
        if (Platform.OS === 'ios') {
            setKeyboardVerticalOffset(navConstants.statusBarHeight + navConstants.topBarHeight);
        }
    };


    let foodItemsRef = firestore().collection('food_items');
  
    useEffect(() => {
      if (!searchMode){
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
        }
      }, [user, data])

    var client = algoliasearch("9137RQMA6A", "872fee6350a0f2b3009728b5172008b3");
    var index = client.initIndex('food_items_dev');

    useNavigationSearchBarUpdate((event) => {
      
      // only turn on search mode if text is not null and current search mode is false
      // additional logic to prevent search mode being turn backed on after hitting cancel button.  
      !searchMode && event.text !== '' ? dispatch(turnOnSearchMode()) : null
      return index
      .search(event.text)
      .then(function(responses) {
        
        // Response from Algolia:
        // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
        if(responses.hits){
          responses.hits.forEach((hit) => {
            return hit.id = hit.objectID
          })
          console.log(responses.hits);
          setData(responses.hits);
        }
      });
      }, componentId)

    useNavigationSearchBarCancelPress((event) => {
      dispatch(turnOffSearchMode())
    })


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
    
    const onItemPressed = (row: object) => {
      dispatch(selectItem(row));
      Navigation.push(componentId, {
        component: {
          name: ITEM,
        }
      })
    }

    const ITEMS = {
      delete: {icon: require('../../assets/icons/delete.png'), 
              text: 'Delete', 
              background: Colors.red30,
              onPress: () => handleDeleteItem(deleteItem)
            },
      edit: {icon: require('../../assets/icons/25/compose.png'), 
        text: 'Edit', 
        background: Colors.blue30,
        onPress: () => onItemPressed
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


    const renderRow = (row: {
      id: string,
      brand: string,
      category: string,
      alert: {
        value: number,
        text: string
      },
      expiration_date: {
        _seconds: number
      }
    }, index: number) => {
  
      const expDate = new Date(row.expiration_date._seconds*1000)
      const cutoffDate = new Date(expDate.setDate(expDate.getDate() - row.alert.value))

      return (
          <Drawer key={index}
          {...drawerProps} 
          onSwipeableRightOpen={() => dispatch(setDeleteItem(row.id))}
          onSwipeableClose={() => dispatch(removeDeleteItem())}>
            <TouchableHighlight
              onPress={() => onItemPressed(row)}
              >
            <View 
              paddingH-20 
              paddingV-10
              marginL-30 
              row centerV 
              style={{borderBottomWidth: 1, 
                borderColor: theme.OpaqueSeparatorColor, 
                backgroundColor: theme.SystemBackgroundColor}}>
              <View >
                <Text text65 style={{color: theme.LabelColor}}>{row.brand + ' ' + row.category}</Text>
                <Text 
                  text80 
                  marginT-2 
                  style={[ cutoffDate >= new Date() ? {color: theme.LabelColor} : {color: 'red'}]}>
                  Expired by: {new Date(row.expiration_date._seconds*1000).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.right}>
                <Image source={require('../../assets/icons/16/cell-chevron.png')} style={styles.more}/>
              </View>
            </View>
            </TouchableHighlight>
          </Drawer>
      );
    }


    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.SystemBackgroundColor}]}>
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
        searchBar: true,
        searchBarHiddenWhenScrolling: false,
        searchBarPlaceholder: 'Search'
    }
});

export default Items;