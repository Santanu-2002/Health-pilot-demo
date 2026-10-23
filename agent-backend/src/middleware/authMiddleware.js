import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function optionalAuth(req, _res, next) {
  try {
    const bearer = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
    const token = req.cookies?.accessToken || bearer;
    if (!token) return next();
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('_id name email role');
    if (user) req.user = user;
  } catch { /* An invalid optional token is treated as unauthenticated. */ }
  next();
}

export async function requireAuth(req, res, next) {
  try {
    const bearer = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
    const token = req.cookies?.accessToken || bearer;
    if (!token) return res.status(401).json({ message: 'Please sign in to continue.', code: 'AUTH_REQUIRED' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('_id name email role');
    if (!user) return res.status(401).json({ message: 'Your session is no longer valid. Please sign in again.' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Your session has expired. Please sign in again.', code: 'INVALID_TOKEN' });
  }
}
