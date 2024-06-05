import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  BasicButton,
  Text,
  ProgressLoadingView,
  CalendarCarouselIndicator,
  Card,
} from '../../../../components';
import { scaleHeight, scaleWidth, scaledSize } from '../../../../utils';
import { useMicros } from './useMicros';
import {
  nutrientName,
  nutrientUnits,
  recommendedNutrient,
  type Nutrient,
} from '../../../../models';
import ProgressBar from '../../../../components/progressBard/ProgressBar';
import { ICONS } from '../../../../assets';
import { DateTime } from 'luxon';

const Micros = () => {
  const {
    dateTime,
    isInfo,
    isMore,
    loading,
    nutrients,
    onInfoPress,
    onLeftArrowPress,
    onMorePress,
    onRightArrowPress,
  } = useMicros();

  const renderItem = ({ item, index }: { item: Nutrient; index: number }) => {
    if (index === 0) {
      return renderHeader();
    }
    const recommended = recommendedNutrient[item.id];
    let percentage = (Math.round(item.amount) * 100) / recommended;

    const remain = recommended - Math.round(item.amount);

    if (remain < 0) {
      percentage = 100;
    }

    const isOverValue = percentage >= 100;

    return (
      <View>
        <View style={styles.itemContainer}>
          <Text weight="700" style={styles.itemTextTitle}>
            {nutrientName[item.id]}
          </Text>
          <Text weight="400" style={styles.itemText}>
            {Math.round(item.amount ?? 0) + ' ' + nutrientUnits[item.id]}
          </Text>
          <Text
            color={isOverValue ? 'error' : 'text'}
            weight={isOverValue ? '500' : '400'}
            style={styles.itemText}
          >
            {Math.round(remain) + ' ' + nutrientUnits[item.id]}
          </Text>
        </View>
        <ProgressBar
          progress={percentage}
          progressColor={
            isOverValue ? 'rgba(239, 68, 68, 1)' : 'rgba(79, 70, 229, 1)'
          }
          height={10}
          radius={6}
          width={Dimensions.get('window').width - 32}
        />
      </View>
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

              <Text weight="400">
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

  const renderHeader = () => {
    return (
      <>
        <View style={styles.infoContainer}>
          <Text weight="700" style={styles.itemTextTitle}>
            {''}
          </Text>
          <Text weight="600" color={'text'} style={styles.itemText}>
            Total
          </Text>
          <Text color={'text'} weight={'600'} style={styles.itemText}>
            Remaining
          </Text>
        </View>
      </>
    );
  };

  const renderEmpty = () => {
    return <Text>{!loading ? 'No Data found' : ''}</Text>;
  };
  const renderFooter = () => {
    return (
      <TouchableOpacity onPress={onMorePress} style={styles.more}>
        <Text weight="500" color="primaryColor">
          {isMore ? 'Show Less' : 'Show More'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
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
      <CalendarCarouselIndicator
        calendarCarouselContainerStyle={styles.calendarCarouselContainer}
        label={
          dateTime.hasSame(DateTime.now(), 'day')
            ? 'Today'
            : dateTime.toFormat('MMM, EEE dd, yyyy')
        }
        onLeftPress={onLeftArrowPress}
        onRightPress={onRightArrowPress}
      />

      {loading ? (
        <ProgressLoadingView />
      ) : (
        <FlatList
          data={[{ amount: 0, id: 'alcohol', unit: 'g' }, ...nutrients]}
          stickyHeaderIndices={[1]}
          ListEmptyComponent={renderEmpty}
          renderItem={renderItem}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          ListHeaderComponent={renderInfo}
        />
      )}
      <BasicButton
        style={styles.button}
        text="Generate Report"
        onPress={() => null}
      />
    </View>
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
    marginVertical: scaleHeight(12),
    flexDirection: 'row',
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
    textAlign: 'center',
  },
  list: {},
  button: {
    borderRadius: scaledSize(4),
    marginVertical: scaleHeight(16),
  },
});

export default React.memo(Micros);
