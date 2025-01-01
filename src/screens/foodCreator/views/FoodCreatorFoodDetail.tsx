import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Card, Text } from '../../../components';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Branding, useBranding } from '../../../contexts';
import { FiledView, FiledViewRef } from '../../../components/filed/FiledView';
import type { FiledSelectionViewRef } from '../../../components/filed/FiledSelectionView';
import { FiledViewClick } from '../../../components/filed/FiledViewClick';
import type { CustomFood, Image } from '../../../models';
import { PassioFoodIcon } from '../../../components/passio/PassioFoodIcon';
import { ICONS } from '../../../assets';

interface Props {
  foodLog?: CustomFood;
  barcode?: string;
  onBarcodePress?: () => void;
  onEditImagePress?: () => void;
  image?: Image;
  isNutritionFact?: boolean;
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
    {
      foodLog: defaultFoodLog,
      barcode: defaultBarcode,
      onBarcodePress,
      onEditImagePress,
      image,
      isNutritionFact,
    }: Props,
    ref: React.Ref<FoodCreatorFoodDetailRef>
  ) => {
    const branding = useBranding();

    const styles = requireNutritionFactStyle(branding);

    const [foodLog, setFoodLog] = useState(defaultFoodLog);
    const [barcode, setBarcode] = useState(defaultBarcode);

    useEffect(() => {
      setFoodLog(defaultFoodLog);
    }, [defaultFoodLog]);

    useEffect(() => {
      setBarcode(defaultBarcode);
    }, [defaultBarcode]);

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

            if (key !== 'barcode' && key !== 'brand') {
              currentRef?.errorCheck();
              if (value === undefined || value.trim().length === 0) {
                isNotValid = true;
              }
            } else {
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
            <Text size="title" weight="600" style={styles.title}>
              {'Scan Description'}
            </Text>
            <View style={styles.container}>
              <TouchableOpacity onPress={onEditImagePress} style={styles.left}>
                <PassioFoodIcon
                  style={styles.icon}
                  iconID={image?.id}
                  extra={image?.base64}
                  defaultImage={
                    isNutritionFact
                      ? ICONS.foodNutritionFact
                      : ICONS.foodCreator
                  }
                />
                <Text
                  size="secondlyTitle"
                  color="primaryColor"
                  isLink
                  onPress={onEditImagePress}
                  style={styles.editImage}
                >
                  {'Edit Image'}
                </Text>
              </TouchableOpacity>
              <View style={styles.right}>
                <FiledView
                  value={foodLog?.name}
                  ref={nameRef}
                  label="enter name"
                  isColum
                  isCharacter
                  keyboardType="default"
                  name="Name"
                />
                <FiledView
                  ref={brandNameRef}
                  label="enter brand"
                  value={foodLog?.brandName}
                  isColum
                  isCharacter
                  keyboardType="default"
                  name="Brand"
                />
                <FiledViewClick
                  value={barcode}
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
    },
    left: {
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    right: {
      marginStart: 16,
      flex: 1,
    },
    editImage: {
      marginVertical: 6,
    },
    icon: {
      height: 100,
      width: 100,
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      borderRadius: 50,
      overflow: 'hidden',
      alignContent: 'center',
    },
  });
