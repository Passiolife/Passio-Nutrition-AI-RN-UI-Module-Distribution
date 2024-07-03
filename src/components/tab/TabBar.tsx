import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../../components';
import { Branding, useBranding } from '../../contexts';
import { scaleHeight } from '../../utils';

export interface TabBarProps {
  list: string[];
  onTabSelect: (value: string) => void;
}

export const TabBar = ({ list, onTabSelect }: TabBarProps) => {
  const styles = tabStyles(useBranding());
  const [tab, setTab] = useState<string>(list[0]);

  return (
    <View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.touchableTab}
          testID="testMealPlanClick"
          onPress={() => {
            setTab(list[0]);
            onTabSelect(list[0]);
          }}
        >
          <Text
            style={[styles.tabTex, tab === list[0] && styles.tabSelectText]}
          >
            {list[0]}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="testSuggestionClick"
          style={styles.touchableTab}
          onPress={() => {
            setTab(list[1]);
            onTabSelect(list[1]);
          }}
        >
          <Text
            color="secondaryText"
            style={[styles.tabTex, tab === list[1] && styles.tabSelectText]}
          >
            {list[1]}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.lineContainer}>
        <View
          style={[styles.tabLine, tab === list[0] && styles.tabSelectLine]}
        />
        <View
          style={[styles.tabLine, tab === list[1] && styles.tabSelectLine]}
        />
      </View>
    </View>
  );
};

const tabStyles = ({ primaryColor, text }: Branding) =>
  StyleSheet.create({
    tabContainer: {
      flexDirection: 'row',
      paddingVertical: scaleHeight(12),
    },
    touchableTab: {
      flex: 1,
    },
    tabTex: {
      fontSize: 18,
      fontWeight: '400',
      textAlign: 'center',
      color: text,
    },
    tabSelectText: {
      fontWeight: '600',
      color: primaryColor,
    },
    lineContainer: {
      flexDirection: 'row',
    },
    tabLine: {
      height: 2,
      borderRadius: 24,
      flex: 1,
    },
    tabSelectLine: {
      backgroundColor: primaryColor,
    },
  });
