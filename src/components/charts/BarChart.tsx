import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
  Dimensions,
} from 'react-native';
import React from 'react';
import { Text } from '../texts';
import { useBranding } from '../../contexts';
import type { Branding } from '../../contexts';
import { scaledSize, scaleHeight } from '../../utils';

import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLine,
} from 'victory-native';

import { Card } from '../cards';

export interface ChartData {
  value: number;
  label: string;
}

const ChartData: ChartData[] = [
  { label: 'Mo', value: 10 },
  { label: 'Tu', value: 20 },
  { label: 'We', value: 15 },
  { label: 'Th', value: 30 },
  { label: 'Fr', value: 18 },
  { label: 'Sa', value: 35 },
  { label: 'Su', value: 50 },
];

export interface BarChartProps {
  title?: string;
  barChartContainerStyle?: StyleProp<ViewStyle>;
  barData: ChartData[];
  target?: number;
}

export const BarChart = ({
  title = 'Calories',
  barChartContainerStyle,
  barData,
  target,
}: BarChartProps) => {
  const { calories, black } = useBranding();
  const styles = barChartStyle(useBranding());

  let maxValue = Math.max(...barData.map((o) => o.value));

  if (target) {
    if (maxValue < target) {
      maxValue = Math.round(target + (target % 20));
    } else {
      maxValue = maxValue > 0 ? Math.round(maxValue + 10) : 30;
    }
  }

  maxValue = maxValue > 0 ? maxValue : 30;
  return (
    <View style={barChartContainerStyle}>
      <Card style={styles.roundedAndShadowView}>
        <Text size="_18px" weight="600" color="text">
          {title}
        </Text>

        <View style={styles.chartView}>
          <VictoryChart
            domainPadding={{ x: 16 }}
            width={Dimensions.get('window').width - 50}
            theme={VictoryTheme.material}
            padding={{ left: 40, right: 30, bottom: 30, top: 20 }}
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
              tickValues={[0, Math.round(maxValue / 2), maxValue]}
            />
            <VictoryAxis
              tickFormat={(item, index) => {
                return barData.length === 7
                  ? item.slice(0, 2)
                  : (index % 8 === 0 || index === barData.length - 1) === true
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

            <VictoryBar
              barRatio={0.6}
              alignment={'middle'}
              data={barData}
              x="label"
              y="value"
              barWidth={barData.length > 7 ? 6 : 12}
              animate={{
                duration: 1000,
                onLoad: { duration: 500 },
              }}
              style={{
                labels: { display: 'none' },
                data: { fill: calories },
              }}
            />

            {/* Dotted Line for Target */}
            {target && (
              <VictoryLine
                data={[
                  { x: barData[0]?.label, y: target },
                  { x: barData[barData.length - 1]?.label, y: target },
                ]}
                style={{
                  data: {
                    stroke: 'rgba(16, 185, 129, 1)', // Set your preferred color for the dotted line
                    strokeDasharray: '5, 5', // Dotted line style
                  },
                  labels: { display: 'none' },
                }}
                x="x"
                y="y"
              />
            )}
          </VictoryChart>
        </View>
      </Card>
    </View>
  );
};

const barChartStyle = ({}: Branding) =>
  StyleSheet.create({
    roundedAndShadowView: {
      borderRadius: scaledSize(16),
      padding: scaledSize(16),
    },
    chartView: {
      marginTop: scaleHeight(12),
    },
    noData: {
      marginTop: scaleHeight(20),
      minHeight: 100,
      textAlign: 'center',
      justifyContent: 'center',
    },
  });
