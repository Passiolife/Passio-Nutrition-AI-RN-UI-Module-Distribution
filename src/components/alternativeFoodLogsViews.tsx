import {
  type StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
  FlatList,
} from 'react-native';
import type {
  PassioAlternative,
  PassioID,
  PassioIDAttributes,
} from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import React, { useEffect, useState } from 'react';
import { getAlternateFoodItems, getAttributesForPassioID } from '../utils';

import { COLORS } from '../constants';
import { Card } from './cards';
import { PassioFoodIcon } from './passio/PassioFoodIcon';
import { palette } from './palette';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';

interface Props {
  passioId: PassioID;
  onAlternateItemCall: (passioIDAttributes: PassioIDAttributes) => void;
  style?: StyleProp<ViewStyle>;
  from?: 'multiScan';
}

export const AlternativeFoodLogsView = React.memo((props: Props) => {
  const [alternateFoodItems, setAlternateFoodItems] = useState<
    PassioIDAttributes[]
  >([]);

  useEffect(() => {
    async function init() {
      const passioAttributeID = await getAttributesForPassioID(props.passioId);
      if (passioAttributeID != null) {
        const list = await getAlternateFoodItems(passioAttributeID);
        setAlternateFoodItems(list);
      }
    }
    init();
  }, [props.passioId]);

  if (alternateFoodItems.length <= 0) {
    return null;
  }

  const AttributesFlatList =
    props.from !== 'multiScan' ? FlatList : BottomSheetFlatList;

  return (
    <Card
      style={[
        styles.container,
        props.style,
        alternateFoodItems.length > 0 ? styles.displayFlex : styles.displayNone,
      ]}
    >
      <Text style={styles.activeText}>Alternatives</Text>
      <View style={styles.itemsContainer}>
        <AttributesFlatList<PassioIDAttributes>
          horizontal={true}
          data={alternateFoodItems}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }: { item: PassioIDAttributes }) => {
            return (
              <TouchableOpacity
                testID="testAlternateFoodLogItem"
                onPress={() => props.onAlternateItemCall(item)}
              >
                <AlternateFoodLogView {...item} />
              </TouchableOpacity>
            );
          }}
          keyExtractor={(__: PassioAlternative) => __.passioID.toString()}
        />
      </View>
    </Card>
  );
});

export const AlternateFoodLogView: React.FC<PassioIDAttributes> = (
  alternate: PassioIDAttributes
) => {
  return (
    <View style={alternateFoodLogViewStyle.container}>
      <View style={alternateFoodLogViewStyle.imageContainer}>
        <PassioFoodIcon
          passioID={alternate.passioID}
          imageName={alternate.imageName}
          style={alternateFoodLogViewStyle.image}
          entityType={alternate.entityType}
        />
      </View>
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={alternateFoodLogViewStyle.text}
      >
        {alternate.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    paddingTop: 4,
    paddingBottom: 8,
    flexDirection: 'column',
  },
  activeText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
    paddingHorizontal: 16,
    color: COLORS.grey7,
  },
  itemsContainer: {
    paddingTop: 15,
  },
  displayNone: {
    display: 'none',
  },
  displayFlex: {
    display: 'flex',
  },
});

const alternateFoodLogViewStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignContent: 'center',
    backgroundColor: palette.lightGray,
    borderRadius: 24,
    height: 45,
    marginLeft: 8,
  },
  imageContainer: {
    width: 32,
    marginLeft: 4,
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  image: {
    width: 32,
    height: 32,
  },
  text: {
    alignSelf: 'center',
    color: palette.charcoal,
    textTransform: 'capitalize',
    marginHorizontal: 5,
    marginRight: 10,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '400',
    maxWidth: 150,
  },
});
