import type { KeyboardTypeOptions } from 'react-native';
import { AlertPrompt } from '../../../components/alertPrompts';

interface Props {
  onSave: (input: string | undefined) => void;
  onClose: () => void;
  isVisible: boolean;
  defaultValue: string | undefined;
  message: string;
  title: string;
  hint: string;
  keyboardType?: KeyboardTypeOptions;
}

export const EditValueAlertPrompt = (props: Props) => {
  return AlertPrompt({
    cancelText: 'Cancel',
    errorMessage: '',
    defaultValue: props.defaultValue,
    keyboardType: props.keyboardType,
    hint: props.hint,
    message: props.message,
    okText: 'Save',
    visible: props.isVisible,
    onCancel(): void {
      props.onClose();
    },
    onSave(input: string | undefined) {
      props.onSave(input);
    },
    title: props.title,
  });
};
