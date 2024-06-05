import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

// Extend the props type to include radius
interface ProgressBarProps {
  progress: number; // Current progress as a percentage
  width: number; // Width of the progress bar
  height?: number; // Optional height, with a default value if not provided
  backgroundColor?: string; // Optional background color
  progressColor?: string; // Optional progress color
  radius?: number; // Optional corner radius
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  width,
  height = 10, // Default height if not specified
  backgroundColor = 'rgba(238, 242, 255, 1)', // Default background color
  progressColor = 'rgba(79, 70, 229, 1)', // Default progress color
  radius = 0, // Default radius if not specified
}) => {
  const progressWidth = (width * progress) / 100;

  return (
    <View
      style={[
        styles.container,
        { width, height, backgroundColor, borderRadius: radius },
      ]}
    >
      <Svg height="100%" width="100%">
        <Rect
          x="0"
          y="0"
          width={progressWidth.toString()} // Convert to string
          height="100%"
          fill={progressColor}
          rx={radius} // Set the radius for rounded corners
          ry={radius} // Same as rx for consistent rounding
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden', // Ensure the background does not bleed outside the border radius
  },
});

export default ProgressBar;
