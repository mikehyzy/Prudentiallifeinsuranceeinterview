import { useState, useEffect } from 'react';
import { InterviewHeader } from './components/InterviewHeader';
import { ProgressBar } from './components/ProgressBar';
import { SectionForm } from './components/SectionForm';
import { ReviewSection } from './components/ReviewSection';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { VoiceWidget } from './components/VoiceWidget';

const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
     const parts = dateString.split('/');
     if (parts.length === 3) {
         return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
     }
     return dateString;
  }
  return date.toISOString().split('T')[0];
};

const normalizeId = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

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

const sections: Section[] = [
  {
    name: 'Personal Info',
    fields: [
      { id: 'fullName', label: 'Full Legal Name', type: 'text', placeholder: 'First Middle Last', required: true },
      { id: 'dateOfBirth', label: 'Date of Birth', type: 'date', format: 'MM/DD/YYYY (Must be 18-85 years old)', required: true },
      { id: 'ssn', label: 'Social Security Number', type: 'ssn', format: 'XXX-XX-XXXX', required: true },
      { id: 'gender', label: 'Gender', type: 'radio', options: ['Male', 'Female'], required: true },
      { id: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed', 'Domestic Partnership'], required: true },
      { id: 'currentAddress', label: 'Current Home Address', type: 'text', placeholder: 'Must be more than 2 years: Number, Street, City, State, ZIP', required: true },
      { id: 'yearsAtAddress', label: 'Years at Current Address', type: 'text', placeholder: 'Number (0-99)', required: true },
      { id: 'previousAddress', label: 'Previous Address', type: 'text', placeholder: 'If less than 2 years: Number, Street, City, State, ZIP' },
      { id: 'phoneNumber', label: 'Phone Number', type: 'phone', format: '(XXX) XXX-XXXX', required: true },
      { id: 'emailAddress', label: 'Email Address', type: 'email', placeholder: 'Valid email address', required: true },
      { id: 'citizenship', label: 'Citizenship Status', type: 'select', options: ['US Citizen', 'Permanent Resident', 'Visa Holder'], required: true },
      { id: 'countryOfBirth', label: 'Country of Birth', type: 'text', placeholder: 'Country name', required: true },
      { id: 'stateOfBirth', label: 'State of Birth (if US)', type: 'text', placeholder: 'State abbreviation' },
      { id: 'driversLicenseNumber', label: "Driver's License Number", type: 'text', placeholder: 'State-specific format', required: true },
      { id: 'driversLicenseState', label: "Driver's License State", type: 'text', placeholder: 'State abbreviation', required: true }
    ]
  },
  {
    name: 'Employment Information',
    fields: [
      { id: 'employmentStatus', label: 'Employment Status', type: 'select', options: ['Employed', 'Self-Employed', 'Retired', 'Unemployed', 'Student', 'Homemaker'], required: true },
      { id: 'employerName', label: 'Employer Name', type: 'text', placeholder: 'Company name', format: 'Company name', required: true },
      { id: 'occupationJobTitle', label: 'Occupation/Job Title', type: 'text', placeholder: 'Your job title', format: 'Text', required: true },
      { id: 'yearsWithCurrentEmployer', label: 'Years with Current Employer', type: 'number', placeholder: '0-99', format: 'Number (0-99)', required: true },
      { id: 'annualIncome', label: 'Annual Income', type: 'text', placeholder: '$0.00', format: 'Dollar amount', required: true },
      { id: 'incomeSource', label: 'Income Source', type: 'select', options: ['Salary', 'Hourly', 'Commission', 'Business Income', 'Investment', 'Pension'], required: true },
      { id: 'workAddress', label: 'Work Address', type: 'text', placeholder: 'Street, City, State, ZIP', format: 'Street, City, State, ZIP', required: true },
      { id: 'workPhone', label: 'Work Phone', type: 'phone', placeholder: '(XXX) XXX-XXXX', format: '(XXX) XXX-XXXX', required: true },
      { id: 'previousEmployer', label: 'Previous Employer (if less than 2 years)', type: 'text', placeholder: 'Company name', format: 'Company name' },
      { id: 'industrySector', label: 'Industry/Sector', type: 'select', options: ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Construction', 'Agriculture', 'Transportation', 'Government', 'Other'], required: true },
      { id: 'travelForWork', label: 'Do you travel for work?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'travelDaysPerYear', label: 'If yes, how many days per year?', type: 'number', placeholder: '0-365', format: 'Number (0-365)' },
      { id: 'hazardousConditions', label: 'Do you work in hazardous conditions?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'hazardousDescription', label: 'If yes, please describe', type: 'textarea', placeholder: 'Describe the hazardous conditions...', format: 'Text (max 500 characters)', maxLength: 500 },
      { id: 'expectedRetirementAge', label: 'Expected Retirement Age', type: 'number', placeholder: '50-100', format: 'Number (50-100)', required: true }
    ]
  },
  {
    name: 'Financial Information',
    fields: [
      { id: 'totalHouseholdIncome', label: 'Total Household Income', type: 'text', placeholder: '$0.00', format: 'Dollar amount', required: true },
      { id: 'netWorth', label: 'Net Worth', type: 'text', placeholder: '$0.00', format: 'Dollar amount range', required: true },
      { id: 'primaryBankName', label: 'Primary Bank Name', type: 'text', placeholder: 'Bank name', format: 'Text', required: true },
      { id: 'existingLifeInsurance', label: 'Do you have existing life insurance?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'existingCoverageAmount', label: 'If yes, total coverage amount', type: 'text', placeholder: '$0.00', format: 'Dollar amount' },
      { id: 'numberOfExistingPolicies', label: 'Number of existing policies', type: 'number', placeholder: '0-20', format: 'Number (0-20)' },
      { id: 'purposeOfInsurance', label: 'Purpose of this insurance', type: 'select', options: ['Income Replacement', 'Mortgage Protection', 'Estate Planning', 'Business/Final Expenses', 'Other'], required: true },
      { id: 'desiredCoverageAmount', label: 'Desired Coverage Amount', type: 'text', placeholder: '$25,000 minimum', format: 'Dollar amount ($25,000 minimum)', required: true },
      { id: 'desiredTermLength', label: 'Desired Term Length (if term)', type: 'select', options: ['10', '15', '20', '25', '30 years'], required: true },
      { id: 'premiumPaymentFrequency', label: 'Premium Payment Frequency', type: 'select', options: ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'], required: true },
      { id: 'accountTypeForPremiums', label: 'Bank Account Type for Premiums', type: 'select', options: ['Checking', 'Savings'], required: true },
      { id: 'routingNumber', label: 'Routing Number', type: 'text', placeholder: '9 digits', format: '9 digits', required: true },
      { id: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'Bank-specific', format: 'Bank-specific', required: true },
      { id: 'totalDebtAmount', label: 'Total Debt Amount', type: 'text', placeholder: '$0.00', format: 'Dollar amount', required: true },
      { id: 'mortgageBalance', label: 'Mortgage Balance', type: 'text', placeholder: '$0.00', format: 'Dollar amount', required: true },
      { id: 'otherLoansDebts', label: 'Other Loans/Debts', type: 'text', placeholder: '$0.00', format: 'Dollar amount' },
      { id: 'monthlyExpenses', label: 'Monthly Expenses', type: 'text', placeholder: '$0.00', format: 'Dollar amount', required: true },
      { id: 'emergencyFundAmount', label: 'Emergency Fund Amount', type: 'text', placeholder: '$0.00', format: 'Dollar amount', required: true },
      { id: 'investmentAccounts', label: 'Investment Accounts', type: 'select', options: ['401k', 'IRA', 'Stocks', 'Bonds', 'None', 'Other'], required: true },
      { id: 'bankruptcyHistory', label: 'Bankruptcy History', type: 'select', options: ['Never', '7+ years ago', 'Within 7 years'], required: true }
    ]
  },
  {
    name: 'Health Information',
    fields: [
      { id: 'height', label: 'Height', type: 'text', placeholder: 'e.g., 5\'10"', format: 'Feet/Inches', required: true },
      { id: 'weight', label: 'Weight', type: 'text', placeholder: 'e.g., 180', format: 'Pounds', required: true },
      { id: 'tobaccoLast12Months', label: 'Have you used tobacco in the last 12 months?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'tobaccoType', label: 'If yes, type of tobacco', type: 'select', options: ['Cigarettes', 'Cigars', 'Pipe', 'Chewing', 'Vaping', 'Other'] },
      { id: 'formerSmokerQuitDate', label: 'If former smoker, quit date', type: 'text', placeholder: 'MM/YYYY', format: 'MM/YYYY' },
      { id: 'primaryCarePhysician', label: 'Primary Care Physician Name', type: 'text', placeholder: 'Dr. First Last', format: 'Text', required: true },
      { id: 'physicianPhone', label: 'Physician Phone Number', type: 'phone', placeholder: '(XXX) XXX-XXXX', format: '(XXX) XXX-XXXX', required: true },
      { id: 'lastPhysicalExam', label: 'Date of Last Physical Exam', type: 'text', placeholder: 'MM/YYYY', format: 'MM/YYYY', required: true },
      { id: 'bloodPressure', label: 'Blood Pressure (if known)', type: 'text', placeholder: '120/80', format: 'XXX/XX' },
      { id: 'cholesterolLevel', label: 'Cholesterol Level (if known)', type: 'text', placeholder: 'e.g., 200', format: 'Number' },
      { id: 'prescriptionMedications', label: 'Do you take prescription medications?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'medicationsList', label: 'If yes, list medications', type: 'textarea', placeholder: 'List medication names', format: 'Text (medication names)', maxLength: 500 },
      { id: 'hospitalizedLast10Years', label: 'Have you been hospitalized in the last 10 years?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'hospitalizationDetails', label: 'If yes, provide dates and reasons', type: 'textarea', placeholder: 'Date and reason for each hospitalization', format: 'Text', maxLength: 500 },
      { id: 'surgeryLast10Years', label: 'Have you had surgery in the last 10 years?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'surgeryDetails', label: 'If yes, provide details', type: 'textarea', placeholder: 'Surgery details', format: 'Text', maxLength: 500 },
      { id: 'familyHeartDisease', label: 'Family history of heart disease?', type: 'select', options: ['Yes', 'No', 'Unknown'], required: true },
      { id: 'familyCancer', label: 'Family history of cancer?', type: 'select', options: ['Yes', 'No', 'Unknown'], required: true },
      { id: 'familyDiabetes', label: 'Family history of diabetes?', type: 'select', options: ['Yes', 'No', 'Unknown'], required: true },
      { id: 'familyStroke', label: 'Family history of stroke?', type: 'select', options: ['Yes', 'No', 'Unknown'], required: true },
      { id: 'diabetes', label: 'Do you have diabetes?', type: 'select', options: ['No', 'Type 1', 'Type 2', 'Pre-diabetes'], required: true },
      { id: 'heartConditions', label: 'Heart conditions?', type: 'select', options: ['None', 'High BP', 'Heart Disease', 'Other'], required: true },
      { id: 'cancer', label: 'Cancer?', type: 'select', options: ['Never', 'In remission', 'Currently treating'], required: true },
      { id: 'mentalHealthTreatment', label: 'Mental health treatment?', type: 'select', options: ['Never', 'Past', 'Current'], required: true },
      { id: 'respiratoryConditions', label: 'Respiratory conditions?', type: 'select', options: ['None', 'Asthma', 'COPD', 'Other'], required: true },
      { id: 'neurologicalConditions', label: 'Neurological conditions?', type: 'select', options: ['None', 'Epilepsy', 'MS', 'Parkinson\'s', 'Other'], required: true },
      { id: 'liverConditions', label: 'Liver conditions?', type: 'select', options: ['None', 'Hepatitis', 'Cirrhosis', 'Other'], required: true },
      { id: 'kidneyDisease', label: 'Kidney disease?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'hivAids', label: 'HIV/AIDS?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'sleepApnea', label: 'Sleep apnea?', type: 'select', options: ['No', 'Yes-treated', 'Yes-untreated'], required: true },
      { id: 'alcoholConsumption', label: 'Alcohol consumption', type: 'select', options: ['None', 'Occasional', '1-2 daily', '3+ daily'], required: true },
      { id: 'drugUseHistory', label: 'Drug use history', type: 'select', options: ['Never', 'Past', 'Current'], required: true },
      { id: 'duiDwiHistory', label: 'DUI/DWI history?', type: 'select', options: ['Never', 'Yes-date'], required: true },
      { id: 'currentlyPregnant', label: 'Currently pregnant? (if female)', type: 'select', options: ['Yes', 'No', 'N/A'], required: true },
      { id: 'planningPregnancy', label: 'Planning pregnancy? (if female)', type: 'select', options: ['Yes', 'No', 'N/A'], required: true },
      { id: 'depressionTreatment', label: 'Depression treatment?', type: 'select', options: ['Never', 'Past', 'Current'], required: true },
      { id: 'anxietyTreatment', label: 'Anxiety treatment?', type: 'select', options: ['Never', 'Past', 'Current'], required: true },
      { id: 'otherMentalHealthConditions', label: 'Other mental health conditions?', type: 'textarea', placeholder: 'Describe any other mental health conditions', format: 'Text', maxLength: 500 },
      { id: 'pendingMedicalTests', label: 'Pending medical tests?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'scheduledSurgeries', label: 'Scheduled surgeries?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'physicalDisabilities', label: 'Physical disabilities?', type: 'select', options: ['None', 'Mobility', 'Vision', 'Hearing', 'Other'], required: true },
      { id: 'workersCompClaims', label: 'Workers comp claims?', type: 'select', options: ['Never', 'Past', 'Current'], required: true },
      { id: 'disabilityInsuranceClaims', label: 'Disability insurance claims?', type: 'select', options: ['Never', 'Past', 'Current'], required: true },
      { id: 'declinedForInsurance', label: 'Declined for insurance before?', type: 'radio', options: ['Yes', 'No'], required: true }
    ]
  },
  {
    name: 'Lifestyle & Habits',
    fields: [
      { id: 'hazardousHobbies', label: 'Hazardous hobbies?', type: 'select', options: ['None', 'Aviation', 'Racing', 'Scuba', 'Rock Climbing', 'Other'], required: true },
      { id: 'pilotLicense', label: 'Pilot license?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'hoursFlownAnnually', label: 'If yes, hours flown annually', type: 'number', placeholder: 'Number', format: 'Number' },
      { id: 'motorcycleRiding', label: 'Motorcycle riding?', type: 'select', options: ['Never', 'Occasionally', 'Regularly'], required: true },
      { id: 'internationalTravelFrequency', label: 'International travel frequency', type: 'select', options: ['Never', '1-2 yearly', '3-5 yearly', '6+ yearly'], required: true },
      { id: 'travelHighRiskCountries', label: 'Travel to high-risk countries?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'militaryService', label: 'Military service?', type: 'select', options: ['Never', 'Past', 'Active', 'Reserve'], required: true },
      { id: 'militaryDeploymentStatus', label: 'If military, deployment status', type: 'select', options: ['Never', 'Past', 'Scheduled', 'Current'] },
      { id: 'criminalHistory', label: 'Criminal history?', type: 'select', options: ['None', 'Misdemeanor', 'Felony'], required: true },
      { id: 'criminalHistoryDetails', label: 'If yes, provide details', type: 'text', placeholder: 'Provide details', format: 'Text' },
      { id: 'suspendedLicenseHistory', label: 'Suspended license history?', type: 'select', options: ['Never', 'Past-restored', 'Current'], required: true },
      { id: 'movingViolations', label: 'Moving violations (last 5 years)', type: 'number', placeholder: '0-99', format: 'Number (0-99)', required: true },
      { id: 'extremeSportsParticipation', label: 'Extreme sports participation?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'professionalSports', label: 'Professional sports?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'volunteerFirefighterEMT', label: 'Volunteer firefighter/EMT?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'lawEnforcement', label: 'Law enforcement?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'hazardousOccupationDetails', label: 'Hazardous occupation details', type: 'text', placeholder: 'Provide details', format: 'Text' },
      { id: 'workAtHeights', label: 'Work at heights?', type: 'select', options: ['Never', 'Occasionally', 'Regularly'], required: true },
      { id: 'workWithExplosives', label: 'Work with explosives?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'radiationExposure', label: 'Radiation exposure?', type: 'select', options: ['Never', 'Occasionally', 'Regularly'], required: true }
    ]
  },
  {
    name: 'Beneficiary Information',
    fields: [
      { id: 'primaryBeneficiaryName', label: 'Primary Beneficiary Name', type: 'text', placeholder: 'First Last', format: 'First Last', required: true },
      { id: 'primaryRelationship', label: 'Relationship', type: 'select', options: ['Spouse', 'Child', 'Parent', 'Sibling', 'Trust', 'Estate', 'Other'], required: true },
      { id: 'primaryBeneficiaryDOB', label: 'Date of Birth', type: 'date', format: 'MM/DD/YYYY', required: true },
      { id: 'primaryBeneficiarySSN', label: 'Social Security Number', type: 'ssn', placeholder: 'XXX-XX-XXXX', format: 'XXX-XX-XXXX', required: true },
      { id: 'primarySharePercentage', label: 'Share Percentage', type: 'number', placeholder: '1-100', format: '1-100%', required: true },
      { id: 'primaryBeneficiaryAddress', label: 'Address', type: 'text', placeholder: 'Street, City, State, ZIP', format: 'Street, City, State, ZIP', required: true },
      { id: 'primaryBeneficiaryPhone', label: 'Phone Number', type: 'phone', placeholder: '(XXX) XXX-XXXX', format: '(XXX) XXX-XXXX', required: true },
      { id: 'contingentBeneficiaryName', label: 'Contingent Beneficiary Name', type: 'text', placeholder: 'First Last', format: 'First Last' },
      { id: 'contingentRelationship', label: 'Contingent Relationship', type: 'select', options: ['Spouse', 'Child', 'Parent', 'Sibling', 'Trust', 'Estate', 'Other'] },
      { id: 'contingentBeneficiaryDOB', label: 'Contingent DOB', type: 'date', format: 'MM/DD/YYYY' },
      { id: 'contingentBeneficiarySSN', label: 'Contingent SSN', type: 'ssn', placeholder: 'XXX-XX-XXXX', format: 'XXX-XX-XXXX' },
      { id: 'contingentSharePercentage', label: 'Contingent Share %', type: 'number', placeholder: '1-100', format: '1-100%' },
      { id: 'additionalBeneficiaries', label: 'Additional Beneficiaries?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'trustAsBeneficiary', label: 'Trust as Beneficiary?', type: 'radio', options: ['Yes', 'No'], required: true },
      { id: 'trustNameAndDate', label: 'If yes, Trust Name and Date', type: 'text', placeholder: 'Trust name and date', format: 'Text' }
    ]
  },
  {
    name: 'Review',
    fields: []
  }
];

const sectionNames = sections.map(s => s.name);
const ALL_FIELD_IDS = new Set(sections.flatMap(section => section.fields.map(field => field.id)));

export default function App() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(15);

  const handleFieldUpdate = (rawFieldId: string, value: string) => {
    let targetId = ALL_FIELD_IDS.has(rawFieldId) ? rawFieldId : null;

    if (!targetId) {
        const normalizedInput = normalizeId(rawFieldId);
        for (const validId of ALL_FIELD_IDS) {
            if (normalizeId(validId) === normalizedInput) {
                targetId = validId;
                break;
            }
            if (normalizeId(validId).includes(normalizedInput) || normalizedInput.includes(normalizeId(validId))) {
                if (normalizedInput.length > 4) {
                     targetId = validId;
                     break;
                }
            }
        }
    }

    if (targetId) {
        let finalValue = value;
        if (targetId.toLowerCase().includes('date') || targetId.toLowerCase().includes('dob')) {
            finalValue = formatDateForInput(value);
            console.log(`[App] Formatted date '${value}' to '${finalValue}'`);
        }

        setFormData(prev => ({ ...prev, [targetId!]: finalValue }));
        toast.success(`Updated ${targetId}`);
    } else {
        console.error(`[Voice] Could not map agent field '${rawFieldId}' to any valid form ID.`);
        toast.error(`Unknown field: ${rawFieldId}`);
    }
  };

  const currentSection = sections[currentSectionIndex];
  const totalFields = sections.reduce((sum, section) => sum + section.fields.length, 0);
  const answeredCount = Object.keys(formData).filter(key => formData[key]).length;

  const getStartingQuestionNumber = (sectionIndex: number) => {
    let count = 1;
    for (let i = 0; i < sectionIndex; i++) {
      count += sections[i].fields.length;
    }
    return count;
  };

  useEffect(() => {
    const baseTime = 15;
    const timePerField = baseTime / totalFields;
    setTimeRemaining(Math.max(1, Math.ceil(baseTime - (answeredCount * timePerField))));
  }, [answeredCount, totalFields]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  const handleSectionClick = (index: number) => {
    setCurrentSectionIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <InterviewHeader />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="relative px-12 shadow-2xl mb-12 overflow-hidden" style={{ paddingTop: '60px', paddingBottom: '40px', background: 'linear-gradient(to right, #E31837, #6B3FA0)' }}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA4IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h1 className="text-white mb-6 tracking-tight leading-none drop-shadow-2xl" style={{ fontSize: '56px', fontFamily: 'Century Schoolbook, Georgia, serif', fontWeight: 'bold' }}>
              Life Insurance E-Interview
            </h1>
            <p className="text-white/90 text-2xl md:text-3xl font-semibold tracking-wide">
              Complete your application with our AI assistant
            </p>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <ProgressBar
          sections={sectionNames}
          currentSection={currentSectionIndex}
          onSectionClick={handleSectionClick}
        />

        {currentSection.name !== 'Review' && (
          <div className="text-center text-gray-500 mb-6">
            About {timeRemaining} minutes remaining
          </div>
        )}

        {currentSection.name === 'Review' ? (
          <ReviewSection
            formData={formData}
            onPrevious={handlePrevious}
            canGoPrevious={currentSectionIndex > 0}
          />
        ) : (
          <SectionForm
            section={currentSection}
            sectionNumber={currentSectionIndex + 1}
            totalSections={sections.length}
            formData={formData}
            onFieldChange={handleFieldChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoPrevious={currentSectionIndex > 0}
            startingQuestionNumber={getStartingQuestionNumber(currentSectionIndex)}
          />
        )}

      </main>

      <Toaster position="top-center" />

      <VoiceWidget onFieldUpdate={handleFieldUpdate} />
    </div>
  );
}
