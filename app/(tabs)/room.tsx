
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { RoomHeader } from '@/components/room/RoomHeader';
import { RoomList } from '@/components/room/RoomList';

export default function RoomScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <RoomHeader />
        <RoomList />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },
});
