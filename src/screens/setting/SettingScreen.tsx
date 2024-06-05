import React from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { BackNavigation, Card, DashboardMenu, Text } from '../../components';
import { COLORS } from '../../constants';
import type { LengthUnitSetting, WeightUnitSetting } from '../../models';
import { ListPicker } from '../../components/listPickers';
import { useSettingScreen } from './useSettingScreen';
import { scaleHeight } from '../../utils';
import { useBranding, type Branding } from '../../contexts';

export const SettingScreen = () => {
  return <SettingScreenView />;
};

const weightUnitOptions: WeightUnitSetting[] = ['Lbs', 'Kgs'];
const lengthUnitOptions: LengthUnitSetting[] = ['Feet, Inch', 'Meter'];

export const SettingScreenView = () => {
  const {
    unitLength,
    unitWeight,
    onLengthUnitPress,
    onWeightUnitPress,
    breakfastNotification,
    lunchNotification,
    dinnerNotification,
    onUpdateBreakfast,
    onUpdateDinner,
    onUpdateLunch,
  } = useSettingScreen();

  const branding = useBranding();
  const styles = profileScreenStyle(branding);

  return (
    <View style={styles.container}>
      <BackNavigation
        title="Settings"
        rightSide={<DashboardMenu hide={['My Profile', 'Settings']} />}
      />
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.cardContainer}>
          <Text
            weight="600"
            size="_16px"
            color="text"
            style={[
              styles.label,
              styles.labelMargin,
              { marginBottom: 16, marginTop: 4 },
            ]}
          >
            {'Units for My Profile '}
          </Text>

          <View
            style={[
              styles.formRow,
              styles.formRowMarginBottom,
              styles.formRowCentered,
            ]}
          >
            <Text
              weight="400"
              size="_14px"
              color="gray500"
              style={styles.label}
            >
              {'Length'}
            </Text>

            <ListPicker
              value={unitLength}
              title={'Select Length'}
              onChange={(value) => {
                onLengthUnitPress(value);
              }}
              lists={lengthUnitOptions}
              style={styles.pickerTextInput}
              error={''}
            />
          </View>
          <View
            style={[
              styles.formRow,
              styles.formRowMarginBottom,
              styles.formRowCentered,
            ]}
          >
            <Text
              weight="400"
              size="_14px"
              color="gray500"
              style={styles.label}
            >
              {'Weight'}
            </Text>

            <ListPicker
              value={unitWeight}
              title={'Select Weight'}
              onChange={(value) => {
                onWeightUnitPress(value);
              }}
              lists={weightUnitOptions}
              style={styles.pickerTextInput}
              error={''}
            />
          </View>
        </Card>

        <Card style={styles.cardContainer}>
          <Text
            weight="600"
            size="_16px"
            color="text"
            style={[
              styles.label,
              styles.labelMargin,
              { marginBottom: 16, marginTop: 4 },
            ]}
          >
            {'Reminders'}
          </Text>

          <View
            style={[
              styles.formRow,
              styles.formRowMarginBottom,
              styles.formRowCentered,
            ]}
          >
            <Text
              weight="400"
              size="_14px"
              color="gray500"
              style={styles.label}
            >
              {'Breakfast (8 AM)'}
            </Text>

            <Switch
              onChange={onUpdateBreakfast}
              thumbColor={branding.white}
              value={breakfastNotification}
              trackColor={{
                true: branding.primaryColor,
              }}
            />
          </View>
          <View
            style={[
              styles.formRow,
              styles.formRowMarginBottom,
              styles.formRowCentered,
            ]}
          >
            <Text
              weight="400"
              size="_14px"
              color="gray500"
              style={styles.label}
            >
              {'Lunch (12 PM)'}
            </Text>

            <Switch
              thumbColor={branding.white}
              onChange={onUpdateLunch}
              trackColor={{
                true: branding.primaryColor,
              }}
              value={lunchNotification}
            />
          </View>
          <View
            style={[
              styles.formRow,
              styles.formRowMarginBottom,
              styles.formRowCentered,
            ]}
          >
            <Text
              weight="400"
              size="_14px"
              color="gray500"
              style={styles.label}
            >
              {'Dinner (5 PM)'}
            </Text>

            <Switch
              thumbColor={branding.white}
              trackColor={{
                true: branding.primaryColor,
              }}
              onChange={onUpdateDinner}
              value={dinnerNotification}
            />
          </View>
        </Card>

        <View style={styles.verticalSpace} />
      </ScrollView>
      <View style={styles.flexSpace} />
    </View>
  );
};

const profileScreenStyle = ({ backgroundColor, white, border }: Branding) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    header: {
      marginTop: 16,
      marginBottom: 17,
      alignItems: 'center',
      flexDirection: 'row',
    },
    backIcon: {
      height: 24,
      width: 24,
    },
    headerText: {
      fontSize: 26,
      flex: 1,
      textAlign: 'center',
      color: COLORS.blue1,
    },
    cardContainer: {
      paddingVertical: scaleHeight(16),
      flex: 1,
      paddingHorizontal: scaleHeight(16),
      marginHorizontal: scaleHeight(16),
      marginVertical: scaleHeight(16),
    },
    formRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    formRowCentered: {
      alignItems: 'center',
    },
    formRowMarginBottom: {
      marginBottom: 16,
    },
    formRowSeparator: {
      height: 10,
    },
    label: {
      flex: 1,
    },
    labelMargin: {
      marginTop: 10,
    },
    textInput: {
      textAlign: 'left',
      flex: 1,
      backgroundColor: white,
      borderColor: border,
      paddingVertical: scaleHeight(8),
      borderRadius: scaleHeight(4),
    },
    containerTextInput: {
      flex: 1,
    },

    pickerTextInput: {
      flexWrap: 'wrap',
      textAlign: 'right',
    },
    bottomContainer: {
      flex: 1,
    },
    macroHeading: {
      fontSize: 18,
      color: COLORS.grey7,
      marginBottom: 10,
      textAlign: 'center',
    },
    macrosContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    macro: {
      marginRight: 16,
    },
    flexSpace: {
      flex: 1,
    },
    footer: {
      marginVertical: 24,
    },
    button: {
      borderRadius: 8,
      marginHorizontal: 16,
    },
    informationText: {
      textAlign: 'center',
      fontWeight: '500',
      paddingHorizontal: 20,
      color: COLORS.grayscaleBody,
    },
    verticalSpace: {
      height: 180,
    },
  });
