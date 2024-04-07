var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Quiz = require('../model/quize.js');

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/quizapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));
// Seed the database with sample questions
const seedQuestions = async () => {
  try {
    await Quiz.deleteMany({});

    const questions = [
      {
        question: 'What is the capital of France?',
        options: ['London', 'Paris', 'Berlin', 'Rome'],
        correctAnswer: 'Paris',
      },
      {
        question: 'What is the powerhouse of the cell?',
        options: ['Nucleus', 'Cell Wall', 'Mitochondria', 'Chloroplast'],
        correctAnswer: 'Mitochondria',
      },
      {
        question: "Who wrote 'To Kill a Mockingbird'?",
        options: ['Harper Lee', 'Mark Twain', 'J.K. Rowling', 'Stephen King'],
        correctAnswer: 'Harper Lee',
      },
      {
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 'Mars',
      },
      {
        question: 'What is the chemical symbol for water?',
        options: ['O', 'H2O', 'WA', 'H'],
        correctAnswer: 'H2O',
      },
      {
        question: 'Who painted the Mona Lisa?',
        options: [
          'Leonardo da Vinci',
          'Pablo Picasso',
          'Vincent van Gogh',
          'Michelangelo',
        ],
        correctAnswer: 'Leonardo da Vinci',
      },
      {
        question: 'Which country won the FIFA World Cup in 2018?',
        options: ['Germany', 'Brazil', 'France', 'Argentina'],
        correctAnswer: 'France',
      },
      {
        question: 'What is the tallest mammal in the world?',
        options: ['Elephant', 'Giraffe', 'Horse', 'Whale'],
        correctAnswer: 'Giraffe',
      },
      {
        question: 'Who is credited with inventing the World Wide Web?',
        options: [
          'Steve Jobs',
          'Bill Gates',
          'Tim Berners-Lee',
          'Mark Zuckerberg',
        ],
        correctAnswer: 'Tim Berners-Lee',
      },
      {
        question: 'What is the chemical symbol for gold?',
        options: ['Au', 'Go', 'Gd', 'Ag'],
        correctAnswer: 'Au',
      },
    ];

    await Quiz.insertMany(questions);
  } catch (err) {
    console.error(err);
  }
};

seedQuestions();
// Serve the quiz questions
router.get('/', async (req, res) => {
  try {
    const questions = await Quiz.find();
    res.render('index', { questions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Submit answers and calculate scores
router.post('/submit', async (req, res) => {
  try {
    const submittedAnswers = req.body;
    const questions = await Quiz.find();

    let score = 0;
    let feedback = [];

    questions.forEach((question, index) => {
      if (question.correctAnswer === submittedAnswers[`answer${index}`]) {
        score++;
        feedback.push({ correct: true, answer: question.correctAnswer });
      } else {
        feedback.push({ correct: false, answer: question.correctAnswer });
      }
    });

    res.render('result', { score, feedback });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
