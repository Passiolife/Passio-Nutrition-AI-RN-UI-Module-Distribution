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
import type { CustomFood, Image } from '../../../models';
import { PassioFoodIcon } from '../../../components/passio/PassioFoodIcon';
import { ICONS } from '../../../assets';

interface Props {
  foodLog?: CustomFood;
  onBarcodePress?: () => void;
  onEditImagePress?: () => void;
  image?: Image;
}

export type FoodCreatorFoodDetailType = 'name' | 'brand' | 'barcode';

interface Value {
  records: Record<FoodCreatorFoodDetailType, string>;
  isNotValid?: boolean;
}

export interface EditRecipeNameRef {
  getValue: () => Value;
}

export const EditRecipeName = React.forwardRef<EditRecipeNameRef, Props>(
  (
    { foodLog: defaultFoodLog, onEditImagePress, image }: Props,
    ref: React.Ref<EditRecipeNameRef>
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

            if (key !== 'barcode' && key !== 'brand') {
              currentRef?.errorCheck();
              if (value === undefined || value.length === 0) {
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
              {'Recipe Details'}
            </Text>
            <View style={styles.container}>
              <TouchableOpacity onPress={onEditImagePress} style={styles.left}>
                <PassioFoodIcon
                  style={styles.icon}
                  iconID={image?.id}
                  extra={image?.base64}
                  entityType="user-recipe"
                  defaultImage={ICONS.recipe}
                />
                <Text
                  size="secondlyTitle"
                  color="primaryColor"
                  isLink
                  style={styles.editImage}
                >
                  {'Edit Image'}
                </Text>
              </TouchableOpacity>
              <View style={styles.right}>
                <FiledView
                  value={foodLog?.name}
                  ref={nameRef}
                  label="RecipeName"
                  isColum
                  isCharacter
                  keyboardType="default"
                  name="Recipe Name"
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
      marginVertical: 16,
      padding: 16,
    },
    title: {
      marginBottom: 16,
    },
    container: {
      flexDirection: 'row',
      paddingVertical: 16,
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
