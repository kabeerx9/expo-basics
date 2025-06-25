import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { supabase } from '~/lib/supabase';

export default function TabOneScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        router.replace('../login');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        router.replace('../login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  }

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="mb-2 text-3xl font-bold text-gray-800">Welcome back!</Text>
          <Text className="text-gray-600">Here&apos;s your dashboard overview</Text>
        </View>

        {/* Account Info Card */}
        <View className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <Text className="mb-4 text-xl font-semibold text-gray-800">Account Information</Text>

          <View className="space-y-3">
            <View className="flex-row justify-between border-b border-gray-100 py-2">
              <Text className="font-medium text-gray-600">Email</Text>
              <Text className="text-gray-800">{session.user.email}</Text>
            </View>

            <View className="flex-row justify-between border-b border-gray-100 py-2">
              <Text className="font-medium text-gray-600">User ID</Text>
              <Text className="text-xs text-gray-800">{session.user.id}</Text>
            </View>

            <View className="flex-row justify-between border-b border-gray-100 py-2">
              <Text className="font-medium text-gray-600">Created</Text>
              <Text className="text-gray-800">
                {new Date(session.user.created_at).toLocaleDateString()}
              </Text>
            </View>

            <View className="flex-row justify-between py-2">
              <Text className="font-medium text-gray-600">Last Sign In</Text>
              <Text className="text-gray-800">
                {session.user.last_sign_in_at
                  ? new Date(session.user.last_sign_in_at).toLocaleDateString()
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="mb-6 flex-row space-x-4">
          <View className="flex-1 rounded-xl bg-blue-50 p-4">
            <Text className="text-sm font-medium text-blue-600">Session Time</Text>
            <Text className="text-lg font-bold text-blue-800">
              {Math.floor((Date.now() - new Date(session.user.created_at).getTime()) / 60000)}m
            </Text>
          </View>

          <View className="flex-1 rounded-xl bg-green-50 p-4">
            <Text className="text-sm font-medium text-green-600">Status</Text>
            <Text className="text-lg font-bold text-green-800">Active</Text>
          </View>
        </View>

        {/* Actions */}
        <View className="space-y-4">
          <TouchableOpacity className="flex-row items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
            <View>
              <Text className="font-medium text-gray-800">Profile Settings</Text>
              <Text className="text-sm text-gray-500">Manage your account</Text>
            </View>
            <Text className="text-gray-400">→</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
            <View>
              <Text className="font-medium text-gray-800">Security</Text>
              <Text className="text-sm text-gray-500">Password & authentication</Text>
            </View>
            <Text className="text-gray-400">→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`rounded-xl bg-red-600 p-4 ${loading ? 'opacity-50' : ''}`}
            onPress={signOut}
            disabled={loading}>
            <Text className="text-center font-semibold text-white">
              {loading ? 'Signing Out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
