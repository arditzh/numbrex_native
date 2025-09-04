import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { NumberGame } from './src/components/NumberGame';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gameContainer}>
        <NumberGame />
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Light background from original design
  },
  gameContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
