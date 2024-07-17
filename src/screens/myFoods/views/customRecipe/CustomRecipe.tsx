import { View } from 'react-native';

import React from 'react';
import { Text } from '../../../../components';

interface Props {}

const CustomRecipe = ({}: Props) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Coming soon...</Text>
    </View>
  );
};
export default React.memo(CustomRecipe);
