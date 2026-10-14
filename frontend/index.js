//express app that serves html files
var express = require('express');
var app = express();
var path = require('path');
var port = 5070;

var getapival = '/api';
var saveapival = '/submit'
app.set('view engine', 'ejs');
//let URL = 'http://localhost:5000';//URL of the backend server. This is used to make API calls from the frontend to the backend. It is used to fetch data from the backend server and display it on the frontend. You can change this URL to point to your backend server if it is running on a different host or port.
//Change this to env Variable cheaking in real time
let URL = process.env.BACKEND_URL || 'http://localhost:5000';
var SAVE_URL = URL + saveapival
let API_URL = URL + getapival;//Full URL of the backend server's API endpoint. This is used to make API calls from the frontend to the backend. It is used to fetch data from the backend server and display it on the frontend. You can change this URL to point to your backend server if it is running on a different host or port.
//Used to make API calls from the frontend to the backend. It is used to fetch data from the backend 
// server and display it on the frontend. You can change this URL to point to your backend server if 
// it is running on a different host or port.
const fetch = (...args) => 
    import('node-fetch').then(({default: fetch}) => fetch(...args));

// app.use(express.static(path.join(__dirname, 'public')));
//Use a middleware to serve form data to  the body parser. This is used to parse the form data sent from the frontend to the backend. It is used to extract the form data from the request body and make it available in req.body. You can change this middleware to use a different body parser if you want to use a different format for the form data.
//Extended :true makes use of qs library to parse the form data.(parse the querystrings) and 
// nested complex obbjects ,which default parser can not do
// for the form data.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));



// 2. Define a route to fetch data from the backend API and render it in the view.ejs template

app.get('/view',async function(req,res){
    const options = {
        method: 'GET'
    };
    
    fetch(API_URL, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error('error:' + err));
    try {
        let response = await fetch(API_URL, options);
        let data = JSON.stringify(await response.json());
        data = JSON.parse(data);
        //console.log(data);
        res.render('view', {data});
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.post('/submit', async (req, res) => {
    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    };
  try {
        // 1. Get the data coming from your frontend form
        const formData = req.body;
        // 2. Forward it to the Flask backend
        const response = await fetch(SAVE_URL, options);
        // 3. Get the response back from Flask
        const data = await response.json();
        console.log(data);
        // 4. Send response back to your frontend
        res.status(200).json({ message: data.message ,  data:data.data });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).send('Error submitting form');
    }
  //res.send(req.body);
});

// show the form
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});
app.listen(port,'0.0.0.0', function() {
    console.log(`Server is running on http://localhost:${port}`);
});