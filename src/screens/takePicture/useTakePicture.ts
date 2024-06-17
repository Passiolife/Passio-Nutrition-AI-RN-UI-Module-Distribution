import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { ParamList } from '../../navigaitons';
import { useServices } from '../../contexts';
import type { StackNavigationProp } from '@react-navigationstack';
import {
  useCameraPermission,
  Camera,
  CameraCaptureError,
} from 'react-native-vision-camera';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  PassioAdvisorFoodInfo,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import type BottomSheet from '@gorhom/bottom-sheet';
import { Platform } from 'react-native';
import { ShowToast } from '../../utils';
import { useSharedValue } from 'react-native-reanimated';

export type TakePictureScreenProps = StackNavigationProp<
  ParamList,
  'TakePictureScreen'
>;

export function useTakePicture() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const animatedMarginBottom = useSharedValue<number>(46);
  const camera = useRef<Camera>(null);
  const [images, setImages] = useState<
    {
      path: string;
    }[]
  >([]);
  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['30%', '60%'], []);
  const [isFetchingResponse, setFetchResponse] = useState(false);
  const [passioAdvisorFoodInfo, setPassioAdvisorFoodInfo] = useState<
    PassioAdvisorFoodInfo[] | null
  >(null);

  const captureImage = useCallback(async () => {
    camera.current
      ?.takePhoto({ enableShutterSound: true })
      .then((value) => {
        let path =
          Platform.OS === 'android' ? `file://${value.path}` : value.path;
        setImages([...images, { path: path }]);
      })
      .catch((val: CameraCaptureError) => {
        console.log('error::::', val.message);
      });
  }, [images]);

  // const services = useServices();
  // const navigation = useNavigation<TakePictureScreenProps>();
  // const route = useRoute<RouteProp<ParamList, 'VoiceLoggingScreen'>>();

  const recognizePictureRemote = useCallback(async () => {
    setFetchResponse(true);
    try {
      setPassioAdvisorFoodInfo(null);

      let foodInfoArray: Array<PassioAdvisorFoodInfo[] | null> = [];

      const data = images.map(async (item) => {
        const val = await PassioSDK.recognizeImageRemote(
          item.path.replace('file://', '') ?? ''
        );
        foodInfoArray?.push(val);
      });

      await Promise.all(data);
      let foodInfoArrayFlat = foodInfoArray.flat();
      if (foodInfoArrayFlat && foodInfoArrayFlat?.length > 0) {
        setFetchResponse(false);
        bottomSheetModalRef.current?.expand();
        setPassioAdvisorFoodInfo(foodInfoArrayFlat as PassioAdvisorFoodInfo[]);
      } else {
        ShowToast('No Result found', 'error');
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setFetchResponse(false);
    }
  }, [images]);

  const onLogSelectPress = useCallback(() => {}, []);
  const onRetakePress = useCallback(() => {}, []);

  return {
    hasPermission,
    requestPermission,
    camera,
    captureImage,
    images,
    recognizePictureRemote,
    snapPoints,
    bottomSheetModalRef,
    onLogSelectPress,
    passioAdvisorFoodInfo,
    onRetakePress,
    isFetchingResponse,
    animatedMarginBottom,
  };
}
