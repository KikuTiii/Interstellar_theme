process.env.AMBIENTE_PROCESSO = "desenvolvimento";
// process.env.AMBIENTE_PROCESSO = "producao";

require('dotenv').config();
const express = require("express");
const passport = require('passport');
const Githubstrategy = require('passport-github').Strategy;
const ExpressSession = require('express-session');
const cors = require("cors");
const path = require("path");
const PORTA = process.env.AMBIENTE_PROCESSO == "desenvolvimento" ? 3333 : 8080;

const app = express();

const indexRouter = require("./src/routes/index");
const usuarioRouter = require("./src/routes/usuarios");
const authRouter = require("./src/routes/auth");
const quizRouter = require("./src/routes/quiz");
const feedbackRouter = require("./src/routes/feedback");
const rankRouter = require("./src/routes/rank");

// Configurando o middleware express.static

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));
app.use(cors());
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
    cb(null, id);
});
passport.use(
    new Githubstrategy(
        {
            clientID: GITHUB_ID,
            clientSecret: GITHUB_SECRET,
            callbackURL: GITHUB_CALLBACK,
        },
        function(accessToken, refreshToken, profile, cb) {
            cb(null, profile);
        }
    )
);

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/auth", authRouter);
app.use("/quiz", quizRouter);
app.use("/feedback", feedbackRouter);
app.use("/rank", rankRouter);

app.listen(PORTA, function () {
    console.log(`Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar: http://localhost:${PORTA} \n
    Você está rodando sua aplicação em Ambiente de ${process.env.AMBIENTE_PROCESSO} \n
    \t\tSe "desenvolvimento", você está se conectando ao banco LOCAL (MySQL Workbench). \n
    \t\tSe "producao", você está se conectando ao banco REMOTO (SQL Server em nuvem Azure) \n
    \t\t\t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'`);
});
