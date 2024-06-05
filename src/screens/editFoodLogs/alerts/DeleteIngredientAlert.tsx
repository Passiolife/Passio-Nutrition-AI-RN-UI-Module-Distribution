import { Alert } from 'react-native';

interface Props {
  onDelete: () => void;
  onClose: () => void;
}

export const DeleteIngredientAlert = (props: Props) => {
  Alert.alert('Are you sure want to delete this ingredient?', undefined, [
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
