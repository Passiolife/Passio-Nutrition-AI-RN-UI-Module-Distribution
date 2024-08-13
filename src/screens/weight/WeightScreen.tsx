import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BackNavigation,
  CalendarCarousel,
  Card,
  SwipeableView,
  Text,
} from '../../components';
import type { Branding } from '../../contexts';
import { useBranding } from '../../contexts';
import { scaleHeight, scaleWidth, scaled, scaledSize } from '../../utils';

import { ICONS } from '../../assets';
import { FlatList } from 'react-native';
import { useWeights } from './useWeights';
import { DateTime } from 'luxon';
import type { Weight } from '../../models';
import { WeightTrendChart } from './linechart/lineChart';

const WeightScreen = () => {
  const {
    target,
    calendarCarouselRef,
    isContentVisible,
    weightLabel,
    weights,
    weightTrendData,
    convertWeightAccordingToUnitWeight,
    getWeights,
    handleContentVisible,
    onDeleteWeightPress,
    onEditPress,
    onPressPlus,
  } = useWeights();

  const styles = waterIntakeStyle(useBranding());

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text weight="600" size="title" style={styles.headerText}>
            {DateTime.fromJSDate(
              calendarCarouselRef?.current?.getStartDate() ?? new Date()
            ).toFormat('MM/dd/yy') +
              ' - ' +
              DateTime.fromJSDate(
                calendarCarouselRef?.current?.getEndDate() ?? new Date()
              ).toFormat('MM/dd/yy')}
          </Text>
          <TouchableOpacity onPress={handleContentVisible}>
            <Image
              source={isContentVisible ? ICONS.up : ICONS.down}
              resizeMode="contain"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Weight }) => {
    const displayDate = DateTime.fromISO(item.day)
      .toFormat('EEE, dd MMM')
      .toString();
    const displayTime = DateTime.fromISO(item.time)
      .toFormat('h:mm a')
      .toString();
    return isContentVisible ? (
      <SwipeableView
        onEditPress={() => {
          onEditPress(item);
        }}
        onDeletePress={() => onDeleteWeightPress(item.uuid)}
        style={styles.swipable}
      >
        <Pressable
          onPress={() => {
            onEditPress(item);
          }}
          style={styles.item}
        >
          <Text style={styles.weight}>
            {convertWeightAccordingToUnitWeight(Number(item.weight)).toFixed(2)}
            <Text color="secondaryText">&nbsp;{weightLabel}</Text>
          </Text>
          <Text style={styles.timestamp}>
            {displayDate + '\n' + displayTime}
          </Text>
        </Pressable>
      </SwipeableView>
    ) : null;
  };

  return (
    <>
      <BackNavigation
        title="Weight"
        rightIcon={ICONS.newAddPlus}
        onRightPress={onPressPlus}
        cardStyle={styles.cardStyle}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <CalendarCarousel
          calendarCarouselContainerStyle={styles.calendarCarouselContainer}
          onDateSelect={getWeights}
          ref={calendarCarouselRef}
        />
        <Card style={styles.chartCard}>
          <View style={styles.chartHeaderText}>
            <Text style={styles.headerOvr}>Weight Trend</Text>
          </View>
          {weightTrendData.length > 0 ? (
            <WeightTrendChart data={weightTrendData} target={target} />
          ) : null}
        </Card>
        <Card style={styles.roundedAndShadowView}>
          <FlatList
            data={weights}
            keyExtractor={(_item, index) => index.toString()}
            style={styles.sectonList}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
          />
        </Card>
      </ScrollView>
    </>
  );
};

const waterIntakeStyle = ({ white, border }: Branding) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: scaleWidth(16),
    },
    cardStyle: {
      padding: 0,
    },
    switchTabContainer: {
      marginTop: scaleHeight(12),
    },
    barChartContainer: {
      marginTop: scaleHeight(16),
    },
    stackChartContainer: {
      marginTop: scaleHeight(16),
    },
    calendarCarouselContainer: {
      marginTop: scaleHeight(24),
    },
    scrollViewStyle: {},
    contentContainerStyle: {
      paddingBottom: scaleHeight(75),
    },
    button: {
      borderRadius: scaledSize(4),
      marginTop: scaleHeight(64),
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    header: {
      borderBottomWidth: 1,
      borderColor: border,
      backgroundColor: white,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: scaleWidth(8),
      marginVertical: scaleHeight(16),
    },
    headerText: {
      marginStart: 6,
    },
    headerOvr: {
      fontSize: scaledSize(18),
      fontWeight: '600',
      lineHeight: scaleHeight(24),
    },
    weight: {
      fontSize: scaledSize(14),
      flex: 1,
    },
    arrowIcon: {
      ...scaled(24),
    },
    roundedAndShadowView: {
      marginVertical: scaleHeight(24),
    },
    timestamp: {
      textAlign: 'right',
    },
    swipable: {
      backgroundColor: white,
    },
    chartHeaderText: {
      alignSelf: 'flex-start',
      paddingTop: scaleHeight(16),
    },
    sectonList: {
      borderRadius: scaleWidth(12),
    },
    chartCard: {
      paddingHorizontal: scaleWidth(16),
      marginTop: scaleHeight(16),
    },
  });

export default React.memo(WeightScreen);
