import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet,
        Text,
        SafeAreaView,
        View,
        TouchableOpacity,
        Alert,
        Dimensions,
        Image,
        Animated,
        TouchableOpacityBase
        } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { RNCamera } from 'react-native-camera';
import { loading, loadingDone } from '../../store/camera/actions';
import { setBrand, setCategory, setExpDate, resetForm } from '../../store/item/actions';
import nodejs from 'nodejs-mobile-react-native';
import vision from '@react-native-firebase/ml-vision';
import { RootState } from '../../store/rootReducer';
import { Navigation } from 'react-native-navigation';
require('datejs'); 
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import ImageEditor from "@react-native-community/image-editor";
import { themes } from '../../components/Theme/Theme';
import { useColorScheme } from 'react-native-appearance';
import { Dialog } from 'react-native-ui-lib';
import Voice from '@react-native-community/voice';
import LottieView from "lottie-react-native";


const Camera: CameraComponentType = ({ 
    componentId,
}): JSX.Element => {

    const animation = useRef(new Animated.Value(0)).current;
    const { brand, category } = useSelector((state: RootState) => state.item);
    const dispatch = useDispatch();
    const isLoading = useSelector((state :RootState) => state.camera.isLoading);
    const colorScheme = useColorScheme();
    const theme = themes[colorScheme];
    const [ratio, setRatio] = useState('16:9');
    const [type, setType] = useState('back');
    const [flash, setFlash] = useState('off');
    const [autoFocus, setAutoFocus] = useState('on');
    const [zoom, setZoom] = useState(0);
    const [depth, setDepth] = useState(0);
    const [canDetectText, setCanDetectText] = useState(false);
    const [textBlocks, setTextBlocks] = useState([]);
    const [speech, setSpeech] = useState([]);
    let { width } = Dimensions.get('window');
    const maskLength = (width * 90)/100;



    useNavigationButtonPress(({ buttonId, componentId }) => {
        if (buttonId === 'cancel_camera_button_id') {
            Navigation.pop(componentId)
        }
    });

    // use mergeOptions to dynamically set bottomTabs color
    useEffect(() => {
        Navigation.mergeOptions(componentId, {
            bottomTabs: {
            backgroundColor: theme.SecondarySystemBackgroundColor
        }
        });
    })

    const openAddItemModal = () => {
        Navigation.showModal({
            stack: {
            children: [
                {
                component: {
                    name: 'addItem',
                    id: 'addItem',
                    // passProps: {
                    //     expiration_date: new Date (Date.parse(msg))
                    // },
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

    
    useEffect(() => {
        nodejs.channel.addListener('message', 
            (msg) => {
                if (msg === null) {
                    dispatch(loadingDone());
                    setTimeout(() => {
                        Alert.alert('Scanning new item', 'Encountered an issue', [
                            {
                                text: 'Manual Typing',
                                style: 'default',
                                onPress: () => openAddItemModal()
                            },                            
                            {
                                text: 'Try again',
                                style: "cancel"
                            }
                        ]);  
                    }, 100);
                } else {
                    console.log('echo message: ' + msg);
                    dispatch(loadingDone());
                    dispatch(resetForm())
                    dispatch(setExpDate(new Date (Date.parse(msg))))
                    setTimeout(() => {
                        openAddItemModal()
                    }, 500)

                }
            },
        )
    }, [])


    async function processDocument (localPath: string) {
        const processed = await vision().textRecognizerProcessImage(localPath);

        return processed.text;
    }

    const takePicture = async function() {
            if (camera) {
            const data = await camera.takePictureAsync({fixOrientation: true, forceUpOrientation: true});
            console.log('takePicture ', data);
            //CameraRoll.save(data.uri, {type: 'photo'})
            dispatch(loading());
            //nodejs.channel.send(data.uri.replace(/^file:\/\//g,''));
            Image.getSize(data.uri, (w, h) => {
                ImageEditor.cropImage(
                    data.uri,
                    {
                    offset:{      
                        x: 0,
                        y: h / 2 - w / 2
                    },
                    size: {width: w, height: h/3} 
                    }).then((uri:string) => {
                        //CameraRoll.save(uri, {type: 'photo'})
                        processDocument(uri.replace(/^file:\/\//g, ''))
                        .then((result) => {
                            console.log(result)
                            nodejs.channel.send(result);
                        }).catch(err => console.log(err));
                    })
                    .catch((err:string) => {
                        console.log(err);
                    })
            }, error => {
                console.log(error)
            })

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

    const onStartButtonPress = async () => {
        try {
            await Voice.start('en-US');
        } catch (e) {
            console.log(e)
        }
    }

    const onStopButtonPress = async () => {
        try {
            await Voice.stop()
        } catch (e) {
            console.log(e)
        }
    }

    const previousResults = useRef('');

    Voice.onSpeechResults = async (e) => {
        console.log(e)
        // Stop the voice recognizer if user stopped speaking
        if (previousResults.current === e.value[0]) {
            try {
                setTimeout(async () => await Voice.stop(), 1000)
                console.log('speech recognizer stopped')
            } catch (e) {
                console.log(e)
            }
        } else {
            previousResults.current = e.value[0]
            dispatch(setBrand(e.value[0]))
        }
    }

    const rippleStart = () => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 10000,
            useNativeDriver: true,
        }).start()
        //setAutoPlay(true)
    }

    const rippleStop = () => {
        Animated.timing(animation, {
            toValue: 0,
            useNativeDriver: true
        }).start()
    }

    const renderVoiceAnimation = () => {
        return (
        <TouchableOpacity
            onPress={() => onStartButtonPress()}
        >
            <LottieView 
            source={require('../../assets/animation/voice-lottie.json')}
            //progress={animation}
            loop={true}
            autoPlay={true}
            style={{width: 100, height: 100}}
            />
        </TouchableOpacity>
        )
    }
    
    
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
            <View style={styles.overlay} />
                <View style={styles.snapText}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
                        PLACE EXP LABEL INSIDE THE FRAME
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
        <Dialog
            migrate
            useSafeArea
            //key={this.getDialogKey(height)}
            panDirection={"up"}
            containerStyle={[styles.roundedDialog, {backgroundColor: theme.SecondarySystemBackgroundColor}]}
            visible={true}
            //onDismiss={this.hideDialog}
            //renderPannableHeader={renderPannableHeader}
            //pannableHeaderProps={this.pannableTitle}
            //supportedOrientations={this.supportedOrientations}
        >
            <View style={{alignItems: "center", justifyContent: 'center'}}>
                <View style={{marginBottom: 10, marginTop: 10}}>
                { brand === ''
                ? <Text style={{color: theme.LabelColor, fontSize: 20}}>What is the brand of this item?</Text>
                : <Text style={{color: theme.LabelColor, fontSize: 20}}>What is the category of this item?</Text>
                }

                {/* <TouchableOpacity
                    onPress={() => rippleStart()}
                >
                    <Text style={{color: theme.LabelColor, fontSize: 20}}>Recording Start</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity
                    onPress={() => onStopButtonPress()}
                >
                    
                    <Text style={{color: theme.LabelColor, fontSize: 20}}>Recording End</Text>
                </TouchableOpacity> */}
                </View>
                {renderVoiceAnimation()}
            </View>

        </Dialog>
        {/* <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            }}
        >
            <View style={[styles.centeredView, {backgroundColor: theme.SystemBackgroundColor} ]}>
            <View style={[styles.modalView, {backgroundColor: theme.SecondarySystemBackgroundColor}]}>
                <Text style={[styles.modalText, {color: theme.LabelColor}]}>What is the brand of the item?</Text>

                <TouchableOpacity
                style={{ ...styles.openButton, backgroundColor: theme.Blue }}
                onPress={() => {
                    onStartButtonPress()
                }}
                >
                <Text style={[styles.textStyle, {color: theme.LabelColor}]}>Start Speaking</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={{ ...styles.openButton, backgroundColor: theme.Blue }}
                onPress={() => {
                    onStopButtonPress()
                }}
                >
                <Text style={[styles.textStyle, {color: theme.LabelColor}]}>Stop Speaking</Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal> */}
    </SafeAreaView>
    )
}


Camera.options = () => ({
    topBar: {
        visible: true,
    },
    bottomTabs: {
        visible: true
    }
})

export default Camera;


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
        //backgroundColor: "rgba(0,0,0,0.5)"
    },
    content: {
        borderWidth: 3,
        borderColor: "#00FF00"
    },
    contentRow: {
        flexDirection: "row",
        marginTop: 16
    },
    roundedDialog: {
        marginBottom: 30,
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    textStyle: {
        fontWeight: "bold",
        textAlign: "center"
    },
    openButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
});