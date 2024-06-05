import React from 'react';
import { ProgressLoadingView } from '../components';
import { Text, View } from 'react-native';

export function withLoading<T>(WrappedComponent: React.FC<T>) {
  return (props: T) => (
    <React.Suspense fallback={<ProgressLoadingView />}>
      {/* @ts-ignore */}
      <WrappedComponent {...props} />
    </React.Suspense>
  );
}
export function errorFallback({ error }: { error: Error }) {
  return (
    <View>
      <Text>An error occurred</Text>
      <Text>{error.message}</Text>
    </View>
  );
}
