import { GoogleGenAI, Type, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { SoapNote } from "../types";

// Initialize the Gemini client
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });

// --- SOAP Generation ---

export const generateSoapNote = async (
  transcript: string,
  language: string
): Promise<SoapNote> => {
  const ai = getAiClient();
  
  const prompt = `
    Source Language: ${language}
    Raw Transcript: "${transcript}"
    
    Generate the JSON output. 
    IMPORTANT: Only extract Subjective and Objective. 
    Leave Assessment and Plan empty as the doctor will fill them manually.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hospital: { type: Type.STRING },
          patient_summary: { type: Type.STRING },
          soap_details: {
            type: Type.OBJECT,
            properties: {
              subjective: { type: Type.STRING, description: "Patient's history, symptoms, and complaints." },
              objective: { type: Type.STRING, description: "Vitals, exam findings, and physical data." },
              // Assessment and Plan are intentionally omitted or made optional/empty here for manual entry
            },
            required: ["subjective", "objective"],
          },
        },
        required: ["hospital", "patient_summary", "soap_details"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  try {
    const data = JSON.parse(text);
    // Return extracted data, defaulting Assessment and Plan to empty strings
    return {
        subjective: data.soap_details.subjective || '',
        objective: data.soap_details.objective || '',
        assessment: '',
        plan: ''
    };
  } catch (e) {
    console.error("Failed to parse JSON", text);
    throw new Error("Failed to parse AI response");
  }
};

// --- Live Audio Utilities ---

export const createPcmBlob = (data: Float32Array): { data: string; mimeType: string } => {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // Clamp values to [-1, 1] to prevent wrapping distortion
    const s = Math.max(-1, Math.min(1, data[i]));
    // Convert to 16-bit PCM
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  // Manual base64 encoding for the blob data
  let binary = '';
  const bytes = new Uint8Array(int16.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64Data = btoa(binary);

  return {
    data: base64Data,
    mimeType: 'audio/pcm;rate=16000',
  };
};

export const connectLiveSession = async (
  onOpen: () => void,
  onMessage: (text: string) => void,
  onClose: () => void,
  onError: (e: Error) => void,
  language: string = "English"
) => {
  const ai = getAiClient();
  
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks: {
      onopen: () => {
        onOpen();
      },
      onmessage: (message) => {
        // We are primarily interested in the transcription of the input audio
        if (message.serverContent?.inputTranscription) {
          const text = message.serverContent.inputTranscription.text;
          if (text) {
            onMessage(text);
          }
        }
      },
      onclose: () => {
        onClose();
      },
      onerror: (e: any) => {
        console.error("Gemini Live Error:", e);
        const message = e.message || e.toString() || "Unknown session error";
        onError(new Error(message));
      }
    },
    config: {
        responseModalities: [Modality.AUDIO], 
        inputAudioTranscription: {}, 
        speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
        },
        // Explicitly tell the model to listen and not converse
        systemInstruction: `You are a passive medical transcriptionist. Your ONLY task is to listen and transcribe the audio input verbatim. Do not speak. Do not generate audio responses. The input language may be ${language} or English.`,
    }
  });
};