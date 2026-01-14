import React from 'react';
import { Search, Filter, MoreHorizontal, FileText, Star, Clock, CheckCircle, AlertCircle, Volume2, Globe, Monitor, Mail, Video, Book } from 'lucide-react';
import { PRIMARY_COLOR, SUPPORTED_LANGUAGES } from '../constants';

// --- MY NOTES VIEW ---
export const MyNotesView = () => {
  const notes = [
    { id: '1', name: 'Rajesh Kumar', mrn: 'BBH-1029', date: 'Oct 24, 2023', type: 'SOAP Note', status: 'Finalized' },
    { id: '2', name: 'Anita Desai', mrn: 'BBH-1030', date: 'Oct 24, 2023', type: 'Cardiology', status: 'Draft' },
    { id: '3', name: 'Mohammed Ali', mrn: 'BBH-1011', date: 'Oct 23, 2023', type: 'General Checkup', status: 'Finalized' },
    { id: '4', name: 'Sarah Thomas', mrn: 'BBH-0992', date: 'Oct 22, 2023', type: 'Pediatrics', status: 'Finalized' },
    { id: '5', name: 'Vikram Singh', mrn: 'BBH-0985', date: 'Oct 21, 2023', type: 'Orthopedics', status: 'Review Needed' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Notes</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and review your patient consultations</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search patients..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-100 outline-none w-64" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Patient Name</th>
              <th className="px-6 py-4">MRN</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Note Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {notes.map((note) => (
              <tr key={note.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{note.name}</td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{note.mrn}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{note.date}</td>
                <td className="px-6 py-4 text-gray-700 text-sm">{note.type}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${note.status === 'Finalized' ? 'bg-green-100 text-green-800' : 
                      note.status === 'Draft' ? 'bg-gray-100 text-gray-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {note.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
            <span>Showing 5 of 124 records</span>
            <div className="flex gap-2">
                <button className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50">Prev</button>
                <button className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- TEMPLATES VIEW ---
export const TemplatesView = ({ type }: { type: 'MY' | 'LIBRARY' }) => {
  const templates = [
    { title: 'Standard SOAP', desc: 'General purpose clinical note structure.', tags: ['General', 'Medicine'] },
    { title: 'Cardiology Follow-up', desc: 'Focused on cardiac symptoms and vitals.', tags: ['Specialty', 'Cardio'] },
    { title: 'Pediatric Intake', desc: 'Includes growth charts and immunization history.', tags: ['Pediatrics'] },
    { title: 'Psychiatry Initial', desc: 'Mental status exam and history focus.', tags: ['Psychiatry'] },
    { title: 'Discharge Summary', desc: 'Hospital course and release instructions.', tags: ['Inpatient'] },
    { title: 'Ortho Knee Exam', desc: 'Specific fields for ROM and stability tests.', tags: ['Ortho'] },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{type === 'MY' ? 'My Templates' : 'Template Library'}</h1>
        <p className="text-gray-500 text-sm mt-1">{type === 'MY' ? 'Your customized clinical templates' : 'Browse standard templates from BBH'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow group relative">
             <div className="absolute top-4 right-4 text-gray-300 cursor-pointer hover:text-yellow-400">
                 <Star size={18} fill={type === 'MY' ? "currentColor" : "none"} className={type === 'MY' ? "text-yellow-400" : ""} />
             </div>
             <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center mb-4">
                 <FileText size={20} />
             </div>
             <h3 className="font-bold text-gray-800 mb-2">{t.title}</h3>
             <p className="text-sm text-gray-500 mb-4 h-10">{t.desc}</p>
             <div className="flex flex-wrap gap-2">
                 {t.tags.map(tag => (
                     <span key={tag} className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                         {tag}
                     </span>
                 ))}
             </div>
          </div>
        ))}
        {type === 'MY' && (
             <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition-colors cursor-pointer min-h-[200px]">
                <div className="mb-2 text-4xl font-light">+</div>
                <span className="font-medium text-sm">Create New Template</span>
             </div>
        )}
      </div>
    </div>
  );
};

// --- PREFERENCES VIEW ---
export const PreferencesView = () => {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Preferences</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
        
        {/* Audio Settings */}
        <div className="p-6">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Volume2 size={18} /> Audio Settings
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Microphone</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50">
                        <option>Default - MacBook Pro Microphone</option>
                        <option>External USB Microphone</option>
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Auto-start recording on consult</span>
                    <input type="checkbox" className="toggle" />
                </div>
            </div>
        </div>

        {/* Language Settings */}
        <div className="p-6">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Globe size={18} /> Language & Region
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Input Language</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50">
                        {SUPPORTED_LANGUAGES.map(l => <option key={l}>{l}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medical Terminology Dictionary</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50">
                        <option>Indian English (Standard)</option>
                        <option>US English</option>
                        <option>UK English</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Display Settings */}
        <div className="p-6">
             <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Monitor size={18} /> Display
            </h3>
             <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Dark Mode</span>
                    <div className="bg-gray-200 rounded-full px-1 w-10 h-6 flex items-center">
                        <div className="bg-white w-4 h-4 rounded-full shadow-sm transform translate-x-0"></div>
                    </div>
            </div>
        </div>

      </div>
      
      <div className="mt-6 flex justify-end">
          <button className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium">
              Save Changes
          </button>
      </div>
    </div>
  );
};

// --- SUPPORT & TRAINING ---
export const SupportView = () => {
    return (
        <div className="p-8 max-w-4xl mx-auto">
             <h1 className="text-2xl font-bold text-gray-800 mb-8">Help & Support</h1>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                        <Book size={20} />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">Training Resources</h3>
                    <p className="text-sm text-gray-600 mb-4">Watch video tutorials on how to effectively use the scribe for multilingual consults.</p>
                    <button className="text-blue-700 font-medium text-sm hover:underline">View Tutorials &rarr;</button>
                 </div>

                 <div className="bg-teal-50 p-6 rounded-xl border border-teal-100">
                    <div className="bg-teal-100 w-10 h-10 rounded-lg flex items-center justify-center text-teal-600 mb-4">
                        <Mail size={20} />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">Contact IT Support</h3>
                    <p className="text-sm text-gray-600 mb-4">Having technical issues? Raise a ticket directly with the hospital IT department.</p>
                    <button className="text-teal-700 font-medium text-sm hover:underline">Raise Ticket &rarr;</button>
                 </div>
             </div>

             <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
                 <h3 className="font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
                 <div className="space-y-4">
                     <details className="group border-b border-gray-100 pb-4">
                         <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-700 group-hover:text-gray-900">
                             How do I handle code-switching during recording?
                             <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                             </span>
                         </summary>
                         <p className="group-open:animate-fadeIn mt-3 text-sm text-gray-500">
                             Just speak naturally. The AI detects languages automatically (Hindi, Kannada, etc.) and translates them into clinical English in the final note.
                         </p>
                     </details>
                     <details className="group border-b border-gray-100 pb-4">
                         <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-700 group-hover:text-gray-900">
                             Is patient data stored on the cloud?
                             <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                             </span>
                         </summary>
                         <p className="group-open:animate-fadeIn mt-3 text-sm text-gray-500">
                             No. This is a local-first processing demo. In production, it complies with HIPPA and local data residency laws.
                         </p>
                     </details>
                 </div>
             </div>
        </div>
    )
}
