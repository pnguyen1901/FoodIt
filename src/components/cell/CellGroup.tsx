import * as React from 'react';
import { View, Text, Platform } from 'react-native';
import styles from './CellGroupStyles';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

interface Props {
  key?: string;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  testID?: string;
}

export default function CellGroup (props) {

  const { theme } = props;

  const renderHeader = () => {
    const { header } = props;

    if (!header) return null;

    if (typeof header === 'boolean' && header === true) {
      return <View style={styles.header} />;
    }

    if (typeof header === 'object' && React.isValidElement(header)) {
      return header;
    }

    const paddingLeft = 16 //Math.max(0, UI.layout.inset) + 16;

    return (
      <View style={[styles.header, styles.itemsIOS, { paddingLeft }]}>
        <Text style={[styles.headerText]}>{String(header).toUpperCase()}</Text>
      </View>
    );
  }

  const renderItem = (item, index) =>  {
    if (React.isValidElement(item) === false) {
      return null;
    }

    return React.cloneElement(item, { ...item.props, index });
  }

  const renderFooter = () => {
    const { footer = true } = props;
    if (!footer) return null;

    if (typeof footer === 'boolean' && footer === true) {
      return <View style={[styles.footer, styles.footer]} />;
    }

    if (typeof footer === 'object' && React.isValidElement(footer)) {
      return footer;
    }

    return (
      <View style={[styles.footer]}>
        <Text style={[styles.footerText]}>{String(footer)}</Text>
      </View>
    );
  }

    const { children } = props;

    return (
      <View>
        {renderHeader()}
        <View style={[styles.itemsIOS, {borderBottomColor: theme.OpaqueSeparatorColor, borderTopColor: theme.OpaqueSeparatorColor}]}>
          {React.Children.map(children, renderItem)}
        </View>
        {renderFooter()}
      </View>
    );
}
