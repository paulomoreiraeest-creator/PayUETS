import { StyleSheet, Text, View } from 'react-native';
import { useBilletera } from '../hooks/useBilletera';

interface Props {
  etiqueta: string;
  valor: string | number;
}

export function Display({ etiqueta, valor }: Props) {
  const { tema, esOscuro } = useBilletera();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: esOscuro ? '#1E1B4B' : '#EEF2FF',
          borderColor: tema.border,
        },
      ]}
    >
      <Text style={[styles.etiqueta, { color: tema.subtext }]}>{etiqueta}</Text>
      <Text style={[styles.valor, { color: esOscuro ? '#E0E7FF' : '#1E1B4B' }]}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, borderRadius: 12, marginVertical: 8, borderWidth: 1 },
  etiqueta: { fontSize: 14 },
  valor: { fontSize: 24, fontWeight: 'bold', marginTop: 4 },
});