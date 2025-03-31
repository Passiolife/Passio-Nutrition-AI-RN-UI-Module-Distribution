import React from 'react';
import { View, Dimensions } from 'react-native';
import {
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLine,
  VictoryScatter,
  VictoryVoronoiContainer,
} from 'victory-native';
import { useBranding } from '../../../contexts';
import { scaleHeight, scaledSize } from '../../../utils';

export type WeightTrendChart = {
  value: number;
  label: string;
};

interface WeightTrendChartProps {
  data: WeightTrendChart[];
  target: number;
}

export const WeightTrendChart = ({ data, target }: WeightTrendChartProps) => {
  const { primaryColor, black } = useBranding();

  let maxValue = Math.max(...data.map((o) => o.value));

  if (maxValue < target) {
    maxValue = Math.round(target + (target % 20));
  } else {
    maxValue = maxValue > 0 ? Math.round(maxValue + 10) : 30;
  }

  // Break data into segments of consecutive points
  const segments = [];
  let currentSegment = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i].value > 0) {
      currentSegment.push(data[i]);
    } else {
      if (currentSegment.length > 0) {
        segments.push(currentSegment);
        currentSegment = [];
      }

      segments.push([data[i]]);
    }
  }

  // Add the last segment if it's non-empty
  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  return (
    <View
      style={{
        overflow: 'hidden',
        marginTop: scaleHeight(0),
        height: 190,
        paddingVertical: scaledSize(16),
      }}
    >
      <VictoryChart
        containerComponent={<VictoryVoronoiContainer />}
        domainPadding={{ x: 16 }}
        width={Dimensions.get('window').width - 60}
        theme={VictoryTheme.material}
        padding={{ left: 40, right: 40, bottom: 30, top: 10 }}
        height={140}
      >
        <VictoryAxis
          dependentAxis={true}
          tickValues={[0, Math.round(maxValue / 2), maxValue]}
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
            grid: { stroke: 'none' },
            ticks: { stroke: 'node' },
            axis: { stroke: 'none' },
          }}
          maxDomain={{ y: maxValue }}
          minDomain={{ y: 0 }}
        />

        {segments.map((segment, index) => (
          <VictoryLine
            key={index}
            style={{
              labels: { display: 'none' },
              data: { stroke: primaryColor },
            }}
            x="label"
            y="value"
            data={segment}
            interpolation="monotoneX"
          />
        ))}

        <VictoryScatter
          data={data.filter((o) => o.value > 0)}
          size={4}
          style={{
            labels: { display: 'none' },
            data: { fill: primaryColor },
          }}
          x="label"
          y="value"
        />

        {/* Dotted Line for Target */}
        <VictoryLine
          data={[
            { x: data[0]?.label, y: target },
            { x: data[data.length - 1]?.label, y: target },
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
      </VictoryChart>
    </View>
  );
};
