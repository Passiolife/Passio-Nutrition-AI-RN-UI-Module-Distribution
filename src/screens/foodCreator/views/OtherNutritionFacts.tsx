import React, { useImperativeHandle, useRef, useState } from 'react';
import { Card, Text } from '../../../components';
import { StyleSheet, View } from 'react-native';
import { Branding, useBranding } from '../../../contexts';
import { FiledView, FiledViewRef } from '../../../components/filed/FiledView';
import { FiledSelectionView } from '../../../components/filed/FiledSelectionView';
import { OtherNutrients } from '../data';
import { FlatList } from 'react-native';
import { CustomFood, nutrientName, type NutrientType } from '../../../models';

interface Props {
  foodLog?: CustomFood;
}

interface Value {
  records: Record<NutrientType, string>;
  isNotValid?: boolean;
}
export interface OtherNutritionFactsRef {
  getValue: () => Value;
}

interface DefaultNutrients {
  label: NutrientType;
  value?: number;
}

export const OtherNutritionFacts = React.forwardRef<
  OtherNutritionFactsRef,
  Props
>(({ foodLog }: Props, ref: React.Ref<OtherNutritionFactsRef>) => {
  const branding = useBranding();
  const styles = requireNutritionFactStyle(branding);

  const refs = useRef<Record<string, React.RefObject<FiledViewRef>>>({});

  // Generate default nutrients where come from `foodLog
  const defaultKey: DefaultNutrients[] | undefined =
    foodLog?.foodItems?.[0]?.nutrients
      .filter((i) => i.amount > 0 && OtherNutrients.includes(i.id))
      .map((i) => {
        const data: DefaultNutrients = {
          label: i.id as NutrientType,
          value: Number(i.amount.toFixed(2)),
        };
        return data;
      });

  const [defaultList, setDefaultList] = useState<NutrientType[]>(
    OtherNutrients.filter((i) => !defaultKey?.find((l) => l.label === i))
  );

  const [list, setList] = useState<DefaultNutrients[]>(defaultKey ?? []);
  const labelList = defaultList.map((i) => {
    return nutrientName[i].toString() ?? '';
  });

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
          const sleetedRef = refs.current[item.label];
          if (sleetedRef && sleetedRef.current) {
            if (sleetedRef.current.errorCheck()) {
              isNotValid = true;
            }
            record[item.label as NutrientType] =
              sleetedRef.current.value() ?? '';
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
    if (!refs.current[item.label]) {
      refs.current[item.label] = React.createRef();
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
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => {
              return (
                <FiledView
                  ref={refs.current[item.label]}
                  label={nutrientName[item.label].toString()}
                  name={nutrientName[item.label].toString()}
                  // name={item}
                  value={item.value ? item.value.toString() : undefined}
                  onDelete={() => {
                    setList((i) => [...i.filter((o) => item !== o)]);
                    setDefaultList((i) => [...i, item.label]);
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
                setList((i) => [
                  ...i,
                  {
                    label: item as NutrientType,
                  },
                ]);
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
