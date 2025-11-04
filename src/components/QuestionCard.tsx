import { motion } from 'motion/react';
import { Info, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useState } from 'react';

interface Question {
  id: number;
  section: string;
  type: 'yesno' | 'multiple' | 'text' | 'date' | 'numeric';
  question: string;
  info: string;
  options?: string[];
  placeholder?: string;
  unit?: 'lbs' | 'inches' | 'years';
}

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  answer: any;
  onAnswer: (answer: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  answer,
  onAnswer,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious
}: QuestionCardProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(answer || []);

  const handleMultipleChoice = (option: string) => {
    let newSelected: string[];
    if (selectedOptions.includes(option)) {
      newSelected = selectedOptions.filter(o => o !== option);
    } else {
      newSelected = [...selectedOptions, option];
    }
    setSelectedOptions(newSelected);
    onAnswer(newSelected);
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-lg p-8 mb-6 relative"
    >
      {/* Question Number & Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
          {answer && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 text-green-600 text-sm"
            >
              <Check className="w-4 h-4" />
              <span>Answered</span>
            </motion.div>
          )}
        </div>
        
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 text-gray-400 hover:text-[#0046B8] transition-colors"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Info Box */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100"
        >
          <p className="text-sm text-gray-700">{question.info}</p>
        </motion.div>
      )}

      {/* Question Text */}
      <h2 className="text-gray-900 mb-8">{question.question}</h2>

      {/* Answer Input Based on Type */}
      <div className="mb-8">
        {question.type === 'yesno' && (
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => onAnswer('yes')}
              variant={answer === 'yes' ? 'default' : 'outline'}
              className={`h-20 text-lg ${
                answer === 'yes'
                  ? 'bg-[#0046B8] hover:bg-[#003a9a]'
                  : 'hover:border-[#0046B8] hover:text-[#0046B8]'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                {answer === 'yes' && <Check className="w-6 h-6" />}
                <span>Yes</span>
              </div>
            </Button>
            <Button
              onClick={() => onAnswer('no')}
              variant={answer === 'no' ? 'default' : 'outline'}
              className={`h-20 text-lg ${
                answer === 'no'
                  ? 'bg-[#0046B8] hover:bg-[#003a9a]'
                  : 'hover:border-[#0046B8] hover:text-[#0046B8]'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                {answer === 'no' && <Check className="w-6 h-6" />}
                <span>No</span>
              </div>
            </Button>
          </div>
        )}

        {question.type === 'multiple' && (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <div
                key={option}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedOptions.includes(option)
                    ? 'border-[#0046B8] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleMultipleChoice(option)}
              >
                <Checkbox
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={() => handleMultipleChoice(option)}
                />
                <Label className="cursor-pointer flex-1">{option}</Label>
              </div>
            ))}
          </div>
        )}

        {question.type === 'text' && (
          <div className="space-y-2">
            <Input
              value={answer || ''}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder={question.placeholder}
              className="h-12 text-lg"
            />
            <p className="text-xs text-gray-500">
              You can speak your answer using the voice assistant below
            </p>
          </div>
        )}

        {question.type === 'date' && (
          <Input
            type="date"
            value={answer || ''}
            onChange={(e) => onAnswer(e.target.value)}
            className="h-12 text-lg max-w-xs"
          />
        )}

        {question.type === 'numeric' && (
          <div className="flex items-center gap-4 max-w-xs">
            <Input
              type="number"
              value={answer || ''}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder="Enter value"
              className="h-12 text-lg"
            />
            {question.unit && (
              <span className="text-gray-600">{question.unit}</span>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center gap-2 bg-[#0046B8] hover:bg-[#003a9a]"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
