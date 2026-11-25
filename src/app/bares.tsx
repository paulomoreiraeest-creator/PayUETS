import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Boton } from '../componentes/Boton';
import { ModalCompra, ResumenCompra } from '../componentes/ModalCompra';
import { TarjetaBar } from '../componentes/TarjetaBar';
import { useBilletera } from '../hooks/useBilletera';

interface ProductoBar {
  id: string;
  seccion: string;
  nombre: string;
  descripcion: string;
  precioMonedas: number;
}

const PRODUCTOS_BAR: ProductoBar[] = [
  {
    id: 'almuerzo-ejecutivo',
    seccion: 'Bar Central',
    nombre: 'Almuerzo Ejecutivo',
    descripcion: 'Seco de pollo + jugo natural',
    precioMonedas: 250,
  },
  {
    id: 'salchipapa-escolar',
    seccion: 'Bar Express',
    nombre: 'Salchipapa Escolar',
    descripcion: 'Porción clásica con papas y hot dog',
    precioMonedas: 180,
  },
  {
    id: 'ensalada-frutas',
    seccion: 'Cafetería Saludable',
    nombre: 'Ensalada de Frutas con Yogurt',
    descripcion: 'Fruta fresca de temporada',
    precioMonedas: 150,
  },
];

export default function BaresScreen() {
  const { usuarioActivo, comprarEnBar, tema, esOscuro } = useBilletera();
  const router = useRouter();
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [productoConCuponId, setProductoConCuponId] = useState<string | null>(null);
  const [resumenCompra, setResumenCompra] = useState<ResumenCompra | null>(null);

  useEffect(() => {
    if (productoConCuponId && usuarioActivo && usuarioActivo.cupones.length === 0) {
      setProductoConCuponId(null);
    }
  }, [usuarioActivo?.cupones.length, productoConCuponId]);

  if (!usuarioActivo) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: tema.background }]}>
        <Text style={[styles.aviso, { color: tema.text }]}>Inicia sesión para ver los bares.</Text>
        <Boton titulo="Ir al Login" onPress={() => router.replace('/')} colorFondo={tema.primary} />
      </View>
    );
  }

  const cuponDisponible = usuarioActivo.cupones[0] || null;

  const alternarCuponEnProducto = (productoId: string) => {
    if (!cuponDisponible) {
      setMensaje('No tienes cupones disponibles. Gana uno en la pestaña Retos.');
      return;
    }
    setMensaje(null);
    setProductoConCuponId((prev) => (prev === productoId ? null : productoId));
  };

  const handleComprar = (producto: ProductoBar) => {
    const usaCupon = productoConCuponId === producto.id && Boolean(cuponDisponible);
    const costoFinal =
      usaCupon && cuponDisponible
        ? Math.round(producto.precioMonedas * (1 - cuponDisponible.descuentoPorcentaje / 100))
        : producto.precioMonedas;

    const exito = comprarEnBar(
      costoFinal,
      usaCupon && cuponDisponible ? cuponDisponible.id : undefined
    );

    if (exito) {
      const textoCuponAplicado =
        usaCupon && cuponDisponible
          ? `${cuponDisponible.codigo} (-${cuponDisponible.descuentoPorcentaje}%)`
          : null;

      if (usaCupon) {
        setProductoConCuponId(null);
      }

      setMensaje(null);
      setResumenCompra({
        nombreProducto: producto.nombre,
        bar: producto.seccion,
        cuponAplicado: textoCuponAplicado,
        monedasPagadas: costoFinal,
        monedasOriginales: producto.precioMonedas,
      });
    } else {
      setMensaje('Saldo insuficiente para completar la compra en el bar.');
    }
  };

  const secciones = Array.from(new Set(PRODUCTOS_BAR.map((p) => p.seccion)));

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: tema.background }]}>
      <Text style={[styles.title, { color: tema.text }]}>Puntos de Consumo UETS</Text>
      <Text style={[styles.subtitle, { color: tema.primary }]}>
        Saldo: {usuarioActivo.saldo} monedas · Cupones: {usuarioActivo.cupones.length}
      </Text>

      {cuponDisponible && (
        <Text
          style={[
            styles.cuponBanner,
            {
              backgroundColor: esOscuro ? '#064E3B' : '#D1FAE5',
              color: esOscuro ? '#A7F3D0' : '#065F46',
            },
          ]}
        >
          Cupón listo: {cuponDisponible.codigo} ({cuponDisponible.descuentoPorcentaje}% OFF)
        </Text>
      )}

      {mensaje && (
        <Text
          style={[
            styles.mensaje,
            {
              backgroundColor: esOscuro ? '#064E3B' : '#ECFDF5',
              color: tema.secondary,
            },
          ]}
        >
          {mensaje}
        </Text>
      )}

      {secciones.map((seccion) => (
        <View key={seccion}>
          <Text style={[styles.sectionHeader, { color: tema.text }]}>{seccion}</Text>
          {PRODUCTOS_BAR.filter((p) => p.seccion === seccion).map((prod) => {
            const tieneCuponAplicado = productoConCuponId === prod.id && Boolean(cuponDisponible);
            const precioConDescuento = cuponDisponible
              ? Math.round(prod.precioMonedas * (1 - cuponDisponible.descuentoPorcentaje / 100))
              : prod.precioMonedas;

            let etiquetaCupon = '+ Cupón';
            if (tieneCuponAplicado && cuponDisponible) {
              etiquetaCupon = `-${cuponDisponible.descuentoPorcentaje}% ✓`;
            } else if (cuponDisponible) {
              etiquetaCupon = `+ Cupón -${cuponDisponible.descuentoPorcentaje}%`;
            } else {
              etiquetaCupon = 'Sin cupón';
            }

            return (
              <TarjetaBar
                key={prod.id}
                nombre={prod.nombre}
                descripcion={prod.descripcion}
                precioMonedas={prod.precioMonedas}
                precioConDescuento={precioConDescuento}
                cuponActivo={tieneCuponAplicado}
                deshabilitarCupon={!cuponDisponible}
                textoBoton="Comprar"
                onPress={() => handleComprar(prod)}
                textoCupon={etiquetaCupon}
                onPressCupon={() => alternarCuponEnProducto(prod.id)}
              />
            );
          })}
        </View>
      ))}

      <ModalCompra
        visible={Boolean(resumenCompra)}
        resumen={resumenCompra}
        onCerrar={() => setResumenCompra(null)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', padding: 24 },
  aviso: { fontSize: 16, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 15, marginBottom: 8, fontWeight: '600' },
  cuponBanner: {
    fontSize: 13,
    fontWeight: '700',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 4 },
  mensaje: {
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    padding: 8,
    borderRadius: 8,
  },
});