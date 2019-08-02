const bCrypt = require('bcrypt-nodejs')

module.exports = function (passport, user) {
  console.log('PASSSSPORT USER ' + user)

  let User = user
  let LocalStrategy = require('passport-local').Strategy

  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id).then(function (user) {
      if (user) {
        done(null, user.get())
      } else {
        done(user.errors, null)
      }
    })
  })

  // LOCAL SIGNIN
  passport.use('local-signin', new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },

    function (req, email, password, done) {
      let isValidPassword = function (userpass, password) {
        return bCrypt.compareSync(password, userpass)
      }

      user.findOne({
        where: {
          email: email
        }
      }).then(function (user) {
        if (!user) {
          console.log('Data not found')
          return done(null, false, {
            message: 'Data not found'
          })
        }

        if (!isValidPassword(user.password, password)) {
          console.log('Incorrect pass')
          return done(null, false, {
            message: 'Incorrect password.'
          })
        }

        let userinfo = user.get()
        console.log('User info ' + userinfo.username + userinfo.email)
        return done(null, userinfo, {
          message: 'Selamat datang ' + userinfo.username
        })
      }).catch(function (err) {
        console.log('Error:', err)
        return done(null, false, {
          message: 'Something went wrong with your Signin'
        })
      })
    }
  ))
}
