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
    });

    if (error) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  }

  if (session) {
    return null; // Will redirect to tabs
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
