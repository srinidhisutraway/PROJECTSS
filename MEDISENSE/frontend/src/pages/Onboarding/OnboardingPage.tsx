import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useSubmitOnboarding } from '../../hooks/useUser';
import { useAuth } from '../../contexts/AuthContext';
import { OnboardingData } from '../../types';

const CHOICE_GROUPS = {
  ageGroup: ['13-17', '18-24', '25-34', '35-44', '45-54', '55+'],
  gender: ['male', 'female', 'non-binary', 'prefer-not-to-say'],
  skinType: ['dry', 'oily', 'combination', 'normal', 'sensitive'],
  mainConcerns: ['acne', 'pigmentation', 'wrinkles', 'dryness', 'oiliness', 'redness', 'dark-circles', 'scarring', 'sensitivity', 'dullness'],
  acneHistory: ['never', 'occasional', 'chronic', 'past-only'],
  currentRoutine: ['none', 'basic', 'moderate', 'extensive'],
  sunscreenUsage: ['never', 'sometimes', 'daily', 'multiple-times-daily'],
  dietHabits: ['balanced', 'high-sugar', 'high-fat', 'vegetarian', 'vegan', 'irregular'],
  smokingAlcohol: ['none', 'occasional', 'regular', 'prefer-not-to-say'],
  dermatologistVisits: ['never', 'rarely', 'occasionally', 'regularly'],
};

const prettify = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

interface Step {
  id: string;
  title: string;
  subtitle: string;
}

const STEPS: Step[] = [
  { id: 'basics', title: "Let's start with the basics", subtitle: 'This helps us tailor advice to your life stage.' },
  { id: 'skin', title: 'Tell us about your skin', subtitle: 'Your skin type and main concerns.' },
  { id: 'history', title: 'Skin history', subtitle: 'Past experiences help us understand context.' },
  { id: 'routine', title: 'Your current routine', subtitle: "What's already working (or not)." },
  { id: 'lifestyle', title: 'Lifestyle factors', subtitle: 'Sleep, water, and diet all affect skin health.' },
  { id: 'medical', title: 'Medical background', subtitle: 'Optional, but helps us give safer suggestions.' },
  { id: 'reminders', title: 'Almost done!', subtitle: 'One last preference.' },
];

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingData>({ mainConcerns: [], allergies: [], productsUsed: [], medications: [], familyHistory: [], cosmeticTreatments: [], existingConditions: [], wantsReminders: true });
  const { mutate, isPending } = useSubmitOnboarding();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const update = (field: keyof OnboardingData, value: any) => setAnswers((a) => ({ ...a, [field]: value }));

  const toggleArrayValue = (field: keyof OnboardingData, value: string) => {
    setAnswers((a) => {
      const current = (a[field] as string[]) || [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...a, [field]: next };
    });
  };

  const handleTagsInput = (field: keyof OnboardingData, raw: string) => {
    update(field, raw.split(',').map((s) => s.trim()).filter(Boolean));
  };

  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      mutate(answers, {
        onSuccess: (user) => {
          setUser(user);
          toast.success('Profile complete! Welcome to MediSense.');
          navigate('/dashboard', { replace: true });
        },
        onError: () => toast.error('Something went wrong saving your answers.'),
      });
    } else {
      setStep((s) => s + 1);
    }
  };

  const ChoiceButtons: React.FC<{ field: keyof OnboardingData; options: string[]; multi?: boolean }> = ({ field, options, multi }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = multi ? ((answers[field] as string[]) || []).includes(opt) : answers[field] === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => (multi ? toggleArrayValue(field, opt) : update(field, opt))}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              selected
                ? 'border-clay-500 bg-clay-500 text-white'
                : 'border-ink/15 bg-white/60 text-ink hover:border-clay-300 dark:border-white/15 dark:bg-white/5 dark:text-canvas'
            }`}
          >
            {prettify(opt)}
          </button>
        );
      })}
    </div>
  );

  const Slider: React.FC<{ field: keyof OnboardingData; min: number; max: number; step?: number; unit: string }> = ({
    field, min, max, step: st = 1, unit,
  }) => (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        step={st}
        value={(answers[field] as number) ?? min}
        onChange={(e) => update(field, Number(e.target.value))}
        className="w-full accent-teal-500"
      />
      <p className="mt-1 font-mono text-sm text-teal-700 dark:text-teal-300">
        {(answers[field] as number) ?? min} {unit}
      </p>
    </div>
  );

  const renderStepContent = () => {
    switch (STEPS[step].id) {
      case 'basics':
        return (
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Age group</p>
              <ChoiceButtons field="ageGroup" options={CHOICE_GROUPS.ageGroup} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Gender (optional)</p>
              <ChoiceButtons field="gender" options={CHOICE_GROUPS.gender} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Occupation</p>
              <input className="input-field" placeholder="e.g. Student, Software Engineer" value={answers.occupation || ''} onChange={(e) => update('occupation', e.target.value)} />
            </div>
          </div>
        );
      case 'skin':
        return (
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Skin type</p>
              <ChoiceButtons field="skinType" options={CHOICE_GROUPS.skinType} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Main concerns (select all that apply)</p>
              <ChoiceButtons field="mainConcerns" options={CHOICE_GROUPS.mainConcerns} multi />
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Acne history</p>
              <ChoiceButtons field="acneHistory" options={CHOICE_GROUPS.acneHistory} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Known allergies (comma-separated)</p>
              <input className="input-field" placeholder="e.g. fragrance, nickel" onChange={(e) => handleTagsInput('allergies', e.target.value)} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Family history of skin conditions (comma-separated)</p>
              <input className="input-field" placeholder="e.g. eczema, psoriasis" onChange={(e) => handleTagsInput('familyHistory', e.target.value)} />
            </div>
          </div>
        );
      case 'routine':
        return (
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Current skincare routine</p>
              <ChoiceButtons field="currentRoutine" options={CHOICE_GROUPS.currentRoutine} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Products you currently use (comma-separated)</p>
              <input className="input-field" placeholder="e.g. cleanser, vitamin C serum" onChange={(e) => handleTagsInput('productsUsed', e.target.value)} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Sunscreen usage</p>
              <ChoiceButtons field="sunscreenUsage" options={CHOICE_GROUPS.sunscreenUsage} />
            </div>
          </div>
        );
      case 'lifestyle':
        return (
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Daily water intake (liters)</p>
              <Slider field="waterIntakeLiters" min={0} max={6} step={0.5} unit="L" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Average sleep (hours)</p>
              <Slider field="sleepHours" min={0} max={12} unit="hrs" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Diet habits</p>
              <ChoiceButtons field="dietHabits" options={CHOICE_GROUPS.dietHabits} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Smoking / alcohol (optional)</p>
              <ChoiceButtons field="smokingAlcohol" options={CHOICE_GROUPS.smokingAlcohol} />
            </div>
          </div>
        );
      case 'medical':
        return (
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Previous dermatologist visits</p>
              <ChoiceButtons field="dermatologistVisits" options={CHOICE_GROUPS.dermatologistVisits} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Prescription medications (comma-separated, optional)</p>
              <input className="input-field" onChange={(e) => handleTagsInput('medications', e.target.value)} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Existing medical conditions (optional)</p>
              <input className="input-field" onChange={(e) => handleTagsInput('existingConditions', e.target.value)} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Cosmetic treatments you've had (optional)</p>
              <input className="input-field" onChange={(e) => handleTagsInput('cosmeticTreatments', e.target.value)} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-canvas">Daily sun exposure (hours)</p>
              <Slider field="dailySunExposureHours" min={0} max={12} unit="hrs" />
            </div>
          </div>
        );
      case 'reminders':
        return (
          <div className="space-y-4">
            <p className="text-sm text-ink/70 dark:text-canvas/70">
              Would you like MediSense to send you gentle skincare reminders (e.g. reapply sunscreen, log a check-in)?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => update('wantsReminders', true)}
                className={`btn-secondary flex-1 ${answers.wantsReminders ? '!border-teal-500 !bg-teal-50 dark:!bg-teal-500/10' : ''}`}
              >
                Yes, remind me
              </button>
              <button
                type="button"
                onClick={() => update('wantsReminders', false)}
                className={`btn-secondary flex-1 ${answers.wantsReminders === false ? '!border-teal-500 !bg-teal-50 dark:!bg-teal-500/10' : ''}`}
              >
                No thanks
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dawn-gradient px-4 py-10 dark:bg-dawn-gradient-dark">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-clay-500 text-white"><Sparkles size={18} /></span>
          <span className="font-display text-lg font-semibold">MediSense</span>
        </div>

        <div className="mb-2 flex justify-between text-xs text-ink/50 dark:text-canvas/50">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
        </div>
        <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-white/50 dark:bg-white/10">
          <motion.div
            className="h-2 rounded-full bg-clay-500"
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="glass-card p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-display text-2xl font-semibold text-ink dark:text-canvas">{STEPS[step].title}</h2>
              <p className="mt-1 mb-6 text-sm text-ink/60 dark:text-canvas/60">{STEPS[step].subtitle}</p>
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="btn-secondary disabled:opacity-40"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button onClick={handleNext} disabled={isPending} className="btn-primary">
              {isLast ? (isPending ? 'Saving…' : 'Finish') : 'Next'}
              {isLast ? <Check size={16} /> : <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
