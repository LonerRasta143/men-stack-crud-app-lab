const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const path = require('path');
const Dog = require('./models/dog');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.redirect('/dogs');
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});
mongoose.connection.on('error', (err) => {
    console.log('Error connecting to MongoDB:', err);
});


app.get('/dogs', async (req, res) => {
    try {
        const allDogs = await Dog.find({});
        res.render('dogs/index.ejs', { dogs: allDogs });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

app.get('/dogs/new', (req, res) => {
   try {
       res.render('dogs/new.ejs');
   } catch (err) {
       console.log(err);
       res.redirect('/dogs');
   }
});

app.post('/dogs', async (req, res) => {
    try {
        if (req.body.isVaccinated === 'on') {
            req.body.isVaccinated = true;
        } else {
            req.body.isVaccinated = false;
        }
        await Dog.create(req.body);
        res.redirect('/dogs');
    } catch (err) {
        console.log(err);
        res.redirect('/dogs');
    }
});

app.get('/dogs/:id', async (req, res) => {
    try {
        const foundDog = await Dog.findById(req.params.id);
        if (!foundDog) {
            return res.redirect('/dogs');
        }
        res.render('dogs/show.ejs', { dog: foundDog });
    } catch (err) {
        console.log(err);
        res.redirect('/dogs');
    }
});

app.delete('/dogs/:id', async (req, res) => {
    try {
        await Dog.findByIdAndDelete(req.params.id);
        res.redirect('/dogs');
    } catch (err) {
        console.log(err);
        res.redirect('/dogs');
    }
});

app.get('/dogs/:id/edit', async (req, res) => {
    try {
        const foundDog = await Dog.findById(req.params.id);
        res.render('dogs/edit.ejs', { dog: foundDog });
    } catch (err) {
        console.log(err);
        res.redirect('/dogs');
    }
});

app.put('/dogs/:id', async (req, res) => {
    try {
        req.body.isVaccinated = req.body.isVaccinated === 'on';
        const updatedDog = await Dog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDog) {
            return res.redirect('/dogs');
        }
        res.redirect(`/dogs/${updatedDog._id}`);
    } catch (err) {
        console.log(err);
        res.redirect('/dogs');
    }
});


