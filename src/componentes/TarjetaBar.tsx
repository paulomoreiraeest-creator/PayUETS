import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBilletera } from '../hooks/useBilletera';

interface Props {
  nombre: string;
  descripcion: string;
  precioMonedas?: number;
  precioConDescuento?: number;
  textoBoton: string;
  onPress: () => void;
  textoCupon?: string;
  onPressCupon?: () => void;
  cuponActivo?: boolean;
  deshabilitarCupon?: boolean;
  colorBotonPrincipal?: string;
}

export function TarjetaBar({
  nombre,
  descripcion,
  precioMonedas,
  precioConDescuento,
  textoBoton,
  onPress,
  textoCupon,
  onPressCupon,
  cuponActivo = false,
  deshabilitarCupon = false,
  colorBotonPrincipal,
}: Props) {
  const { tema, esOscuro } = useBilletera();
  const mostrarDescuento =
    cuponActivo && precioConDescuento !== undefined && precioMonedas !== undefined;

  return (
    <View style={[styles.card, { backgroundColor: tema.card, borderColor: tema.border }]}>
      <View style={styles.info}>
        <Text style={[styles.nombre, { color: tema.text }]}>{nombre}</Text>
        <Text style={[styles.desc, { color: tema.subtext }]}>{descripcion}</Text>
        {precioMonedas !== undefined && (
          <View style={styles.filaPrecios}>
            <Text
              style={[
                styles.precio,
                { color: tema.primary },
                mostrarDescuento && styles.precioTachado,
              ]}
            >
              {precioMonedas} monedas (${(precioMonedas / 100).toFixed(2)})
            </Text>
            {mostrarDescuento && (
              <Text style={[styles.precioDescuento, { color: tema.secondary }]}>
                → {precioConDescuento} monedas (${(precioConDescuento / 100).toFixed(2)})
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.acciones}>
        <TouchableOpacity
          style={[
            styles.botonPrincipal,
            { backgroundColor: colorBotonPrincipal || tema.primary },
          ]}
          onPress={onPress}
        >
          <Text style={styles.textoBoton}>{textoBoton}</Text>
        </TouchableOpacity>

        {textoCupon && onPressCupon && (
          <TouchableOpacity
            style={[
              styles.botonCupon,
              {
                borderColor: tema.primary,
                backgroundColor: esOscuro ? '#1E1B4B' : '#EEF2FF',
              },
              cuponActivo && {
                backgroundColor: tema.secondary,
                borderColor: tema.secondary,
              },
              deshabilitarCupon &&
                !cuponActivo && {
                  borderColor: tema.border,
                  backgroundColor: tema.background,
                },
            ]}
            onPress={onPressCupon}
            disabled={deshabilitarCupon && !cuponActivo}
          >
            <Text
              style={[
                styles.textoCupon,
                { color: tema.primary },
                cuponActivo && styles.textoCuponActivo,
                deshabilitarCupon && !cuponActivo && { color: tema.subtext },
              ]}
            >
              {textoCupon}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 14,
    marginVertical: 8,
    borderWidth: 1,
  },
  info: { marginBottom: 10 },
  nombre: { fontSize: 18, fontWeight: 'bold' },
  desc: { fontSize: 14, marginTop: 2 },
  filaPrecios: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 6, gap: 8 },
  precio: { fontSize: 15, fontWeight: '600' },
  precioTachado: { textDecorationLine: 'line-through', opacity: 0.6, fontSize: 14 },
  precioDescuento: { fontSize: 15, fontWeight: '700' },
  acciones: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  botonPrincipal: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  textoBoton: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  botonCupon: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoCupon: { fontWeight: '700', fontSize: 13 },
  textoCuponActivo: { color: '#FFFFFF' },
});