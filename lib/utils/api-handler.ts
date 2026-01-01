import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { dbConnect } from '@/lib/db/mongoose';
import { verifyToken } from '@/lib/auth/jwt';
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from './api-response';

type AuthenticatedRequest = NextRequest & {
  user: {
    id: string;
  };
};

type ApiMethodHandler = (
  req: NextRequest | AuthenticatedRequest,
  params?: any
) => Promise<NextResponse>;

interface HandlerOptions {
  auth?: boolean;
  schema?: z.ZodSchema<any>;
}

export function apiHandler(
  handler: ApiMethodHandler,
  options: HandlerOptions = {}
) {
  return async (req: NextRequest, params?: any) => {
    try {
      await dbConnect();

      let validatedBody: any;
      if (options.schema) {
        const body = await req.json();
        const validationResult = options.schema.safeParse(body);
        if (!validationResult.success) {
          return validationErrorResponse(validationResult.error.issues);
        }
        validatedBody = validationResult.data;
      }

      const modifiedReq = Object.assign(req, {
        json: async () => validatedBody
      });


      if (options.auth) {
        const token =
          req.headers.get('Authorization')?.split(' ')[1] ||
          req.cookies.get('token')?.value;

        if (!token) {
          return errorResponse('Unauthorized', 401);
        }

        const decoded = verifyToken(token);
        (modifiedReq as AuthenticatedRequest).user = { id: decoded.userId };
      }

      return await handler(modifiedReq, params);
    } catch (error) {
      if (error instanceof ZodError) {
        return validationErrorResponse(error.issues);
      }
      if (error instanceof Error && error.message === 'Invalid token') {
        return errorResponse('Invalid token', 401);
      }
      console.error('API Handler Error:', error);
      return errorResponse('Internal Server Error', 500);
    }
  };
}
