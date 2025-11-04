import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Check, FileText, DollarSign, Calendar, Users, Briefcase, Heart } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface ReviewSectionProps {
  formData: Record<string, any>;
  onPrevious: () => void;
  canGoPrevious: boolean;
}

export function ReviewSection({ formData, onPrevious, canGoPrevious }: ReviewSectionProps) {
  // Determine which insurance products are being applied for based on form data
  const initialProducts = [
    {
      id: 'term-life',
      name: 'Term Life Insurance',
      description: 'Coverage for a specific period of time',
      checked: formData.desiredTermLength ? true : false,
      details: formData.desiredTermLength ? `${formData.desiredTermLength} year term` : null,
      icon: Calendar
    },
    {
      id: 'whole-life',
      name: 'Whole Life Insurance',
      description: 'Permanent coverage with cash value',
      checked: formData.purposeOfInsurance === 'Estate Planning',
      details: formData.purposeOfInsurance === 'Estate Planning' ? 'Estate planning coverage' : null,
      icon: FileText
    },
    {
      id: 'mortgage-protection',
      name: 'Mortgage Protection',
      description: 'Coverage specifically for mortgage debt',
      checked: formData.purposeOfInsurance === 'Mortgage Protection',
      details: formData.mortgageBalance ? `Mortgage balance: ${formData.mortgageBalance}` : null,
      icon: DollarSign
    },
    {
      id: 'income-replacement',
      name: 'Income Replacement',
      description: 'Replace lost income for your family',
      checked: formData.purposeOfInsurance === 'Income Replacement',
      details: formData.annualIncome ? `Annual income: ${formData.annualIncome}` : null,
      icon: Briefcase
    },
    {
      id: 'final-expense',
      name: 'Final Expense Insurance',
      description: 'Coverage for burial and end-of-life costs',
      checked: formData.purposeOfInsurance === 'Business/Final Expenses',
      details: 'Covers funeral and final expenses',
      icon: Heart
    }
  ];

  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    initialProducts.filter(p => p.checked).map(p => p.id)
  );

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSubmit = () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select at least one insurance product to apply for');
      return;
    }
    toast.success('Application submitted successfully!', {
      description: `${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''} selected`,
      duration: 3000,
    });
  };

  const insuranceProducts = initialProducts.map(product => ({
    ...product,
    checked: selectedProducts.includes(product.id)
  }));

  const checkedProducts = insuranceProducts.filter(p => p.checked);

  return (
    <div className="pb-24">
      <Card className="p-8 shadow-lg border-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[#0046B8] mb-2">Review Your Application</h2>
            <p className="text-gray-600">
              Please review the life insurance coverage you're applying for
            </p>
          </div>

          {/* Coverage Summary */}
          {formData.desiredCoverageAmount && (
            <div className="bg-gradient-to-r from-[#0046B8] to-[#003087] rounded-lg p-6 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Total Coverage Amount</p>
                  <p className="text-3xl">{formData.desiredCoverageAmount}</p>
                </div>
                <DollarSign className="w-12 h-12 opacity-50" />
              </div>
              {formData.premiumPaymentFrequency && (
                <p className="text-blue-100 mt-4">
                  Payment Frequency: {formData.premiumPaymentFrequency}
                </p>
              )}
            </div>
          )}

          {/* Insurance Products Checklist */}
          <div className="mb-8">
            <h3 className="text-gray-900 mb-4">Life Insurance Products Applied For</h3>
            
            <div className="space-y-4">
              {insuranceProducts.map((product, index) => {
                const Icon = product.icon;
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      onClick={() => toggleProduct(product.id)}
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        product.checked
                          ? 'border-[#0046B8] bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
                      }`}
                    >
                      <div className="flex items-center h-6">
                        <Checkbox
                          checked={product.checked}
                          onCheckedChange={() => toggleProduct(product.id)}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <Icon className={`w-5 h-5 ${product.checked ? 'text-[#0046B8]' : 'text-gray-400'}`} />
                          <h4 className={`${product.checked ? 'text-[#0046B8]' : 'text-gray-900'}`}>
                            {product.name}
                          </h4>
                          {product.checked && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto"
                            >
                              <div className="bg-green-500 text-white rounded-full p-1">
                                <Check className="w-4 h-4" />
                              </div>
                            </motion.div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        {product.checked && product.details && (
                          <p className="text-sm text-[#0046B8] bg-white px-3 py-1.5 rounded inline-block">
                            {product.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Application Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h4 className="text-gray-900 mb-4">Application Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {formData.fullName && (
                <div>
                  <span className="text-gray-500">Applicant Name</span>
                  <p className="text-gray-900">{formData.fullName}</p>
                </div>
              )}
              {formData.dateOfBirth && (
                <div>
                  <span className="text-gray-500">Date of Birth</span>
                  <p className="text-gray-900">{formData.dateOfBirth}</p>
                </div>
              )}
              {formData.employmentStatus && (
                <div>
                  <span className="text-gray-500">Employment Status</span>
                  <p className="text-gray-900">{formData.employmentStatus}</p>
                </div>
              )}
              {formData.tobaccoLast12Months && (
                <div>
                  <span className="text-gray-500">Tobacco Use</span>
                  <p className="text-gray-900">{formData.tobaccoLast12Months}</p>
                </div>
              )}
            </div>
          </div>

          {/* Selected Products Count */}
          <div className="bg-blue-50 border-l-4 border-[#0046B8] p-4 rounded mb-8">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0046B8]" />
              <p className="text-gray-900">
                <span className="text-[#0046B8]">{checkedProducts.length}</span> life insurance{' '}
                {checkedProducts.length === 1 ? 'product' : 'products'} selected for your application
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
            {canGoPrevious && (
              <Button
                variant="outline"
                onClick={onPrevious}
                className="border-gray-300 hover:bg-gray-50"
              >
                Previous Section
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-[#0046B8] to-[#003087] text-white hover:opacity-90"
            >
              Submit Application
            </Button>
          </div>
        </motion.div>
      </Card>

      {/* Sticky Progress Indicator */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg py-4 px-6 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#0046B8] to-[#003087] text-white w-10 h-10 rounded-full flex items-center justify-center">
              7
            </div>
            <div>
              <p className="text-sm text-gray-500">Section 7 of 7</p>
              <p className="text-gray-900">Review</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-5 h-5" />
            <span>Application Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}
