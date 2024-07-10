import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Card, Text } from '../../../components';
import { Image, StyleSheet, View } from 'react-native';
import { Branding, useBranding } from '../../../contexts';
import { FiledView, FiledViewRef } from '../../../components/filed/FiledView';
import type { FiledSelectionViewRef } from '../../../components/filed/FiledSelectionView';
import { ICONS } from '../../../assets';
import { FiledViewClick } from '../../../components/filed/FiledViewClick';
import type { CustomFood } from '../../../models';

interface Props {
  foodLog?: CustomFood;
  onBarcodePress?: () => void;
}

export type FoodCreatorFoodDetailType = 'name' | 'brand' | 'barcode';

interface Value {
  records: Record<FoodCreatorFoodDetailType, string>;
  isNotValid?: boolean;
}

export interface FoodCreatorFoodDetailRef {
  getValue: () => Value;
}

export const FoodCreatorFoodDetail = React.forwardRef<
  FoodCreatorFoodDetailRef,
  Props
>(
  (
    { foodLog: defaultFoodLog, onBarcodePress }: Props,
    ref: React.Ref<FoodCreatorFoodDetailRef>
  ) => {
    const branding = useBranding();

    const styles = requireNutritionFactStyle(branding);

    const [foodLog, setFoodLog] = useState(defaultFoodLog);

    useEffect(() => {
      setFoodLog(defaultFoodLog);
    }, [defaultFoodLog]);

    const nameRef = useRef<FiledViewRef>(null);
    const brandNameRef = useRef<FiledViewRef>(null);
    const barcodeRef = useRef<FiledSelectionViewRef>(null);

    const refs = useMemo(
      () => ({
        name: nameRef,
        brand: brandNameRef,
        barcode: barcodeRef,
      }),
      []
    );

    useImperativeHandle(
      ref,
      () => ({
        getValue: () => {
          let record: Record<FoodCreatorFoodDetailType, string> = {} as Record<
            FoodCreatorFoodDetailType,
            string
          >;
          let isNotValid = false;

          (Object.keys(refs) as FoodCreatorFoodDetailType[]).forEach((key) => {
            const currentRef = refs[key].current;
            const value = currentRef?.value();
            currentRef?.errorCheck();

            if (key !== 'barcode' && key !== 'brand') {
              if (value === undefined || value.length === 0) {
                isNotValid = true;
              }
            }

            record[key] = value ?? '';
          });

          return {
            records: record,
            isNotValid,
          };
        },
      }),
      [refs]
    );

    return (
      <Card style={styles.card}>
        {
          <View>
            <Text style={styles.title}>{'Scan Description'}</Text>
            <View style={styles.container}>
              <View style={styles.left}>
                <Image source={ICONS.FoodEditImage} style={styles.icon} />
                <Text
                  size="_12px"
                  color="primaryColor"
                  isLink
                  style={styles.editImage}
                >
                  {'Edit Image'}
                </Text>
              </View>
              <View style={styles.right}>
                <FiledView
                  value={foodLog?.name}
                  ref={nameRef}
                  label="enter name"
                  isColum
                  keyboardType="name-phone-pad"
                  name="Name"
                />
                <FiledView
                  ref={brandNameRef}
                  label="enter brand"
                  isColum
                  keyboardType="name-phone-pad"
                  name="Brand"
                />
                <FiledViewClick
                  value={foodLog?.barcode}
                  ref={barcodeRef}
                  isColum
                  name="Barcode"
                  onValuePress={onBarcodePress}
                />
              </View>
            </View>
          </View>
        }
      </Card>
    );
  }
);

const requireNutritionFactStyle = ({}: Branding) =>
  StyleSheet.create({
    card: {
      marginHorizontal: 16,
      marginVertical: 16,
      padding: 16,
    },
    title: {
      marginBottom: 16,
    },
    container: {
      flexDirection: 'row',
      alignContent: 'space-around',
      justifyContent: 'space-between',
    },
    left: {
      flex: 1,
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    right: {
      flex: 1.5,
    },
    editImage: {
      marginVertical: 4,
      fontSize: 10,
    },
    icon: {
      height: 80,
      width: 80,
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      alignContent: 'center',
    },
  });
