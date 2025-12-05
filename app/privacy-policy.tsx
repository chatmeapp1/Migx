
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function PrivacyPolicyScreen() {
  return (
    <LinearGradient
      colors={['#1a4d2e', '#2d5f3f', '#1a4d2e']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <Text style={styles.title}>Privacy Policy</Text>
          
          <Text style={styles.section}>Last updated: December 2024</Text>
          
          <Text style={styles.heading}>1. Information We Collect</Text>
          <Text style={styles.text}>
            We collect information you provide directly to us, including username, email address, 
            country, and gender when you create an account.
          </Text>
          
          <Text style={styles.heading}>2. How We Use Your Information</Text>
          <Text style={styles.text}>
            We use the information we collect to provide, maintain, and improve our services, 
            to communicate with you, and to ensure account security.
          </Text>
          
          <Text style={styles.heading}>3. Information Sharing</Text>
          <Text style={styles.text}>
            We do not share your personal information with third parties except as necessary 
            to provide our services or as required by law.
          </Text>
          
          <Text style={styles.heading}>4. Data Security</Text>
          <Text style={styles.text}>
            We implement appropriate security measures to protect your personal information 
            from unauthorized access, alteration, or destruction.
          </Text>
          
          <Text style={styles.heading}>5. Your Rights</Text>
          <Text style={styles.text}>
            You have the right to access, update, or delete your personal information at any time.
          </Text>
          
          <Text style={styles.heading}>6. Contact Us</Text>
          <Text style={styles.text}>
            If you have any questions about this Privacy Policy, please contact us.
          </Text>
        </ScrollView>
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#e0e0e0',
    lineHeight: 22,
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: '#0d3320',
    padding: 16,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
