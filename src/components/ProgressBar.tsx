import { Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  sections: string[];
  currentSection: number;
  onSectionClick?: (index: number) => void;
}

export function ProgressBar({ sections, currentSection, onSectionClick }: ProgressBarProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <motion.div 
            className="h-full bg-[#0046B8]"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentSection / (sections.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>

        {sections.map((section, index) => {
          const isCompleted = index < currentSection;
          const isCurrent = index === currentSection;
          const isUpcoming = index > currentSection;

          return (
            <button
              key={section}
              onClick={() => onSectionClick?.(index)}
              className="flex flex-col items-center flex-1 cursor-pointer group transition-all hover:scale-105"
            >
              {/* Circle Indicator */}
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all shadow-lg font-bold text-lg ${
                  isCompleted
                    ? 'bg-gradient-to-br from-[#0046B8] to-[#003087] text-white group-hover:shadow-xl'
                    : isCurrent
                    ? 'bg-gradient-to-br from-[#0046B8] to-[#003087] text-white ring-4 ring-blue-200 shadow-2xl group-hover:shadow-xl'
                    : 'bg-white border-3 border-gray-300 text-gray-400 group-hover:border-[#0046B8] group-hover:text-[#0046B8] group-hover:shadow-xl'
                }`}
                animate={isCurrent ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6 stroke-[3]" />
                ) : (
                  <span className="font-black">{index + 1}</span>
                )}
              </motion.div>

              {/* Label */}
              <span
                className={`text-sm text-center max-w-[90px] transition-colors font-semibold ${
                  isCurrent
                    ? 'text-[#0046B8] font-bold'
                    : isCompleted
                    ? 'text-gray-700 group-hover:text-[#0046B8]'
                    : 'text-gray-400 group-hover:text-[#0046B8]'
                }`}
              >
                {section}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
