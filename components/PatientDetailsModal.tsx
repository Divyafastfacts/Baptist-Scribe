import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { PatientDetails, SupportedLanguage } from '../types';
import { PRIMARY_COLOR, SUPPORTED_LANGUAGES, NOTE_TYPES } from '../constants';

interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (details: PatientDetails) => void;
}

const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({ isOpen, onClose, onProceed }) => {
  const [formData, setFormData] = useState<PatientDetails>({
    name: '',
    age: '',
    gender: 'He',
    inputLanguage: SupportedLanguage.ENGLISH,
    outputLanguage: '',
    noteType: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProceed(formData);
  };

  const updateField = (field: keyof PatientDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-bold text-gray-800">Patient Details</h2>
            <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-teal-100">Optional</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Patient Name</label>
            <input 
              type="text" 
              placeholder="Enter Patient Name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-black"
            />
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Age</label>
            <input 
              type="text" 
              placeholder="Enter Age"
              value={formData.age}
              onChange={(e) => updateField('age', e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-black"
            />
          </div>

          {/* Pronoun */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Pronoun</label>
            <div className="flex items-center space-x-4">
              <label 
                className={`flex-1 flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                  formData.gender === 'He' 
                    ? 'bg-teal-50 border-teal-200 text-teal-800 ring-1 ring-teal-200' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.gender === 'He' ? 'border-teal-500' : 'border-gray-300'}`}>
                  {formData.gender === 'He' && <div className="w-2 h-2 bg-teal-500 rounded-full" />}
                </div>
                <span className="font-medium text-black">He</span>
                <input 
                  type="radio" 
                  name="gender" 
                  value="He" 
                  checked={formData.gender === 'He'} 
                  onChange={() => updateField('gender', 'He')}
                  className="hidden" 
                />
              </label>

              <label 
                className={`flex-1 flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                  formData.gender === 'She' 
                    ? 'bg-teal-50 border-teal-200 text-teal-800 ring-1 ring-teal-200' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.gender === 'She' ? 'border-teal-500' : 'border-gray-300'}`}>
                  {formData.gender === 'She' && <div className="w-2 h-2 bg-teal-500 rounded-full" />}
                </div>
                <span className="font-medium text-black">She</span>
                <input 
                  type="radio" 
                  name="gender" 
                  value="She" 
                  checked={formData.gender === 'She'} 
                  onChange={() => updateField('gender', 'She')}
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          {/* Languages */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Input Language</label>
              <select 
                value={formData.inputLanguage}
                onChange={(e) => updateField('inputLanguage', e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all appearance-none text-black"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Output Language</label>
              <select 
                value={formData.outputLanguage}
                onChange={(e) => updateField('outputLanguage', e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all appearance-none text-black"
              >
                <option value="">Select output language (optional)</option>
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Note Type */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Choose Note Type *</label>
            <div className="relative">
              <select 
                required
                value={formData.noteType}
                onChange={(e) => updateField('noteType', e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all appearance-none text-black"
              >
                <option value="" disabled>Select template</option>
                {NOTE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute right-0 top-0 h-full flex items-center pr-3 pointer-events-none">
                 <button type="button" className="text-xs text-teal-600 font-medium bg-teal-50 px-2 py-1 rounded">Create your template</button>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full text-white font-semibold rounded-lg py-3 flex items-center justify-center space-x-2 shadow-sm hover:opacity-90 transition-opacity active:scale-95"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              <span>Proceed</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientDetailsModal;