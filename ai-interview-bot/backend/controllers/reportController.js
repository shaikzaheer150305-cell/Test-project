const Interview = require('../models/Interview');

exports.getReport = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'completed'
    });

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, report: interview.report, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Interview.find({ user: req.user._id, status: 'completed' })
      .sort({ completedAt: -1 })
      .select('config report startedAt completedAt totalTime');

    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
