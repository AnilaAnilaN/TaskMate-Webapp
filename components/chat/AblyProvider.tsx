// components/chat/AblyProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import * as Ably from 'ably';

interface AblyContextType {
  client: Ably.Realtime | null;
  isConnected: boolean;
}

const AblyContext = createContext<AblyContextType>({
  client: null,
  isConnected: false,
});

export function AblyProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<Ably.Realtime | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let ablyClient: Ably.Realtime | null = null;

    const initAbly = async () => {
      try {
        // Fetch auth token from our API
        const response = await fetch('/api/chat/ably-token');
        if (!response.ok) {
          throw new Error('Failed to fetch Ably token');
        }

        const { tokenRequest } = await response.json();
        const parsedTokenRequest = JSON.parse(tokenRequest);

        // Initialize Ably client
        ablyClient = new Ably.Realtime({
          authCallback: async (data, callback) => {
            try {
              const res = await fetch('/api/chat/ably-token');
              const { tokenRequest: newToken } = await res.json();
              callback(null, JSON.parse(newToken));
            } catch (error) {
              callback(error as any, null);
            }
          },
        });

        // Wait for connection
        ablyClient.connection.on('connected', () => {
          console.log('✅ Ably connected');
          setIsConnected(true);
        });

        ablyClient.connection.on('disconnected', () => {
          console.log('❌ Ably disconnected');
          setIsConnected(false);
        });

        ablyClient.connection.on('failed', (error) => {
          console.error('❌ Ably connection failed:', error);
          setIsConnected(false);
        });

        setClient(ablyClient);
      } catch (error) {
        console.error('Failed to initialize Ably:', error);
      }
    };

    initAbly();

    return () => {
      if (ablyClient) {
        ablyClient.close();
      }
    };
  }, []);

  return (
    <AblyContext.Provider value={{ client, isConnected }}>
      {children}
    </AblyContext.Provider>
  );
}

export function useAbly() {
  const context = useContext(AblyContext);
  if (!context) {
    throw new Error('useAbly must be used within AblyProvider');
  }
  return context;
}