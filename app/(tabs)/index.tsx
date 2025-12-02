
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/home/Header';
import { StatusSection } from '@/components/home/StatusSection';
import { EmailSection } from '@/components/home/EmailSection';
import { ContactList } from '@/components/home/ContactList';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <StatusSection />
        <EmailSection />
        <ContactList />
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
