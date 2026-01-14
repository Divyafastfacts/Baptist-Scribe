import React from 'react';
import { Calendar, User, Hash, CheckCircle, PenTool } from 'lucide-react';
import { SoapNote, PatientDetails } from '../types';
import { HOSPITAL_NAME } from '../constants';

interface SoapEditorProps {
  soapData: SoapNote;
  patientDetails: PatientDetails | null;
  onUpdate: (field: keyof SoapNote, value: string) => void;
  isGenerating: boolean;
  isVerified: boolean;
  onVerify: () => void;
}

const SoapEditor: React.FC<SoapEditorProps> = ({ 
  soapData, 
  patientDetails, 
  onUpdate, 
  isGenerating, 
  isVerified, 
  onVerify 
}) => {
  
  const sections: { key: keyof SoapNote; label: string; placeholder: string; color: string; readOnly: boolean }[] = [
    { 
      key: 'subjective', 
      label: 'Subjective (AI Generated)', 
      placeholder: 'Waiting for AI generation...', 
      color: 'border-l-4 border-blue-600 pl-3',
      readOnly: true
    },
    { 
      key: 'objective', 
      label: 'Objective (AI Generated)', 
      placeholder: 'Waiting for AI generation...', 
      color: 'border-l-4 border-green-600 pl-3',
      readOnly: true
    },
    { 
      key: 'assessment', 
      label: 'Assessment', 
      placeholder: 'Enter clinical impression or diagnosis manually...', 
      color: 'border-l-4 border-orange-600 pl-3',
      readOnly: false
    },
    { 
      key: 'plan', 
      label: 'Plan', 
      placeholder: 'Enter medication, tests, and follow-up manually...', 
      color: 'border-l-4 border-purple-600 pl-3',
      readOnly: false
    },
  ];

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="flex flex-col bg-gray-100 rounded-lg overflow-hidden border border-gray-200 print:border-none print:bg-white">
      
      {/* Title Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0 z-10 shadow-sm print:hidden">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-700 flex items-center gap-2">
           <span>Clinical Note</span>
           {patientDetails && <span className="text-gray-400 font-normal">| {patientDetails.name}</span>}
        </h2>
        {isVerified && (
          <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded border border-green-200">
            <CheckCircle size={14} />
            <span>VERIFIED</span>
          </div>
        )}
      </div>

      {/* Document Area */}
      <div className="p-4 md:p-8 relative print:p-0">
        
        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center backdrop-blur-[2px] rounded-lg print:hidden">
            <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center space-y-4 border border-gray-100">
              <div className="w-10 h-10 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-800">Analyzing Transcript...</p>
                <p className="text-xs text-gray-500">Extracting Subjective & Objective</p>
              </div>
            </div>
          </div>
        )}

        {/* Paper Document */}
        <div className="max-w-3xl mx-auto bg-white shadow-lg min-h-[800px] flex flex-col relative print:shadow-none print:w-full print:max-w-none">
            
            {/* Document Header */}
            <div className="p-8 border-b border-gray-100 print:p-6 print:border-gray-300">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-tight">{HOSPITAL_NAME}</h1>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">General Medicine Department</p>
                    </div>
                    <div className="text-right">
                        <div className="bg-gray-50 px-3 py-1 rounded text-xs font-medium text-gray-600 inline-block border border-gray-100 print:border-gray-300">
                            {patientDetails?.noteType || 'Standard SOAP Note'}
                        </div>
                    </div>
                </div>

                {/* Patient Demographics */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm print:bg-white print:border-gray-300">
                    <div>
                        <span className="block text-xs text-gray-500 mb-1">Patient Name</span>
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                            <User size={14} className="text-gray-400" />
                            {patientDetails?.name || 'Unknown'}
                        </div>
                    </div>
                    <div>
                        <span className="block text-xs text-gray-500 mb-1">Age / Gender</span>
                        <div className="font-semibold text-gray-900">
                            {patientDetails?.age || '--'} / {patientDetails?.gender || '--'}
                        </div>
                    </div>
                    <div>
                        <span className="block text-xs text-gray-500 mb-1">Date</span>
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                            <Calendar size={14} className="text-gray-400" />
                            {currentDate}
                        </div>
                    </div>
                     <div>
                        <span className="block text-xs text-gray-500 mb-1">MRN ID</span>
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                            <Hash size={14} className="text-gray-400" />
                            BBH-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Body */}
            <div className="p-8 space-y-8 flex-1 print:p-6">
                {sections.map((section) => (
                <div key={section.key} className="relative group">
                    <div className={`mb-3 ${section.color} print:border-l-0 print:pl-0 flex items-center justify-between`}>
                        <label className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                            {section.label}
                        </label>
                        {section.readOnly && (
                           <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200 print:hidden">Read Only</span>
                        )}
                    </div>
                    <textarea
                        value={soapData[section.key]}
                        onChange={(e) => onUpdate(section.key, e.target.value)}
                        placeholder={section.placeholder}
                        readOnly={section.readOnly}
                        className={`w-full min-h-[120px] text-gray-800 text-base leading-relaxed border-none focus:ring-0 p-3 outline-none resize-none rounded transition-colors overflow-hidden print:bg-transparent
                           ${section.readOnly 
                             ? 'bg-gray-50 text-gray-600 placeholder-gray-400 cursor-not-allowed' 
                             : 'bg-transparent hover:bg-yellow-50/50 focus:bg-yellow-50 placeholder-gray-300'}
                        `}
                        spellCheck={!section.readOnly}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = target.scrollHeight + 'px';
                        }}
                    />
                </div>
                ))}
            </div>

            {/* Verification / Signature Section */}
            <div className="p-8 mt-auto border-t border-gray-100 print:p-6 print:border-gray-300">
                {!isVerified ? (
                    <div className="flex flex-col items-center justify-center space-y-3 py-4 print:hidden">
                        <p className="text-sm text-gray-500 italic">Please complete Assessment & Plan manually before verifying.</p>
                        <button 
                            onClick={onVerify}
                            disabled={!soapData.assessment || !soapData.plan}
                            className="flex items-center space-x-2 px-8 py-3 bg-gray-900 text-white rounded-lg shadow-md hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <PenTool size={16} />
                            <span>Verify & Sign Note</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-end">
                        <div className="text-center">
                            <div className="h-16 flex items-end justify-center mb-2">
                                {/* Simulated Digital Signature */}
                                <span className="font-['cursive'] text-2xl text-blue-900 transform -rotate-3 border-b-2 border-blue-900/20 px-4 pb-1">
                                    Dr. Shaun Murphy
                                </span>
                            </div>
                            <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">Attending Physician</p>
                            <p className="text-[10px] text-gray-500">Digitally signed on {currentDate}</p>
                        </div>
                    </div>
                )}

                <div className="mt-8 flex items-center justify-between text-xs text-gray-400">
                    <p>Generated by BBH Clinical Intelligence Engine</p>
                    <p>Page 1 of 1</p>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-[10px] rounded border border-yellow-100 text-center print:border-gray-300">
                    <strong>Disclaimer:</strong> This is an AI-assisted record. The attending physician has reviewed and verified all information.
                </div>
            </div>

        </div>
        <div className="h-8 print:hidden"></div>
      </div>
    </div>
  );
};

export default SoapEditor;