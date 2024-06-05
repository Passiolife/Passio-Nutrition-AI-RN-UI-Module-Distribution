import { Alert } from 'react-native';

interface Props {
  onDelete: () => void;
  onClose: () => void;
  title: string;
}

export const DeleteAlert = (props: Props) => {
  Alert.alert(props.title, undefined, [
    {
      text: 'Cancel',
      onPress: () => props.onClose(),
      style: 'cancel',
    },
    {
      text: 'Delete',
      onPress: () => props.onDelete(),
      style: 'destructive',
    },
  ]);
};
