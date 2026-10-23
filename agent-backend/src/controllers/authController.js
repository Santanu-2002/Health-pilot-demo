import crypto from 'node:crypto';
import { promisify } from 'node:util';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const scrypt = promisify(crypto.scrypt);
const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', maxAge: 24 * 60 * 60 * 1000, path: '/' });
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, phone: user.phone || '' });
async function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const derived = await scrypt(password, salt, 64);
  return { salt, hash: derived.toString('hex') };
}
async function verifyPassword(password, stored) {
  const [salt, expected] = stored.split(':');
  const { hash } = await hashPassword(password, salt);
  const a = Buffer.from(hash, 'hex'); const b = Buffer.from(expected, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function issueSession(user, res) {
  const token = jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d', issuer: 'healthpilot-ai' });
  res.cookie('accessToken', token, cookieOptions());
}

export async function signup(req, res, next) {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const phone = String(req.body.phone || '').trim();
    if (name.length < 2) return res.status(400).json({ message: 'Enter your full name.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must contain at least 8 characters.' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'An account with this email already exists. Please sign in.' });
    const { salt, hash } = await hashPassword(password);
    const user = await User.create({ name, email, phone, passwordHash: `${salt}:${hash}` });
    issueSession(user, res);
    res.status(201).json({ user: publicUser(user) });
  } catch (error) { next(error); }
}

export async function login(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await verifyPassword(password, user.passwordHash))) return res.status(401).json({ message: 'Email or password is incorrect.' });
    issueSession(user, res);
    res.json({ user: publicUser(user) });
  } catch (error) { next(error); }
}

export async function me(req, res) { res.json({ user: publicUser(req.user) }); }
export async function logout(_req, res) { res.clearCookie('accessToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', path: '/' }); res.json({ message: 'You have been signed out.' }); }
