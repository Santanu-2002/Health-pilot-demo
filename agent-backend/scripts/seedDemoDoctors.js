import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Doctor from '../src/models/Doctor.js';
dotenv.config();

const doctors = [
  { doctorId: 'DEMO-001', name: 'Dr. Asha Mehta', department: 'Cardiology', specialty: 'Heart health', hospital: 'HealthPilot Partner Clinic', city: 'Bengaluru', experienceYears: 12, consultationFee: 700, rating: 4.9, avatarColor: 'mint' },
  { doctorId: 'DEMO-002', name: 'Dr. Rohan Das', department: 'Dermatology', specialty: 'Skin and hair', hospital: 'HealthPilot Partner Clinic', city: 'Bengaluru', experienceYears: 9, consultationFee: 600, rating: 4.8, avatarColor: 'blue' },
  { doctorId: 'DEMO-003', name: 'Dr. Nisha Rao', department: 'Orthopedics', specialty: 'Bones and joints', hospital: 'City Care Centre', city: 'Bengaluru', experienceYears: 14, consultationFee: 800, rating: 4.9, avatarColor: 'lavender' },
  { doctorId: 'DEMO-004', name: 'Dr. Kabir Sen', department: 'General Medicine', specialty: 'General health', hospital: 'City Care Centre', city: 'Bengaluru', experienceYears: 7, consultationFee: 450, rating: 4.7, avatarColor: 'amber' },
  { doctorId: 'DEMO-005', name: 'Dr. Mira Iyer', department: 'Pediatrics', specialty: 'Child health', hospital: 'Little Steps Clinic', city: 'Bengaluru', experienceYears: 11, consultationFee: 550, rating: 4.8, avatarColor: 'rose' },
  { doctorId: 'DEMO-006', name: 'Dr. Arjun Nair', department: 'Neurology', specialty: 'Brain and nerves', hospital: 'HealthPilot Partner Clinic', city: 'Bengaluru', experienceYears: 15, consultationFee: 900, rating: 4.9, avatarColor: 'blue' },
];
if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in agent-backend/.env first.');
await mongoose.connect(process.env.MONGODB_URI);
for (const doctor of doctors) await Doctor.updateOne({ doctorId: doctor.doctorId }, { $set: doctor }, { upsert: true });
console.log(`Seeded ${doctors.length} clearly labelled demo doctor records.`);
await mongoose.disconnect();
