import '../global.css';

import { Stack } from 'expo-router';
import { AuthProvider } from '~/components/AuthProvider';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  //   initialRouteName: '(tabs)',
  initialRouteName: 'login',
};

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </AuthProvider>
    </ClerkProvider>
  );
}
