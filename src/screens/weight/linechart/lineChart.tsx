import React from 'react';
import { View, Dimensions } from 'react-native';
import {
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLine,
} from 'victory-native';
import { useBranding } from '../../../contexts';
import { scaleHeight, scaledSize } from '../../../utils';

export type WeightTrendChart = {
  value: number;
  label: string;
};

interface WeightTrendChartProps {
  data: WeightTrendChart[];
}

export const WeightTrendChart = ({ data }: WeightTrendChartProps) => {
  const { primaryColor, black } = useBranding();

  const maxValue = Math.max(...data.map((o) => o.value));

  return (
    <View
      style={{
        overflow: 'hidden',
        marginTop: scaleHeight(0),
        padding: scaledSize(16),
      }}
    >
      <VictoryChart
        domainPadding={{ x: 16 }}
        width={Dimensions.get('window').width - 60}
        theme={VictoryTheme.material}
        padding={{ left: 30, right: 30, bottom: 30, top: 0 }}
        height={125}
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
        />
        <VictoryAxis
          tickFormat={(item, index) => {
            return data.length === 7
              ? item.slice(0, 2)
              : (index % 8 === 0 || index === data.length - 1) === true
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

        <VictoryLine
          style={{
            labels: { display: 'none' },
            data: { stroke: primaryColor },
          }}
          x="label"
          y="value"
          data={data}
          interpolation="basis"
        />
      </VictoryChart>
    </View>
  );
};
