import type React from 'react';
import { AlertPrompt } from '../../../components/alertPrompts';
import { content } from '../../../constants/Content';

interface Props {
  onSave: (input: string | undefined) => void;
  onClose: () => void;
  isVisible: boolean;
  defaultValue: string | undefined;
}

export const UpdateFoodLogAlertPrompt: React.FC<Props> = (props) => {
  return AlertPrompt({
    cancelText: content.cancel,
    errorMessage: '',
    defaultValue: props.defaultValue,
    hint: content.renameFoodRecord,
    message: undefined,
    okText: content.save,
    visible: props.isVisible,
    onCancel(): void {
      props.onClose();
    },
    onSave(input: string | undefined) {
      props.onSave(input);
    },
    title: content.renameFoodRecord,
  });
};
