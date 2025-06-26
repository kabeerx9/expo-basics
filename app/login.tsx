import 'react-native-url-polyfill/auto';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '~/lib/supabase';
import { useAuth } from '~/components/AuthProvider';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (session) {
      router.replace('/(tabs)');
    }
  }, [session]);

  async function signIn() {
    if (!email || !password) {
      Alert.alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
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
        <Text className="mb-8 text-center text-3xl font-bold text-gray-800">Welcome Back</Text>

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
          onPress={signIn}
          disabled={loading}>
          <Text className="text-center text-lg font-semibold text-white">
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-600">Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => router.push('./signup')}>
            <Text className="font-medium text-blue-600">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
