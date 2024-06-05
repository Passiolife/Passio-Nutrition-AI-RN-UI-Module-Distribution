import { AlertPrompt } from '../../../components/alertPrompts';

interface Props {
  onSave: (input: string | undefined) => void;
  onClose: () => void;
  isVisible: boolean;
  text: string | undefined;
}

export const SaveFoodAlert = (props: Props) => {
  return AlertPrompt({
    cancelText: 'Cancel',
    errorMessage: '',
    hint: 'Name your food',
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
    title: 'Name your food',
  });
};
