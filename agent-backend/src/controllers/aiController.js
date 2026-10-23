import { GoogleGenAI } from '@google/genai';
import Doctor from '../models/Doctor.js';

export async function chat(req, res, next) {
  try {
    const message = String(req.body.message || '').trim();
    if (!message) return res.status(400).json({ message: 'Write a message first.' });
    if (message.length > 2000) return res.status(400).json({ message: 'Please keep messages under 2,000 characters.' });
    const doctors = await Doctor.find({ isActive: { $ne: false } }).select('name department specialty city').limit(40).lean();
    const doctorContext = doctors.length ? doctors.map((d) => `${d.name} — ${d.department}${d.specialty ? ` (${d.specialty})` : ''}, ${d.city}`).join('\n') : 'The database does not contain verified doctor profiles yet. Demo doctor listings may be shown separately in the UI.';
    const key = process.env.GEMINI_API_KEY;
    if (!key) return res.json({ reply: `I can help you plan your next step. For example, tell me which specialty you need and your preferred city.\n\nI cannot diagnose symptoms or confirm a booking in chat. You can browse available demo profiles in Doctors. ${req.user ? 'When you are ready, use the appointment form to book.' : 'You can explore the assistant without an account; signing in is required when you book.'}`, mode: 'fallback', requiresLoginToBook: !req.user });
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: `You are HealthPilot AI, a friendly healthcare appointment coordination assistant. You are not a clinician and must not diagnose, prescribe, or promise outcomes. Help users identify a relevant department and prepare to book an appointment. Never claim an appointment is booked. Only the authenticated appointment API can create bookings after explicit user confirmation. If the user describes emergency symptoms, advise contacting local emergency services immediately. Be concise, warm, and clear.\n\nDirectory context (may be incomplete):\n${doctorContext}\n\nUser status: ${req.user ? 'signed in' : 'guest (not signed in)'}\nUser message: ${message}`
    });
    res.json({ reply: response.text || 'I could not form a useful reply just now. Please try again.', mode: 'gemini', requiresLoginToBook: !req.user });
  } catch (error) { next(error); }
}
