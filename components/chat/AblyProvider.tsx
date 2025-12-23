// ============================================
// 3. Updated AblyProvider with Global Presence
// ============================================
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

export function AblyProvider({ 
  children,
  userId 
}: { 
  children: React.ReactNode;
  userId?: string;
}) {
  const [client, setClient] = useState<Ably.Realtime | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let ablyClient: Ably.Realtime | null = null;

    const initAbly = async () => {
      try {
        const response = await fetch('/api/chat/ably-token');
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Ably token error:', data);
          throw new Error(data.error || 'Failed to fetch Ably token');
        }

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

        ablyClient.connection.on('connected', async () => {
          console.log('✅ Ably connected');
          setIsConnected(true);
          
          // Enter global presence when connected
          if (userId) {
            const presenceChannel = ablyClient!.channels.get('global:presence');
            try {
              await presenceChannel.presence.enter({ userId });
            } catch (err) {
              console.error('Failed to enter presence:', err);
            }
          }
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
      if (ablyClient && userId) {
        // Leave global presence when unmounting
        const presenceChannel = ablyClient.channels.get('global:presence');
        presenceChannel.presence.leave();
      }
      if (ablyClient) {
        ablyClient.close();
      }
    };
  }, [userId]);

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
