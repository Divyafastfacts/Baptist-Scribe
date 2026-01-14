
export interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface EmrExportData {
  hospital_name: string;
  metadata: {
    language_detected: string;
    timestamp: string;
  };
  soap_note: SoapNote;
  status: string;
}

export enum RecordingStatus {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
}

export enum SupportedLanguage {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  TAMIL = 'Tamil',
  TELUGU = 'Telugu',
  KANNADA = 'Kannada',
  MALAYALAM = 'Malayalam',
}

export type AppView = 
  | 'DASHBOARD' 
  | 'SCRIBE' 
  | 'MY_NOTES' 
  | 'MY_TEMPLATES' 
  | 'TEMPLATE_LIBRARY' 
  | 'PREFERENCES' 
  | 'SUPPORT' 
  | 'TRAINING';

export interface PatientDetails {
  name: string;
  age: string;
  gender: 'He' | 'She' | 'Other';
  inputLanguage: string;
  outputLanguage: string;
  noteType: string;
}
