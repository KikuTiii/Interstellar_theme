require('dotenv').config();
const express = require('express');
const passport = require('passport');
const Githubstrategy = require('passport-github').Strategy;
const ExpressSession = require('express-session');
const path = require('path');
const { profile } = require('console');

const app = express();

// Configurando o middleware express.static
app.use(express.static(path.join(__dirname, 'site', 'public')));

app.use(
    ExpressSession({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    // Aqui, você pode recuperar o usuário do banco de dados usando o ID, se necessário.
    // Por exemplo, se estiver usando um banco de dados MongoDB:
    // User.findById(id, function(err, user) {
    //     cb(err, user);
    // });
    cb(null, id);
});
passport.use(
    new Githubstrategy(
        {
            clientID: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            callbackURL: 'http://localhost:3333/auth/github/callback',
        },
        function(accessToken, refreshToken, profile, cb) {
            cb(null, profile);
        }
    )
);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'site', 'public', 'login.html'));
});

// Rota de logout
app.get('/logout', (req, res) => {
    // Adicionando uma função de retorno de chamada
    req.logout((err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/login.html');
    });
});

// AUTH
app.get('/auth/github', passport.authenticate('github'));

app.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        console.log('Autenticação bem-sucedida:', req.user);
        res.redirect('/site/public/quiz.html');
    }
);

app.listen(3333, () => console.log('O servidor está rodando na porta 3333 meu pit'));