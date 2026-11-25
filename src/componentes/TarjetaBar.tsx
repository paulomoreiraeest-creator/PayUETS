import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Boton } from './Boton';

interface Props {
  nombre: string;
  descripcion: string;
  precioMonedas?: number;
  textoBoton: string;
  onPress: () => void;
}

export function TarjetaBar({ nombre, descripcion, precioMonedas, textoBoton, onPress }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.desc}>{descripcion}</Text>
        {precioMonedas !== undefined && (
          <Text style={styles.precio}>
            {precioMonedas} monedas (${(precioMonedas / 100).toFixed(2)})
          </Text>
        )}
      </View>
      <Boton titulo={textoBoton} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  info: { marginBottom: 8 },
  nombre: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  desc: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  precio: { fontSize: 15, fontWeight: '600', color: '#4F46E5', marginTop: 6 },
});