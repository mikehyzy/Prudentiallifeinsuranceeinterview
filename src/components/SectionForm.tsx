import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Check, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'select' | 'radio' | 'ssn' | 'phone' | 'email' | 'number' | 'textarea';
  placeholder?: string;
  options?: string[];
  format?: string;
  required?: boolean;
  maxLength?: number;
}

interface Section {
  name: string;
  fields: FormField[];
}

interface SectionFormProps {
  section: Section;
  sectionNumber: number;
  totalSections: number;
  formData: Record<string, any>;
  onFieldChange: (fieldId: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoPrevious: boolean;
  startingQuestionNumber?: number;
}

export function SectionForm({
  section,
  sectionNumber,
  totalSections,
  formData,
  onFieldChange,
  onNext,
  onPrevious,
  canGoPrevious,
  startingQuestionNumber = 1
}: SectionFormProps) {
  const requiredFields = section.fields.filter(f => f.required);
  const answeredRequiredFields = requiredFields.filter(f => formData[f.id]);
  const canGoNext = requiredFields.length === 0 || answeredRequiredFields.length === requiredFields.length;

  const handleSaveForm = () => {
    toast.success('Responses are saved', {
      duration: 2000,
    });
  };

  const renderField = (field: FormField, index: number) => {
    const value = formData[field.id] || '';
    const isAnswered = !!formData[field.id];
    const questionNumber = startingQuestionNumber + index;

    return (
      <motion.div
        key={field.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <Label htmlFor={field.id} className="text-gray-700">
            <span className="text-gray-400 mr-2">{questionNumber}.</span>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {isAnswered && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 text-green-600 text-xs"
            >
              <Check className="w-3 h-3" />
            </motion.div>
          )}
        </div>

        {field.format && (
          <p className="text-xs text-gray-500">Format: {field.format}</p>
        )}

        {field.type === 'text' && (
          <Input
            id={field.id}
            value={value}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="max-w-xl"
          />
        )}

        {field.type === 'date' && (
          <Input
            id={field.id}
            type="date"
            value={value}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            className="max-w-xs"
          />
        )}

        {field.type === 'email' && (
          <Input
            id={field.id}
            type="email"
            value={value}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="max-w-xl"
          />
        )}

        {field.type === 'phone' && (
          <Input
            id={field.id}
            type="tel"
            value={value}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            placeholder={field.format}
            className="max-w-xs"
          />
        )}

        {field.type === 'ssn' && (
          <Input
            id={field.id}
            type="text"
            value={value}
            onChange={(e) => {
              // Auto-format SSN
              let val = e.target.value.replace(/\D/g, '');
              if (val.length > 3) val = val.slice(0, 3) + '-' + val.slice(3);
              if (val.length > 6) val = val.slice(0, 6) + '-' + val.slice(6, 10);
              onFieldChange(field.id, val);
            }}
            placeholder={field.format}
            maxLength={11}
            className="max-w-xs"
          />
        )}

        {field.type === 'radio' && field.options && (
          <RadioGroup value={value} onValueChange={(val) => onFieldChange(field.id, val)}>
            <div className="flex gap-4">
              {field.options.map((option) => (
                <Label
                  key={option}
                  htmlFor={`${field.id}-${option}`}
                  className="flex items-center gap-3 cursor-pointer px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-[#0046B8] hover:bg-blue-50 transition-all shadow-md"
                  style={{
                    borderColor: value === option ? '#0046B8' : '',
                    backgroundColor: value === option ? '#E6F0FF' : ''
                  }}
                >
                  <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                  <span className={value === option ? 'text-[#0046B8]' : 'text-gray-700'}>
                    {option}
                  </span>
                </Label>
              ))}
            </div>
          </RadioGroup>
        )}

        {field.type === 'select' && field.options && (
          <Select value={value} onValueChange={(val) => onFieldChange(field.id, val)}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {field.type === 'number' && (
          <Input
            id={field.id}
            type="number"
            value={value}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="max-w-xs"
          />
        )}

        {field.type === 'textarea' && (
          <Textarea
            id={field.id}
            value={value}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            className="max-w-2xl resize-none"
            rows={4}
          />
        )}
      </motion.div>
    );
  };

  // Review section
  if (section.name === 'Review') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8 mb-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-[#0046B8] mb-2">Review Your Information</h2>
          <p className="text-gray-600">Please review all your answers before submitting</p>
        </div>

        <div className="space-y-6 mb-8">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
              <span className="text-gray-900">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button
            onClick={onPrevious}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            className="flex items-center gap-2 bg-[#0046B8] hover:bg-[#003a9a]"
          >
            Submit Application
            <Check className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8 mb-32"
      >
        {/* Section Header */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[#0046B8]">{section.name}</h2>
            <span className="text-sm text-gray-500">
              Section {sectionNumber} of {totalSections}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {requiredFields.length > 0 && (
              <>Fields marked with <span className="text-red-500">*</span> are required</>
            )}
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {section.fields.map((field, index) => renderField(field, index))}
        </div>
      </motion.div>

      {/* Sticky Progress Indicator - Fixed to Bottom */}
      {requiredFields.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40"
        >
          <div className="max-w-5xl mx-auto px-8 py-4">
            {/* Progress Indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-700">Required fields completed:</span>
                <span className="text-[#0046B8]">
                  {answeredRequiredFields.length} of {requiredFields.length}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#0046B8]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(answeredRequiredFields.length / requiredFields.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Button
                onClick={onPrevious}
                disabled={!canGoPrevious}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSaveForm}
                  variant="outline"
                  className="flex items-center gap-2 border-[#0046B8] text-[#0046B8] hover:bg-[#0046B8] hover:text-white transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Form
                </Button>

                <Button
                  onClick={onNext}
                  disabled={!canGoNext}
                  className="flex items-center gap-2 bg-[#0046B8] hover:bg-[#003a9a]"
                >
                  Next Section
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
