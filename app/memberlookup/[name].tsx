import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function MemberPage(){
    const { name } : any = useLocalSearchParams();

    return(
        <View>
            <Text>{name}!</Text>
        </View>
    );
}