export interface QueueItem {
  id: string;
  queueNumber: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  treatment: string;
  time: string;
  status: "Menunggu" | "Konsultasi" | "Selesai" | "Batal";
  room: string;
}

export interface DoctorSchedule {
  id: string;
  doctorName: string;
  specialty: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  quota: number;
  status: "Aktif" | "Cuti" | "Selesai";
}

export interface MedicalRecordData {
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  skinType: string;
  allergies: string;
  complaints: string;
  diagnosis: string;
  treatments: string[];
  prescriptions: string;
  notes: string;
  nextAppointment?: string;
}

export const initialQueues: QueueItem[] = [
  {
    id: "Q-001",
    queueNumber: "A-01",
    patientName: "Clarissa Aurelia",
    patientPhone: "0812-3456-7890",
    doctorName: "dr. Nadia Sp.KK",
    treatment: "Laser Rejuvenation & Glowing Facial",
    time: "09:00 WIB",
    status: "Konsultasi",
    room: "Ruang Estetika 1",
  },
  {
    id: "Q-002",
    queueNumber: "A-02",
    patientName: "Siti Rahmawati",
    patientPhone: "0813-9876-5432",
    doctorName: "dr. Felicia Tan",
    treatment: "Acne Peeling & LED Therapy",
    time: "09:30 WIB",
    status: "Menunggu",
    room: "Ruang Tindakan 2",
  },
  {
    id: "Q-003",
    queueNumber: "A-03",
    patientName: "Amanda Putri",
    patientPhone: "0811-2233-4455",
    doctorName: "dr. Nadia Sp.KK",
    treatment: "Botox Anti-Aging Treatment",
    time: "10:15 WIB",
    status: "Menunggu",
    room: "Ruang Estetika 1",
  },
  {
    id: "Q-004",
    queueNumber: "A-04",
    patientName: "Jessica Melinda",
    patientPhone: "0821-4455-6677",
    doctorName: "dr. Nadia Sp.KK",
    treatment: "Hydra Glow Infusion",
    time: "08:15 WIB",
    status: "Selesai",
    room: "Ruang Tindakan 1",
  },
  {
    id: "Q-005",
    queueNumber: "A-05",
    patientName: "Dewi Lestari",
    patientPhone: "0857-1122-3344",
    doctorName: "dr. Felicia Tan",
    treatment: "Skin Booster Salmon DNA",
    time: "11:00 WIB",
    status: "Menunggu",
    room: "Ruang Tindakan 2",
  },
];

export const initialSchedules: DoctorSchedule[] = [
  {
    id: "SCH-01",
    doctorName: "dr. Nadia Putri, Sp.KK",
    specialty: "Spesialis Kulit & Kelamin",
    day: "Senin - Kamis",
    startTime: "09:00",
    endTime: "15:00",
    room: "Ruang Estetika 1",
    quota: 15,
    status: "Aktif",
  },
  {
    id: "SCH-02",
    doctorName: "dr. Felicia Tan",
    specialty: "Aesthetic Doctor & Anti-Aging",
    day: "Senin - Sabtu",
    startTime: "10:00",
    endTime: "17:00",
    room: "Ruang Tindakan 2",
    quota: 20,
    status: "Aktif",
  },
  {
    id: "SCH-03",
    doctorName: "dr. Kevin Pratama",
    specialty: "Aesthetic Laser Specialist",
    day: "Jumat - Minggu",
    startTime: "13:00",
    endTime: "20:00",
    room: "Ruang Laser Pro",
    quota: 12,
    status: "Aktif",
  },
  {
    id: "SCH-04",
    doctorName: "dr. Gisella Anastasia, Sp.DVE",
    specialty: "Dermatologi & Venereologi",
    day: "Rabu & Jumat",
    startTime: "09:00",
    endTime: "14:00",
    room: "Ruang Konsultasi VIP",
    quota: 10,
    status: "Cuti",
  },
];
