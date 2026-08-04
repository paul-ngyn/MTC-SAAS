// components/GoogleSignInButton.tsx
import { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { signInWithGoogle } from '@/lib/google-auth';

export default function GoogleSignInButton({ label = 'Continue with Google' }: { label?: string }) {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    try {
      const success = await signInWithGoogle();
      // On success, root layout's onAuthStateChange picks up the new
      // session and redirects out of the auth stack automatically.
      if (!success) {
        // user cancelled the browser sheet — nothing to do
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed.';
      Alert.alert('Sign-in failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handlePress} disabled={loading}>
      {loading ? (
        <ActivityIndicator color="#374151" />
      ) : (
        <>
          <Text style={styles.g}>G</Text>
          <Text style={styles.text}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingVertical: 13,
    backgroundColor: '#fff',
  },
  buttonDisabled: { opacity: 0.6 },
  g: { fontSize: 16, fontWeight: '900', color: '#4285F4' },
  text: { color: '#374151', fontWeight: '700', fontSize: 15 },
});
