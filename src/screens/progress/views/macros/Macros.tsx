import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useBranding } from '../../../../contexts';
import type { Branding } from '../../../../contexts';
import {
  CalendarCarousel,
  BasicButton,
  CustomActivityIndicator,
  StackChart,
} from '../../../../components';
import { scaleHeight, scaleWidth, scaledSize } from '../../../../utils';
import { useMacros } from './useMacros';

const Macros = () => {
  const {
    macroChartData,
    fetchData,
    calories,
    calendarCarouselRef,
    targetCalories,
    targetFat,
    targetCarbs,
    targetProtein,
    loading,
  } = useMacros();

  const styles = macrosStyle(useBranding());

  return (
    <View style={styles.container}>
      <CalendarCarousel
        ref={calendarCarouselRef}
        calendarCarouselContainerStyle={styles.calendarCarouselContainer}
        onDateSelect={(sd, ed, type) => {
          return fetchData(sd, ed, type);
        }}
      />
      {loading ? (
        <CustomActivityIndicator style={{ marginTop: 90 }} />
      ) : (
        <>
          <ScrollView
            style={styles.scrollViewStyle}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerStyle}
          >
            {calories.length > 0 ? (
              <StackChart
                barChartContainerStyle={styles.stackChartContainer}
                stackData={calories ?? []}
                title="Calories"
                showInfo={false}
                target={targetCalories}
              />
            ) : null}

            {macroChartData.length > 0 ? (
              <StackChart
                barChartContainerStyle={styles.stackChartContainer}
                title="Macros"
                target={targetFat + targetProtein + targetCarbs}
                stackData={macroChartData ?? []}
              />
            ) : null}
          </ScrollView>
          <BasicButton
            style={styles.button}
            text="Generate Report"
            onPress={() => null}
          />
        </>
      )}
    </View>
  );
};

const macrosStyle = ({}: Branding) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: scaleWidth(16),
      flex: 1,
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
      marginVertical: scaleHeight(16),
    },
  });

export default React.memo(Macros);
