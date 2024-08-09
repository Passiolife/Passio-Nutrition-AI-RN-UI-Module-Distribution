import React from 'react';
import { Dimensions } from 'react-native';
import { View } from 'react-native';
import { Path, Svg } from 'react-native-svg';

const ScanSVG = ({ margin = 40 }: { margin?: number }) => {
  return (
    <View style={{ alignItems: 'center', marginVertical: 16 }}>
      <Svg
        width={Dimensions.get('window').width - margin}
        height="360"
        fill="none"
        viewBox="0 0 384 384"
      >
        <Path
          stroke="#fff"
          strokeLinecap="round"
          strokeWidth="4"
          d="M102 2H18C9.163 2 2 9.163 2 18v84M102 382H18c-8.837 0-16-7.163-16-16v-84M282 2h84c8.837 0 16 7.163 16 16v84M282 382h84c8.837 0 16-7.163 16-16v-84"
        />
      </Svg>
    </View>
  );
};

export default ScanSVG;
