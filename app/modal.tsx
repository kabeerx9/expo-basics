import { StatusBar } from 'expo-status-bar';
import { Platform, Text, View } from 'react-native';

export default function Modal() {
  return (
    <>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <View>
        <Text>This is the modal content</Text>
      </View>
    </>
  );
}
