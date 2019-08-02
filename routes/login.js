module.exports = function (app, passport) {
  app.get('/login', function (req, res) {
    console.log('LOGIN')
    res.render('login/login', { layout: false })
  })

  app.post('/login', passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true
  }))

  app.get('/logout', function (req, res) {
    req.logout()
    req.session.destroy((err) => {
      if (err) {
        res.send(err)
      } else {
        res.clearCookie('connect.sid')
        res.send('Logout success')
      }
    })
  })
}
