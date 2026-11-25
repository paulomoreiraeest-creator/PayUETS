import React, { createContext, useContext, useState } from 'react';
import { Vibration } from 'react-native';

interface Usuario {
  email: string;
  nombre: string;
  saldo: number; // 100 monedas = $1.00
}

interface BilleteraContextType {
  usuarioActivo: Usuario | null;
  companeros: Usuario[];
  error: string | null;
  loginInstitucional: (email: string) => boolean;
  cerrarSesion: () => void;
  recargarLocal: (monedas: number) => void;
  transferirP2P: (emailDestino: string, monedas: number) => boolean;
  comprarEnBar: (costoFinal: number) => boolean;
}

const BilleteraContext = createContext<BilleteraContextType | undefined>(undefined);

const USUARIOS_INICIALES: Usuario[] = [
  { email: 'paulo.moreira@uets.edu.ec', nombre: 'Paulo Moreira', saldo: 500 },
  { email: 'mateo.perez@uets.edu.ec', nombre: 'Mateo Pérez', saldo: 300 },
  { email: 'domenic.gomez@uets.edu.ec', nombre: 'Domenic Gómez', saldo: 450 },
];

function notificar(tipo: 'exito' | 'error') {
  try {
    if (tipo === 'exito') {
      Vibration.vibrate(40);
    } else {
      Vibration.vibrate([0, 60, 40, 60]);
    }
  } catch {
    // Ignorar en entornos sin vibración
  }
}

export function BilleteraProvider({ children }: { children: React.ReactNode }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>(USUARIOS_INICIALES);
  const [emailActivo, setEmailActivo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const usuarioActivo = usuarios.find((u) => u.email === emailActivo) || null;
  const companeros = usuarios.filter((u) => u.email !== emailActivo);

  const loginInstitucional = (email: string): boolean => {
    const limpio = email.trim().toLowerCase();
    if (!limpio.endsWith('@uets.edu.ec')) {
      setError('Acceso restringido: Usa un correo institucional @uets.edu.ec');
      notificar('error');
      return false;
    }

    const existe = usuarios.find((u) => u.email === limpio);
    if (!existe) {
      setUsuarios((prev) => [
        ...prev,
        { email: limpio, nombre: limpio.split('@')[0], saldo: 200 },
      ]);
    }
    setEmailActivo(limpio);
    setError(null);
    return true;
  };

  const cerrarSesion = () => {
    setEmailActivo(null);
    setError(null);
  };

  const recargarLocal = (monedas: number) => {
    if (!emailActivo) return;
    setUsuarios((prev) =>
      prev.map((u) => (u.email === emailActivo ? { ...u, saldo: u.saldo + monedas } : u))
    );
    notificar('exito');
  };

  const transferirP2P = (emailDestino: string, monedas: number): boolean => {
    if (!usuarioActivo || usuarioActivo.saldo < monedas || monedas <= 0) {
      notificar('error');
      return false;
    }

    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.email === usuarioActivo.email) return { ...u, saldo: u.saldo - monedas };
        if (u.email === emailDestino) return { ...u, saldo: u.saldo + monedas };
        return u;
      })
    );
    notificar('exito');
    return true;
  };

  const comprarEnBar = (costoFinal: number): boolean => {
    if (!usuarioActivo || usuarioActivo.saldo < costoFinal) {
      notificar('error');
      return false;
    }

    setUsuarios((prev) =>
      prev.map((u) =>
        u.email === usuarioActivo.email ? { ...u, saldo: u.saldo - costoFinal } : u
      )
    );
    notificar('exito');
    return true;
  };

  return (
    <BilleteraContext.Provider
      value={{
        usuarioActivo,
        companeros,
        error,
        loginInstitucional,
        cerrarSesion,
        recargarLocal,
        transferirP2P,
        comprarEnBar,
      }}
    >
      {children}
    </BilleteraContext.Provider>
  );
}

export function useBilletera() {
  const context = useContext(BilleteraContext);
  if (!context) throw new Error('useBilletera debe usarse dentro de BilleteraProvider');
  return context;
}