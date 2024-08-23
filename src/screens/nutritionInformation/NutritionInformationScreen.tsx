import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Text, Card, BackNavigation } from '../../components';
import { scaleHeight, scaleWidth, scaledSize } from '../../utils';
import { useNutritionInformation } from './useNutritionInformation';
import { nutrientName, nutrientUnits, type Nutrient } from '../../models';
import { ICONS } from '../../assets';
import FoodInfo from './FoodInfo';

const NutritionInformationScreen = () => {
  const { nutrients, isInfo, onInfoPress, foodLog } = useNutritionInformation();

  const renderItem = ({ item }: { item: Nutrient; index: number }) => {
    return (
      <Card style={styles.cardContainer}>
        <View style={styles.itemContainer}>
          <Text weight="700" style={styles.itemTextTitle}>
            {nutrientName[item.id]}
          </Text>
          <Text
            weight="600"
            color="primaryColor"
            size={'_24px'}
            style={styles.itemText}
          >
            {Math.round(item.amount)}
            <Text
              weight="400"
              color="secondaryText"
              size={'_12px'}
              style={styles.itemText}
            >
              {` ${nutrientUnits[item.id]}`}
            </Text>
          </Text>
        </View>
      </Card>
    );
  };

  const renderInfo = () => {
    return (
      <>
        {isInfo && (
          <Card style={{ marginVertical: 16, marginHorizontal: 4 }}>
            <View style={{ padding: 16, marginBottom: 16 }}>
              <TouchableOpacity onPress={onInfoPress}>
                <Image
                  source={ICONS.newClose}
                  style={{
                    height: 24,
                    width: 24,
                    marginBottom: 8,
                    alignSelf: 'flex-end',
                    alignContent: 'flex-end',
                  }}
                />
              </TouchableOpacity>

              <Text
                weight="400"
                size="secondlyTitle"
                style={{ textAlign: 'center', paddingHorizontal: 0 }}
              >
                {
                  'Please note that not all foods in our database have available micronutrient information, so the summary provided may be incomplete.'
                }
              </Text>
            </View>
          </Card>
        )}
      </>
    );
  };

  const renderFood = () => {
    return <FoodInfo foodLog={foodLog} />;
  };

  return (
    <>
      <BackNavigation title="Nutrition Information" />
      <View style={styles.container}>
        {!isInfo && (
          <TouchableOpacity onPress={onInfoPress}>
            <Image
              source={ICONS.newInfo}
              style={{
                height: 24,
                width: 24,
                marginHorizontal: 16,
                alignSelf: 'flex-end',
                marginTop: 16,
                alignContent: 'flex-end',
              }}
            />
          </TouchableOpacity>
        )}
        <FlatList
          data={nutrients}
          renderItem={renderItem}
          style={styles.list}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {renderInfo()}
              {renderFood()}
            </>
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scaleWidth(16),
    flex: 1,
  },
  moreContainer: {},
  more: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 32,
  },
  calendarCarouselContainer: {
    marginTop: 12,
  },
  itemContainer: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    flex: 1,
  },
  cardContainer: {
    marginHorizontal: 8,
    marginVertical: scaleHeight(6),
    flexDirection: 'row',
    borderRadius: 8,
    flex: 1,
  },
  infoContainer: {
    paddingVertical: scaleHeight(12),
    flexDirection: 'row',
    backgroundColor: 'rgba(249, 250, 251, 1)',
  },
  itemTextTitle: {
    flex: 2,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  info: {
    textTransform: 'capitalize',
  },
  itemText: {
    flex: 1,
    alignSelf: 'center',
    marginVertical: 8,
    textAlign: 'center',
  },
  list: {},
  button: {
    borderRadius: scaledSize(4),
    marginVertical: scaleHeight(16),
  },
});

export default React.memo(NutritionInformationScreen);
