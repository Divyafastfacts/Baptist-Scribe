import React from 'react';
import { Mic, PlayCircle, ArrowRight } from 'lucide-react';
import { PRIMARY_COLOR } from '../constants';

interface DashboardHomeProps {
  onStartRecording: () => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ onStartRecording }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Greeting Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">
            Hello <span style={{ color: PRIMARY_COLOR }}>Doctor!</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium">How can I help you today?</p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Recording Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform">
              <Mic size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Record a consultation</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Effortlessly create comprehensive and accurate patient notes from your voice recordings. 
              Automatically generates SOAP notes for your EMR.
            </p>
            <button 
              onClick={onStartRecording}
              className="px-6 py-2.5 rounded-lg text-white font-medium flex items-center space-x-2 hover:opacity-90 transition-opacity active:scale-95"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              <span>Start Recording</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Onboarding/Help Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
              <PlayCircle size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">New to BBH Scribe?</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Watch how our AI streamlines your workflow from recording patient interactions 
              to producing clear, structured clinical notes.
            </p>
            <button className="px-6 py-2.5 rounded-lg bg-gray-50 text-gray-700 font-medium flex items-center space-x-2 hover:bg-gray-100 transition-colors border border-gray-200">
              <span>Learn more here</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

        {/* Recent Activity Placeholder */}
        <div className="pt-8">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-semibold text-gray-700">Recent Notes</h3>
             <button className="text-sm font-medium text-teal-600 hover:text-teal-700">View All</button>
           </div>
           <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-400">No recent consultations found.</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;
