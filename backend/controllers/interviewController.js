const Interview = require('../models/Interview');
const aiService = require('../services/aiService');

exports.createInterview = async (req, res) => {
  try {
    const { jobRole, technology, experienceLevel, difficulty, totalQuestions, interviewType } = req.body;

    const interview = await Interview.create({
      user: req.user._id,
      config: { jobRole, technology, experienceLevel, difficulty, totalQuestions, interviewType },
      adaptiveDifficulty: { currentLevel: difficulty, performanceTrend: 'stable' }
    });

    res.status(201).json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFirstQuestion = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const questionData = await aiService.generateQuestion(
      { ...interview.config, difficulty: interview.adaptiveDifficulty.currentLevel },
      [],
      []
    );

    const questionId = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.json({
      success: true,
      question: {
        id: questionId,
        text: questionData.question,
        topic: questionData.topic,
        difficulty: questionData.difficulty,
        expectedKeyPoints: questionData.expectedKeyPoints || [],
        questionNumber: 1,
        totalQuestions: interview.config.totalQuestions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { questionId, questionText, answerText, inputMethod, timeSpent, topic, difficulty, expectedKeyPoints } = req.body;

    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const evaluation = await aiService.evaluateAnswer(questionText, answerText, interview.config, expectedKeyPoints || []);

    interview.answers.push({
      questionId,
      questionText,
      answerText,
      inputMethod: inputMethod || 'text',
      evaluation: {
        score: evaluation.overallScore,
        technicalAccuracy: evaluation.technicalAccuracy,
        depth: evaluation.depth,
        communication: evaluation.communication,
        completeness: evaluation.completeness,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements
      },
      timeSpent: timeSpent || 0,
      difficulty: difficulty || interview.adaptiveDifficulty.currentLevel,
      topic: topic || '',
      answeredAt: new Date()
    });

    interview.currentQuestionIndex += 1;

    const scores = interview.answers.map(a => a.evaluation.score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    if (avgScore >= 7.5) {
      interview.adaptiveDifficulty.performanceTrend = 'improving';
      if (interview.adaptiveDifficulty.currentLevel === 'beginner') {
        interview.adaptiveDifficulty.currentLevel = 'intermediate';
      } else if (interview.adaptiveDifficulty.currentLevel === 'intermediate') {
        interview.adaptiveDifficulty.currentLevel = 'advanced';
      }
    } else if (avgScore < 5) {
      interview.adaptiveDifficulty.performanceTrend = 'declining';
      if (interview.adaptiveDifficulty.currentLevel === 'advanced') {
        interview.adaptiveDifficulty.currentLevel = 'intermediate';
      } else if (interview.adaptiveDifficulty.currentLevel === 'intermediate') {
        interview.adaptiveDifficulty.currentLevel = 'beginner';
      }
    }

    await interview.save();

    const isComplete = interview.currentQuestionIndex >= interview.config.totalQuestions;
    let nextQuestion = null;

    if (!isComplete) {
      const previousQuestionTexts = interview.answers.map(a => a.questionText);
      const performanceHistory = interview.answers.map(a => a.evaluation.score);

      const questionData = await aiService.generateQuestion(
        { ...interview.config, difficulty: interview.adaptiveDifficulty.currentLevel },
        previousQuestionTexts,
        performanceHistory
      );

      const questionId = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      nextQuestion = {
        id: questionId,
        text: questionData.question,
        topic: questionData.topic,
        difficulty: questionData.difficulty,
        questionNumber: interview.currentQuestionIndex + 1,
        totalQuestions: interview.config.totalQuestions
      };
    }

    res.json({
      success: true,
      evaluation: {
        score: evaluation.overallScore,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        breakdown: {
          technicalAccuracy: evaluation.technicalAccuracy,
          depth: evaluation.depth,
          communication: evaluation.communication,
          completeness: evaluation.completeness
        }
      },
      nextQuestion,
      isComplete,
      progress: {
        answered: interview.currentQuestionIndex,
        total: interview.config.totalQuestions,
        percentage: Math.round((interview.currentQuestionIndex / interview.config.totalQuestions) * 100)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.completeInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    if (interview.answers.length === 0) {
      return res.status(400).json({ success: false, message: 'No answers to evaluate' });
    }

    const report = await aiService.generateFinalReport({
      config: interview.config,
      answers: interview.answers
    });

    interview.report = report;
    interview.status = 'completed';
    interview.completedAt = new Date();
    interview.totalTime = Math.round((new Date() - interview.startedAt) / 1000);
    await interview.save();

    res.json({ success: true, report, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }
    res.json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('config status report overallScore startedAt completedAt totalTime');
    res.json({ success: true, interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
