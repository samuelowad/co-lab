var express = require('express');
var router = express.Router();
const passport = require('passport')

router.get('/login', (req, res, next) => {
    res.render('login', {
        title: 'Login'
    })
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login'
}), (req, res) => {
    // console.log(res)
    res.redirect('/')
})

router.get('/register', (req, res, next) => {
    res.render('register', {
        title: 'register a new account'
    })
})

// router.post('/login',(req,res,next)=>{
//     res.render('login',{
//       title:'Login'
//     })
// })
router.post('/register', (req, res, next) => {

    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.save(err => {
        console.log(err)
        if (err) {
            res.render('register', {
                errorMessage: err
            });
        } else {
            res.redirect('/login');
        }
    })

})
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;