import React, { useImperativeHandle, useRef, useState } from 'react';
import { Card, Text } from '../../../components';
import { StyleSheet, View } from 'react-native';
import { Branding, useBranding } from '../../../contexts';
import { FiledView, FiledViewRef } from '../../../components/filed/FiledView';
import { FiledSelectionView } from '../../../components/filed/FiledSelectionView';
import { OtherNutrients } from '../data';
import { FlatList } from 'react-native';
import { nutrientName, type NutrientType } from '../../../models';

interface Props {}

interface Value {
  records: Record<NutrientType, string>;
  isNotValid?: boolean;
}
export interface OtherNutritionFactsRef {
  getValue: () => Value;
}

export const OtherNutritionFacts = React.forwardRef<
  OtherNutritionFactsRef,
  Props
>(({}: Props, ref: React.Ref<OtherNutritionFactsRef>) => {
  const branding = useBranding();

  const styles = requireNutritionFactStyle(branding);
  const [defaultList, setDefaultList] =
    useState<NutrientType[]>(OtherNutrients);
  const [list, setList] = useState<string[]>([]);
  const labelList = defaultList.map((i) => {
    return nutrientName[i].toString() ?? '';
  });

  const refs = useRef<Record<string, React.RefObject<FiledViewRef>>>({});

  useImperativeHandle(
    ref,
    () => ({
      getValue: () => {
        let record: Record<NutrientType, string> = {} as Record<
          NutrientType,
          string
        >;
        let isNotValid = false;
        list.forEach((item) => {
          const sleetedRef = refs.current[item];
          if (sleetedRef && sleetedRef.current) {
            if (sleetedRef.current.errorCheck()) {
              isNotValid = true;
            }
            record[item as NutrientType] = sleetedRef.current.value() ?? '';
          }
        });

        return {
          records: record,
          isNotValid: isNotValid,
        };
      },
    }),
    [list]
  );

  // Initialize refs for each item in the list
  list.forEach((item) => {
    if (!refs.current[item]) {
      refs.current[item] = React.createRef();
    }
  });

  return (
    <Card style={styles.card}>
      {
        <View>
          <Text style={styles.title}>{'Other Nutrition Facts'}</Text>
          <FlatList
            data={list}
            extraData={list}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              return (
                <FiledView
                  ref={refs.current[item]}
                  label={nutrientName[item as NutrientType].toString()}
                  name={nutrientName[item as NutrientType].toString()}
                  onDelete={() => {
                    setList((i) => [...i.filter((o) => item !== o)]);
                    setDefaultList((i) => [...i, item as NutrientType]);
                  }}
                />
              );
            }}
          />
          {defaultList.length > 0 && (
            <FiledSelectionView
              isColum
              lists={defaultList}
              labelList={labelList}
              name=""
              label="Select Nutrients"
              isCenter
              onChange={(item) => {
                setList((i) => [...i, item]);
                setDefaultList((i) => [...i.filter((o) => item !== o)]);
              }}
            />
          )}
        </View>
      }
    </Card>
  );
});

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
  });
