import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointmentAt: { type: Date, required: true, index: true },
  reason: { type: String, trim: true, maxlength: 500, default: '' },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'confirmed', index: true },
}, { timestamps: true, versionKey: false });

appointmentSchema.index({ doctor: 1, appointmentAt: 1 }, { unique: true, partialFilterExpression: { status: 'confirmed' } });
export default mongoose.model('Appointment', appointmentSchema);
