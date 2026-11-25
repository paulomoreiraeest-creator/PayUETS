import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { Cupon, useBilletera } from '../hooks/useBilletera';
import { Boton } from './Boton';

export interface PreguntaReto {
  materia: string;
  enunciado: string;
  respuestasAceptadas: string[];
  pista?: string;
}

interface Props {
  visible: boolean;
  tituloReto: string;
  recompensaMonedas: number;
  recompensaCupon?: Cupon;
  pregunta: PreguntaReto | null;
  onCerrar: () => void;
  onRespuestaCorrecta: () => void;
}

function normalizarRespuesta(texto: string): string {
  return texto.trim().replace(/\s+/g, '').replace(/,/g, '').replace(/\./g, '').toLowerCase();
}

export function ModalReto({
  visible,
  tituloReto,
  recompensaMonedas,
  recompensaCupon,
  pregunta,
  onCerrar,
  onRespuestaCorrecta,
}: Props) {
  const { tema } = useBilletera();
  const [respuesta, setRespuesta] = useState('');
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setRespuesta('');
      setFeedbackError(null);
    }
  }, [visible, pregunta]);

  if (!pregunta) return null;

  const verificar = () => {
    const limpia = normalizarRespuesta(respuesta);
    const esValida = pregunta.respuestasAceptadas.some(
      (acep) => normalizarRespuesta(acep) === limpia
    );

    if (!limpia) {
      setFeedbackError('Escribe una respuesta antes de comprobar.');
      return;
    }

    if (esValida) {
      setFeedbackError(null);
      onRespuestaCorrecta();
    } else {
      setFeedbackError('Respuesta incorrecta. ¡Inténtalo de nuevo!');
    }
  };

  const resumenPremio = [
    recompensaMonedas > 0 ? `+${recompensaMonedas} monedas` : null,
    recompensaCupon ? `Cupón ${recompensaCupon.descuentoPorcentaje}% OFF (${recompensaCupon.codigo})` : null,
  ]
    .filter(Boolean)
    .join(' + ');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: tema.card, borderColor: tema.border }]}>
          <Text style={[styles.materia, { color: tema.primary }]}>📚 {pregunta.materia}</Text>
          <Text style={[styles.titulo, { color: tema.text }]}>{tituloReto}</Text>
          <Text style={[styles.bono, { color: tema.secondary }]}>Premio: {resumenPremio}</Text>

          <Text style={[styles.pregunta, { color: tema.text }]}>{pregunta.enunciado}</Text>
          {pregunta.pista && (
            <Text style={[styles.pista, { color: tema.subtext }]}>Pista: {pregunta.pista}</Text>
          )}

          <TextInput
            style={[
              styles.input,
              {
                borderColor: tema.border,
                backgroundColor: tema.background,
                color: tema.text,
              },
            ]}
            placeholder="Escribe tu respuesta..."
            placeholderTextColor={tema.subtext}
            value={respuesta}
            onChangeText={(txt) => {
              setRespuesta(txt);
              if (feedbackError) setFeedbackError(null);
            }}
            keyboardType="numeric"
            autoCapitalize="none"
          />

          {feedbackError && <Text style={[styles.error, { color: tema.error }]}>{feedbackError}</Text>}

          <Boton titulo="Comprobar y Reclamar" onPress={verificar} colorFondo={tema.secondary} />
          <Boton titulo="Cancelar" onPress={onCerrar} colorFondo="#6B7280" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.65)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  materia: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bono: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 14,
  },
  pregunta: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 22,
  },
  pista: {
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  error: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
});