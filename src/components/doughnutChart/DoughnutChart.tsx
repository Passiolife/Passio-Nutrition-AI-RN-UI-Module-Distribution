import React from 'react';
import { View } from 'react-native';
import Svg, { G, Path, type Linecap } from 'react-native-svg';

interface DoughnutChartData {
  progress: number;
  color: string;
}

interface DoughnutChartProps {
  data: DoughnutChartData[];
  size: number;
  strokeWidth?: number;
  startAngle?: number;
  gap: number;
  strokeLinecap?: Linecap;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  size,
  strokeWidth = 8,
  strokeLinecap = 'round',
  startAngle = -90, // Starting angle at 12 o'clock position
  gap = 10, // Angle in degrees for the gap at the end of each segment
}) => {
  const radius = size / 2;
  const diz = 180;

  // Calculate the total progress
  const totalProgress = data.reduce((total, item) => total + item.progress, 0);

  const calculatePath = (progress: number, _index: number) => {
    const segmentAngle = 360 * (progress / totalProgress);
    const endAngle = startAngle + segmentAngle;

    // Adjust endAngle for the gap
    const adjustedEndAngle = endAngle - gap;

    const x1 =
      radius +
      (radius - strokeWidth / 2) * Math.cos((Math.PI * startAngle) / diz);
    const y1 =
      radius +
      (radius - strokeWidth / 2) * Math.sin((Math.PI * startAngle) / diz);
    const x2 =
      radius +
      (radius - strokeWidth / 2) * Math.cos((Math.PI * adjustedEndAngle) / diz);
    const y2 =
      radius +
      (radius - strokeWidth / 2) * Math.sin((Math.PI * adjustedEndAngle) / diz);
    const largeArcFlag = segmentAngle <= diz ? 0 : 1;
    return `M${x1},${y1}
            A${radius - strokeWidth / 2},${
              radius - strokeWidth / 2
            } 0 ${largeArcFlag},1 ${x2},${y2}`;
  };

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
      }}
    >
      {totalProgress > 0 && (
        <Svg width={size} height={size}>
          {data.map((item, index) => {
            const path = calculatePath(item.progress, index);
            startAngle += 360 * (item.progress / totalProgress);
            return (
              <G key={index}>
                <Path
                  d={path}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap={strokeLinecap}
                />
              </G>
            );
          })}
        </Svg>
      )}
    </View>
  );
};

export default DoughnutChart;
