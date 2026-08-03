const router = require('express').Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createInterview, getFirstQuestion, submitAnswer,
  completeInterview, getInterview, getInterviewHistory
} = require('../controllers/interviewController');

router.use(protect);

router.post('/', [
  body('jobRole').notEmpty().withMessage('Job role is required'),
  body('technology').notEmpty().withMessage('Technology is required'),
  body('experienceLevel').isIn(['fresher', '1-3years', 'experienced']).withMessage('Valid experience level required'),
  body('difficulty').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Valid difficulty level required'),
  body('totalQuestions').isInt({ min: 1, max: 50 }).withMessage('Total questions must be between 1 and 50'),
  body('interviewType').isIn(['technical', 'hr', 'behavioral', 'mixed']).withMessage('Valid interview type required')
], validate, createInterview);

router.get('/history', getInterviewHistory);
router.get('/:id', getInterview);
router.get('/:id/question', getFirstQuestion);
router.post('/:id/answer', submitAnswer);
router.post('/:id/complete', completeInterview);

module.exports = router;
