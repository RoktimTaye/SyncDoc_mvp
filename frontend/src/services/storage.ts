// LocalStorage service for managing app data

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  phone?: string;
  registrationNumber?: string;
}

export interface Consultation {
  id: string;
  date: string;
  transcription: string;
  prescription: string;
  aiSummary: string;
  insights: {
    duration: string;
    confidence: string;
  };
  audioUrl?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone?: string;
  email?: string;
  bloodGroup?: string;
  allergies?: string[];
  consultations: Consultation[];
  createdAt: string;
  lastVisit: string;
}

// Doctor Management
export function saveDoctor(doctor: Doctor): void {
  localStorage.setItem("currentDoctor", JSON.stringify(doctor));
}

export function getDoctor(): Doctor | null {
  const data = localStorage.getItem("currentDoctor");
  return data ? JSON.parse(data) : null;
}

export function clearDoctor(): void {
  localStorage.removeItem("currentDoctor");
}

// Patient Management
export function savePatient(patient: Patient): void {
  const patients = getPatients();
  const index = patients.findIndex((p) => p.id === patient.id);
  
  if (index !== -1) {
    patients[index] = patient;
  } else {
    patients.push(patient);
  }
  
  localStorage.setItem("patients", JSON.stringify(patients));
}

export function getPatients(): Patient[] {
  const data = localStorage.getItem("patients");
  return data ? JSON.parse(data) : [];
}

export function getPatientById(id: string): Patient | null {
  const patients = getPatients();
  return patients.find((p) => p.id === id) || null;
}

export function deletePatient(id: string): void {
  const patients = getPatients().filter((p) => p.id !== id);
  localStorage.setItem("patients", JSON.stringify(patients));
}

// Consultation Management
export function addConsultation(patientId: string, consultation: Consultation): void {
  const patient = getPatientById(patientId);
  if (patient) {
    patient.consultations.push(consultation);
    patient.lastVisit = consultation.date;
    savePatient(patient);
  }
}

export function updateConsultation(
  patientId: string,
  consultationId: string,
  updates: Partial<Consultation>
): void {
  const patient = getPatientById(patientId);
  if (patient) {
    const index = patient.consultations.findIndex((c) => c.id === consultationId);
    if (index !== -1) {
      patient.consultations[index] = { ...patient.consultations[index], ...updates };
      savePatient(patient);
    }
  }
}

// Generate unique ID
export function generateId(prefix: string): string {
  return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
}

// Initialize with demo data if empty
export function initializeDemoData(): void {
  if (getPatients().length === 0) {
    const demoPatients: Patient[] = [
      {
        id: "PAT001",
        name: "Riya Sharma",
        age: 32,
        gender: "Female",
        phone: "+91 98765 43210",
        email: "riya.sharma@email.com",
        bloodGroup: "O+",
        allergies: ["Penicillin"],
        createdAt: "2025-09-15",
        lastVisit: "2025-10-16",
        consultations: [
          {
            id: "CONS001",
            date: "2025-10-16",
            transcription: "Patient complains about mild headache for the past 3 days. Pain is localized in the frontal region. No history of migraine. Patient reports stress at work.",
            prescription: "Tab. Paracetamol 500mg - Take twice daily after meals for 3 days\nAdvised to rest adequately and manage stress\nFollow-up if symptoms persist",
            aiSummary: "Mild tension headache likely due to work-related stress. No alarming symptoms.",
            insights: {
              duration: "15 mins",
              confidence: "0.92",
            },
          },
        ],
      },
      {
        id: "PAT002",
        name: "Arjun Patel",
        age: 45,
        gender: "Male",
        phone: "+91 87654 32109",
        bloodGroup: "B+",
        createdAt: "2025-08-20",
        lastVisit: "2025-10-14",
        consultations: [
          {
            id: "CONS002",
            date: "2025-10-14",
            transcription: "Regular checkup. Patient has controlled diabetes. Blood sugar levels stable. No new complications reported.",
            prescription: "Continue with current medication:\nTab. Metformin 500mg twice daily\nRegular exercise and diet control\nNext checkup in 3 months",
            aiSummary: "Diabetes well-managed. No intervention needed.",
            insights: {
              duration: "12 mins",
              confidence: "0.95",
            },
          },
        ],
      },
    ];

    demoPatients.forEach(savePatient);
  }
}
