const express = require ("express")
const passport = require ("passport")
const router = express.Router()

router.get('/', function (req, res)  {
    res.sendFile(path.join(__dirname, 'site', 'public', 'login.html'));
});

// Rota de logout
router.get('/logout', (req, res) => {
    // Adicionando uma função de retorno de chamada
    req.logout((err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/login.html');
    });
});

// AUTH
router.get('/github', passport.authenticate('github'));

router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        console.log('Autenticação bem-sucedida:', req.user);
        res.redirect('/quiz.html');
    }
);

module.exports = router