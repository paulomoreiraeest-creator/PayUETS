import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Boton } from '../componentes/Boton';
import { Display } from '../componentes/Display';
import { useBilletera } from '../hooks/useBilletera';

export default function WalletScreen() {
  const {
    usuarioActivo,
    companeros,
    recargarLocal,
    transferirP2P,
    cerrarSesion,
    tema,
    esOscuro,
    alternarTema,
  } = useBilletera();
  const router = useRouter();
  const [mensaje, setMensaje] = useState<string | null>(null);

  if (!usuarioActivo) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: tema.background }]}>
        <Text style={[styles.aviso, { color: tema.text }]}>No hay sesión activa.</Text>
        <Boton titulo="Ir al Login" onPress={() => router.replace('/')} colorFondo={tema.primary} />
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
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: tema.background }]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.bienvenida, { color: tema.text }]}>Hola, {usuarioActivo.nombre}</Text>
          <Text style={[styles.email, { color: tema.subtext }]}>{usuarioActivo.email}</Text>
        </View>

        <View style={styles.headerBotones}>
          <TouchableOpacity
            style={[styles.botonTema, { backgroundColor: tema.card, borderColor: tema.border }]}
            onPress={alternarTema}
          >
            <Text style={{ color: tema.text, fontWeight: '700', fontSize: 13 }}>
              {esOscuro ? '☀️ Claro' : '🌙 Oscuro'}
            </Text>
          </TouchableOpacity>
          <Boton titulo="Salir" onPress={handleSalir} colorFondo={tema.error} />
        </View>
      </View>

      <Display
        etiqueta="Saldo Disponible"
        valor={`${usuarioActivo.saldo} monedas ($${(usuarioActivo.saldo / 100).toFixed(2)})`}
      />

      {mensaje && <Text style={[styles.mensaje, { color: tema.primary }]}>{mensaje}</Text>}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: tema.text }]}>
          Cupones Disponibles ({usuarioActivo.cupones.length})
        </Text>
        {usuarioActivo.cupones.length === 0 ? (
          <Text style={{ color: tema.subtext, fontSize: 14 }}>
            No tienes cupones activos. Gánalos en la pestaña Retos.
          </Text>
        ) : (
          usuarioActivo.cupones.map((cupon) => (
            <View
              key={cupon.id}
              style={[styles.cuponCard, { backgroundColor: tema.card, borderColor: tema.border }]}
            >
              <Text style={{ color: tema.secondary, fontWeight: '700' }}>
                🎟️ {cupon.codigo} (-{cupon.descuentoPorcentaje}%)
              </Text>
              <Text style={{ color: tema.subtext, fontSize: 13 }}>{cupon.descripcion}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: tema.text }]}>Simular Recarga Local</Text>
        <Boton
          titulo="Recargar 100 monedas ($1.00)"
          onPress={handleRecarga}
          colorFondo={tema.secondary}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: tema.text }]}>Transferencias P2P a Compañeros</Text>
        {companeros.map((comp) => (
          <View
            key={comp.email}
            style={[styles.row, { backgroundColor: tema.card, borderColor: tema.border }]}
          >
            <Text style={[styles.compText, { color: tema.text }]}>{comp.nombre}</Text>
            <Boton
              titulo="Enviar 50 🪙"
              onPress={() => handleTransferencia(comp.email)}
              colorFondo={tema.primary}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', padding: 24 },
  aviso: { fontSize: 16, textAlign: 'center', marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 8 },
  headerBotones: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  botonTema: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1 },
  bienvenida: { fontSize: 22, fontWeight: 'bold' },
  email: { fontSize: 13 },
  section: { marginTop: 22 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  cuponCard: { padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1 },
  compText: { fontSize: 16 },
  mensaje: { fontWeight: '600', marginVertical: 8, textAlign: 'center' },
});