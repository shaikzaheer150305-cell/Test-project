const { GoogleGenerativeAI } = require('@google/generative-ai');
const questionBank = require('./questionBank');

class AIService {
  constructor() {
    this.useAI = false;
    this.model = null;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.length > 10) {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        this.useAI = true;
        console.log('Gemini AI enabled - questions will be AI-generated');
      } catch (err) {
        console.warn('Gemini AI initialization failed, using question bank:', err.message);
      }
    } else {
      console.log('No valid Gemini API key found - using question bank for questions and evaluation');
    }
  }

  async generateQuestion(config, previousQuestions = [], performanceHistory = []) {
    if (this.useAI) {
      try {
        return await this._generateWithAI(config, previousQuestions, performanceHistory);
      } catch (error) {
        console.warn('AI generation failed, falling back to question bank:', error.message);
        return questionBank.getQuestion(config, previousQuestions);
      }
    }
    return questionBank.getQuestion(config, previousQuestions);
  }

  async _generateWithAI(config, previousQuestions, performanceHistory) {
    const { jobRole, technology, experienceLevel, difficulty, interviewType, totalQuestions } = config;
    const questionNumber = previousQuestions.length + 1;

    let performanceContext = '';
    if (performanceHistory.length > 0) {
      const avgScore = performanceHistory.reduce((a, b) => a + b, 0) / performanceHistory.length;
      performanceContext = `
CANDIDATE PERFORMANCE SO FAR:
- Average score: ${avgScore.toFixed(1)}/10
- Questions answered: ${performanceHistory.length}/${totalQuestions}
- Trend: ${avgScore >= 7 ? 'Strong performer - can handle harder questions' : avgScore >= 5 ? 'Average performer - maintain current difficulty' : 'Struggling - consider easier questions'}
`;
    }

    const prompt = `You are an expert technical interviewer for a ${jobRole} position specializing in ${technology}.

INTERVIEW CONFIGURATION:
- Job Role: ${jobRole}
- Technology/Domain: ${technology}
- Experience Level: ${experienceLevel}
- Difficulty Level: ${difficulty}
- Interview Type: ${interviewType}
- Question ${questionNumber} of ${totalQuestions}
${performanceContext}

PREVIOUS QUESTIONS ASKED (DO NOT REPEAT):
${previousQuestions.length > 0 ? previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n') : 'None yet'}

Generate ONE interview question that:
1. Is relevant to ${technology} for a ${jobRole} role
2. Matches the ${difficulty} difficulty level
3. Is appropriate for ${experienceLevel} experience
4. Has NOT been asked before
5. Is ${interviewType === 'technical' ? 'technical in nature' : interviewType === 'hr' ? 'behavioral/HR focused' : interviewType === 'behavioral' ? 'behavioral/situational' : 'a mix of technical and behavioral'}
${performanceHistory.length > 0 && avgScore < 5 ? '6. Since the candidate is struggling, make the question more accessible' : ''}
${performanceHistory.length > 0 && avgScore >= 8 ? '6. Since the candidate is performing well, make the question more challenging' : ''}

Respond in this EXACT JSON format only (no markdown, no code blocks):
{
  "question": "Your question text here",
  "topic": "The specific topic/subtopic this covers",
  "expectedKeyPoints": ["key point 1", "key point 2", "key point 3"],
  "difficulty": "beginner/intermediate/advanced"
}`;

    const result = await this.model.generateContent(prompt);
    const response = result.response.text();
    return this.parseJSON(response);
  }

  async evaluateAnswer(question, answer, config, expectedKeyPoints = []) {
    if (this.useAI) {
      try {
        return await this._evaluateWithAI(question, answer, config, expectedKeyPoints);
      } catch (error) {
        console.warn('AI evaluation failed, using question bank evaluation:', error.message);
        return questionBank.evaluateAnswer(question, answer, config);
      }
    }
    return questionBank.evaluateAnswer(question, answer, config);
  }

  async _evaluateWithAI(question, answer, config, expectedKeyPoints) {
    const prompt = `You are an expert interviewer evaluating a candidate's answer.

INTERVIEW CONTEXT:
- Job Role: ${config.jobRole}
- Technology: ${config.technology}
- Difficulty: ${config.difficulty}

QUESTION ASKED: ${question}

CANDIDATE'S ANSWER: ${answer}

EXPECTED KEY POINTS (if any): ${expectedKeyPoints.length > 0 ? expectedKeyPoints.join(', ') : 'Not specified'}

Evaluate the answer on these criteria (each scored 0-10):

1. **Technical Accuracy**: Is the answer technically correct?
2. **Depth**: Does it show deep understanding or just surface-level knowledge?
3. **Communication**: Is the answer well-structured and clearly explained?
4. **Completeness**: Does it cover all important aspects of the question?

Also provide:
- Overall score (weighted average)
- Specific strengths (2-3 points)
- Areas for improvement (2-3 points)
- Detailed feedback (2-3 sentences)

Respond in this EXACT JSON format only (no markdown, no code blocks):
{
  "overallScore": 7,
  "technicalAccuracy": 8,
  "depth": 6,
  "communication": 7,
  "completeness": 7,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "feedback": "Detailed feedback text here"
}`;

    const result = await this.model.generateContent(prompt);
    const response = result.response.text();
    return this.parseJSON(response);
  }

  async generateFinalReport(interviewData) {
    if (this.useAI) {
      try {
        return await this._generateReportWithAI(interviewData);
      } catch (error) {
        console.warn('AI report generation failed, using question bank report:', error.message);
        return questionBank.generateReport(interviewData.config, interviewData.answers);
      }
    }
    return questionBank.generateReport(interviewData.config, interviewData.answers);
  }

  async _generateReportWithAI(interviewData) {
    const { config, answers } = interviewData;

    const qaSummary = answers.map((a, i) => `
Question ${i + 1}: ${a.questionText}
Answer: ${a.answerText}
Score: ${a.evaluation?.overallScore || 'N/A'}/10
Topic: ${a.topic || 'N/A'}
Difficulty: ${a.difficulty || 'N/A'}
`).join('\n---\n');

    const prompt = `You are a senior technical interviewer generating a comprehensive interview report.

INTERVIEW CONFIGURATION:
- Job Role: ${config.jobRole}
- Technology: ${config.technology}
- Experience Level: ${config.experienceLevel}
- Interview Type: ${config.interviewType}
- Total Questions: ${config.totalQuestions}
- Difficulty Level: ${config.difficulty}

INTERVIEW TRANSCRIPT:
${qaSummary}

Based on ALL the above Q&A sessions, generate a comprehensive interview report.

Analyze:
1. Overall technical competency
2. Communication skills throughout
3. Problem-solving approach
4. Confidence level (based on answer quality and depth)
5. Key strengths demonstrated
6. Critical areas needing improvement
7. Topics the candidate should study more
8. Whether you would recommend hiring (strong_yes, yes, maybe, no, strong_no)

Respond in this EXACT JSON format only (no markdown, no code blocks):
{
  "overallScore": 7.5,
  "technicalScore": 8,
  "communicationScore": 7,
  "problemSolvingScore": 7,
  "confidenceLevel": 7,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "recommendedTopics": ["topic 1", "topic 2", "topic 3"],
  "summary": "A comprehensive 3-4 sentence summary of the candidate's overall performance...",
  "hiringRecommendation": "yes"
}`;

    const result = await this.model.generateContent(prompt);
    const response = result.response.text();
    return this.parseJSON(response);
  }

  parseJSON(text) {
    let cleaned = text.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    try {
      return JSON.parse(cleaned);
    } catch {
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse AI response as JSON');
    }
  }
}

module.exports = new AIService();
