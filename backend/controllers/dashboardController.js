const Interview = require('../models/Interview');

exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalInterviews = await Interview.countDocuments({ user: userId, status: 'completed' });
    const allCompleted = await Interview.find({ user: userId, status: 'completed' }).sort({ completedAt: -1 });

    if (totalInterviews === 0) {
      return res.json({
        success: true,
        stats: {
          totalInterviews: 0,
          averageScore: 0,
          latestScore: 0,
          bestScore: 0,
          averageTechnical: 0,
          averageCommunication: 0,
          averageProblemSolving: 0,
          recentTrend: [],
          technologyBreakdown: [],
          difficultyBreakdown: [],
          improvementOverTime: [],
          topStrengths: [],
          topImprovements: []
        }
      });
    }

    const scores = allCompleted.map(i => i.report?.overallScore || 0);
    const technicalScores = allCompleted.map(i => i.report?.technicalScore || 0);
    const commScores = allCompleted.map(i => i.report?.communicationScore || 0);
    const problemScores = allCompleted.map(i => i.report?.problemSolvingScore || 0);

    const avg = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 0;

    const recentTrend = allCompleted.slice(0, 10).reverse().map(i => ({
      date: i.completedAt,
      score: i.report?.overallScore || 0,
      technology: i.config?.technology
    }));

    const techMap = {};
    allCompleted.forEach(i => {
      const tech = i.config?.technology || 'Unknown';
      if (!techMap[tech]) techMap[tech] = { count: 0, totalScore: 0 };
      techMap[tech].count++;
      techMap[tech].totalScore += i.report?.overallScore || 0;
    });
    const technologyBreakdown = Object.entries(techMap).map(([name, data]) => ({
      name,
      count: data.count,
      avgScore: (data.totalScore / data.count).toFixed(1)
    }));

    const diffMap = {};
    allCompleted.forEach(i => {
      const diff = i.config?.difficulty || 'Unknown';
      if (!diffMap[diff]) diffMap[diff] = 0;
      diffMap[diff]++;
    });
    const difficultyBreakdown = Object.entries(diffMap).map(([name, count]) => ({ name, count }));

    const strengthCounts = {};
    const improvementCounts = {};
    allCompleted.forEach(i => {
      (i.report?.strengths || []).forEach(s => {
        strengthCounts[s] = (strengthCounts[s] || 0) + 1;
      });
      (i.report?.improvements || []).forEach(s => {
        improvementCounts[s] = (improvementCounts[s] || 0) + 1;
      });
    });
    const topStrengths = Object.entries(strengthCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([topic, count]) => ({ topic, count }));
    const topImprovements = Object.entries(improvementCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([topic, count]) => ({ topic, count }));

    res.json({
      success: true,
      stats: {
        totalInterviews,
        averageScore: parseFloat(avg(scores)),
        latestScore: scores[0] || 0,
        bestScore: Math.max(...scores),
        averageTechnical: parseFloat(avg(technicalScores)),
        averageCommunication: parseFloat(avg(commScores)),
        averageProblemSolving: parseFloat(avg(problemScores)),
        recentTrend,
        technologyBreakdown,
        difficultyBreakdown,
        improvementOverTime: allCompleted.slice(0, 20).reverse().map(i => ({
          date: i.completedAt,
          score: i.report?.overallScore || 0
        })),
        topStrengths,
        topImprovements
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
