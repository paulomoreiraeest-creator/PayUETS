import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  etiqueta: string;
  valor: string | number;
}

export function Display({ etiqueta, valor }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#EEF2FF', borderRadius: 12, marginVertical: 8 },
  etiqueta: { fontSize: 14, color: '#4B5563' },
  valor: { fontSize: 24, fontWeight: 'bold', color: '#1E1B4B', marginTop: 4 },
});