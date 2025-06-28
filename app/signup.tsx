import 'react-native-url-polyfill/auto';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { supabase } from '~/lib/supabase';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        router.replace('/(tabs)');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        router.replace('/(tabs)');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signUp() {
    if (!email || !password) {
      Alert.alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: 'course://auth/confirm',
      },
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setEmailSent(true);
    }
    setLoading(false);
  }

  if (session) {
    return null; // Will redirect to tabs
  }

  // Show email verification UI after successful signup
  if (emailSent) {
    return (
      <View className="flex-1 bg-white">
        <View className="flex-1 justify-center px-8">
          {/* Success Icon */}
          <View className="mb-6 items-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Text className="text-3xl">📧</Text>
            </View>
          </View>

          <Text className="mb-4 text-center text-3xl font-bold text-gray-800">
            Check Your Email
          </Text>

          <Text className="mb-8 text-center leading-6 text-gray-600">
            We sent a confirmation link to{'\n'}
            <Text className="font-medium text-gray-800">{email}</Text>
            {'\n\n'}
            Click the link in your email to activate your account and get started.
          </Text>

          {/* Resend Email Button */}
          <TouchableOpacity
            className="mb-4 rounded-lg border border-blue-600 py-4"
            onPress={() => {
              setEmailSent(false);
              signUp(); // Resend email
            }}
            disabled={loading}>
            <Text className="text-center font-semibold text-blue-600">Resend Email</Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            className="rounded-lg bg-gray-100 py-4"
            onPress={() => router.push('./login')}>
            <Text className="text-center font-semibold text-gray-700">Back to Sign In</Text>
          </TouchableOpacity>

          {/* Try Different Email */}
          <View className="mt-6 flex-row justify-center">
            <Text className="text-gray-600">Wrong email? </Text>
            <TouchableOpacity onPress={() => setEmailSent(false)}>
              <Text className="font-medium text-blue-600">Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center px-8">
        <Text className="mb-8 text-center text-3xl font-bold text-gray-800">Create Account</Text>

        <View className="mb-4">
          <Text className="mb-2 font-medium text-gray-700">Email</Text>
          <TextInput
            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View className="mb-6">
          <Text className="mb-2 font-medium text-gray-700">Password</Text>
          <TextInput
            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          className={`rounded-lg bg-blue-600 py-4 ${loading ? 'opacity-50' : ''}`}
          onPress={signUp}
          disabled={loading}>
          <Text className="text-center text-lg font-semibold text-white">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('./login')}>
            <Text className="font-medium text-blue-600">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
