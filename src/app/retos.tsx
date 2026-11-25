import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Boton } from '../componentes/Boton';
import { ModalReto, PreguntaReto } from '../componentes/ModalReto';
import { TarjetaBar } from '../componentes/TarjetaBar';
import { Cupon, useBilletera } from '../hooks/useBilletera';

interface Reto {
  id: string;
  titulo: string;
  descripcion: string;
  recompensaMonedas: number;
  recompensaCupon?: Cupon;
  pregunta: PreguntaReto;
}

const RETOS_UETS: Reto[] = [
  {
    id: 'matematicas-1-1000',
    titulo: 'Desafío de Matemáticas',
    descripcion: 'Gana monedas y un cupón de descuento para los bares',
    recompensaMonedas: 100,
    recompensaCupon: {
      id: 'cupon-mate-25',
      codigo: 'MATE25',
      descuentoPorcentaje: 25,
      descripcion: '25% de descuento por reto de Matemáticas',
    },
    pregunta: {
      materia: 'Matemáticas',
      enunciado: 'Cual es la suma de todos los numeros enteros entre 1 y 1000',
      respuestasAceptadas: ['500500', '500 500'],
      pista: 'Fórmula de Gauss: n × (n + 1) / 2 con n = 1000',
    },
  },
  {
    id: 'cupon-rapido-15',
    titulo: 'Cupón Express UETS',
    descripcion: 'Responde bien para obtener un cupón del 15% de descuento',
    recompensaMonedas: 0,
    recompensaCupon: {
      id: 'cupon-rapido-15',
      codigo: 'UETS15',
      descuentoPorcentaje: 15,
      descripcion: '15% de descuento en consumo',
    },
    pregunta: {
      materia: 'Matemáticas',
      enunciado: '¿Cuánto es 25 × 40?',
      respuestasAceptadas: ['1000', '1 000'],
      pista: '25 × 4 = 100, luego multiplica por 10',
    },
  },
  {
    id: 'conversion-monedas',
    titulo: 'Equivalencia PayUETS',
    descripcion: 'Suma monedas extra resolviendo la equivalencia',
    recompensaMonedas: 75,
    pregunta: {
      materia: 'Matemáticas',
      enunciado: 'Si 100 monedas equivalen a $1.00, ¿cuántas monedas son $3.50?',
      respuestasAceptadas: ['350'],
      pista: 'Multiplica 3.5 por 100',
    },
  },
];

export default function RetosScreen() {
  const { usuarioActivo, recargarLocal, otorgarCupon, tema, esOscuro } = useBilletera();
  const router = useRouter();
  const [completados, setCompletados] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [retoSeleccionado, setRetoSeleccionado] = useState<Reto | null>(null);

  useEffect(() => {
    setCompletados([]);
    setMensaje(null);
    setRetoSeleccionado(null);
  }, [usuarioActivo?.email]);

  if (!usuarioActivo) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: tema.background }]}>
        <Text style={[styles.aviso, { color: tema.text }]}>
          Inicia sesión para ver y reclamar retos.
        </Text>
        <Boton titulo="Ir al Login" onPress={() => router.replace('/')} colorFondo={tema.primary} />
      </View>
    );
  }

  const abrirReto = (reto: Reto) => {
    if (completados.includes(reto.id)) {
      setMensaje(`Ya reclamaste "${reto.titulo}".`);
      return;
    }
    setMensaje(null);
    setRetoSeleccionado(reto);
  };

  const confirmarRecompensa = () => {
    if (!retoSeleccionado) return;

    if (retoSeleccionado.recompensaMonedas > 0) {
      recargarLocal(retoSeleccionado.recompensaMonedas);
    }
    if (retoSeleccionado.recompensaCupon) {
      otorgarCupon(retoSeleccionado.recompensaCupon);
    }

    setCompletados((prev) => [...prev, retoSeleccionado.id]);

    const premios: string[] = [];
    if (retoSeleccionado.recompensaMonedas > 0) {
      premios.push(`+${retoSeleccionado.recompensaMonedas} monedas`);
    }
    if (retoSeleccionado.recompensaCupon) {
      premios.push(
        `cupón ${retoSeleccionado.recompensaCupon.codigo} (${retoSeleccionado.recompensaCupon.descuentoPorcentaje}% OFF)`
      );
    }

    setMensaje(`¡Respuesta correcta! Recibiste ${premios.join(' y ')}.`);
    setRetoSeleccionado(null);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: tema.background }]}>
      <Text style={[styles.title, { color: tema.text }]}>Retos PayUETS</Text>
      <Text style={[styles.subtitle, { color: tema.primary }]}>
        Saldo: {usuarioActivo.saldo} monedas · Cupones disponibles: {usuarioActivo.cupones.length}
      </Text>

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

      {RETOS_UETS.map((reto) => {
        const reclamado = completados.includes(reto.id);
        const etiquetaPremio = reto.recompensaCupon
          ? `${reto.recompensaMonedas > 0 ? `${reto.recompensaMonedas} 🪙 + ` : ''}Cupón ${reto.recompensaCupon.descuentoPorcentaje}%`
          : undefined;

        return (
          <TarjetaBar
            key={reto.id}
            nombre={reto.titulo}
            descripcion={`${reto.descripcion} · Materia: ${reto.pregunta.materia}${
              etiquetaPremio ? ` · Premio: ${etiquetaPremio}` : ''
            }`}
            precioMonedas={reto.recompensaMonedas > 0 ? reto.recompensaMonedas : undefined}
            textoBoton={reclamado ? 'Reclamado ✓' : 'Responder y Reclamar'}
            onPress={() => abrirReto(reto)}
          />
        );
      })}

      <ModalReto
        visible={Boolean(retoSeleccionado)}
        tituloReto={retoSeleccionado?.titulo ?? ''}
        recompensaMonedas={retoSeleccionado?.recompensaMonedas ?? 0}
        recompensaCupon={retoSeleccionado?.recompensaCupon}
        pregunta={retoSeleccionado?.pregunta ?? null}
        onCerrar={() => setRetoSeleccionado(null)}
        onRespuestaCorrecta={confirmarRecompensa}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', padding: 24 },
  aviso: { fontSize: 16, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 15, marginBottom: 12, fontWeight: '600' },
  mensaje: {
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    padding: 10,
    borderRadius: 8,
  },
});