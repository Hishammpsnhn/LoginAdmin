function checkAuth(req, res, next) {
  if (req.session.email) {
    next();
  } else {
    req.session.passwordWrong = false;
    res.redirect("/signup");
  }
}

function checkNotAuth(req, res, next) {
  if (req.session.email) {
    res.redirect("/");
    req.session.passwordWrong = false;
  } else {
    next();
  }
}
function checkAdmin(req, res, next) {
  if (req.session.email && req.session.isAdmin) {
    req.session.passwordWrong = false;
    next();
  } else {
    res.redirect("/login");
  }
}
function errorMsg(req, res, msg, redirect = "/login") {
    console.log(redirect)
  req.session.passwordWrong = true;
  req.session.errMessage = msg;
  res.redirect(redirect);
  
}

function sessionStore(req, res, user) {
  req.session.email = user.email;
  req.session.password = user.password;
  req.session.Username = user.userName;
}

export { checkAuth, checkNotAuth, errorMsg, sessionStore,checkAdmin };
