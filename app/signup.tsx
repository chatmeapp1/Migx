import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { API_ENDPOINTS } from '@/utils/api';

interface Country {
  code: string;
  name: string;
}

interface Gender {
  value: string;
  label: string;
}

// Static data
const STATIC_GENDERS: Gender[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

const STATIC_COUNTRIES: Country[] = [
  { code: 'ID', name: 'Indonesia' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'PH', name: 'Philippines' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'CN', name: 'China' },
  { code: 'BR', name: 'Brazil' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'CA', name: 'Canada' }
];

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // FIX: Animated values must not recreate on each render
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Invalid email format' };
    }
    const domain = email.split('@')[1]?.toLowerCase();
    const allowedDomains = ['gmail.com', 'yahoo.com', 'zoho.com'];

    if (!allowedDomains.includes(domain)) {
      return { valid: false, message: `Email must be from Gmail, Yahoo, or Zoho.` };
    }
    return { valid: true, message: '' };
  };

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-z][a-z0-9._]{5,31}$/;
    if (!usernameRegex.test(username)) {
      return {
        valid: false,
        message:
          'Username must be 6-32 characters, start with a letter, and contain only lowercase letters, numbers, dots, and underscores'
      };
    }
    return { valid: true, message: '' };
  };

  const handleSignup = async () => {
    const userCheck = validateUsername(username);
    if (!userCheck.valid) {
      Alert.alert('Invalid Username', userCheck.message);
      return;
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      Alert.alert('Invalid Email', emailCheck.message);
      return;
    }

    if (password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters');
      return;
    }

    if (!country) return Alert.alert('Required Field', 'Please select your country');
    if (!gender) return Alert.alert('Required Field', 'Please select your gender');

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.toLowerCase(),
          password,
          email: email.toLowerCase(),
          country,
          gender,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert(
          'Registration Successful',
          'Please check your email to activate your account.',
          [{ text: 'OK', onPress: () => router.replace('/login') }]
        );
      } else {
        Alert.alert('Registration Failed', data.error || 'Please try again');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#7FB3C2', '#A8C9D4', '#7FB3C2']}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                flex: 1,  // FIX: Prevent collapse when keyboard appears
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Image
              source={require('@/assets/logo/logo_migx.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Create Account</Text>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Username (min 6 chars, lowercase)"
                placeholderTextColor="#666"
                value={username}
                onChangeText={(text) => setUsername(text.toLowerCase())}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password (min 6 chars)"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#666" />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Email (Gmail, Yahoo, or Zoho)"
                placeholderTextColor="#666"
                value={email}
                onChangeText={(text) => setEmail(text.toLowerCase())}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={country}
                  onValueChange={(value) => setCountry(value)}
                  style={styles.picker}
                  dropdownIconColor="#2C5F6E"
                >
                  <Picker.Item label="Select Country" value="" />
                  {STATIC_COUNTRIES.map((c) => (
                    <Picker.Item key={c.code} label={c.name} value={c.code} />
                  ))}
                </Picker>
              </View>

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={gender}
                  onValueChange={(value) => setGender(value)}
                  style={styles.picker}
                  dropdownIconColor="#2C5F6E"
                >
                  <Picker.Item label="Select Gender" value="" />
                  {STATIC_GENDERS.map((g) => (
                    <Picker.Item key={g.value} label={g.label} value={g.value} />
                  ))}
                </Picker>
              </View>

              <TouchableOpacity
                style={[styles.signupButton, loading && styles.buttonDisabled]}
                onPress={handleSignup}
                disabled={loading}
              >
                <Text style={styles.signupButtonText}>
                  {loading ? 'Creating Account...' : 'Send OTP & Create Account'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => router.back()}
              >
                <Text style={styles.loginText}>Already have an account? </Text>
                <Text style={styles.loginTextBold}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.privacyLink}
                onPress={() => router.push('/privacy-policy')}
              >
                <Text style={styles.privacyText}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

// Styles unchanged
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  scrollView: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  content: { alignItems: 'center', width: '100%' },
  logo: { width: 80, height: 80, marginBottom: 10 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#2C5F6E',
    marginBottom: 20,
  },
  form: { width: '100%', maxWidth: 350 },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 16,
    marginBottom: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    padding: 16,
    paddingRight: 20,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  picker: { color: '#333' },
  signupButton: {
    backgroundColor: '#4BA3C3',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonDisabled: { opacity: 0.6 },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  loginText: { color: '#2C5F6E', fontSize: 14 },
  loginTextBold: {
    color: '#2C5F6E',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  privacyLink: { alignItems: 'center' },
  privacyText: { color: '#2C5F6E', fontSize: 12, fontWeight: '600' },
});