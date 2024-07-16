function checkAuth(req, res, next) {
    if (req.session.email) {
        next();
    } else {
        req.session.passwordWrong = false
        res.redirect('/signup');
    }
}

function checkNotAuth(req, res, next) {
    if (req.session.email) {
        res.redirect('/');
        req.session.passwordWrong = false
    } else {
        next();
    }
}


export  {checkAuth, checkNotAuth};
