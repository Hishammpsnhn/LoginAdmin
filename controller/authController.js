const credential = {
    userName: 'Hisham',
    email: 'hisham@gmail.com',
    password: '123'
}


// @desc    login user credentials
// @route   POST /route/login
export const login = (req, res) => {
    const { email, password } = req.body
    if (email === credential.email && password === credential.password) {
        req.session.email = email;
        req.session.password = password;
        req.session.Username = credential.userName
        res.redirect('/')
    } else {
        req.session.passwordWrong = true
        res.redirect('/auth')
    }
}
// @desc    signUp user credentials
// @route   POST /route/signup
export const signUp = (req, res) => {
    const { email, password,name } = req.body
    console.log(name,email,password)
    // if (email === credential.email && password === credential.password) {
    //     req.session.email = email;
    //     req.session.password = password;
    //     req.session.Username = credential.userName
    //     res.redirect('/')
    // } else {
    //     req.session.passwordWrong = true
    //     res.redirect('/auth')
    // }
}


// @desc    logout user credentials
// @route   GET /route/logout
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/')
        }
        // Clear the session cookie
        res.clearCookie('connect.sid');
        res.redirect('/login');
    })
}