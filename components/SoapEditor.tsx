import React from 'react';
import { Save, FileJson, Printer, Share2, Calendar, User, Hash } from 'lucide-react';
import { SoapNote, PatientDetails } from '../types';
import { PRIMARY_COLOR, HOSPITAL_NAME } from '../constants';

interface SoapEditorProps {
  soapData: SoapNote;
  patientDetails: PatientDetails | null;
  onUpdate: (field: keyof SoapNote, value: string) => void;
  onSync: () => void;
  isGenerating: boolean;
}

const SoapEditor: React.FC<SoapEditorProps> = ({ soapData, patientDetails, onUpdate, onSync, isGenerating }) => {
  
  const sections: { key: keyof SoapNote; label: string; placeholder: string; color: string }[] = [
    { key: 'subjective', label: 'Subjective', placeholder: 'Enter patient history and complaints...', color: 'border-l-4 border-blue-600 pl-3' },
    { key: 'objective', label: 'Objective', placeholder: 'Enter physical exam findings and vitals...', color: 'border-l-4 border-green-600 pl-3' },
    { key: 'assessment', label: 'Assessment', placeholder: 'Enter clinical impression or diagnosis...', color: 'border-l-4 border-orange-600 pl-3' },
    { key: 'plan', label: 'Plan', placeholder: 'Enter medication, tests, and follow-up...', color: 'border-l-4 border-purple-600 pl-3' },
  ];

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="flex flex-col bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
      
      {/* Toolbar */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0 z-10 shadow-sm">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-700 flex items-center gap-2">
           <span>Clinical Note</span>
           {patientDetails && <span className="text-gray-400 font-normal">| {patientDetails.name}</span>}
        </h2>
        <div className="flex items-center space-x-2">
            <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors" title="Print">
                <Printer size={16} />
            </button>
            <button 
                onClick={onSync}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: PRIMARY_COLOR }}
            >
            <FileJson size={14} />
            <span>Finalize & Sync</span>
            </button>
        </div>
      </div>

      {/* Document Area - Grows with content */}
      <div className="p-4 md:p-8 relative">
        
        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center backdrop-blur-[2px] rounded-lg">
            <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center space-y-4 border border-gray-100">
              <div className="w-10 h-10 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-800">Analyzing Transcript...</p>
                <p className="text-xs text-gray-500">Extracting clinical context</p>
              </div>
            </div>
          </div>
        )}

        {/* Paper Document */}
        <div className="max-w-3xl mx-auto bg-white shadow-lg min-h-[800px] flex flex-col relative">
            
            {/* Document Header */}
            <div className="p-8 border-b border-gray-100">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-tight">{HOSPITAL_NAME}</h1>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">General Medicine Department</p>
                    </div>
                    <div className="text-right">
                        <div className="bg-gray-50 px-3 py-1 rounded text-xs font-medium text-gray-600 inline-block border border-gray-100">
                            {patientDetails?.noteType || 'Standard SOAP Note'}
                        </div>
                    </div>
                </div>

                {/* Patient Demographics Grid */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
            <div className="p-8 space-y-8 flex-1">
                {sections.map((section) => (
                <div key={section.key} className="relative group">
                    <div className={`mb-3 ${section.color}`}>
                        <label className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                            {section.label}
                        </label>
                    </div>
                    <textarea
                        value={soapData[section.key]}
                        onChange={(e) => onUpdate(section.key, e.target.value)}
                        placeholder={section.placeholder}
                        className="w-full min-h-[120px] bg-transparent text-gray-800 text-base leading-relaxed border-none focus:ring-0 p-0 outline-none resize-none placeholder-gray-300 group-hover:bg-gray-50/50 transition-colors rounded px-2 -mx-2 overflow-hidden"
                        spellCheck={false}
                        onInput={(e) => {
                          // Auto-grow
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = target.scrollHeight + 'px';
                        }}
                    />
                </div>
                ))}
            </div>

            {/* Document Footer */}
            <div className="p-8 mt-auto border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-400">
                    <p>Generated by BBH Clinical Intelligence Engine</p>
                    <p>Page 1 of 1</p>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-[10px] rounded border border-yellow-100 text-center">
                    <strong>Disclaimer:</strong> This is an AI-assisted record. The attending physician must review and verify all information before final signature.
                </div>
            </div>

        </div>
        <div className="h-8"></div> {/* Bottom spacer */}
      </div>
    </div>
  );
};

export default SoapEditor;