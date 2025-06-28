import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '~/lib/supabase';

export default function ConfirmScreen() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Only process when we actually have tokens (from layout processing)
  useEffect(() => {
    if (params.access_token && params.refresh_token) {
      handleAuthCallback();
    } else if (Object.keys(params).length === 0) {
      // No params yet - probably waiting for layout to process deep link
      console.log('⏳ Waiting for deep link processing...');
    } else {
      // We have some params but missing tokens
      setError('Missing authentication tokens');
      setLoading(false);
    }
  }, [params]);

  const handleAuthCallback = async () => {
    try {
      setLoading(true);

      console.log('🔍 Processing auth params:', params);

      const { access_token, refresh_token } = params;

      if (access_token && refresh_token) {
        console.log('🔐 Setting session with tokens...');

        const { data, error } = await supabase.auth.setSession({
          access_token: access_token as string,
          refresh_token: refresh_token as string,
        });

        if (error) {
          console.error('❌ Session error:', error);
          setError(error.message);
          return;
        }

        console.log('✅ Session set successfully:', data.session?.user.email);
        router.replace('/(tabs)');
      } else {
        console.error('❌ Missing tokens');
        setError('Missing authentication tokens');
      }
    } catch (err) {
      console.error('❌ Auth callback error:', err);
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-8">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-center text-gray-600">Confirming authentication...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-8">
        <Text className="text-center text-lg text-red-600">Error: {error}</Text>
        <Text
          className="mt-4 text-center text-blue-600 underline"
          onPress={() => router.replace('/login')}>
          Go back to login
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      <Text className="text-center text-lg text-green-600">Authentication successful!</Text>
    </View>
  );
}
