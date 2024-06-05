import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface BMIIndicatorProps {
  bmi: number;
}

const BMIIndicator: React.FC<BMIIndicatorProps> = ({ bmi }) => {
  // Determine BMI category
  let category = '';
  let colors: string[] = [];
  let categoryText = '';

  if (bmi < 18.5) {
    category = 'Underweight';
    colors = ['#00bfff', '#00ff00']; // Blue to Green
    categoryText = 'Underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal weight';
    colors = ['#00ff00', '#ffff00']; // Green to Yellow
    categoryText = 'Normal';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    colors = ['#ffff00', '#ff4500']; // Yellow to Orange
    categoryText = 'Overweight';
  } else {
    category = 'Obese';
    colors = ['#ff4500', '#ff0000']; // Orange to Red
    categoryText = 'Obese';
  }

  // Calculate progress
  const progress = (bmi - 18.5) / 6.5; // Normalizing BMI range to 0-1

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>
      <LinearGradient
        colors={colors}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.text}>BMI: {bmi.toFixed(2)}</Text>
        <Text style={styles.text}>Category: {category}</Text>
      </LinearGradient>
      <Text style={styles.categoryText}>{categoryText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  progressBarContainer: {
    width: '80%',
    height: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007aff',
    borderRadius: 10,
  },
  gradientContainer: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default BMIIndicator;
