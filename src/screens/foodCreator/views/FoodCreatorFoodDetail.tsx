import React from 'react';
import { Card, Text } from '../../../components';
import { Image, StyleSheet, View } from 'react-native';
import { Branding, useBranding } from '../../../contexts';
import { FiledView } from './FiledView';
import { FiledSelectionView } from './FiledSelectionView';
import { Units } from '../data';
import { ICONS } from '../../../assets';

interface Props {}

export const FoodCreatorFoodDetail = ({}: Props) => {
  const branding = useBranding();

  const styles = requireNutritionFactStyle(branding);

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
              <FiledView label="enter name" isColum name="Name" />
              <FiledView label="enter brand" isColum name="Brand" />
              <FiledSelectionView isColum lists={Units} name="Barcode" />
            </View>
          </View>
        </View>
      }
    </Card>
  );
};

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
