import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Briefcase, Code, BarChart3, Hash, FileText, ChevronRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = ['Software Engineer', 'Data Analyst', 'Java Developer', 'Python Developer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'ML Engineer', 'QA Engineer', 'Product Manager', 'Business Analyst'];

const TECHNOLOGIES = {
  'Software Engineer': ['Java', 'Python', 'JavaScript', 'TypeScript', 'C++', 'Go', 'Rust'],
  'Data Analyst': ['Python', 'SQL', 'Excel', 'Tableau', 'Power BI', 'R'],
  'Java Developer': ['Java', 'Spring Boot', 'Hibernate', 'Microservices', 'JDBC'],
  'Python Developer': ['Python', 'Django', 'Flask', 'FastAPI', 'NumPy', 'Pandas'],
  'Full Stack Developer': ['MERN', 'MEAN', 'Django + React', 'Spring + React', 'Next.js'],
  'Frontend Developer': ['React', 'Vue.js', 'Angular', 'TypeScript', 'Next.js', 'Tailwind CSS'],
  'Backend Developer': ['Node.js', 'Express', 'Spring Boot', 'Django', 'FastAPI', 'Go'],
  'DevOps Engineer': ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'CI/CD'],
  'ML Engineer': ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'NLP', 'Computer Vision'],
  'QA Engineer': ['Selenium', 'Jest', 'Cypress', 'Postman', 'API Testing', 'TDD'],
  'Product Manager': ['Agile', 'Scrum', 'JIRA', 'User Stories', 'Roadmapping'],
  'Business Analyst': ['SQL', 'Excel', 'Tableau', 'Process Modeling', 'Requirements Gathering'],
};

const EXPERIENCE_LEVELS = [
  { value: 'fresher', label: 'Fresher', desc: '0-1 years experience' },
  { value: '1-3years', label: '1-3 Years', desc: 'Some industry experience' },
  { value: 'experienced', label: '3+ Years', desc: 'Experienced professional' },
];

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner', desc: 'Fundamental concepts', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { value: 'intermediate', label: 'Intermediate', desc: 'Applied knowledge', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { value: 'advanced', label: 'Advanced', desc: 'Expert-level depth', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
];

const INTERVIEW_TYPES = [
  { value: 'technical', label: 'Technical', icon: Code, desc: 'Coding & technical concepts' },
  { value: 'hr', label: 'HR', icon: Briefcase, desc: 'HR & personality questions' },
  { value: 'behavioral', label: 'Behavioral', icon: FileText, desc: 'Situational & behavioral' },
  { value: 'mixed', label: 'Mixed', icon: Sparkles, desc: 'Combination of all types' },
];

export default function SetupInterview() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    jobRole: '',
    technology: '',
    experienceLevel: '',
    difficulty: 'intermediate',
    totalQuestions: 10,
    interviewType: 'technical'
  });

  const updateConfig = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));

  const steps = [
    { title: 'Job Role', description: 'Select your target role' },
    { title: 'Technology', description: 'Choose your tech stack' },
    { title: 'Experience', description: 'Your experience level' },
    { title: 'Difficulty', description: 'Interview difficulty' },
    { title: 'Settings', description: 'Type & question count' },
  ];

  const canProceed = () => {
    if (step === 0) return config.jobRole;
    if (step === 1) return config.technology;
    if (step === 2) return config.experienceLevel;
    if (step === 3) return config.difficulty;
    return true;
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const data = await api.interview.create(config);
      toast.success('Interview created!');
      navigate(`/interview/${data.interview._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-white">Setup Your Interview</h1>
        <p className="text-dark-400 mt-2">Configure your personalized AI interview session</p>
      </div>

      <div className="flex items-center justify-between mb-8 px-4">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all ${
              i < step ? 'bg-primary-600 text-white' : i === step ? 'bg-gradient-to-br from-primary-500 to-purple-600 text-white scale-110' : 'bg-dark-800 text-dark-500'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`hidden sm:block w-12 lg:w-20 h-0.5 mx-1 ${i < step ? 'bg-primary-600' : 'bg-dark-800'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-8 animate-slide-up" key={step}>
        <h2 className="text-xl font-bold text-white mb-2">{steps[step].title}</h2>
        <p className="text-dark-400 text-sm mb-6">{steps[step].description}</p>

        {step === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ROLES.map(role => (
              <button
                key={role}
                onClick={() => { updateConfig('jobRole', role); updateConfig('technology', ''); }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  config.jobRole === role
                    ? 'border-primary-500 bg-primary-500/10 text-white'
                    : 'border-dark-700 bg-dark-800/50 text-dark-300 hover:border-dark-500 hover:text-white'
                }`}
              >
                <span className="text-sm font-medium">{role}</span>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(TECHNOLOGIES[config.jobRole] || []).map(tech => (
              <button
                key={tech}
                onClick={() => updateConfig('technology', tech)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  config.technology === tech
                    ? 'border-primary-500 bg-primary-500/10 text-white'
                    : 'border-dark-700 bg-dark-800/50 text-dark-300 hover:border-dark-500 hover:text-white'
                }`}
              >
                <span className="text-sm font-medium">{tech}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            {EXPERIENCE_LEVELS.map(level => (
              <button
                key={level.value}
                onClick={() => updateConfig('experienceLevel', level.value)}
                className={`w-full p-5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  config.experienceLevel === level.value
                    ? 'border-primary-500 bg-primary-500/10 text-white'
                    : 'border-dark-700 bg-dark-800/50 text-dark-300 hover:border-dark-500 hover:text-white'
                }`}
              >
                <div>
                  <span className="font-medium">{level.label}</span>
                  <p className="text-sm text-dark-400 mt-0.5">{level.desc}</p>
                </div>
                {config.experienceLevel === level.value && (
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                )}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            {DIFFICULTY_LEVELS.map(level => (
              <button
                key={level.value}
                onClick={() => updateConfig('difficulty', level.value)}
                className={`w-full p-5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  config.difficulty === level.value
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-dark-700 bg-dark-800/50 hover:border-dark-500'
                }`}
              >
                <div>
                  <span className={`font-medium ${config.difficulty === level.value ? 'text-white' : 'text-dark-300'}`}>{level.label}</span>
                  <p className="text-sm text-dark-400 mt-0.5">{level.desc}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${level.color}`}>{level.label}</span>
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-3">Interview Type</label>
              <div className="grid grid-cols-2 gap-3">
                {INTERVIEW_TYPES.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => updateConfig('interviewType', type.value)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        config.interviewType === type.value
                          ? 'border-primary-500 bg-primary-500/10 text-white'
                          : 'border-dark-700 bg-dark-800/50 text-dark-300 hover:border-dark-500'
                      }`}
                    >
                      <Icon size={20} className={config.interviewType === type.value ? 'text-primary-400' : 'text-dark-500'} />
                      <p className="font-medium mt-2">{type.label}</p>
                      <p className="text-xs text-dark-400 mt-1">{type.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-3">
                Number of Questions: <span className="text-primary-400 font-bold">{config.totalQuestions}</span>
              </label>
              <input
                type="range"
                min={1}
                max={30}
                value={config.totalQuestions}
                onChange={e => updateConfig('totalQuestions', parseInt(e.target.value))}
                className="w-full h-2 bg-dark-800 rounded-full appearance-none cursor-pointer accent-primary-500"
              />
              <div className="flex justify-between text-xs text-dark-500 mt-1">
                <span>1</span>
                <span>15</span>
                <span>30</span>
              </div>
            </div>

            <div className="glass-light rounded-xl p-5 mt-4">
              <h3 className="text-sm font-semibold text-white mb-3">Interview Summary</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-dark-400">Role: <span className="text-white">{config.jobRole}</span></div>
                <div className="text-dark-400">Tech: <span className="text-white">{config.technology}</span></div>
                <div className="text-dark-400">Level: <span className="text-white">{config.experienceLevel}</span></div>
                <div className="text-dark-400">Difficulty: <span className="text-white capitalize">{config.difficulty}</span></div>
                <div className="text-dark-400">Type: <span className="text-white capitalize">{config.interviewType}</span></div>
                <div className="text-dark-400">Questions: <span className="text-white">{config.totalQuestions}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : null}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
            step > 0 ? 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700' : 'invisible'
          }`}
        >
          Back
        </button>
        <button
          onClick={() => step < 4 ? setStep(step + 1) : handleStart()}
          disabled={!canProceed() || loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:from-primary-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : step === 4 ? 'Start Interview' : 'Next'}
          {step < 4 && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
}
