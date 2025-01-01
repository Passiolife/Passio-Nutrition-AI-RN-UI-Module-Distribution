import { DateTime } from 'luxon';
import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ICONS } from '../../assets';
import {
  BackNavigation,
  CalendarCarousel,
  Card,
  SwipeableView,
  Text,
  BarChart,
} from '../../components';
import type { Branding } from '../../contexts';
import { useBranding } from '../../contexts';
import { scaleHeight, scaleWidth, scaled, scaledSize } from '../../utils';
import { useWaters } from './useWaters';
import { QuickAddTracking } from './views/quickadd/QuickAdd';
import type { Water } from '../../models';

const WaterScreen = () => {
  const {
    calendarCarouselRef,
    chartData,
    target,
    isContentVisible,
    isImperialWeight,
    ogMlLabel,
    waters,
    convertConsumeValueAsUnitSystem,
    getWaters,
    handleContentVisible,
    onDeleteWaterPress,
    onEditPress,
    onPressPlus,
    onPressQuickAdd,
  } = useWaters();

  const styles = waterIntakeStyle(useBranding());

  const renderItem = ({ item }: { item: Water }) => {
    const displayDate = DateTime.fromISO(item.day)
      .toFormat('EEE, dd MMM')
      .toString();
    const displayTime = DateTime.fromISO(item.time)
      .toFormat('h:mm a')
      .toString();
    return isContentVisible ? (
      <SwipeableView
        onDeletePress={() => onDeleteWaterPress(item.uuid)}
        onEditPress={() => onEditPress(item)}
        style={styles.swipple}
      >
        <Pressable onPress={() => onEditPress(item)} style={styles.item}>
          <Text weight="600" style={styles.weight}>
            {Math.round(convertConsumeValueAsUnitSystem(Number(item.consumed)))}
            <Text weight="400" color="secondaryText">
              &nbsp;{ogMlLabel}
            </Text>
          </Text>
          <Text weight="400" style={styles.timestamp}>
            {displayDate + '\n' + displayTime}
          </Text>
        </Pressable>
      </SwipeableView>
    ) : null;
  };

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

  const renderFooter = () => {
    return <View style={styles.footer} />;
  };

  return (
    <>
      <BackNavigation
        title="Water"
        rightIcon={ICONS.newAddPlus}
        onRightPress={onPressPlus}
        cardStyle={styles.cardStyle}
      />
      <ScrollView style={styles.container}>
        <CalendarCarousel
          ref={calendarCarouselRef}
          calendarCarouselContainerStyle={styles.calendarCarouselContainer}
          onDateSelect={getWaters}
        />

        {chartData.length > 0 && (
          <BarChart
            barData={chartData}
            title="Water Trend"
            barChartContainerStyle={{ marginTop: 16 }}
            target={target}
          />
        )}
        <QuickAddTracking
          isImperial={isImperialWeight}
          label={ogMlLabel}
          onPress={(val) => onPressQuickAdd(val)}
        />
        <Card style={styles.roundedAndShadowView}>
          <FlatList
            data={waters}
            keyExtractor={(_item, index) => index.toString()}
            style={styles.sectionList}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
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
      paddingVertical: 0,
    },
    footer: {
      height: 0,
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
      marginStart: 8,
    },
    weight: {
      fontSize: scaledSize(14),
      flex: 1,
    },
    arrowIcon: {
      ...scaled(24),
    },
    roundedAndShadowView: {
      marginVertical: scaleHeight(8),
    },
    timestamp: {
      textAlign: 'right',
    },
    swipple: {
      backgroundColor: white,
      elevation: 0,
    },
    sectionList: {
      borderRadius: scaleWidth(12),
    },
  });

export default WaterScreen;
