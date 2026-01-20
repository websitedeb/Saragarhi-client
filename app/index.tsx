import { getSession } from '@/hooks/session';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSignStore } from "@/hooks/store";
import { DB_URL } from '@/constants/constants';

export default function SignIn() {
  useEffect(() => {
    (async () => {
      const token = await getSession();
      if (token) {
        router.push("/dashboard");
      }
      const { setSign } = useSignStore() as { setSign: (sign: any) => void };
      const res = await fetch(`${DB_URL}/get-sign`);
      const data = await res.json();
      setSign(data.sign);
    })();
  }, []);

  return (
    <View className="flex-1 bg-gray-900 justify-center items-center">
      <Image 
        source={require("../assets/images/icon.png")} 
        style={{ width: 200, height: 200, resizeMode: 'cover' }} 
      />

      <MaskedView
        maskElement={
          <Text 
            style={{
              fontSize: 48,
              fontFamily: 'Shrikhand',
              color: 'white',
              textAlign: 'center'
            }}
          >
            Saragarhi
          </Text>
        }
      >
        <LinearGradient
          colors={['#ed1c24', '#ed1c24', '#341717']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ height: 60, width: 300 }}
        />
      </MaskedView>

      <Text style={{ marginTop: 10, color: 'white', fontSize: 24, fontFamily: 'Inter' }}>
        Welcome!
      </Text>
      
      <TouchableOpacity
          onPress={() => router.push('/signin')}
          className="bg-red-600 rounded-3xl px-6 py-3 mt-20"
      >
          <Text className="text-white text-center font-bold text-2xl pl-10 pr-10" style={{ fontFamily: "Inter"}}>Ready?</Text>
      </TouchableOpacity>
    </View>
  );
}
