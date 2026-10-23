import Doctor from '../models/Doctor.js';

const demoDoctors = [
  { doctorId: 'DEMO-001', name: 'Dr. Asha Mehta', department: 'Cardiology', specialty: 'Heart health', hospital: 'HealthPilot Partner Clinic', city: 'Bengaluru', experienceYears: 12, consultationFee: 700, rating: 4.9, avatarColor: 'mint' },
  { doctorId: 'DEMO-002', name: 'Dr. Rohan Das', department: 'Dermatology', specialty: 'Skin and hair', hospital: 'HealthPilot Partner Clinic', city: 'Bengaluru', experienceYears: 9, consultationFee: 600, rating: 4.8, avatarColor: 'blue' },
  { doctorId: 'DEMO-003', name: 'Dr. Nisha Rao', department: 'Orthopedics', specialty: 'Bones and joints', hospital: 'City Care Centre', city: 'Bengaluru', experienceYears: 14, consultationFee: 800, rating: 4.9, avatarColor: 'lavender' },
  { doctorId: 'DEMO-004', name: 'Dr. Kabir Sen', department: 'General Medicine', specialty: 'General health', hospital: 'City Care Centre', city: 'Bengaluru', experienceYears: 7, consultationFee: 450, rating: 4.7, avatarColor: 'amber' },
  { doctorId: 'DEMO-005', name: 'Dr. Mira Iyer', department: 'Pediatrics', specialty: 'Child health', hospital: 'Little Steps Clinic', city: 'Bengaluru', experienceYears: 11, consultationFee: 550, rating: 4.8, avatarColor: 'rose' },
  { doctorId: 'DEMO-006', name: 'Dr. Arjun Nair', department: 'Neurology', specialty: 'Brain and nerves', hospital: 'HealthPilot Partner Clinic', city: 'Bengaluru', experienceYears: 15, consultationFee: 900, rating: 4.9, avatarColor: 'blue' },
];

export async function listDoctors(req, res, next) {
  try {
    const filter = { isActive: { $ne: false } };
    if (req.query.department) filter.department = new RegExp(String(req.query.department).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (req.query.q) filter.$or = ['name', 'department', 'specialty', 'hospital', 'city'].map((field) => ({ [field]: new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }));
    const count = await Doctor.countDocuments(filter);
    const doctors = count ? await Doctor.find(filter).select('-__v').sort({ rating: -1, name: 1 }).limit(100).lean() : demoDoctors.filter((d) => (!filter.department || filter.department.test(d.department)) && (!req.query.q || new RegExp(String(req.query.q), 'i').test(`${d.name} ${d.department} ${d.specialty} ${d.hospital}`)));
    res.json({ doctors, source: count ? 'database' : 'demo', note: count ? undefined : 'Demo profiles for preview only. Import verified doctor data before real-world use.' });
  } catch (error) { next(error); }
}
