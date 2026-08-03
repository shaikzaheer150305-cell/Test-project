import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Plus, TrendingUp, Award, Target, Brain, MessageSquare, Clock, ChevronRight, Zap } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard.getStats()
      .then(data => setStats(data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Interviews', value: stats.totalInterviews, icon: Target, color: 'from-blue-500 to-blue-600' },
    { label: 'Average Score', value: `${stats.averageScore}/10`, icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    { label: 'Best Score', value: `${stats.bestScore}/10`, icon: Award, color: 'from-amber-500 to-amber-600' },
    { label: 'Latest Score', value: `${stats.latestScore}/10`, icon: Zap, color: 'from-emerald-500 to-emerald-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {user.name?.split(' ')[0]}</h1>
          <p className="text-dark-400 mt-1">Here's your interview performance overview</p>
        </div>
        <Link
          to="/setup"
          className="mt-4 sm:mt-0 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:from-primary-500 hover:to-purple-500 transition-all"
        >
          <Plus size={18} />
          Start Interview
        </Link>
      </div>

      {stats.totalInterviews === 0 ? (
        <div className="glass rounded-2xl p-12 text-center animate-slide-up">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Brain size={40} className="text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No Interviews Yet</h2>
          <p className="text-dark-400 mb-8 max-w-md mx-auto">
            Start your first AI-powered interview to get personalized feedback and track your progress over time.
          </p>
          <Link
            to="/setup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:from-primary-500 hover:to-purple-500 transition-all"
          >
            <Plus size={18} />
            Start Your First Interview
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="glass rounded-xl p-5 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-dark-400 text-sm">{card.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                    </div>
                    <div className={`w-11 h-11 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                      <Icon size={20} className="text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {stats.recentTrend.length > 1 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-primary-400" />
                  Score Trend
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={stats.recentTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString()} stroke="#64748b" fontSize={12} />
                    <YAxis domain={[0, 10]} stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} labelFormatter={d => new Date(d).toLocaleDateString()} />
                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {stats.technologyBreakdown.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Brain size={18} className="text-purple-400" />
                  Technology Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stats.technologyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis domain={[0, 10]} stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                    <Bar dataKey="avgScore" radius={[4, 4, 0, 0]}>
                      {stats.technologyBreakdown.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-emerald-400" />
                Skill Assessment
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Technical', score: stats.averageTechnical, color: 'bg-blue-500' },
                  { label: 'Communication', score: stats.averageCommunication, color: 'bg-purple-500' },
                  { label: 'Problem Solving', score: stats.averageProblemSolving, color: 'bg-emerald-500' },
                ].map(skill => (
                  <div key={skill.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-dark-300">{skill.label}</span>
                      <span className="text-white font-medium">{skill.score}/10</span>
                    </div>
                    <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div className={`h-full ${skill.color} rounded-full transition-all`} style={{ width: `${skill.score * 10}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {stats.topStrengths.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Strengths</h3>
                <div className="space-y-2">
                  {stats.topStrengths.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <Award size={14} className="text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-dark-200 truncate">{s.topic}</span>
                      <span className="ml-auto text-xs text-emerald-400 font-medium">{s.count}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats.topImprovements.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Areas to Improve</h3>
                <div className="space-y-2">
                  {stats.topImprovements.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <Target size={14} className="text-amber-400 flex-shrink-0" />
                      <span className="text-sm text-dark-200 truncate">{s.topic}</span>
                      <span className="ml-auto text-xs text-amber-400 font-medium">{s.count}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
