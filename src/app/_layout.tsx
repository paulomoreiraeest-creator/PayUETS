import React from 'react';
import { Stack } from 'expo-router';
import { BilleteraProvider } from '../hooks/useBilletera';
import { Colores } from '../styles/colores';

export default function RootLayout() {
  return (
    <BilleteraProvider>
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerStyle: { backgroundColor: Colores.light.primary },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Acceso PayUETS',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="wallet"
          options={{
            title: 'Billetera PayUETS',
          }}
        />
        <Stack.Screen
          name="bares"
          options={{
            title: 'Bares UETS',
          }}
        />
      </Stack>
    </BilleteraProvider>
  );
}