import React, { useState, } from 'react';
import { View, Text, TouchableHighlight, Image, TextInput} from 'react-native';
import styles from './CellStyles';
import { useColorScheme } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';
import { useDispatch } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { setPasswordVisibilty } from '../../store/user/actions';
import { GestureHandlerGestureEvent, GestureHandlerProperties } from 'react-native-gesture-handler';

interface Props {
    id?: any;
    key?: string;
    index?: number;

    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    value?: React.ReactNode;
    left?: React.ReactNode;
    right?: React.ReactNode;

    bordered?: boolean;
    more?: boolean;
    selected?: boolean;

    onPress?: (GestureResponderEvent: GestureHandlerGestureEvent, Props: GestureHandlerProperties) => void;
    onPressIn?: (GestureResponderEvent: GestureHandlerGestureEvent, Props: GestureHandlerProperties) => void;
    onLongPress?: (GestureResponderEvent: GestureHandlerGestureEvent, Props: GestureHandlerProperties) => void;
    disabled?: boolean;
    numberOfLines?: number;

    testID?: string;
    item?: any;
}


// const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight;

// @observer
export default function Cell (props) {
    
    const colorScheme = useColorScheme();
    const theme = themes[colorScheme];
    const [isUnderlay, setUnderlay] = useState(false);
    const dispatch = useDispatch();


    const renderTitle = () => {
        const { title, numberOfLines = 1, userProfile, deleteButton, signOutButton, required } = props;

        if (!title) return null;

        if (typeof title === 'object' && React.isValidElement(title)) {
        return title;
        }

        return (
        <View 
            style={deleteButton | signOutButton ? {justifyContent: 'center'} : null}>
            <Text style={[styles.titleText, {color: theme.LabelColor},
            userProfile ? {fontSize: 24 } : null, 
            deleteButton | signOutButton ? {color: theme.RedColor, textAlign: 'center'} : null ]} 
            numberOfLines={numberOfLines}>{String(title)}</Text>
        </View>
        );
    }

    const renderSubtitle = () => {
        const { subtitle, userProfile, subtitleFontSize } = props;

        if (!subtitle) return null;

        if (typeof subtitle === 'object' && React.isValidElement(subtitle)) {
        return subtitle;
        }

        return (
        <View >
            <Text style={[styles.subtitleText, {color: theme.LabelColor}]}>{String(subtitle)}</Text>
        </View>
        );
    }

    const renderValue = () => {
        const { value } = props;

        if (!value) return null;

        if (typeof value === 'object' && React.isValidElement(value)) {
        return value;
        }

        return (
        <View style={styles.value}>
            <Text style={styles.value}>{String(value)}</Text>
        </View>
        );
    }

    const renderLeft = () =>  {
        const { left } = props;

        if (!left) return null;

        if (typeof left === 'object' && React.isValidElement(left)) {
        return (
            <View style={styles.left}>
            {left}
            </View>
        );
        }
    }

    const renderRight = () => {
        const { right } = props;

        if (!right) return null;

        if (typeof right === 'object' && React.isValidElement(right)) {
        return right;
        }
    }

        const { bordered = true, index, more, 
            radioButton, selected, disabled, onPress, onPressIn, 
            onLongPress, testID, textInput, placeholder,
            value, secureTextEntry, onInputChange, multiline, showPassword,
            height, primarySystemBackgroundColor, size, textContentType, 
            autoCompleteType, password, autoCapitalize } = props;
        const border = bordered && (typeof index === 'undefined' || index > 0);
        const isRight = selected || more || props.value || props.right;

        //const paddingHorizontal = Math.max(0, UI.layout.inset);

    return (
        <TouchableHighlight
        onPress={onPress && onPress }
        onPressIn={onPressIn && onPressIn}
        onLongPress={onLongPress && onLongPress}
        underlayColor="transparent"
        activeOpacity={1}
        // onShowUnderlay={onShowUnderlay}
        // onHideUnderlay={onHideUnderlay}
        disabled={disabled}
        testID={testID}
        >
        <View
            style={[
            styles.host,
            styles.ios,
            primarySystemBackgroundColor 
            ? {backgroundColor: theme.SystemBackgroundColor}
            : {backgroundColor: theme.SecondarySystemBackgroundColor},
            //{ paddingHorizontal },
            isUnderlay && styles.underlay,
            ]}
        >
            {renderLeft()}
            <View style={styles.content}>
            {!isUnderlay && border && <View style={[styles.border, {backgroundColor: theme.OpaqueSeparatorColor}]} />}
            <View style={styles.center}>
                {renderTitle()}
                {renderSubtitle()}
                {textInput && <TextInput
                        style={[styles.titleText, {color: theme.LabelColor}, height ? {height: height} : null]} 
                        placeholder={placeholder}
                        placeholderTextColor={theme.PlaceholderTextColor} 
                        clearButtonMode='while-editing'
                        multiline={multiline}
                        value={value}
                        secureTextEntry={secureTextEntry}
                        textContentType={textContentType}
                        autoCompleteType={autoCompleteType}
                        onChangeText={(text) => {
                            dispatch(onInputChange(text))
                        }}
                        autoCapitalize={autoCapitalize}
                        onKeyPress={onPress}
                        />}
            </View>
            <View style={styles.right}>
                {renderRight()}
                {/* <Observer render={renderValue} /> */}
                {radioButton
                    ? 
                    (selected
                    ? <FontAwesome5 color={theme.LabelColor} size={22} name="check-circle"/>
                    : <FontAwesome5 color={theme.LabelColor} size={22} name="circle"/>
                    )
                    : null
                }
                {more && <Image source={require('../../assets/icons/16/cell-chevron.png')} 
                    style={[styles.more, {tintColor: theme.SystemFillColor}]} />}
                {password ? 
                    secureTextEntry 
                    ? <FontAwesome5 onPress={() => dispatch(setPasswordVisibilty())} color={theme.LabelColor} size={16} name="eye"/>
                    : <FontAwesome5 onPress={() => dispatch(setPasswordVisibilty())} color={theme.LabelColor} size={16} name="eye-slash"/>
                    : null
                }
            </View>
            </View>
        </View>
        </TouchableHighlight>
    );
}
