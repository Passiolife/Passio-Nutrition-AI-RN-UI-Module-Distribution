import React, { useRef } from 'react';
import { Pressable, View } from 'react-native';
import { useBranding } from '../contexts';
import { LogOptions, Text, type FloatingOptionRef } from '../components';
import { FloatingOption } from '../components';
import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3';
import {
  TabBarProps,
  bottomTabStyle,
  BottomNavTab,
  renderTabBarIcons,
} from './BottomTabNavigations';

export const TabBar = React.memo((props: TabBarProps) => {
  const { navigation, state } = props;
  const branding = useBranding();
  const styles = bottomTabStyle(branding);
  const floatingRef = useRef<FloatingOptionRef>(null);

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const menu: BottomNavTab = props.items[index] as BottomNavTab;
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            canPreventDefault: true,
            target: route.key,
            type: 'tabPress',
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            // navigation.navigate({merge: true, name: route.name});
            navigation.navigate(route.name);
          }
        };

        if (menu.title === 'Blank') {
          return (
            <FloatingOption
              ref={floatingRef}
              options={
                <LogOptions
                  onClose={function (): void {}}
                  onFoodScanner={async () => {
                    const isAuthorize =
                      await PassioSDK.requestCameraAuthorization();
                    if (isAuthorize) {
                      floatingRef.current?.onClose();
                      props.onFoodScanner();
                    }
                  }}
                  onTextSearch={() => {
                    floatingRef.current?.onClose();
                    props.onTextSearch();
                  }}
                  onFavorite={() => {
                    floatingRef.current?.onClose();
                    props.onFavorite();
                  }}
                  onVoiceLogging={() => {
                    floatingRef.current?.onClose();
                    props.onVoiceLogging();
                  }}
                />
              }
            />
          );
        }
        return (
          <Pressable
            key={`${route.name}-${index}-TabBar`}
            accessibilityRole="button"
            onPress={onPress}
            accessibilityState={isFocused ? { selected: true } : {}}
            style={styles.tabBarItemStyle}
          >
            {renderTabBarIcons(menu.icon, isFocused, branding)}
            <Text
              weight="400"
              size="_12px"
              style={styles.tabItemText}
              color={isFocused ? 'primaryColor' : 'gray300'}
            >
              {menu.title}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});
