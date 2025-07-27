import React from 'react';
import { View } from 'react-native';

export const BentoGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <View className="flex-row flex-wrap justify-between p-3">
      {children}
    </View>
  );
};

import type { ViewStyle } from 'react-native';

export type BentoBoxProps = {
  title?: string;
  children?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: ViewStyle;
};

export const BentoBox = ({ children, size = 'medium', className, style={} }: BentoBoxProps) => {
  const heightClass =
    size === 'small' ? 'h-24' : size === 'large' ? 'h-52' : 'h-36';

  return (
    <View className={`p-4 m-1 items-center justify-center flex-grow min-w-[40%] ${heightClass} ${className}`} style={style}>
      {children}
    </View>
  );
};
