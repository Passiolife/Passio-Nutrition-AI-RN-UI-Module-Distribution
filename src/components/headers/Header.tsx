import React from 'react';
import { View, StatusBar } from 'react-native';
import headerStyle from './styles';
import { useBranding } from '../../contexts';

interface Props {
  leftSide: Array<JSX.Element> | JSX.Element | undefined;
  body: Array<JSX.Element> | JSX.Element | undefined;
  rightSide?: Array<JSX.Element> | JSX.Element | undefined;
  bottomView?: Array<JSX.Element> | JSX.Element | undefined;
}

export const Header: React.FC<Props> = (props) => {
  const { leftSide, body, rightSide, bottomView } = props;
  let styles = headerStyle(useBranding());
  let hs = [styles.mainContainer];
  return (
    <>
      <View style={styles.imgBgStyle}>
        <View style={styles.statusBar}>
          <StatusBar
            translucent
            barStyle="dark-content"
            backgroundColor={'transparent'}
            {...props}
          />
        </View>
        <View {...props} style={hs}>
          <View style={styles.sideBar}>{leftSide}</View>
          <View style={styles.body}>{body}</View>
          <View style={styles.sideBar}>{rightSide}</View>
        </View>
        {bottomView && <View style={styles.headerBottom}>{bottomView}</View>}
      </View>
    </>
  );
};

export default Header;
