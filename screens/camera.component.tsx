import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet,
         Text,
         SafeAreaView,
         View,
         TouchableOpacity,
         Alert,
        } from 'react-native';
import Slider from '@react-native-community/slider';
import { RNCamera } from 'react-native-camera';
import { createItem } from '../store/actions';
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
    const [ratio, setRatio] = useState('16:9');
    const [type, setType] = useState('back');
    const [flash, setFlash] = useState('off');
    const [autoFocus, setAutoFocus] = useState('on');
    const [zoom, setZoom] = useState(0);
    const [depth, setDepth] = useState(0);
    const [canDetectText, setCanDetectText] = useState(false);
    const [textBlocks, setTextBlocks] = useState([]);

    useEffect(() => {
        nodejs.channel.addListener('message', 
            (msg) => {
                if (msg.includes('Error:')) {
                    Alert.alert(msg); 
                } else {
                    console.log(msg);
                    dispatch(createItem(msg));
                    navigation.navigate('AddItem'); 
                }

            },
            this
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
        //   nodejs.channel.send(data.uri.replace(/^file:\/\//g,''));
          processDocument(data.uri.replace(/^file:\/\//g, ''))
            .then((result) => {
                nodejs.channel.send(result);
            }).catch(err => console.log(err));
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
            <View
            style={{
                flex: 0.5,
            }}
            >
            <View
                style={{
                backgroundColor: 'transparent',
                flexDirection: 'row',
                justifyContent: 'space-around',
                }}
            >
                <TouchableOpacity onPress={() => setCanDetectText(!canDetectText)} style={styles.flipButton}>
                <Text style={styles.flipText}>
                    {!canDetectText ? 'Detect Text' : 'Detecting Text'}
                </Text>
                </TouchableOpacity>
            </View>
            </View>
            <View
            style={{
                flex: 0.4,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                alignSelf: 'flex-end',
            }}
            >
            {/* <Slider
                style={{ width: 150, marginTop: 15, alignSelf: 'flex-end' }}
                onValueChange={() => setFocusDepth()}
                step={0.1}
                disabled={autoFocus === 'on'}
            /> */}
            </View>
            {zoom !== 0 && (
            <Text style={[styles.flipText, styles.zoomText]}>Zoom: {zoom}</Text>
            )}
            <View
            style={{
                flex: 0.1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                alignSelf: 'flex-end',
            }}
            >
            <TouchableOpacity
                style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
                onPress={() => zoomIn()}
            >
                <Text style={styles.flipText}> + </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
                onPress={() => zoomOut()}
            >
                <Text style={styles.flipText}> - </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.flipButton, { flex: 0.25, alignSelf: 'flex-end' }]}
                onPress={() => toggleFocus()}
            >
                <Text style={styles.flipText}> AF : {autoFocus} </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.flipButton, styles.picButton, { flex: 0.3, alignSelf: 'flex-end' }]}
                onPress={() => takePicture()}
            >
                <Text style={styles.flipText}> SNAP </Text>
            </TouchableOpacity>
            </View>
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
      height: 40,
      marginHorizontal: 2,
      marginBottom: 10,
      marginTop: 10,
      borderRadius: 8,
      borderColor: 'white',
      borderWidth: 1,
      padding: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    flipText: {
      color: 'white',
      fontSize: 15,
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
      backgroundColor: 'darkseagreen',
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
  });