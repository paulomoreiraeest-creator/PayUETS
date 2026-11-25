import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { BilleteraProvider, useBilletera } from '../hooks/useBilletera';

function NavegacionConTabs() {
  const { usuarioActivo, tema } = useBilletera();
  const sesionActiva = Boolean(usuarioActivo);

  const estiloTabBar = sesionActiva
    ? {
        backgroundColor: tema.card,
        borderTopColor: tema.border,
      }
    : { display: 'none' as const };

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: tema.primary,
        tabBarInactiveTintColor: tema.subtext,
        headerStyle: { backgroundColor: tema.card },
        headerTintColor: tema.text,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Acceso PayUETS',
          headerShown: false,
          tabBarStyle: { display: 'none' },
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Billetera',
          tabBarStyle: estiloTabBar,
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>💳</Text>,
        }}
      />
      <Tabs.Screen
        name="bares"
        options={{
          title: 'Bares UETS',
          tabBarStyle: estiloTabBar,
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>🍔</Text>,
        }}
      />
      <Tabs.Screen
        name="retos"
        options={{
          title: 'Retos',
          tabBarStyle: estiloTabBar,
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>🎯</Text>,
        }}
      />
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <BilleteraProvider>
      <NavegacionConTabs />
    </BilleteraProvider>
  );
}