// app/(auth)/sign-up.tsx

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !password || !fullName.trim()) {
      Alert.alert('Missing fields', 'Full name, email and password are required.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim(), company_name: companyName.trim() },
      },
    });
    setLoading(false);
    if (error) {
      Alert.alert('Sign-up failed', error.message);
    } else {
      Alert.alert(
        'Check your email',
        'We sent a confirmation link. Verify your email then sign in.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        {/* Brand */}
        <View style={styles.brand}>
          <Text style={styles.brandName}>MTC</Text>
          <Text style={styles.brandSub}>Supply Hub</Text>
        </View>

        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Start ordering wholesale today</Text>

        <TextInput
          style={styles.input}
          placeholder="Full name *"
          placeholderTextColor="#9ca3af"
          autoCapitalize="words"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Company name (optional)"
          placeholderTextColor="#9ca3af"
          autoCapitalize="words"
          value={companyName}
          onChangeText={setCompanyName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email address *"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password (min. 6 chars) *"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  brand: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 32 },
  brandName: { fontSize: 32, fontWeight: '900', color: '#1c51a3', marginRight: 6 },
  brandSub: { fontSize: 16, fontWeight: '500', color: '#6b7280' },
  title: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#6b7280', marginBottom: 28 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#111827',
    marginBottom: 14,
    backgroundColor: '#f9fafb',
  },
  button: {
    backgroundColor: '#1c51a3',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#6b7280', fontSize: 14 },
  link: { color: '#1c51a3', fontWeight: '600', fontSize: 14 },
});
