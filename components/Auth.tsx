import { useState } from 'react';
import { Alert, StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);

    // TODO: Implement Clerk sign in
    Alert.alert('Todo', 'Implement Clerk sign in here');

    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);

    // TODO: Implement Clerk sign up
    Alert.alert('Todo', 'Implement Clerk sign up here');

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          style={styles.input}
          placeholder="email@address.com"
          onChangeText={(text: string) => setEmail(text)}
          value={email}
          autoCapitalize={'none'}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text: string) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={signInWithEmail}
          disabled={loading}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.verticallySpaced}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={signUpWithEmail}
          disabled={loading}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
