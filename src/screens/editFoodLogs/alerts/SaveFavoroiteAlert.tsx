import type React from 'react';
import { AlertPrompt } from '../../../components/alertPrompts';

interface Props {
  onSave: (input: string | undefined) => void;
  onClose: () => void;
  isVisible: boolean;
  text: string | undefined;
}

export const SaveFavoriteFoodItem: React.FC<Props> = (props) => {
  return AlertPrompt({
    cancelText: 'Cancel',
    errorMessage: '',
    hint: 'Name your favourite',
    message: undefined,
    okText: 'Save',
    defaultValue: props.text,
    visible: props.isVisible,
    onCancel(): void {
      props.onClose();
    },
    onSave(input: string | undefined) {
      props.onSave(input);
    },
    title: 'Name your favourite',
  });
};
