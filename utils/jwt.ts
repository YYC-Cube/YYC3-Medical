import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const signToken = (payload: object) => jwt.sign(payload, SECRET, { expiresIn: '1d' });
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
};
