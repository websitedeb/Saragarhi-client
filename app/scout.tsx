import { Frame } from "@/components/Forms/frame";
import { ScrollView, StyleSheet } from "react-native";

export default function Scout() {
    return (
        <ScrollView
            contentContainerStyle={styles.container}
            style={{ flex: 1, backgroundColor: '#374151' }}
        >
            <Frame>
                
            </Frame>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
    },
});
