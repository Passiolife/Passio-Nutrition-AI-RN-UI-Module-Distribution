import React from 'react';
import { View, ActivityIndicator, type ViewStyle } from 'react-native';
import { useBranding } from '../../contexts';

interface Props {
  text?: string;
}

export const ProgressLoadingView: React.FC<Props> = (_: Props) => {
  const { primaryColor } = useBranding();
  const render: () => JSX.Element = () => {
    return (
      <>
        <View style={passioSdkBaseContainerStyle}>
          <ActivityIndicator
            size="large"
            color={primaryColor}
            accessibilityIgnoresInvertColors={false}
          />
        </View>
      </>
    );
  };
  return render();
};

const passioSdkBaseContainerStyle: ViewStyle = {
  flex: 1,
  alignSelf: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
};
