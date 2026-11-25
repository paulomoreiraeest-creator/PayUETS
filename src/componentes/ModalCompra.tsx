import { Modal, StyleSheet, Text, View } from 'react-native';
import { useBilletera } from '../hooks/useBilletera';
import { Boton } from './Boton';

export interface ResumenCompra {
  nombreProducto: string;
  bar: string;
  cuponAplicado: string | null;
  monedasPagadas: number;
  monedasOriginales: number;
}

interface Props {
  visible: boolean;
  resumen: ResumenCompra | null;
  onCerrar: () => void;
}

export function ModalCompra({ visible, resumen, onCerrar }: Props) {
  const { tema, esOscuro } = useBilletera();

  if (!resumen) return null;

  const ahorro = resumen.monedasOriginales - resumen.monedasPagadas;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: tema.card, borderColor: tema.border }]}>
          <Text style={[styles.etiquetaSuperior, { color: tema.secondary }]}>
            ✓ COMPRA EXITOSA · {resumen.bar.toUpperCase()}
          </Text>

          <Text style={[styles.productoGrande, { color: tema.text }]}>
            {resumen.nombreProducto}
          </Text>

          <View
            style={[
              styles.cajaDetalle,
              {
                backgroundColor: esOscuro ? '#111827' : '#F9FAFB',
                borderColor: tema.border,
              },
            ]}
          >
            <Text style={[styles.filaLabel, { color: tema.subtext }]}>Cupón:</Text>
            <Text
              style={[
                styles.filaValor,
                { color: resumen.cuponAplicado ? tema.secondary : tema.text },
              ]}
            >
              {resumen.cuponAplicado ? `Aplicado (${resumen.cuponAplicado})` : 'No aplicado'}
            </Text>

            {ahorro > 0 && (
              <>
                <Text style={[styles.filaLabel, { color: tema.subtext }]}>Ahorro:</Text>
                <Text style={[styles.filaValor, { color: tema.secondary }]}>
                  -{ahorro} monedas (${(ahorro / 100).toFixed(2)})
                </Text>
              </>
            )}

            <Text style={[styles.filaLabel, { color: tema.subtext }]}>Total pagado:</Text>
            <Text style={[styles.totalPagado, { color: tema.primary }]}>
              {resumen.monedasPagadas} monedas (${(resumen.monedasPagadas / 100).toFixed(2)})
            </Text>
          </View>

          <Boton titulo="Aceptar" onPress={onCerrar} colorFondo={tema.primary} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.7)',
    justifyContent: 'center',
    padding: 22,
  },
  card: {
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
  },
  etiquetaSuperior: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    textAlign: 'center',
    marginBottom: 8,
  },
  productoGrande: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  cajaDetalle: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
    gap: 6,
  },
  filaLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  filaValor: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  totalPagado: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
});