import type React from 'react';
import { Alert, type KeyboardTypeOptions, Platform } from 'react-native';
import { AndroidAlertPrompt } from './AndroidAlertPrompt';
import { useEffect } from 'react';

export interface Props {
  title: string;
  message: string | undefined;
  defaultValue: string | undefined;
  hint: string;
  errorMessage: string;
  cancelText: string;
  okText: string;
  visible: boolean;
  keyboardType?: KeyboardTypeOptions;
  onSave: (input: string | undefined) => void;
  onCancel: () => void;
}

export const AlertPrompt: React.FC<Props> = (props) => {
  useEffect(() => {
    if (props.visible) {
      IOSAlert(props);
    }
  }, [props, props.visible]);

  const iOS = Platform.OS === 'ios';
  return iOS ? null : AndroidAlertPrompt(props);
};

export const IOSAlert = (props: Props) => {
  Alert.prompt(
    props.title,
    props.message,
    [
      {
        text: props.cancelText,
        onPress: () => props.onCancel(),
        style: 'cancel',
      },
      {
        text: props.okText,
        onPress: (input) => {
          props.onSave(input);
        },
      },
    ],
    'plain-text',
    props.defaultValue,
    props.keyboardType
  );
};
