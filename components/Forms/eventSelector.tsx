import { Year } from '@/constants/constants';
import { useEvent } from '@/hooks/store';
import { Fonts } from '@/hooks/useFont';
import { Picker } from '@react-native-picker/picker';
import { useQuery } from '@tanstack/react-query';
import { Text, View } from 'react-native';

export default function EventSelector() {
  const { event, setEvent } = useEvent() as unknown as {
    event: string;
    setEvent: (event: string) => void;
  };

  const { data: evts, isLoading, isError, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await fetch(`https://www.thebluealliance.com/api/v3/events/${Year}/simple`, {
        headers: {
          'X-TBA-Auth-Key': 'Cs7SlKYcjtXTJeGskesduTVc44ensMcSSKBMUNsaydPa6GATv1EGH8tiAzUlaV6x',
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch: ${res.status} - ${errorText}`);
      }

      return res.json();
    },
  });

  return (
    <View className="bg-red-600 rounded-lg px-4 py-2 w-[90%] self-center mt-4">
      <Text className="text-white text-base mb-1 font-bold" style={{ fontFamily: Fonts.Inter }}>
        Select Event
      </Text>
      <Picker
        selectedValue={event}
        onValueChange={setEvent}
        dropdownIconColor="white"
        style={{
          color: 'white',
          fontFamily: 'Inter',
        }}
        itemStyle={{ fontFamily: 'Inter' }}
      >
        {isLoading && <Picker.Item label="Loading..." value="" />}
        {evts?.map((e: any) => (
          <Picker.Item label={e.name} value={e.key} key={e.name} />
        ))}
      </Picker>
    </View>
  );
}
