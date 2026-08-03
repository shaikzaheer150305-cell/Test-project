import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ChevronRight, Home, Award, Brain, MessageSquare, Target, BookOpen, CheckCircle, AlertTriangle, Clock, FileText } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export default function ReportDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.reports.getOne(id)
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data?.report) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle size={48} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Report Not Found</h2>
          <Link to="/reports" className="text-primary-400 hover:text-primary-300">Back to Reports</Link>
        </div>
      </div>
    );
  }

  const { report, interview } = data;
  const radarData = [
    { subject: 'Technical', score: report.technicalScore },
    { subject: 'Communication', score: report.communicationScore },
    { subject: 'Problem Solving', score: report.problemSolvingScore },
    { subject: 'Confidence', score: report.confidenceLevel },
    { subject: 'Overall', score: report.overallScore },
  ];

  const formatTime = (s) => { const m = Math.floor(s / 60); return `${m}m ${s % 60}s`; };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-dark-400 mb-6">
        <Link to="/dashboard" className="hover:text-white"><Home size={14} /></Link>
        <ChevronRight size={14} />
        <Link to="/reports" className="hover:text-white">Reports</Link>
        <ChevronRight size={14} />
        <span className="text-white">Detail</span>
      </div>

      <div className="glass rounded-2xl p-8 mb-6 animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="text-center lg:text-left">
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold mx-auto lg:mx-0 ${
              report.overallScore >= 7 ? 'bg-emerald-500/20 text-emerald-400' :
              report.overallScore >= 5 ? 'bg-amber-500/20 text-amber-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {report.overallScore}
            </div>
            <p className="text-dark-400 text-sm mt-2">Overall Score</p>
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Technical', score: report.technicalScore, icon: Brain, color: 'text-blue-400' },
              { label: 'Communication', score: report.communicationScore, icon: MessageSquare, color: 'text-purple-400' },
              { label: 'Problem Solving', score: report.problemSolvingScore, icon: Target, color: 'text-emerald-400' },
              { label: 'Confidence', score: report.confidenceLevel, icon: Award, color: 'text-amber-400' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-dark-800/50 rounded-xl p-4 text-center">
                  <Icon size={18} className={`${item.color} mx-auto mb-1`} />
                  <p className="text-xl font-bold text-white">{item.score}</p>
                  <p className="text-xs text-dark-400">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-dark-700/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-dark-400">Role:</span>
            <span className="text-white ml-2">{interview.config?.jobRole}</span>
          </div>
          <div>
            <span className="text-dark-400">Technology:</span>
            <span className="text-white ml-2">{interview.config?.technology}</span>
          </div>
          <div>
            <span className="text-dark-400">Difficulty:</span>
            <span className="text-white ml-2 capitalize">{interview.config?.difficulty}</span>
          </div>
          <div>
            <span className="text-dark-400">Duration:</span>
            <span className="text-white ml-2">{formatTime(interview.totalTime || 0)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Brain size={18} className="text-primary-400" />
            Performance Radar
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText size={18} className="text-purple-400" />
            Summary
          </h3>
          <p className="text-dark-300 leading-relaxed">{report.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-400" />
            Strengths
          </h3>
          <div className="space-y-2">
            {report.strengths?.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <span className="text-emerald-400 mt-0.5 text-sm">✓</span>
                <span className="text-dark-200 text-sm">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target size={18} className="text-amber-400" />
            Areas for Improvement
          </h3>
          <div className="space-y-2">
            {report.improvements?.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <span className="text-amber-400 mt-0.5 text-sm">→</span>
                <span className="text-dark-200 text-sm">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-primary-400" />
          Recommended Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {report.recommendedTopics?.map((topic, i) => (
            <span key={i} className="px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-xl text-primary-300 text-sm font-medium">
              {topic}
            </span>
          ))}
        </div>
      </div>

      {interview.answers?.length > 0 && (
        <div className="glass rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Question-by-Question Review</h3>
          <div className="space-y-4">
            {interview.answers.map((a, i) => (
              <div key={i} className="bg-dark-800/50 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="text-sm font-medium text-white">Q{i + 1}: {a.questionText}</h4>
                  <span className={`text-sm font-bold flex-shrink-0 ${
                    a.evaluation?.score >= 7 ? 'text-emerald-400' :
                    a.evaluation?.score >= 5 ? 'text-amber-400' :
                    'text-red-400'
                  }`}>
                    {a.evaluation?.score}/10
                  </span>
                </div>
                <p className="text-sm text-dark-400 mb-2 line-clamp-2">A: {a.answerText}</p>
                {a.evaluation?.feedback && (
                  <p className="text-xs text-dark-500 italic">{a.evaluation.feedback}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <Link
          to="/reports"
          className="flex items-center gap-2 px-6 py-3 bg-dark-800 text-dark-300 font-medium rounded-xl hover:text-white hover:bg-dark-700 transition-all"
        >
          ← Back to Reports
        </Link>
      </div>
    </div>
  );
}
