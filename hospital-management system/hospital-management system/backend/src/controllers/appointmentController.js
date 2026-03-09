import Appointment from '../models/Appointment.js';

export const getAppointments = async (req, res, next) => {
  try {
    const { patient, doctor, date, status } = req.query;
    const filter = {};
    if (patient) filter.patient = patient;
    if (doctor) filter.doctor = doctor;
    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: d, $lt: end };
    }
    if (status) filter.status = status;
    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .populate('department', 'name')
      .sort({ date: 1, timeSlot: 1 });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone dateOfBirth')
      .populate('doctor', 'name specialization consultationFee')
      .populate('department', 'name');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.create(req.body);
    await appointment.populate(['patient', 'doctor', 'department']);
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .populate('department', 'name');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment removed' });
  } catch (error) {
    next(error);
  }
};
