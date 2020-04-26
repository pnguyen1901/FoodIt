import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Platform, TouchableNativeFeedback, TouchableHighlight, Image } from 'react-native';
// import { theme } from 'styles';
// import { observer, Observer } from 'mobx-react';
// import { observable } from 'mobx';
// import { autobind } from 'core-decorators';
// import UI from 'stores/UI';
import styles from './CellStyles';
import { ThemeContext } from '../Theme/Theme';
import { useSelector } from 'react-redux';
import { useColorScheme } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';

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

  onPress?: (GestureResponderEvent, Props) => void;
  onPressIn?: (GestureResponderEvent, Props) => void;
  onLongPress?: (GestureResponderEvent, Props) => void;
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
    // const theme = useSelector(state => state.itemReducer.theme);
//   @autobind
//   onShowUnderlay() {
//     this.isUnderlay = true;
//   }

//   @autobind
//   onHideUnderlay() {
//     this.isUnderlay = false;
//   }

//   @autobind
//   onPress(e) {
//     this.props.onPress(e, this.props);
//   }

//   @autobind
//   onPressIn(e) {
//     this.props.onPressIn(e, this.props);
//   }

//   @autobind
//   onLongPress(e) {
//     this.props.onLongPress(e, this.props);
//   }

    const renderTitle = () => {
        const { title, numberOfLines = 1, userProfile } = props;

        if (!title) return null;

        if (typeof title === 'object' && React.isValidElement(title)) {
        return title;
        }

        return (
        <View >
            <Text style={[styles.titleText, {color: theme.LabelColor},
            userProfile ? {fontSize: 24 } : null ]} numberOfLines={numberOfLines}>{String(title)}</Text>
        </View>
        );
    }

    const renderSubtitle = () => {
        const { subtitle, userProfile } = props;

        if (!subtitle) return null;

        if (typeof subtitle === 'object' && React.isValidElement(subtitle)) {
        return subtitle;
        }

        return (
        <View >
            <Text style={[styles.subtitleText, {color: theme.LabelColor},
                userProfile ? {fontSize: 15}: null ]}>{String(subtitle)}</Text>
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

        const { bordered = true, index, more, selected, disabled, onPress, onPressIn, onLongPress, testID } = props;
        const border = bordered && (typeof index === 'undefined' || index > 0);
        const isRight = selected || more || props.value || props.right;

        //const paddingHorizontal = Math.max(0, UI.layout.inset);

    return (
        <TouchableHighlight
        onPress={onPress && onPress}
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
            {backgroundColor: theme.SecondarySystemBackgroundColor},
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
            </View>
            <View style={styles.right}>
                {renderRight()}
                {/* <Observer render={renderValue} /> */}
                {selected && <Image source={require('../../assets/icons/16/cell-check.png')} style={styles.selected} />}
                {more && <Image source={require('../../assets/icons/16/cell-chevron.png')} 
                    style={[styles.more, {tintColor: theme.OpaqueSeparatorColor}]} />}
            </View>
            </View>
        </View>
        </TouchableHighlight>
);
}
