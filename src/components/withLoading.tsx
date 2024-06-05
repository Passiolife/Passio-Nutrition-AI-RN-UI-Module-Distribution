import React from 'react';
import { ProgressLoadingView } from '../components/loader';
import { ErrorBoundary } from 'react-error-boundary';
import { errorFallback } from '../utils/withLoading';

export function withLoading<T>(WrappedComponent: React.FC<T>) {
  return (props: T) => (
    <ErrorBoundary FallbackComponent={errorFallback}>
      <React.Suspense fallback={<ProgressLoadingView />}>
        {/* @ts-ignore */}
        <WrappedComponent {...props} />
      </React.Suspense>
    </ErrorBoundary>
  );
}
