import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'center';

export function ShowToast(message: string, type: ToastType = 'success') {
  Toast.show({
    autoHide: true,
    text1: message,
    type: type,
  });
}
