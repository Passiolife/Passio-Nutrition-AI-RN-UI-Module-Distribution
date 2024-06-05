import React from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
  FlatList,
  Dimensions,
} from 'react-native';

import { scaledSize, scaleHeight, scaled, scaleWidth } from '../../utils';
import { useBranding } from '../../contexts';
import type { Branding } from '../../contexts';
import { Card } from '../cards';
import { Text } from '../texts';
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryStack,
} from 'victory-native';
export interface StackDataType {
  value: number;
  color: string;
}

export interface StackChartData {
  stacks: StackDataType[];
  label: string;
}

export interface legendDataTyle {
  color: string;
  label: string;
}

export interface StackChartProps {
  title?: string;
  barChartContainerStyle?: StyleProp<ViewStyle>;
  stackData: StackChartData[];
  showInfo?: boolean;
  target?: number;
}

const chartLegendData: legendDataTyle[] = [
  { color: '#F59E0B', label: 'Calories' },
  { color: '#10B981', label: 'Protein' },
  { color: '#8B5CF6', label: 'Fat' },
  { color: '#0EA5E9', label: 'Carbs' },
];

function normalizeToMultipleOf(value: number, multiple: number) {
  const roundedValue = Math.round(value / multiple) * multiple;
  return roundedValue > value ? roundedValue : roundedValue + multiple;
}

export const StackChart = ({
  title = 'Macros',
  stackData,
  showInfo = true,
}: StackChartProps) => {
  const { black } = useBranding();

  let maxValue = stackData.reduce((max, day) => {
    const daySum = day.stacks.reduce((sum, stack) => sum + stack.value, 0);
    return Math.max(max, daySum);
  }, 0);

  maxValue = normalizeToMultipleOf(maxValue, 20);

  const transformedData = stackData.map((day) =>
    day.stacks.map((stack) => ({
      x: day.label,
      y: stack.value,
      fill: stack.color,
    }))
  );

  const styles = stackChartStyle(useBranding());

  const renderLegends = ({ item }: { item: legendDataTyle }) => {
    return (
      <View style={styles.indicatorView}>
        <View style={[styles.indicator, { backgroundColor: item.color }]} />
        <Text weight="400" size="_14px" color="text">
          {item.label}
        </Text>
      </View>
    );
  };

  return (
    <View>
      <Card style={styles.roundedAndShadowView}>
        <Text size="_18px" weight="600" color="text">
          {title}
        </Text>
        <View style={styles.chartView}>
          <VictoryChart
            domainPadding={{ x: 16 }}
            width={Dimensions.get('window').width - 45}
            theme={VictoryTheme.material}
            padding={{ left: 40, right: 30, bottom: 30, top: 10 }}
            height={135}
          >
            <VictoryAxis
              dependentAxis={true}
              maxDomain={{ y: maxValue }}
              minDomain={{ y: 0 }}
              style={{
                grid: {
                  stroke: '#CACACA',
                  strokeWidth: 1,
                  strokeDasharray: '6, 0',
                },
                ticks: { stroke: 'none' },
                axis: { stroke: 'none' },
                tickLabels: { fill: black },
              }}
              tickValues={[0, maxValue / 2, maxValue]}
            />
            <VictoryAxis
              tickFormat={(item, index) => {
                return stackData.length === 7
                  ? item.slice(0, 2)
                  : (index % 8 === 0 || index === stackData.length - 1) === true
                    ? item.replace(/\D/g, '')
                    : undefined;
              }}
              style={{
                tickLabels: {
                  fontSize: 12,
                  paddingTop: 0,
                  angle: 0,
                  fill: black,
                },
                grid: { stroke: 'none' },
                ticks: { stroke: 'node' },
                axis: { stroke: 'none' },
                axisLabel: { color: 'red' },
              }}
              maxDomain={{ y: maxValue }}
              minDomain={{ y: 0 }}
            />

            <VictoryStack>
              {transformedData[0] &&
                transformedData[0].map((_, i) => (
                  <VictoryBar
                    barRatio={0.6}
                    alignment={'middle'}
                    key={i}
                    barWidth={stackData.length > 7 ? 6 : 12}
                    data={transformedData.map((day) => day[i])}
                    style={{
                      data: {
                        fill: ({ datum }) => datum.fill,
                      },
                      labels: { display: 'none' },
                    }}
                  />
                ))}
            </VictoryStack>
          </VictoryChart>
        </View>
      </Card>
      {showInfo && (
        <View style={styles.legendView}>
          <FlatList
            data={chartLegendData}
            horizontal
            keyExtractor={(item) => item.label}
            renderItem={renderLegends}
            scrollEnabled={false}
            contentContainerStyle={styles.flatListContentContainerStyle}
          />
        </View>
      )}
    </View>
  );
};

const stackChartStyle = ({}: Branding) =>
  StyleSheet.create({
    roundedAndShadowView: {
      borderRadius: scaledSize(16),
      paddingVertical: scaledSize(16),
      paddingHorizontal: scaledSize(8),
      marginHorizontal: scaledSize(8),
      marginVertical: scaledSize(8),
    },
    chartView: {
      marginTop: scaleHeight(12),
    },
    legendView: {
      marginTop: scaleHeight(16),
    },
    indicator: {
      ...scaled(12),
      borderRadius: 6,
      marginRight: scaleWidth(8),
    },
    indicatorView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: scaleWidth(12),
    },
    flatListContentContainerStyle: {
      justifyContent: 'center',
      flex: 1,
    },
  });
