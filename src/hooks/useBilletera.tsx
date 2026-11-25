import React, { createContext, useContext, useState } from 'react';
import { Vibration } from 'react-native';
import { Colores } from '../styles/colores';

export interface Cupon {
  id: string;
  codigo: string;
  descuentoPorcentaje: number;
  descripcion: string;
}

interface Usuario {
  email: string;
  nombre: string;
  saldo: number; // 100 monedas = $1.00
  cupones: Cupon[];
}

export type PaletaTema = typeof Colores.light;

interface BilleteraContextType {
  usuarioActivo: Usuario | null;
  companeros: Usuario[];
  error: string | null;
  esOscuro: boolean;
  tema: PaletaTema;
  alternarTema: () => void;
  loginInstitucional: (email: string) => boolean;
  cerrarSesion: () => void;
  recargarLocal: (monedas: number) => void;
  otorgarCupon: (cupon: Cupon) => void;
  transferirP2P: (emailDestino: string, monedas: number) => boolean;
  comprarEnBar: (costoFinal: number, cuponId?: string) => boolean;
}

const BilleteraContext = createContext<BilleteraContextType | undefined>(undefined);

const CUPON_INICIAL: Cupon = {
  id: 'cupon-bienvenida-20',
  codigo: 'UETS20',
  descuentoPorcentaje: 20,
  descripcion: '20% de descuento en bares',
};

const USUARIOS_INICIALES: Usuario[] = [
  {
    email: 'paulo.moreira.est@uets.edu.ec',
    nombre: 'Paulo Moreira',
    saldo: 500,
    cupones: [{ ...CUPON_INICIAL, id: 'cupon-paulo-1' }],
  },
  {
    email: 'mateo.perez.est@uets.edu.ec',
    nombre: 'Mateo Pérez',
    saldo: 300,
    cupones: [],
  },
  {
    email: 'domenic.gomez.est@uets.edu.ec',
    nombre: 'Domenic Gómez',
    saldo: 450,
    cupones: [],
  },
];

function formatearNombreDesdeCorreo(correo: string): string {
  const prefijo = correo.replace(/\.est@uets\.edu\.ec$/i, '');
  const partes = prefijo.split('.').filter(Boolean);
  if (partes.length === 0) return 'Estudiante UETS';
  return partes
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(' ');
}

function esCorreoEstudianteValido(correo: string): boolean {
  return /^[^@\s]+\.est@uets\.edu\.ec$/i.test(correo);
}

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
  const [esOscuro, setEsOscuro] = useState<boolean>(true);

  const tema = esOscuro ? Colores.dark : Colores.light;
  const usuarioActivo = usuarios.find((u) => u.email === emailActivo) || null;
  const companeros = usuarios.filter((u) => u.email !== emailActivo);

  const alternarTema = () => setEsOscuro((prev) => !prev);

  const loginInstitucional = (email: string): boolean => {
    const limpio = email.trim().toLowerCase();
    if (!esCorreoEstudianteValido(limpio)) {
      setError('Acceso restringido: Usa tu correo estudiantil primernombre.apellido.est@uets.edu.ec');
      notificar('error');
      return false;
    }

    const existe = usuarios.find((u) => u.email === limpio);
    if (!existe) {
      setUsuarios((prev) => [
        ...prev,
        {
          email: limpio,
          nombre: formatearNombreDesdeCorreo(limpio),
          saldo: 200,
          cupones: [{ ...CUPON_INICIAL, id: `cupon-${Date.now()}` }],
        },
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
    if (!emailActivo || monedas <= 0) return;
    setUsuarios((prev) =>
      prev.map((u) => (u.email === emailActivo ? { ...u, saldo: u.saldo + monedas } : u))
    );
    notificar('exito');
  };

  const otorgarCupon = (cupon: Cupon) => {
    if (!emailActivo) return;
    setUsuarios((prev) =>
      prev.map((u) =>
        u.email === emailActivo
          ? { ...u, cupones: [...u.cupones, { ...cupon, id: `${cupon.id}-${Date.now()}` }] }
          : u
      )
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

  const comprarEnBar = (costoFinal: number, cuponId?: string): boolean => {
    if (!usuarioActivo || usuarioActivo.saldo < costoFinal) {
      notificar('error');
      return false;
    }

    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.email !== usuarioActivo.email) return u;
        const cuponesActualizados = cuponId
          ? u.cupones.filter((c) => c.id !== cuponId)
          : u.cupones;
        return {
          ...u,
          saldo: u.saldo - costoFinal,
          cupones: cuponesActualizados,
        };
      })
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
        esOscuro,
        tema,
        alternarTema,
        loginInstitucional,
        cerrarSesion,
        recargarLocal,
        otorgarCupon,
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