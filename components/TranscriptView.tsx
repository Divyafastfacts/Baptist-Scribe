import React, { useEffect, useRef } from 'react';
import { FileText, MicOff, PlayCircle } from 'lucide-react';

interface TranscriptViewProps {
  transcript: string;
  isRecording: boolean;
  onLoadDemo?: () => void;
}

const TranscriptView: React.FC<TranscriptViewProps> = ({ transcript, isRecording, onLoadDemo }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-700">
          <FileText size={18} />
          <h2 className="font-semibold text-sm uppercase tracking-wide">Live Transcript</h2>
        </div>
        <span className="text-xs text-gray-400">
          {isRecording ? 'Listening...' : 'Ready'}
        </span>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {transcript ? (
          <div className="space-y-2">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{transcript}</p>
            <div ref={bottomRef} />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
            <div className="p-4 bg-gray-50 rounded-full">
              <MicOff size={32} className="opacity-50" />
            </div>
            <div className="text-center">
                <p className="text-sm mb-1">No transcript available.</p>
                <p className="text-xs text-gray-400">Start recording to begin.</p>
            </div>
            {onLoadDemo && (
                <button 
                    onClick={onLoadDemo}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors"
                >
                    <PlayCircle size={14} />
                    <span>Start Simulation (Alex)</span>
                </button>
            )}
          </div>
        )}
      </div>
      
      {isRecording && (
        <div className="bg-red-50 px-4 py-2 border-t border-red-100 text-xs text-red-700 flex items-center justify-center">
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 animate-bounce"></span>
          Capturing audio...
        </div>
      )}
    </div>
  );
};

export default TranscriptView;