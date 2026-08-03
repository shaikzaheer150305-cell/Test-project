import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FileText, Clock, Award, ChevronRight, Home, Filter } from 'lucide-react';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.reports.getAll()
      .then(data => setReports(data.reports))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatTime = (s) => { const m = Math.floor(s / 60); return `${m}m ${s % 60}s`; };

  const filteredReports = reports.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'high') return r.report?.overallScore >= 7;
    if (filter === 'mid') return r.report?.overallScore >= 4 && r.report?.overallScore < 7;
    if (filter === 'low') return r.report?.overallScore < 4;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-dark-400 mb-4">
        <Link to="/dashboard" className="hover:text-white"><Home size={14} /></Link>
        <ChevronRight size={14} />
        <span className="text-white">Reports</span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white">Interview Reports</h1>
          <p className="text-dark-400 mt-1">{reports.length} completed interview{reports.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Filter size={14} className="text-dark-500" />
          {['all', 'high', 'mid', 'low'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f ? 'bg-primary-600/20 text-primary-400' : 'text-dark-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : f === 'high' ? 'High (7+)' : f === 'mid' ? 'Mid (4-7)' : 'Low (<4)'}
            </button>
          ))}
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <FileText size={40} className="text-dark-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Reports Found</h2>
          <p className="text-dark-400 mb-6">
            {reports.length === 0 ? 'Complete your first interview to see reports here.' : 'No reports match the current filter.'}
          </p>
          {reports.length === 0 && (
            <Link to="/setup" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl">
              Start Interview
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((r, i) => (
            <Link
              key={r._id}
              to={`/reports/${r._id}`}
              className="block glass rounded-xl p-5 hover:border-primary-500/30 transition-all animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0 ${
                  r.report?.overallScore >= 7 ? 'bg-emerald-500/20 text-emerald-400' :
                  r.report?.overallScore >= 5 ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {r.report?.overallScore || 'N/A'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-semibold">{r.config?.jobRole}</h3>
                    <span className="text-dark-600">·</span>
                    <span className="text-primary-400 text-sm">{r.config?.technology}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      r.config?.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-400' :
                      r.config?.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {r.config?.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-dark-400">
                    <span className="flex items-center gap-1"><Clock size={12} /> {formatTime(r.totalTime || 0)}</span>
                    <span>{r.config?.totalQuestions} questions</span>
                    <span>{formatDate(r.completedAt || r.startedAt)}</span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-dark-400 text-xs">Tech</p>
                    <p className="text-white font-medium">{r.report?.technicalScore || '-'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-dark-400 text-xs">Comm</p>
                    <p className="text-white font-medium">{r.report?.communicationScore || '-'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-dark-400 text-xs">PS</p>
                    <p className="text-white font-medium">{r.report?.problemSolvingScore || '-'}</p>
                  </div>
                </div>

                <ChevronRight size={18} className="text-dark-500" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
