const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  answerText: { type: String, required: true },
  inputMethod: { type: String, enum: ['text', 'voice'], default: 'text' },
  evaluation: {
    score: { type: Number, min: 0, max: 10 },
    technicalAccuracy: { type: Number, min: 0, max: 10 },
    depth: { type: Number, min: 0, max: 10 },
    communication: { type: Number, min: 0, max: 10 },
    completeness: { type: Number, min: 0, max: 10 },
    feedback: { type: String },
    strengths: [String],
    improvements: [String]
  },
  timeSpent: { type: Number, default: 0 },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  topic: { type: String },
  askedAt: { type: Date, default: Date.now },
  answeredAt: { type: Date }
});

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  config: {
    jobRole: { type: String, required: true },
    technology: { type: String, required: true },
    experienceLevel: { type: String, enum: ['fresher', '1-3years', 'experienced'], required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    totalQuestions: { type: Number, required: true, min: 1, max: 50 },
    interviewType: { type: String, enum: ['technical', 'hr', 'behavioral', 'mixed'], required: true }
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'cancelled'],
    default: 'in_progress'
  },
  currentQuestionIndex: { type: Number, default: 0 },
  answers: [answerSchema],
  adaptiveDifficulty: {
    currentLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    performanceTrend: { type: String, enum: ['improving', 'stable', 'declining'], default: 'stable' }
  },
  report: {
    overallScore: { type: Number, min: 0, max: 10 },
    technicalScore: { type: Number, min: 0, max: 10 },
    communicationScore: { type: Number, min: 0, max: 10 },
    problemSolvingScore: { type: Number, min: 0, max: 10 },
    confidenceLevel: { type: Number, min: 0, max: 10 },
    strengths: [String],
    improvements: [String],
    recommendedTopics: [String],
    summary: { type: String },
    hiringRecommendation: { type: String, enum: ['strong_yes', 'yes', 'maybe', 'no', 'strong_no'] }
  },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  totalTime: { type: Number, default: 0 }
});

interviewSchema.index({ user: 1, createdAt: -1 });
interviewSchema.index({ status: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
