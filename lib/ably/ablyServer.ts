// lib/ably/ablyServer.ts
import Ably from 'ably';

let ablyServer: Ably.Rest | null = null;

export function getAblyServer(): Ably.Rest {
  if (!ablyServer) {
    const apiKey = process.env.ABLY_API_KEY;
    
    if (!apiKey) {
      throw new Error('ABLY_API_KEY is not configured');
    }

    ablyServer = new Ably.Rest({ key: apiKey });
  }

  return ablyServer;
}

// Helper to publish messages from server
export async function publishMessage(
  channelName: string,
  eventName: string,
  data: any
): Promise<void> {
  const ably = getAblyServer();
  const channel = ably.channels.get(channelName);
  await channel.publish(eventName, data);
}

// Helper to generate auth tokens for clients
export async function generateAblyToken(clientId: string): Promise<string> {
  const ably = getAblyServer();
  const tokenRequest = await ably.auth.createTokenRequest({
    clientId,
    capability: {
      '*': ['subscribe', 'presence', 'history'],
      'chat:*': ['publish', 'subscribe', 'presence', 'history'],
    },
  });
  
  return JSON.stringify(tokenRequest);
}