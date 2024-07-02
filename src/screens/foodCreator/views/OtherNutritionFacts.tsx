import React, { useState } from 'react';
import { Card, Text } from '../../../components';
import { StyleSheet, View } from 'react-native';
import { Branding, useBranding } from '../../../contexts';
import { FiledView } from './FiledView';
import { FiledSelectionView } from './FiledSelectionView';
import { OtherNutrients } from '../data';
import { FlatList } from 'react-native';
import { nutrientName, type NutrientType } from '../../../models';

interface Props {}

export const OtherNutritionFacts = ({}: Props) => {
  const branding = useBranding();

  const styles = requireNutritionFactStyle(branding);
  const [defaultList, setDefaultList] =
    useState<NutrientType[]>(OtherNutrients);
  const [list, setList] = useState<string[]>([]);
  const labelList = defaultList.map((i) => {
    return nutrientName[i].toString() ?? '';
  });

  return (
    <Card style={styles.card}>
      {
        <View>
          <Text style={styles.title}>{'Other Nutrition Facts'}</Text>
          <FlatList
            data={list}
            renderItem={({ item }) => {
              return <FiledView label={item} name={item} />;
            }}
          />
          <View style={styles.right}>
            <FiledSelectionView
              isColum
              lists={defaultList}
              labelList={labelList}
              name=""
              isCenter
              onChange={(item) => {
                setList((i) => [...i, item]);
                setDefaultList((i) => [...i.filter((o) => item !== o)]);
              }}
            />
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
