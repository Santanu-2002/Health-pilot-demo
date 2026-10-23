import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';
import Doctor from '../src/models/Doctor.js';
dotenv.config();

function parseCsvLine(line) {
  const cells = []; let value = ''; let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && quoted && line[i + 1] === '"') { value += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { cells.push(value.trim()); value = ''; }
    else value += char;
  }
  cells.push(value.trim()); return cells;
}
function normalizeHeader(value) { return value.toLowerCase().replace(/[^a-z0-9]/g, ''); }
function first(row, ...keys) { for (const key of keys) { const value = row[normalizeHeader(key)]; if (value !== undefined && value !== '') return value; } return ''; }
function numberOr(value, fallback) { const n = Number(value); return Number.isFinite(n) ? n : fallback; }

const inputPath = process.argv[2];
if (!inputPath) throw new Error('Usage: npm run import:doctors -- ./data/doctors.csv');
if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in agent-backend/.env first.');
const csv = await fs.readFile(path.resolve(inputPath), 'utf8');
const lines = csv.replace(/^\uFEFF/, '').split(/\r?\n/).filter((line) => line.trim());
if (lines.length < 2) throw new Error('CSV must include a header row and at least one doctor row.');
const headers = parseCsvLine(lines.shift()).map(normalizeHeader);
const records = lines.map((line) => { const values = parseCsvLine(line); return Object.fromEntries(headers.map((header, i) => [header, values[i] || ''])); });
const doctors = records.map((row, index) => {
  const name = first(row, 'name', 'doctorName', 'fullName');
  const department = first(row, 'department', 'specialty', 'specialization', 'category');
  if (!name || !department) throw new Error(`CSV row ${index + 2} must include name and department/specialty.`);
  const doctorId = first(row, 'doctorId', 'id', 'registrationNumber') || `IMPORT-${String(index + 1).padStart(5, '0')}`;
  return {
    doctorId, name, department,
    specialty: first(row, 'specialty', 'specialization') || department,
    hospital: first(row, 'hospital', 'hospitalName', 'clinic') || 'Partner clinic',
    city: first(row, 'city', 'location') || 'Not specified',
    experienceYears: Math.max(0, numberOr(first(row, 'experienceYears', 'experience'), 5)),
    consultationFee: Math.max(0, numberOr(first(row, 'consultationFee', 'fee'), 0)),
    rating: Math.min(5, Math.max(0, numberOr(first(row, 'rating'), 4.5))),
    isActive: true,
  };
});
await mongoose.connect(process.env.MONGODB_URI);
let imported = 0;
for (const doctor of doctors) {
  await Doctor.updateOne({ doctorId: doctor.doctorId }, { $set: doctor }, { upsert: true });
  imported += 1;
}
await mongoose.disconnect();
console.log(`Imported/updated ${imported} doctor records.`);
