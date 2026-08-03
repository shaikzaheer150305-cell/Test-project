import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Mic, MicOff, Send, Clock, ChevronRight, AlertCircle, Volume2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [progress, setProgress] = useState({ answered: 0, total: 0, percentage: 0 });
  const [nextQuestionData, setNextQuestionData] = useState(null);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    loadFirstQuestion();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (!showEvaluation && question) {
      setTimeSpent(0);
      timerRef.current = setInterval(() => setTimeSpent(t => t + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [question, showEvaluation]);

  const loadFirstQuestion = async () => {
    try {
      const data = await api.interview.getFirstQuestion(id);
      setQuestion(data.question);
      setInterview({ _id: id });
      setProgress({ answered: 0, total: data.question.totalQuestions, percentage: 0 });
    } catch (err) {
      setError(err.message || 'Failed to load question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startVoiceInput = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswer(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      if (event.error !== 'no-speech') {
        toast.error('Voice input error. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, []);

  const stopVoiceInput = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    if (isRecording) stopVoiceInput();
    setSubmitting(true);

    try {
      const data = await api.interview.submitAnswer(id, {
        questionId: question.id,
        questionText: question.text,
        answerText: answer.trim(),
        inputMethod: isRecording ? 'voice' : 'text',
        timeSpent,
        topic: question.topic,
        difficulty: question.difficulty,
        expectedKeyPoints: question.expectedKeyPoints || []
      });

      setEvaluation(data.evaluation);
      setProgress(data.progress);
      setShowEvaluation(true);

      if (data.nextQuestion) {
        setNextQuestionData(data.nextQuestion);
      }

      if (data.isComplete) {
        setTimeout(async () => {
          try {
            await api.interview.complete(id);
            navigate(`/interview/${id}/result`);
          } catch (err) {
            toast.error('Error generating report');
            navigate(`/interview/${id}/result`);
          }
        }, 3000);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setAnswer('');
    setEvaluation(null);
    setShowEvaluation(false);
    setNextQuestionData(null);

    if (nextQuestionData) {
      setQuestion(nextQuestionData);
    } else {
      setLoading(true);
      api.interview.getFirstQuestion(id)
        .then(data => {
          setQuestion(data.question);
        })
        .catch(err => {
          toast.error(err.message);
          navigate('/dashboard');
        })
        .finally(() => setLoading(false));
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-dark-400">Generating your question...</p>
        <p className="text-dark-500 text-sm">This may take a moment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Failed to Load Question</h2>
          <p className="text-dark-400 text-sm mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setError(null); setLoading(true); loadFirstQuestion(); }}
              className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-xl hover:from-primary-500 hover:to-purple-500 transition-all"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 bg-dark-800 text-dark-300 font-medium rounded-xl hover:text-white transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="glass rounded-2xl p-6 mb-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-dark-400">
              Question <span className="text-white font-bold">{progress.answered + (showEvaluation ? 0 : 1)}</span> of <span className="text-white font-bold">{progress.total}</span>
            </div>
            <div className="h-4 w-px bg-dark-700" />
            <div className="flex items-center gap-1.5 text-sm text-dark-400">
              <Clock size={14} />
              <span className="font-mono">{formatTime(timeSpent)}</span>
            </div>
            {question?.difficulty && (
              <>
                <div className="h-4 w-px bg-dark-700" />
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  question.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  question.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {question.difficulty}
                </span>
              </>
            )}
          </div>
          <div className="w-32 h-2 bg-dark-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${progress.percentage}%` }} />
          </div>
        </div>
      </div>

      {!showEvaluation ? (
        <div className="animate-slide-up">
          <div className="glass rounded-2xl p-8 mb-6">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">Q</span>
              </div>
              <div>
                {question?.topic && (
                  <span className="text-xs text-primary-400 font-medium">{question.topic}</span>
                )}
                <h2 className="text-xl text-white font-semibold leading-relaxed mt-1">{question?.text}</h2>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 mb-6">
            <label className="block text-sm font-medium text-dark-300 mb-3">Your Answer</label>
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Type your answer here or use voice input..."
              rows={8}
              className="w-full p-4 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={isRecording ? stopVoiceInput : startVoiceInput}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                isRecording
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                  : 'bg-dark-800 text-dark-300 border border-dark-700 hover:text-white hover:border-dark-500'
              }`}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
              {isRecording ? 'Stop Recording' : 'Voice Input'}
            </button>

            <button
              onClick={handleSubmitAnswer}
              disabled={!answer.trim() || submitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:from-primary-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit Answer
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-slide-up">
          <div className="glass rounded-2xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold ${
                evaluation.score >= 7 ? 'bg-emerald-500/20 text-emerald-400' :
                evaluation.score >= 5 ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {evaluation.score}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Evaluation Result</h3>
                <p className="text-dark-400 text-sm">Score out of 10</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Technical', value: evaluation.breakdown.technicalAccuracy },
                { label: 'Depth', value: evaluation.breakdown.depth },
                { label: 'Communication', value: evaluation.breakdown.communication },
                { label: 'Completeness', value: evaluation.breakdown.completeness },
              ].map(item => (
                <div key={item.label} className="bg-dark-800/50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <p className="text-xs text-dark-400 mt-1">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Feedback</h4>
                <p className="text-dark-300 text-sm leading-relaxed">{evaluation.feedback}</p>
              </div>

              {evaluation.strengths?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-emerald-400 mb-2">Strengths</h4>
                  <ul className="space-y-1">
                    {evaluation.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-dark-300 flex items-start gap-2">
                        <span className="text-emerald-400 mt-1">+</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {evaluation.improvements?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-amber-400 mb-2">Areas for Improvement</h4>
                  <ul className="space-y-1">
                    {evaluation.improvements.map((s, i) => (
                      <li key={i} className="text-sm text-dark-300 flex items-start gap-2">
                        <span className="text-amber-400 mt-1">→</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:from-primary-500 hover:to-purple-500 transition-all"
            >
              Next Question
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
