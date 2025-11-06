import React, { useCallback, useState } from 'react';
import { useConversation } from '@elevenlabs/react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceWidgetProps {
  onFieldUpdate: (fieldId: string, value: string) => void;
}

export const VoiceWidget: React.FC<VoiceWidgetProps> = ({ onFieldUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const conversation = useConversation({
    onConnect: () => toast.success('Assistant Listening'),
    onDisconnect: () => {
        setIsExpanded(false);
    },
    onError: (error) => console.error('Voice Error:', error),
    clientTools: {
      fillFormField: (data: any) => {
        console.log('[VoiceWidget] RAW TOOL DATA:', JSON.stringify(data, null, 2));

        const fieldId = data.fieldId || data.field_id || data.fieldName || data.name || data.id;
        const value = data.value || data.text || data.answer || data.response;

        if (!fieldId || !value) {
            console.error('[VoiceWidget] Failed to extract parameters from:', data);
            return "Error: Could not understand field parameters";
        }

        onFieldUpdate(fieldId, value);
        return "OK";
      }
    }
  });

  const toggleConversation = useCallback(async () => {
    if (conversation.status === 'connected') {
      await conversation.endSession();
      setIsExpanded(false);
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await conversation.startSession({
          agentId: 'agent_4301k95kgvjcf7pae9s837pe3bca'
        });
        setIsExpanded(true);
      } catch (err) {
        toast.error('Microphone access required');
        console.error(err);
      }
    }
  }, [conversation]);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 bg-white rounded-2xl shadow-2xl p-4 w-72 border border-gray-100 origin-bottom"
          >
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2">
                 <div className={`w-2.5 h-2.5 rounded-full ${conversation.status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                 <span className="font-semibold text-gray-800">Prudential Assistant</span>
               </div>
               <button onClick={() => conversation.endSession()} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
               </button>
             </div>

             <div className="h-16 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white rounded-xl border border-blue-100">
                {conversation.isSpeaking ? (
                    <div className="flex items-center gap-1.5">
                      {[1,2,3,4].map(i => (
                        <motion.div
                          key={i}
                          animate={{ height: [8, 32, 8] }}
                          transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1, ease: "easeInOut" }}
                          className="w-1.5 bg-[#0046B8] rounded-full"
                        />
                      ))}
                    </div>
                ) : (
                    <div className="text-sm text-[#0046B8] font-medium flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0046B8]"></span>
                      </span>
                      Listening...
                    </div>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleConversation}
          className="relative z-50 w-16 h-16 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center transition-all overflow-hidden"
          style={{
            background: conversation.status === 'connected'
              ? 'linear-gradient(135deg, #0046B8 0%, #001538 100%)'
              : '#0046B8'
          }}
        >
          {conversation.status === 'connected' ? (
             <>
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                 className="absolute inset-[-50%] opacity-30 mix-blend-overlay"
                 style={{
                   background: 'conic-gradient(from 90deg at 50% 50%, transparent 0%, #00FFFF 50%, transparent 100%)'
                 }}
               />
               <motion.div
                 animate={{ scale: conversation.isSpeaking ? [1, 1.2, 1] : 1 }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute w-8 h-8 rounded-full bg-white/20 blur-md"
               />
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="relative z-10">
                 <rect x="9" y="2" width="6" height="12" rx="2" />
                 <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
                 <line x1="12" y1="18" x2="12" y2="22" />
                 <line x1="8" y1="22" x2="16" y2="22" />
               </svg>
             </>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="9" y="2" width="6" height="12" rx="2" />
              <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="8" y1="22" x2="16" y2="22" />
            </svg>
          )}
        </motion.button>

        <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
          Voice Assistant
        </span>
      </div>
    </div>
  );
};
