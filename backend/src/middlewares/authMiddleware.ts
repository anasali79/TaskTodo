import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser, UserRole } from '../models/User';

interface DecodedToken {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET;
      if (!secret) return res.status(500).json({ message: 'Auth secret not configured' });

      const decoded = jwt.verify(token, secret) as DecodedToken;
      const user = await User.findById(decoded.id).select('-password');

      if (!user) return res.status(401).json({ message: 'User not found' });
      
      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === UserRole.ADMIN) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
