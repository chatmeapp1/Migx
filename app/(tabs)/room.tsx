import { StyleSheet, View, SafeAreaView } from 'react-native';
import { useThemeCustom } from '@/theme/provider';
import { RoomHeader } from '@/components/room/RoomHeader';
import { RoomList } from '@/components/room/RoomList';
import { SwipeableScreen } from '@/components/navigation/SwipeableScreen';

export default function RoomScreen() {
  const { theme } = useThemeCustom();
  
  return (
    <SwipeableScreen>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SafeAreaView style={styles.safeArea}>
          <RoomHeader />
          <RoomList />
        </SafeAreaView>
      </View>
    </SwipeableScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
