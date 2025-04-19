import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as JwtPayload;

        if (!payload || !payload.id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        //@ts-ignore
        req.id = payload.id; // Type-safe now
        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};
