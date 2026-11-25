import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Boton } from '../componentes/Boton';
import { useBilletera } from '../hooks/useBilletera';

export default function LoginScreen() {
  const [inputEmail, setInputEmail] = useState('');
  const { loginInstitucional, error } = useBilletera();
  const router = useRouter();

  const handleLogin = () => {
    if (loginInstitucional(inputEmail)) {
      router.replace('/wallet');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PayUETS</Text>
      <Text style={styles.subtitle}>Billetera Digital Institucional</Text>
      <TextInput
        style={styles.input}
        placeholder="usuario@uets.edu.ec"
        placeholderTextColor="#9CA3AF"
        value={inputEmail}
        onChangeText={setInputEmail}
        autoCapitalize="none"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Boton titulo="Iniciar Sesión" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F9FAFB' },
  title: { fontSize: 36, fontWeight: 'bold', color: '#4F46E5', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', padding: 14, borderRadius: 12, marginBottom: 12, backgroundColor: '#FFF' },
  errorText: { color: '#EF4444', marginBottom: 12, textAlign: 'center' },
});