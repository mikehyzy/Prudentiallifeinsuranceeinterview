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
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 bg-white rounded-2xl shadow-2xl p-4 w-72 border border-gray-100 origin-bottom-right"
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

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleConversation}
        className="relative z-50 w-16 h-16 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center transition-all bg-white overflow-hidden"
      >
        {conversation.status === 'connected' ? (
           <div className="absolute inset-0 bg-gradient-to-br from-[#0046B8] to-[#001538]">
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
               className="absolute inset-[-50%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#00FFFF_50%,transparent_100%)] opacity-30 mix-blend-overlay"
             />
             <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#0055E6] to-[#00338D] flex items-center justify-center">
                <motion.div
                  animate={{ scale: conversation.isSpeaking ? [1, 1.2, 1] : 1 }}
                  className="w-8 h-8 rounded-full bg-white/20 blur-md"
                />
             </div>
           </div>
        ) : (
           <img src="https://www.prudential.com/wcm/myassets/wb_header_footer/Pru_Logo_Blue_RGB.svg" alt="Prudential" className="w-8 h-8" />
        )}
      </motion.button>
    </div>
  );
};
