import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useBilletera } from '../hooks/useBilletera';
import { TarjetaBar } from '../componentes/TarjetaBar';
import { Boton } from '../componentes/Boton';

export default function BaresScreen() {
  const { usuarioActivo, comprarEnBar } = useBilletera();
  const router = useRouter();
  const [mensaje, setMensaje] = useState<string | null>(null);

  if (!usuarioActivo) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.aviso}>Inicia sesión para comprar en los bares.</Text>
        <Boton titulo="Ir al Login" onPress={() => router.replace('/')} />
      </View>
    );
  }

  const handleComprar = (nombreItem: string, precio: number, usaCupon: boolean = false) => {
    const costoFinal = usaCupon ? Math.round(precio * 0.8) : precio;
    const exito = comprarEnBar(costoFinal);

    if (exito) {
      setMensaje(`¡Compra exitosa de "${nombreItem}" por ${costoFinal} monedas!`);
    } else {
      setMensaje('Saldo insuficiente para completar la compra en el bar.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Puntos de Consumo UETS</Text>
      <Text style={styles.subtitle}>Saldo actual: {usuarioActivo.saldo} monedas</Text>

      {mensaje && <Text style={styles.mensaje}>{mensaje}</Text>}

      <Text style={styles.sectionHeader}>Bar Central</Text>
      <TarjetaBar
        nombre="Almuerzo Ejecutor"
        descripcion="Seco de pollo + jugo natural"
        precioMonedas={250}
        textoBoton="Comprar (Normal)"
        onPress={() => handleComprar('Almuerzo Ejecutor', 250, false)}
      />
      <TarjetaBar
        nombre="Almuerzo Ejecutor (Con Cupón 20%)"
        descripcion="Aplica descuento del reto académico"
        precioMonedas={250}
        textoBoton="Comprar con Cupón"
        onPress={() => handleComprar('Almuerzo (Cupón)', 250, true)}
      />

      <Text style={styles.sectionHeader}>Bar Express</Text>
      <TarjetaBar
        nombre="Salchipapa Escolar"
        descripcion="Porción clásica con papas y hot dog"
        precioMonedas={180}
        textoBoton="Comprar"
        onPress={() => handleComprar('Salchipapa Escolar', 180)}
      />

      <Text style={styles.sectionHeader}>Cafetería Saludable</Text>
      <TarjetaBar
        nombre="Ensalada de Frutas con Yogurt"
        descripcion="Fruta fresca de temporada"
        precioMonedas={150}
        textoBoton="Comprar"
        onPress={() => handleComprar('Ensalada de Frutas', 150)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F9FAFB', flexGrow: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F9FAFB' },
  aviso: { fontSize: 16, color: '#374151', textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: 16, color: '#4F46E5', marginBottom: 12, fontWeight: '600' },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginTop: 20, marginBottom: 6 },
  mensaje: { color: '#10B981', fontWeight: '600', marginBottom: 10, textAlign: 'center', backgroundColor: '#ECFDF5', padding: 8, borderRadius: 8 },
});