export type Role = 'admin' | 'recepcion' | 'especialista' | 'caja' | 'gerencia' | 'paciente';

export type KPI = {
  label: string;
  value: string;
  hint: string;
};

export type PatientRecord = {
  id: string;
  fullName: string;
  phone: string;
  lastVisit: string;
  upcomingVisit: string;
  allergies: string;
  status: 'activo' | 'frecuente' | 'nuevo';
};
