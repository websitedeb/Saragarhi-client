import React from 'react';
import { View } from 'react-native';

export const BentoGrid = ({ children, className="" }: { children: React.ReactNode, className?: string }) => {
  return (
    <View 
    style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      padding: 8,
      alignItems: 'center',
      gap: 0,
      marginBottom: 16,
    }}
    className={className}
  >
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
  style?: ViewStyle | ViewStyle[];
};

export const BentoBox = ({ children, size = 'medium', className, style = {} }: BentoBoxProps) => {
  const heightClass =
    size === 'small' ? 'h-12' : size === 'large' ? 'h-52' : 'h-36';

  return (
    <View className={`p-4 m-1 items-center justify-center flex-grow min-w-[40%] ${heightClass} ${className}`} style={style}>
      {children}
    </View>
  );
};
