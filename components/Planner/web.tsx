import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function Web() {
  const [Comp, setComp] = useState<React.ReactNode>(
    <View>
      <Text>Loading Planner...</Text>
      <ActivityIndicator size="large" color="#ed1c24" />
    </View>
  );

  useEffect(() => {
    (async () => {
      const { WithSkiaWeb } = await import(
        '@shopify/react-native-skia/lib/module/web'
      );

      const Wrapped = (
        <WithSkiaWeb
          getComponent={() => import('./web_skia')}
          fallback={<Text>Loading Planner...</Text>}
          opts={{ locateFile: () => `/canvaskit.wasm` }}
        />
      );

      setComp(Wrapped);
    })();
  }, []);

  return Comp;
}
