import React, { useCallback, useState } from 'react';
import { useConversation } from '@elevenlabs/react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface VoiceWidgetProps {
  onFieldUpdate: (fieldId: string, value: string) => void;
}

export const VoiceWidget: React.FC<VoiceWidgetProps> = ({ onFieldUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const conversation = useConversation({
    onConnect: () => toast.success('Assistant Listening'),
    onDisconnect: () => {
        setIsExpanded(false);
        toast.info('Assistant Disconnected');
    },
    onError: (error) => console.error('Voice Error:', error),
    onMessage: (message) => {
        if (message.source === 'ai') {
        }
    },
    clientTools: {
      fillFormField: ({ fieldId, value }: { fieldId: string; value: string }) => {
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
      }
    }
  }, [conversation]);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          className="mb-4 bg-white rounded-2xl shadow-xl p-4 w-72 border border-gray-100"
        >
           <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${conversation.status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
               <span className="font-semibold text-gray-700">Prudential Assistant</span>
             </div>
             <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-gray-600">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             </button>
           </div>
           <div className="h-12 flex items-center justify-center bg-blue-50 rounded-lg">
              {conversation.isSpeaking ? (
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <motion.div
                        key={i}
                        animate={{ height: [10, 24, 10] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                        className="w-1 bg-[#0046B8] rounded-full"
                      />
                    ))}
                  </div>
              ) : (
                  <span className="text-sm text-gray-500">Listening...</span>
              )}
           </div>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleConversation}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all ${
          conversation.status === 'connected'
            ? 'bg-white border-2 border-[#0046B8]'
            : 'bg-[#0046B8]'
        }`}
      >
        {conversation.status === 'connected' ? (
           <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-[#0046B8] to-[#002868]">
             <motion.div
               animate={{
                 scale: [1, 1.2, 1],
                 opacity: [0.5, 0.8, 0.5],
               }}
               transition={{
                 duration: 2,
                 repeat: Infinity,
                 ease: "easeInOut"
               }}
               className="absolute inset-0 bg-white/20 rounded-full"
             />
             <div className="absolute inset-0 flex items-center justify-center">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                 <rect x="9" y="2" width="6" height="12" rx="2" />
                 <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
                 <line x1="12" y1="18" x2="12" y2="22" />
                 <line x1="8" y1="22" x2="16" y2="22" />
               </svg>
             </div>
           </div>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="9" y="2" width="6" height="12" rx="2" />
            <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="8" y1="22" x2="16" y2="22" />
          </svg>
        )}
      </motion.button>
    </div>
  );
};
