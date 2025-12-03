
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';
import { useThemeCustom } from '@/theme/provider';
import Svg, { Path } from 'react-native-svg';

const BackIcon = ({ size = 24, color = '#fff' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M15 18l-6-6 6-6" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const HistoryIcon = ({ size = 24, color = '#fff' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

export default function TransferCreditScreen() {
  const { theme } = useThemeCustom();
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const coinBalance = 1250; // Example balance

  const handleSubmit = () => {
    console.log('Transfer submitted:', { username, amount, pin });
    // Implement transfer logic here
  };

  const handleHistory = () => {
    router.push('/transfer-history');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <BackIcon size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Transfer Credit</Text>
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={handleHistory}
        >
          <HistoryIcon size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Coin Balance */}
        <View style={[styles.balanceContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.balanceLabel, { color: theme.secondary }]}>IDR Balance</Text>
          <View style={styles.balanceRow}>
            <Image 
              source={require('@/assets/icons/ic_coin.png')} 
              style={styles.coinIcon}
            />
            <Text style={[styles.balanceAmount, { color: theme.text }]}>{coinBalance.toLocaleString()}</Text>
          </View>
        </View>

        {/* Transfer Form */}
        <View style={[styles.formContainer, { backgroundColor: theme.background }]}>
          <Text style={[styles.formTitle, { color: theme.text }]}>Transfer Coin to User</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Username</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card, 
                borderColor: theme.border, 
                color: theme.text 
              }]}
              placeholder="Enter username"
              placeholderTextColor={theme.secondary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Amount</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card, 
                borderColor: theme.border, 
                color: theme.text 
              }]}
              placeholder="Enter amount"
              placeholderTextColor={theme.secondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>PIN</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card, 
                borderColor: theme.border, 
                color: theme.text 
              }]}
              placeholder="Enter your PIN"
              placeholderTextColor={theme.secondary}
              value={pin}
              onChangeText={setPin}
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
            />
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 40,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyButton: {
    padding: 8,
  },
  safeArea: {
    flex: 1,
  },
  balanceContainer: {
    padding: 20,
    marginTop: 1,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coinIcon: {
    width: 32,
    height: 32,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
    marginTop: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
