import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useBilletera } from '../hooks/useBilletera';
import { Display } from '../componentes/Display';
import { Boton } from '../componentes/Boton';

export default function WalletScreen() {
  const { usuarioActivo, companeros, recargarLocal, transferirP2P, cerrarSesion } = useBilletera();
  const router = useRouter();
  const [mensaje, setMensaje] = useState<string | null>(null);

  if (!usuarioActivo) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.aviso}>No hay una sesión activa.</Text>
        <Boton titulo="Ir al Login" onPress={() => router.replace('/')} />
      </View>
    );
  }

  const handleSalir = () => {
    cerrarSesion();
    router.replace('/');
  };

  const handleRecarga = () => {
    recargarLocal(100);
    setMensaje('¡Recarga simulada exitosa (+100 monedas)!');
  };

  const handleTransferencia = (emailDestino: string) => {
    const exito = transferirP2P(emailDestino, 50);
    if (exito) {
      setMensaje(`¡50 monedas transferidas a ${emailDestino} con éxito!`);
    } else {
      setMensaje('Saldo insuficiente para realizar la transferencia.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.bienvenida}>Hola, {usuarioActivo.nombre}</Text>
          <Text style={styles.email}>{usuarioActivo.email}</Text>
        </View>
        <Boton titulo="Salir" onPress={handleSalir} colorFondo="#EF4444" />
      </View>

      <Display
        etiqueta="Saldo Disponible"
        valor={`${usuarioActivo.saldo} monedas ($${(usuarioActivo.saldo / 100).toFixed(2)})`}
      />

      {mensaje && <Text style={styles.mensaje}>{mensaje}</Text>}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Puntos de Consumo</Text>
        <Boton titulo="Ir a Bares UETS" onPress={() => router.push('/bares')} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Simular Recarga Local</Text>
        <Boton titulo="Recargar 100 monedas ($1.00)" onPress={handleRecarga} colorFondo="#10B981" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transferencias P2P a Compañeros</Text>
        {companeros.map((comp) => (
          <View key={comp.email} style={styles.row}>
            <Text style={styles.compText}>{comp.nombre}</Text>
            <Boton titulo="Enviar 50 🪙" onPress={() => handleTransferencia(comp.email)} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F9FAFB', flexGrow: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F9FAFB' },
  aviso: { fontSize: 16, color: '#374151', textAlign: 'center', marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  bienvenida: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  email: { fontSize: 14, color: '#6B7280' },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  compText: { fontSize: 16, color: '#1F2937' },
  mensaje: { color: '#4F46E5', fontWeight: '600', marginVertical: 8, textAlign: 'center' },
});