import { getSession } from 'next-auth/react';

interface SessionData {
  status: number;
  data: {
    message: string;
    user?: any;
    typeProfile?: string;
  };
}

export default async function getSessionData(): Promise<SessionData> {
  try {
    const session = await getSession();

    if (session) {
      return {
        status: 200,
        data: {
          message: 'User found',
          user: session.user,
          typeProfile: session.user.typeProfile 
        }
      };
    } else {
      return {
        status: 401,
        data: {
          message: 'User not authenticated',
        }
      };
    }
  } catch (error) {
    return {
      status: 500,
      data: {
        message: 'Error getting session',
      }
    };
  }
}
