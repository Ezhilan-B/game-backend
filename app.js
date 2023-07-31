// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const round1QA = require('./models/round1/Round1QA');
const round1User = require('./models/round1/Round1User')

const app = express();
const port = process.env.PORT || 5000; // You can change this to any port you prefer

app.use(express.json());
app.use(cors());

// Replace 'your_mongodb_url' with your actual MongoDB connection string
const mongoUrl = 'mongodb+srv://jeeva:Jeeva1234@cluster0.5o5ajqi.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(bodyParser.json());

// API to add a new question and answer for 1st round
app.post('/api/round1addquestions', async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newQA = new round1QA({ question, answer });
    const savedQA = await newQA.save();
    res.json(savedQA);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add the question and answer.' });
  }
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Shuffle the 'answer' keys for every 5 values
function shuffleAnswers(response) {
  for (let i = 0; i < response.length; i += 5) {
    const currentFiveAnswers = response.slice(i, i + 5).map(item => item.answer);
    const shuffledAnswers = shuffleArray(currentFiveAnswers);
    for (let j = 0; j < 5; j++) {
      response[i + j].answer = shuffledAnswers[j];
    }
  }
}

// API to get all questions and answers 
app.get('/api/round1qa', async (req, res) => {
  try {
    let allRound1QA = await round1QA.find();
    
    // allRound1QA = shuffleArray(allRound1QA);

  // Shuffle the 'answer' keys for every 5 values
    shuffleAnswers(allRound1QA);
    
    res.json(allRound1QA);

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questions and answers for Round 1.' });
  }
});

// API to get all users and scores
app.get('/api/round1users', async (req, res) => {
  try {
    const allUsers = await round1User.find();
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users and scores.' });
  }
});


// API to compare answers and update the user's score
// app.post('/api/round1compareanswers', async (req, res) => {
//  try {

//     const{username,answers} = req.body;

//     // let allRound1QA = await round1QA.find();

//     let score = 0;

// for(let answer of answers){
//       let matchedQA = round1QA.findOne({_id : answer.id}).select('answer').then((foundDoc)=>{

        
//           // console.log(foundDoc.answer);
//           // console.log(item.answer);

//           if(matchedQA && answer.answer.replace('"'," ").trim()===foundDoc['answer']){

//             console.log("in answer")
//             score = score +1 ;
//             console.log(score);

//           }

//     })
//   }

//     res.json({"score":score})
    
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch questions and answers for Round 1.' });
//   }
// });

app.post('/api/round1compareanswers', async (req, res) => {
  try {
    const { username, answers } = req.body;

    // Fetch all questions from the database
    const allQuestions = await round1QA.find();
    
    // Calculate the score by comparing user-submitted answers with the correct answers
    let score = 0;
    answers.forEach((userAnswer) => {
      const question = allQuestions.find((q) => q.id === userAnswer.id);
      if (question && question.answer === userAnswer.answer) {
        score++;
      }
    });

     // Create a new user document with username, answers, and score
     const newUser = new round1User({
      username,
      score,
    });

    // Save the user document to the database
    await newUser.save();

    res.json({ "score" : score });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error calculating the score.' });
  }
});
 



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



