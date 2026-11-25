import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Boton } from '../componentes/Boton';
import { useBilletera } from '../hooks/useBilletera';

export default function LoginScreen() {
  const [inputEmail, setInputEmail] = useState('');
  const { loginInstitucional, error, tema, esOscuro, alternarTema } = useBilletera();
  const router = useRouter();

  const handleLogin = () => {
    if (loginInstitucional(inputEmail)) {
      router.replace('/wallet');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: tema.background }]}>
      <TouchableOpacity
        style={[styles.botonTema, { backgroundColor: tema.card, borderColor: tema.border }]}
        onPress={alternarTema}
      >
        <Text style={{ color: tema.text, fontWeight: '600' }}>
          {esOscuro ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: tema.primary }]}>PayUETS</Text>
      <Text style={[styles.subtitle, { color: tema.subtext }]}>Billetera Digital Institucional</Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: tema.border,
            backgroundColor: tema.card,
            color: tema.text,
          },
        ]}
        placeholder="primernombre.apellido.est@uets.edu.ec"
        placeholderTextColor={tema.subtext}
        value={inputEmail}
        onChangeText={setInputEmail}
        autoCapitalize="none"
      />
      {error && <Text style={[styles.errorText, { color: tema.error }]}>{error}</Text>}
      <Boton titulo="Iniciar Sesión" onPress={handleLogin} colorFondo={tema.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  botonTema: {
    position: 'absolute',
    top: 24,
    right: 24,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  title: { fontSize: 36, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, padding: 14, borderRadius: 12, marginBottom: 12 },
  errorText: { marginBottom: 12, textAlign: 'center', fontWeight: '600' },
});