import jwt from 'jsonwebtoken';

export function verifyToken(token: string): { userId: string } {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function createToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
}