import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  type StyleProp,
  type ViewStyle,
  Pressable,
} from 'react-native';
import headerStyle from './styles';
import { useBranding } from '../../contexts';
import { Text } from '../texts';
import { useNavigation } from '@react-navigation/native';
import { ICONS } from '../../assets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEntry } from '../../contexts/entry/EntryContext';

interface Props {
  rightSide?: Array<JSX.Element> | JSX.Element | undefined;
  rightIcon?: number;
  bottomView?: Array<JSX.Element> | JSX.Element | undefined | React.JSX.Element;
  title?: string;
  bottomStyle?: StyleProp<ViewStyle>;
  cardStyle?: StyleProp<ViewStyle>;
  onBackArrowPress?: () => void;
  onRightPress?: () => void;
}

export const BackOnly: React.FC<Props> = (props) => {
  const { title, rightSide, rightIcon, onRightPress } = props;
  const insets = useSafeAreaInsets();
  let styles = headerStyle(useBranding(), insets);
  let hs = [styles.mainContainer];
  const navigation = useNavigation();
  const entry = useEntry();
  return (
    <>
      <View {...props} style={hs}>
        <View style={styles.leftSize}>
          <TouchableOpacity
            onPress={() => {
              if (props.onBackArrowPress) {
                props.onBackArrowPress();
              } else {
                try {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  } else {
                    entry?.onBackToHost?.();
                  }
                } catch (e) {
                  entry?.onBackToHost?.();
                }
              }
            }}
          >
            <Image
              source={ICONS.newBack}
              resizeMethod="resize"
              resizeMode="contain"
              style={styles.backIcon}
            />
          </TouchableOpacity>
        </View>
        <Text
          weight="700"
          size="_24px"
          color="text"
          adjustsFontSizeToFit
          numberOfLines={2}
          allowFontScaling
          style={styles.body}
        >
          {title}
        </Text>

        {rightSide ? (
          rightSide
        ) : (
          <Pressable onPress={onRightPress} style={styles.leftSize}>
            {rightIcon ? (
              <Image source={rightIcon} style={styles.rightIcon} />
            ) : (
              <View style={styles.rightIcon} />
            )}
          </Pressable>
        )}
      </View>
    </>
  );
};

export default BackOnly;
