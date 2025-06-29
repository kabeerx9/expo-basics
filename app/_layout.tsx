import '../global.css';

import { Stack } from 'expo-router';
import { AuthProvider } from '~/components/AuthProvider';
import { useEffect } from 'react';
import * as Linking from 'expo-linking';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  //   initialRouteName: '(tabs)',
  initialRouteName: 'login',
};

export default function RootLayout() {
  const url = Linking.useURL();

  useEffect(() => {
    if (url) {
      handleDeepLink({ url });
    }
  }, [url]);

  const handleDeepLink = ({ url }: { url: string }) => {
    console.log('🔗 Deep link received:', url);

    const parsed = Linking.parse(url);
    console.log('📄 Parsed URL:', parsed);

    // Handle auth confirmation URLs with fragments
    if (parsed.hostname === 'auth' && parsed.path === 'confirm' && url.includes('#')) {
      console.log('🔐 Processing auth confirmation with fragments');

      // Use Supabase's official approach to parse fragments
      const QueryParams = require('expo-auth-session/build/QueryParams');
      const { params } = QueryParams.getQueryParams(url);

      console.log('🔍 Extracted params:', params);

      // Navigate with extracted params as query parameters
      if (params.access_token && params.refresh_token) {
        const { router } = require('expo-router');
        router.push({
          pathname: '/auth/confirm',
          params: params,
        });
        return; // Prevent default navigation
      }
    }

    // Let Expo Router handle other deep links automatically
  };

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="auth/confirm" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </AuthProvider>
  );
}
