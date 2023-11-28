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
const avisosRouter = require("./src/routes/avisos");
const medidasRouter = require("./src/routes/medidas");
const aquariosRouter = require("./src/routes/aquarios");
const empresasRouter = require("./src/routes/empresas");
const authRouter = require("./src/routes/auth");

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

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/avisos", avisosRouter);
app.use("/medidas", medidasRouter);
app.use("/aquarios", aquariosRouter);
app.use("/empresas", empresasRouter);
app.use("/auth", authRouter);



app.listen(PORTA, function () {
    console.log(`Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar: http://localhost:${PORTA} \n
    Você está rodando sua aplicação em Ambiente de ${process.env.AMBIENTE_PROCESSO} \n
    \t\tSe "desenvolvimento", você está se conectando ao banco LOCAL (MySQL Workbench). \n
    \t\tSe "producao", você está se conectando ao banco REMOTO (SQL Server em nuvem Azure) \n
    \t\t\t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'`);
});
