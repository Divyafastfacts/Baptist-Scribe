import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import TranscriptView from './components/TranscriptView';
import SoapEditor from './components/SoapEditor';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import PatientDetailsModal from './components/PatientDetailsModal';
import { MyNotesView, TemplatesView, PreferencesView, SupportView } from './components/MockViews';
import { connectLiveSession, createPcmBlob, generateSoapNote } from './services/geminiService';
import { EmrExportData, RecordingStatus, SoapNote, SupportedLanguage, AppView, PatientDetails } from './types';
import { HOSPITAL_NAME, SUPPORTED_LANGUAGES, PRIMARY_COLOR } from './constants';
import { Mic, Sparkles, Globe, Download, FileJson } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('DASHBOARD');
  const [status, setStatus] = useState<RecordingStatus>(RecordingStatus.IDLE);
  const [transcript, setTranscript] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(SupportedLanguage.ENGLISH);
  const [timer, setTimer] = useState<number>(0);
  
  // Verification State
  const [isVerified, setIsVerified] = useState<boolean>(false);

  // Modal State
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(null);
  
  const [soapData, setSoapData] = useState<SoapNote>({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });

  // Refs for Audio Handling
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null); 
  const demoIntervalRef = useRef<any>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (status === RecordingStatus.RECORDING) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOpenConsult = () => {
    setIsPatientModalOpen(true);
  };

  const handleProceedWithConsult = (details: PatientDetails) => {
    setPatientDetails(details);
    setSelectedLanguage(details.inputLanguage); // Sync language choice
    setIsPatientModalOpen(false);
    setCurrentView('SCRIBE');
    // Reset verify state for new consult
    setIsVerified(false);
    setSoapData({ subjective: '', objective: '', assessment: '', plan: '' });
  };

  const startRecording = async () => {
    try {
      // Ensure we are in the Scribe view
      if (currentView !== 'SCRIBE') {
        setCurrentView('SCRIBE');
      }

      setTranscript(''); 
      setIsVerified(false); // Reset verification on new recording
      setStatus(RecordingStatus.RECORDING);

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });

      const sessionPromise = connectLiveSession(
        () => console.log("Connected to Gemini Live"),
        (text) => {
          setTranscript((prev) => {
            // Add a space if the previous text didn't end with whitespace 
            // and the new text doesn't start with punctuation/whitespace
            const needsSpace = prev.length > 0 && !/\s$/.test(prev) && !/^[.,!?;:]/.test(text);
            return prev + (needsSpace ? ' ' : '') + text;
          });
        },
        () => {
            console.log("Session Closed");
            if (status === RecordingStatus.RECORDING) stopRecording();
        },
        (err) => {
            console.error("Session Error", err);
            // Ignore close errors if we are manually stopping
            if (status === RecordingStatus.RECORDING) {
                alert("Connection error: " + err.message);
                stopRecording();
            }
        },
        selectedLanguage // Pass selected language
      );
      
      // Catch initial connection errors
      sessionPromise.catch((e) => {
        console.error("Failed to connect to Live API:", e);
        alert("Failed to connect to Gemini Live service. Please check your network or try again.");
        stopRecording();
      });

      sessionRef.current = sessionPromise;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmBlob = createPcmBlob(inputData);
        sessionPromise.then((session) => {
            session.sendRealtimeInput({ media: pcmBlob });
        }).catch(err => {
            // This catches errors if the session failed to initialize or was closed
            // We've likely already handled the main error via the promise catch or onerror callback
        });
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Could not access microphone or connect to AI service.");
      setStatus(RecordingStatus.IDLE);
    }
  };

  const stopRecording = () => {
    // Clear demo interval if active
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    // Close the session explicitly
    if (sessionRef.current) {
      sessionRef.current.then((session: any) => {
        try {
          // Check if session has a close method (it should for LiveSession)
          if (typeof session.close === 'function') {
             session.close();
          }
        } catch (e) {
          console.error("Error closing session:", e);
        }
      }).catch((e: any) => {
         // Ignore errors from the promise if it was already rejected
      });
      sessionRef.current = null;
    }

    setStatus(RecordingStatus.IDLE);
  };

  const handleGenerateSoap = async () => {
    if (!transcript) {
      alert("No transcript available to generate note.");
      return;
    }
    setStatus(RecordingStatus.PROCESSING);
    setIsVerified(false); // Reset verification if regenerating
    try {
      if (status === RecordingStatus.RECORDING) {
        stopRecording();
      }
      const note = await generateSoapNote(transcript, selectedLanguage);
      setSoapData(note);
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate SOAP note. Please try again.");
    } finally {
      setStatus(RecordingStatus.IDLE);
    }
  };

  const handleUpdateSoap = (field: keyof SoapNote, value: string) => {
    setSoapData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVerify = () => {
    if (!soapData.assessment || !soapData.plan) {
        alert("Please complete the Assessment and Plan sections before verifying.");
        return;
    }
    setIsVerified(true);
  };

  const handleSyncToEmr = () => {
    const exportData: EmrExportData = {
      hospital_name: HOSPITAL_NAME,
      metadata: {
        language_detected: selectedLanguage,
        timestamp: new Date().toISOString(),
      },
      soap_note: soapData,
      status: "finalized"
    };

    console.log("Syncing to EMR:", JSON.stringify(exportData, null, 2));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BBH_EMR_Transfer_${patientDetails?.name || 'Unknown'}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert("Synced to EMR successfully! A JSON transfer file has been downloaded.");
  };

  const handleDownloadWord = () => {
    const currentDate = new Date().toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>SOAP Note</title>
    <style>body{font-family: 'Arial', sans-serif;} h1{color: #B71C1C;} .section{margin-bottom: 20px;} .label{font-weight:bold; color:#444;} .signature-block{margin-top:50px; text-align:right;} .signature{font-family:'Brush Script MT', cursive; font-size:24px; color:#1e3a8a; border-bottom:1px solid #ddd; display:inline-block; padding-bottom:5px; margin-bottom:5px;}</style>
    </head><body>`;
    
    const body = `
      <h1>${HOSPITAL_NAME}</h1>
      <p><strong>Patient:</strong> ${patientDetails?.name || 'Unknown'} | <strong>Date:</strong> ${currentDate}</p>
      <hr/>
      <div class='section'><p class='label'>Subjective</p><p>${soapData.subjective.replace(/\n/g, '<br/>')}</p></div>
      <div class='section'><p class='label'>Objective</p><p>${soapData.objective.replace(/\n/g, '<br/>')}</p></div>
      <div class='section'><p class='label'>Assessment</p><p>${soapData.assessment.replace(/\n/g, '<br/>')}</p></div>
      <div class='section'><p class='label'>Plan</p><p>${soapData.plan.replace(/\n/g, '<br/>')}</p></div>
      
      <div class='signature-block'>
         <div class='signature'>Dr. Shaun Murphy</div>
         <p><strong>Attending Physician</strong><br/><small>Digitally signed on ${currentDate}</small></p>
      </div>
    `;
    
    const footer = `</body></html>`;
    const sourceHTML = header + body + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SOAP_Note_${patientDetails?.name || 'Patient'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadDemo = () => {
    stopRecording();
    setPatientDetails({
        name: "Alex",
        age: "24 Yrs",
        gender: "He",
        inputLanguage: "English",
        outputLanguage: "English",
        noteType: "SOAP Note - Standard"
    });

    const scriptLines = [
        "Doctor: Good morning Alex. I see you're limping slightly. What happened?",
        "Patient: Hi Doctor. Yeah, I have this really bad pain in my right knee.",
        "Doctor: I'm sorry to hear that. When did the pain start?",
        "Patient: It started about six days ago. I was cycling in the city and I fell off my bike.",
        "Doctor: Did you hit your knee directly?",
        "Patient: Yes, I landed right on it on the pavement.",
        "Doctor: Is the pain constant or does it come and go?",
        "Patient: It's persistent. It hurts a lot when I try to walk or bend it.",
        "Doctor: Any swelling? Or did you notice any bruising?",
        "Patient: No swelling that I can see. I can move it, but it's stiff.",
        "Doctor: Okay. Do you have any other medical conditions or take any medications?",
        "Patient: No, nothing like that. I'm generally healthy.",
        "Doctor: (Examining) I see no edema. Range of motion is preserved but painful at the extremes.",
        "Doctor: It looks like a simple knee contusion. Nothing broken.",
        "Doctor: I'm going to prescribe a topical analgesic gel. Apply it twice a day.",
        "Patient: Okay, sounds good.",
        "Doctor: If the pain doesn't improve in a week, come back and we'll do an X-ray just to be sure."
    ];

    setStatus(RecordingStatus.RECORDING);
    setTranscript(scriptLines[0]);
    setIsVerified(false);
    
    let lineIndex = 1;
    demoIntervalRef.current = setInterval(() => {
        if (lineIndex < scriptLines.length) {
            setTranscript(prev => prev + "\n\n" + scriptLines[lineIndex]);
            lineIndex++;
        } else {
            if (demoIntervalRef.current) {
                clearInterval(demoIntervalRef.current);
                demoIntervalRef.current = null;
            }
            setStatus(RecordingStatus.IDLE);
        }
    }, 1500); 
  };

  // --- Render Scribe View ---
  const renderScribeView = () => (
    <div className="flex flex-col flex-1 bg-gray-100 min-h-0">
      {/* Action Toolbar */}
      <div className="bg-white px-6 py-4 flex flex-wrap gap-4 items-center justify-between shadow-sm z-20 border-b border-gray-200 sticky top-16 print:hidden">
        <div className="flex items-center gap-4">
           {/* Language Selector */}
           <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Recording Button */}
          {status === RecordingStatus.RECORDING ? (
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium shadow-md animate-pulse ring-4 ring-red-100"
            >
              <div className="w-3 h-3 bg-white rounded-sm" />
              <span>Stop Recording ({formatTime(timer)})</span>
            </button>
          ) : (
            <button
              onClick={startRecording}
              disabled={status === RecordingStatus.PROCESSING}
              className="flex items-center gap-2 px-6 py-2 text-white rounded-lg transition-all font-medium shadow-sm hover:shadow-md active:transform active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              <Mic size={18} />
              <span>Start Recording</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
            {patientDetails && (
                <div className="hidden md:flex flex-col items-end mr-4">
                    <span className="text-xs font-bold text-gray-700">{patientDetails.name}</span>
                    <span className="text-[10px] text-gray-500">{patientDetails.gender}, {patientDetails.age}</span>
                </div>
            )}
            
            <button
            onClick={handleGenerateSoap}
            disabled={!transcript || status === RecordingStatus.PROCESSING}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all font-medium disabled:opacity-50"
            >
                <Sparkles size={18} />
                <span className="hidden xl:inline">{status === RecordingStatus.PROCESSING ? 'Generating...' : 'Generate SOAP'}</span>
            </button>

            {isVerified && (
                <>
                <div className="h-8 w-px bg-gray-200 mx-1"></div>

                {/* Download Button (Direct) */}
                <button 
                    onClick={handleDownloadWord}
                    disabled={!soapData.subjective}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 animate-in fade-in zoom-in-95 duration-200"
                >
                    <Download size={18} />
                    <span className="hidden xl:inline">Download</span>
                </button>

                {/* Sync Button */}
                <button 
                    onClick={handleSyncToEmr}
                    disabled={!soapData.subjective}
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity font-medium disabled:opacity-50 animate-in fade-in zoom-in-95 duration-200"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                >
                    <FileJson size={18} />
                    <span className="hidden xl:inline">Finalize</span>
                </button>
                </>
            )}
        </div>
      </div>

      {/* Split Content with Sticky Transcript */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start print:block print:p-0">
        <div className="lg:sticky lg:top-36 lg:h-[calc(100vh-10rem)] print:hidden">
           <TranscriptView 
             transcript={transcript} 
             isRecording={status === RecordingStatus.RECORDING} 
             onLoadDemo={handleLoadDemo}
           />
        </div>
        <div className="min-w-0 print:w-full">
           <SoapEditor
             soapData={soapData}
             patientDetails={patientDetails}
             onUpdate={handleUpdateSoap}
             isGenerating={status === RecordingStatus.PROCESSING}
             isVerified={isVerified}
             onVerify={handleVerify}
           />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'SCRIBE':
        return renderScribeView();
      case 'MY_NOTES':
        return <MyNotesView />;
      case 'MY_TEMPLATES':
        return <TemplatesView type="MY" />;
      case 'TEMPLATE_LIBRARY':
        return <TemplatesView type="LIBRARY" />;
      case 'PREFERENCES':
        return <PreferencesView />;
      case 'SUPPORT':
      case 'TRAINING':
        return <SupportView />;
      case 'DASHBOARD':
      default:
        return <DashboardHome onStartRecording={handleOpenConsult} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView}
        onStartConsult={handleOpenConsult}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <Header 
          isRecording={status === RecordingStatus.RECORDING}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          languages={SUPPORTED_LANGUAGES}
        />

        {/* Content based on View */}
        <div className="flex-1 overflow-x-hidden">
            {renderContent()}
        </div>

      </div>
      
      {/* Modal */}
      <PatientDetailsModal 
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onProceed={handleProceedWithConsult}
      />
    </div>
  );
};

export default App;