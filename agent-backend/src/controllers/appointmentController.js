import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

export async function listMyAppointments(req, res, next) {
  try {
    const appointments = await Appointment.find({ patient: req.user._id }).populate('doctor', 'name department specialty hospital city consultationFee').sort({ appointmentAt: -1 }).lean();
    res.json({ appointments });
  } catch (error) { next(error); }
}

export async function createAppointment(req, res, next) {
  try {
    const { doctorId, appointmentAt, reason = '' } = req.body;
    if (!doctorId || !appointmentAt) return res.status(400).json({ message: 'Choose a doctor and appointment date/time.' });
    if (String(reason).length > 500) return res.status(400).json({ message: 'Reason must be 500 characters or fewer.' });
    const date = new Date(appointmentAt);
    if (Number.isNaN(date.getTime()) || date <= new Date()) return res.status(400).json({ message: 'Choose a future date and time.' });
    if (date.getTime() < Date.now() + 60 * 60 * 1000) return res.status(400).json({ message: 'Please book at least one hour in advance.' });
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(400).json({ message: 'This doctor is not available for booking. Please choose a listed doctor from the database.' });
    if (date.getMinutes() % 30 !== 0 || date.getSeconds() !== 0) return res.status(400).json({ message: 'Choose a slot starting on the hour or half-hour.' });
    const conflict = await Appointment.findOne({ doctor: doctor._id, appointmentAt: date, status: { $in: ['pending', 'confirmed'] } });
    if (conflict) return res.status(409).json({ message: 'That time slot has just been taken. Please choose another time.' });
    const appointment = await Appointment.create({ patient: req.user._id, doctor: doctor._id, appointmentAt: date, reason: String(reason).trim(), status: 'confirmed' });
    const populated = await appointment.populate('doctor', 'name department specialty hospital city consultationFee');
    res.status(201).json({ appointment: populated, message: 'Your appointment is confirmed.' });
  } catch (error) { next(error); }
}

export async function cancelAppointment(req, res, next) {
  try {
    const appointment = await Appointment.findOneAndUpdate({ _id: req.params.id, patient: req.user._id, status: { $in: ['pending', 'confirmed'] } }, { status: 'cancelled' }, { new: true }).populate('doctor', 'name department specialty hospital city');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found or it can no longer be cancelled.' });
    res.json({ appointment, message: 'Appointment cancelled.' });
  } catch (error) { next(error); }
}
