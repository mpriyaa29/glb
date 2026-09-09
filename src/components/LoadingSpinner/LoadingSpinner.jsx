import React from 'react';
import { InfinityLoader } from './InfinityLoader';

export function LoadingSpinner({ progress = 0, message }) {
  return <InfinityLoader progress={progress} message={message} />;
}
