import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Award, TrendingUp, Target, Brain, MessageSquare, BookOpen, FileText, Home, ChevronRight, CheckCircle, AlertTriangle, Star } from 'lucide-react';

export default function InterviewResult() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.reports.getOne(id)
      .then(data => { setReport(data.report); setInterview(data.interview); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-dark-400">Generating your report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle size={48} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Report Not Found</h2>
          <Link to="/dashboard" className="text-primary-400 hover:text-primary-300">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const radarData = [
    { subject: 'Technical', score: report.technicalScore },
    { subject: 'Communication', score: report.communicationScore },
    { subject: 'Problem Solving', score: report.problemSolvingScore },
    { subject: 'Confidence', score: report.confidenceLevel },
    { subject: 'Overall', score: report.overallScore },
  ];

  const recommendationMap = {
    strong_yes: { label: 'Strongly Recommended', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: Star },
    yes: { label: 'Recommended', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
    maybe: { label: 'Needs Improvement', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: AlertTriangle },
    no: { label: 'Not Recommended', color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: Target },
    strong_no: { label: 'Strongly Not Recommended', color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: Target },
  };

  const rec = recommendationMap[report.hiringRecommendation] || recommendationMap.maybe;
  const RecIcon = rec.icon;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-dark-400 mb-6">
        <Link to="/dashboard" className="hover:text-white"><Home size={14} /></Link>
        <ChevronRight size={14} />
        <span className="text-white">Interview Report</span>
      </div>

      <div className="text-center mb-8 animate-fade-in">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Award size={36} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">Interview Complete!</h1>
        <p className="text-dark-400 mt-2">Here's your comprehensive performance report</p>
      </div>

      <div className="glass rounded-2xl p-8 mb-6 animate-slide-up">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="text-center">
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold ${
              report.overallScore >= 7 ? 'bg-emerald-500/20 text-emerald-400' :
              report.overallScore >= 5 ? 'bg-amber-500/20 text-amber-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {report.overallScore}
            </div>
            <p className="text-dark-400 text-sm mt-2">Overall Score</p>
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Technical', score: report.technicalScore, icon: Brain },
              { label: 'Communication', score: report.communicationScore, icon: MessageSquare },
              { label: 'Problem Solving', score: report.problemSolvingScore, icon: Target },
              { label: 'Confidence', score: report.confidenceLevel, icon: TrendingUp },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-dark-800/50 rounded-xl p-4 text-center">
                  <Icon size={18} className="text-primary-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-white">{item.score}</p>
                  <p className="text-xs text-dark-400">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-dark-700/50">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium ${rec.color}`}>
            <RecIcon size={16} />
            {rec.label}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-2xl p-6 animate-slide-up">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Brain size={18} className="text-primary-400" />
            Performance Radar
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
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
          <div className="space-y-3">
            {report.strengths?.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-400 text-xs font-bold">✓</span>
                </div>
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
          <div className="space-y-3">
            {report.improvements?.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-400 text-xs font-bold">→</span>
                </div>
                <span className="text-dark-200 text-sm">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-primary-400" />
          Recommended Topics to Study
        </h3>
        <div className="flex flex-wrap gap-2">
          {report.recommendedTopics?.map((topic, i) => (
            <span key={i} className="px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-xl text-primary-300 text-sm font-medium">
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/dashboard"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-dark-800 text-dark-300 font-medium rounded-xl hover:text-white hover:bg-dark-700 transition-all"
        >
          <Home size={16} />
          Back to Dashboard
        </Link>
        <Link
          to={`/reports/${id}`}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:from-primary-500 hover:to-purple-500 transition-all"
        >
          <FileText size={16} />
          View Full Report
        </Link>
      </div>
    </div>
  );
}
