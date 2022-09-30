const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const User = require('./models/user');


// express app
const app = express();

// connect to mongodb
const dbURL = 'mongodb+srv://personal:Kawasaki1234@personal.t3fpx8n.mongodb.net/personal?retryWrites=true&w=majority';
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => app.listen(5005))
.catch((err) => console.log(err))

// view engine
app.set('view engine', 'ejs');

// view engine in different folder

//app.set('views', 'myviews');

// middleware & static files 
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

// routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Start' });
});

app.get('/users', (req, res) => {
    res.redirect('/list');
});

// get data
app.get('/list', (req, res) => {
    User.find().sort({ createdAt: -1 })
    .then((result) => {
        res.render('./users', { title: 'All Users', users: result })
    })
    .catch((err) => {
        console.log(err);
    })
});

// post data
app.post('/users', (req, res) => {
    //console.log(req.body);
    const user = new User(req.body);

    user.save()
    .then((result) => {
        res.redirect('/users');
    })
    .catch((err) => {
        console.log(err);
    });
});

// get single data
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
    .then(result => {
        res.render('details', { user: result, title: 'User Details'})
    })
    .catch(err => {
        console.log(err);
    });
});

// delete data
app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
  
    User.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/users' });
      })
      .catch(err => {
        console.log(err);
      });
  });

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});


