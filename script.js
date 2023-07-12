if(typeof document !=='undefined'){
    document.getElementById('myForm').addEventListener('submit', submitForm);
}


function submitForm(event) {
  event.preventDefault();

  var formData = new FormData();
  formData.append('name', document.getElementById('name').value);
  formData.append('age', document.getElementById('age').value);
  formData.append('weight', document.getElementById('weight').value);
  formData.append('email', document.getElementById('email').value);
  formData.append('healthReport', document.getElementById('health-report').files[0]);

  fetch('/submit', {
    method: 'POST',
    body: formData
  })
    .then(response => response.text())
    .then(data => {
      console.log(data);
      // Do something with the response data
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/form_data', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a schema for the form data
const formDataSchema = new mongoose.Schema({
  name: String,
  age: Number,
  weight: Number,
  pdf: String,
  email: String
});

// Create a model based on the schema
const FormData = mongoose.model('FormData', formDataSchema);

// Configure multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Create the Express app
const app = express();

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.render('public/index.html')
})
// Define a route to handle the form submission
app.post('/submit', upload.single('file'), (req, res) => {
  // Create a new instance of the FormData model
  const formData = new FormData({
    name: req.body.name,
    age: req.body.age,
    weight: req.body.weight,
    pdf: req?.file?.filename,
    email: req.body.email
  });

  // Save the form data to the database
  formData.save().then(()=>{
    res.send("this data has been saved")
  }).catch(()=>{
    res.status(404).send('data was not saved')
  })
  //    (err) => {
//   if (err) {
//       console.log(err);
//       res.send('Error saving form data.');
//     } else {
//       res.send('Form data saved successfully.');
//     }
//   }
   
  
});

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});