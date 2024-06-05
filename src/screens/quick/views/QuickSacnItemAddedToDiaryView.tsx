import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { BasicButton, Card, Text } from '../../../components';
import { ICONS } from '../../../assets';
interface Props {
  onViewDiaryPress?: () => void;
  onContinueScanningPress?: () => void;
}

export const QuickScanItemAddedToDiaryView = ({
  onViewDiaryPress,
  onContinueScanningPress,
}: Props) => {
  return (
    <Card style={styles.container}>
      <View style={styles.contentContainer}>
        <Image source={ICONS.addedToDiary} style={styles.icon} />
        <Text weight="700" size="_20px" style={styles.title}>
          Item Added To Diary
        </Text>
        <Text style={styles.description}>
          View your diary or continue scanning
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <BasicButton
          secondary
          onPress={onViewDiaryPress}
          style={styles.button}
          text={'View Diary'}
        />
        <BasicButton
          text="Continue Scanning"
          onPress={onContinueScanningPress}
          style={styles.button}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: 'white',
    bottom: 40,
    paddingVertical: 8,
    right: 8,
    left: 8,
  },
  contentContainer: {
    flexDirection: 'column',
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 24,
    width: 24,
    marginVertical: 12,
  },
  title: {
    marginVertical: 3,
    textAlign: 'center',
  },
  description: {
    marginBottom: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default QuickScanItemAddedToDiaryView;
