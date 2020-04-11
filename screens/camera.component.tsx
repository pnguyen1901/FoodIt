import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet,
         Text,
         SafeAreaView,
         View,
         TouchableOpacity,
         Alert,
         Dimensions,
         Image
        } from 'react-native';
import ImageEditor from "@react-native-community/image-editor";
import Spinner from 'react-native-loading-spinner-overlay';
import { RNCamera } from 'react-native-camera';
import { createItem, loading, loadingDone } from '../store/actions';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigations/BottomNavigation';
import nodejs from 'nodejs-mobile-react-native';
import vision from '@react-native-firebase/ml-vision';

type CameraScreenNavigationProp = StackNavigationProp<
        RootStackParamList,
        'Camera'
>;

type CameraProps = {
    navigation: CameraScreenNavigationProp,
}


export const Camera: React.FC<CameraProps> = ({ navigation }) => {

    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.itemReducer.isLoading);
    const [ratio, setRatio] = useState('16:9');
    const [type, setType] = useState('back');
    const [flash, setFlash] = useState('off');
    const [autoFocus, setAutoFocus] = useState('on');
    const [zoom, setZoom] = useState(0);
    const [depth, setDepth] = useState(0);
    const [canDetectText, setCanDetectText] = useState(false);
    const [textBlocks, setTextBlocks] = useState([]);
    let { width } = Dimensions.get('window');
    const maskLength = (width * 90)/100;

    useEffect(() => {
        nodejs.channel.addListener('message', 
            (msg) => {
                if (msg === null) {
                    dispatch(loadingDone());
                    setTimeout(() => {
                      Alert.alert('Please try again!');  
                    }, 100);
                } else {
                    console.log(msg);
                    dispatch(loadingDone());
                    dispatch(createItem(msg));
                    navigation.navigate('AddItem'); 
                }
            },
        )
    })


    async function processDocument (localPath: string) {
        const processed = await vision().textRecognizerProcessImage(localPath);

        return processed.text;
    }

    const takePicture = async function() {
        if (camera) {
          const data = await camera.takePictureAsync({fixOrientation: true, forceUpOrientation: true});
          console.log('takePicture ', data);
          dispatch(loading());
          nodejs.channel.send(data.uri.replace(/^file:\/\//g,''));

        //   ImageEditor.cropImage(
        //       data.uri,
        //       {
        //         offset:{},
        //         size: {} 
        //       }).then((url:string) => {
        //         nodejs.channel.send(url.replace(/^file:\/\//g,''));
        //       })
        //       .catch((err:string) => {
        //           console.log(err);
        //       })

          
        //   processDocument(data.uri.replace(/^file:\/\//g, ''))
        //     .then((result) => {
        //         nodejs.channel.send(result);
        //     }).catch(err => console.log(err));
        }
      };
    
    const  textRecognized = (object: {textBlocks: []}): void => {
    const { textBlocks } = object;
        setTextBlocks(textBlocks);
    };

    const toggleFocus = (): void => {
        setAutoFocus(
          autoFocus === 'on' ? 'off' : 'on',
        );
      };
    
    const zoomOut = (): void => {
        setZoom(
            zoom - 0.1 < 0 ? 0 : zoom - 0.1,
        );
    }

    const zoomIn = (): void => {
        setZoom(
            zoom + 0.1 > 1 ? 1 : zoom + 0.1,
        );
    }


    const renderTextBlocks = (): React.ReactElement => (
        <View style={styles.facesContainer} pointerEvents="none">
          {textBlocks.map(renderTextBlock)}
        </View>
      );

    const renderTextBlock = ({ bounds, value }) => {

        nodejs.channel.send(value);
        // Open the add new item modal and prepopulate the expiration date when the camera recognizes a valid expiration date. 
        // if(value.includes('EXP')) {
        //     const regex = /EXP.(.*)/;
        //     const datevalue = regex.exec(value)[1].trim();
        //     dispatch(createItem(datevalue));
        //     navigation.navigate('AddItem'); 
        // }
        // Display blocks of text on the camera screen
        return (
            <React.Fragment key={value + bounds.origin.x}>
                <Text style={[styles.textBlock, { left: bounds.origin.x, top: bounds.origin.y }]}>
                {value}
                </Text>
                <View
                style={[
                    styles.text,
                    {
                    ...bounds.size,
                    left: bounds.origin.x,
                    top: bounds.origin.y,
                    },
                ]}
                />
            </React.Fragment>
    )};
    
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
            <View style={{height: 200, width:400}}>

            </View>
            <RNCamera
            ref={ref => {
            camera = ref;
            }}
            style={{
            flex: 1,
            }}
            type={type}
            flashMode={flash}
            autoFocus={autoFocus}
            zoom={zoom}
            ratio={ratio}
            focusDepth={depth}
            trackingEnabled
            onTextRecognized={canDetectText ? textRecognized : null}
            captureAudio={false}
        >
            <View style={styles.overlay} />
                <View style={styles.snapText}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
                        PLACE IMAGE INSIDE THE FRAME
                    </Text>
                </View>
                <View style={[styles.contentRow, { height: 200 }]}>
                    <View style={styles.overlay} />
                    <View
                        style={[
                        styles.content,
                        { width: maskLength, height: 200 }
                        ]}
                    />
                    <View style={styles.overlay} />
                </View>
            <View
            style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                alignSelf: 'center',
            }}
            >
            {/* { isLoading ? <Spinner size='giant'/> : null } */}
            <Spinner
            visible={isLoading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
            />
            <TouchableOpacity
                style={[styles.flipButton, styles.picButton, { flex: 0.3, alignSelf: 'flex-end' }]}
                onPress={() => takePicture()}
            >
                <Text style={styles.flipText}> SNAP </Text>
            </TouchableOpacity>
            </View>
            <View style={styles.overlay} />
            {!!canDetectText && renderTextBlocks()}
        </RNCamera>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 10,
      backgroundColor: '#000',
    },
    flipButton: {
      flex: 0.3,
      height: 60,
      width: 60,
      marginHorizontal: 2,
      marginBottom: 50,
      marginTop: 10,
      borderRadius: 30,
      borderColor: 'white',
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    flipText: {
      color: 'black',
      fontSize: 15,
    },
    snapText: {
        alignItems: "center",
        fontSize: 15
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    zoomText: {
      position: 'absolute',
      bottom: 70,
      zIndex: 2,
      left: 2,
    },
    facesContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
    },
    picButton: {
      backgroundColor: 'white',
    },
    text: {
      padding: 10,
      borderWidth: 2,
      borderRadius: 2,
      position: 'absolute',
      borderColor: '#F00',
      justifyContent: 'center',
    },
    textBlock: {
      color: '#F00',
      position: 'absolute',
      textAlign: 'center',
      backgroundColor: 'transparent',
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    content: {
        borderWidth: 3,
        borderColor: "#00FF00"
    },
    contentRow: {
        flexDirection: "row"
    },
  });