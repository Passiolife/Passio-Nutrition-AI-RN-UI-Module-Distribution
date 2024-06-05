import React from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity, View } from 'react-native';
import { BackNavigation, DashboardMenu, Text } from '../../components';
import { withLoading } from '../../components/withLoading';
import type { ParamList } from '../../navigaitons';
import { useProgress } from './useProgress';
import progressScreenStyle from './ProgressScreen.style';
import Macros from './views/macros/Macros';
import Micros from './views/micros/Micros';
import { useBranding } from '../../contexts';

export type ProgressScreenNavigationProps = StackNavigationProp<
  ParamList,
  'ProgressScreen'
>;

export interface ProgressScreenProps {}

const ProgressScreen = () => {
  const { tab, onSelectTab } = useProgress();
  const styles = progressScreenStyle(useBranding());

  const renderTab = () => {
    return (
      <View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.touchableTab}
            testID="testMealPlanClick"
            onPress={() => onSelectTab('Macro')}
          >
            <Text
              style={[styles.tabTex, tab === 'Macro' && styles.tabSelectText]}
            >
              Macros
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="testSuggestionClick"
            style={styles.touchableTab}
            onPress={() => onSelectTab('Micro')}
          >
            <Text
              color="secondaryText"
              style={[styles.tabTex, tab === 'Micro' && styles.tabSelectText]}
            >
              Micros
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.lineContainer}>
          <View
            style={[styles.tabLine, tab === 'Macro' && styles.tabSelectLine]}
          />
          <View
            style={[styles.tabLine, tab === 'Micro' && styles.tabSelectLine]}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.bodyContainer} testID="testView">
      <BackNavigation
        title="My Progress"
        rightSide={<DashboardMenu />}
        bottomView={renderTab()}
        cardStyle={styles.cardStyle}
      />
      {tab === 'Macro' && <Macros />}
      {tab === 'Micro' && <Micros />}
    </View>
  );
};

export default withLoading(ProgressScreen);
