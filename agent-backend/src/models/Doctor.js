import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  doctorId: { type: String, unique: true, sparse: true, trim: true },
  name: { type: String, required: true, trim: true, index: true },
  department: { type: String, required: true, trim: true, index: true },
  specialty: { type: String, trim: true, default: '' },
  hospital: { type: String, trim: true, default: 'HealthPilot Partner Clinic' },
  city: { type: String, trim: true, default: 'Bengaluru', index: true },
  experienceYears: { type: Number, min: 0, max: 70, default: 5 },
  consultationFee: { type: Number, min: 0, default: 500 },
  rating: { type: Number, min: 0, max: 5, default: 4.7 },
  avatarColor: { type: String, default: 'mint' },
  isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true, versionKey: false });

doctorSchema.index({ name: 'text', department: 'text', specialty: 'text', hospital: 'text', city: 'text' });
export default mongoose.model('Doctor', doctorSchema);
