import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colores } from '../styles/colores';

interface Props {
  titulo: string;
  onPress: () => void;
  colorFondo?: string;
}

export function Boton({ titulo, onPress, colorFondo = Colores.light.primary }: Props) {
  return (
    <TouchableOpacity style={[styles.boton, { backgroundColor: colorFondo }]} onPress={onPress}>
      <Text style={styles.texto}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: { padding: 14, borderRadius: 12, alignItems: 'center', marginVertical: 6 },
  texto: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});