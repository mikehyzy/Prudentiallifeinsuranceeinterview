import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, Sparkles, X } from 'lucide-react';
import { Button } from './ui/button';

interface VoiceAssistantProps {
  isActive: boolean;
  transcript: string;
  onToggle: () => void;
  currentQuestion: string;
}

export function VoiceAssistant({
  isActive,
  transcript,
  onToggle,
  currentQuestion
}: VoiceAssistantProps) {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Voice Active Overlay - Enhanced Chat Interface */}
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            key="voice-chat"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-24 right-0 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Gradient Header with AI Insurance Assistant Label */}
            <div className="bg-gradient-to-r from-[#0046B8] to-[#003087] p-5 text-white relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">AI Insurance Assistant</h3>
                  <p className="text-xs text-blue-100">Powered by Prudential AI</p>
                </div>
                {/* Close Button */}
                <button
                  onClick={onToggle}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Enhanced Sound Wave Animation */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 bg-white rounded-full"
                      animate={{
                        height: ['12px', '28px', '12px'],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.08,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-white/90 ml-2">Listening...</span>
              </div>
            </div>

            {/* Chat Content Area */}
            <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
              {/* AI Assistant Question */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0046B8] to-[#003087] flex items-center justify-center flex-shrink-0">
                  <Volume2 className="w-4 h-4 text-white" />
                </div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl rounded-tl-none p-4 shadow-sm"
                >
                  <p className="text-sm text-gray-800 leading-relaxed">{currentQuestion}</p>
                </motion.div>
              </div>

              {/* Real-time Transcript - User Response */}
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3 justify-end"
                >
                  <div className="flex-1 bg-gradient-to-br from-[#0046B8] to-[#003087] rounded-2xl rounded-tr-none p-4 shadow-lg max-w-[80%] ml-auto">
                    <p className="text-sm text-white">{transcript}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">👤</span>
                  </div>
                </motion.div>
              )}

              {/* Voice Confidence Meter */}
              {transcript && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2 px-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Recognition Quality</span>
                    <span className="text-green-600 font-medium">Excellent</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-green-500"
                      initial={{ width: '0%' }}
                      animate={{ width: '95%' }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Smart Prompts Footer */}
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2.5">Quick responses:</p>
              <div className="flex flex-wrap gap-2">
                {['Yes', 'No', 'I need more information'].map((prompt) => (
                  <motion.button
                    key={prompt}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 hover:border-[#0046B8] hover:text-[#0046B8] transition-all shadow-sm"
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button with Gradient */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={onToggle}
          className={`w-16 h-16 rounded-full shadow-2xl transition-all relative overflow-hidden ${
            isActive ? 'ring-4 ring-red-200' : 'ring-0'
          }`}
          style={{
            background: isActive 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #0046B8 0%, #003087 100%)'
          }}
        >
          {/* Shimmer effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          
          <motion.div
            className="relative z-10 flex items-center justify-center text-white"
            animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
          >
            {isActive ? (
              <MicOff className="w-7 h-7" />
            ) : (
              <Mic className="w-7 h-7" />
            )}
          </motion.div>
        </button>

        {/* Label below button */}
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          >
            <span className="text-xs text-gray-600 font-medium">Voice Assistant</span>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Pulse Effect When Active */}
      {isActive && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0, 70, 184, 0.3) 0%, transparent 70%)'
            }}
            animate={{ 
              scale: [1, 1.8],
              opacity: [0.5, 0]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0, 70, 184, 0.3) 0%, transparent 70%)'
            }}
            animate={{ 
              scale: [1, 1.8],
              opacity: [0.5, 0]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.75 }}
          />
        </>
      )}
    </div>
  );
}
