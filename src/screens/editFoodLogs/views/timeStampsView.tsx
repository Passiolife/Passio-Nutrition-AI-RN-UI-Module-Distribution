import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text } from '../../../components';
import { dateFormatter, scaleHeight, scaledSize } from '../../../utils';
import { content } from '../../../constants/Content';
import { useBranding, type Branding } from '../../../contexts';

interface Props {
  date: string;
  onPress: () => void;
}

export const TimeStampView = ({ date, onPress }: Props) => {
  let d = new Date(date);
  const styles = timeStampViewStyle(useBranding());

  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress}>
      <Card style={styles.container}>
        <Text weight="600" size="title" color="text" style={styles.headerText}>
          {content.date}
        </Text>
        <View style={styles.timeStampContainer}>
          <Text weight="400" size="_16px" color="text" style={styles.dateText}>
            {dateFormatter(d)}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const timeStampViewStyle = ({ border }: Branding) =>
  StyleSheet.create({
    container: {
      marginTop: scaleHeight(16),
      paddingVertical: scaleHeight(12),
      paddingHorizontal: scaleHeight(13),
      flexDirection: 'column',
    },
    headerText: {
      lineHeight: 16,
      paddingTop: scaleHeight(12),
    },
    timeStampContainer: {
      marginTop: scaleHeight(12),
      marginBottom: scaleHeight(12),
      paddingHorizontal: 19,
      borderColor: border,
      flex: 1,
      borderWidth: 1,
      borderRadius: scaledSize(8),
    },
    dateText: {
      lineHeight: 18,
      paddingVertical: scaleHeight(12),
    },
  });
