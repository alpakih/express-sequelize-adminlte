// global.__base = __dirname + '/';
/**
 * Module Requirement
 *
 */
var createError = require('http-errors')
var express = require('express')
var session = require('express-session')
var passport = require('passport')
var path = require('path')
var cookieParser = require('cookie-parser')
var pg = require('pg')
var pgSession = require('connect-pg-simple')(session)
var logger = require('morgan')
var exphbs = require('express-handlebars')
var flash = require('express-flash')
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
var methodOverride = require('method-override')
/**
 * Instance Express
 *
 */
var app = express()

/**
 * Include config
 */
const config = require('./config/index')

/**
 * Include model
 */
var models = require('./models')

/**
 * Sync Database
 */
models.sequelize.sync().then(function () {
  console.log('Nice! Database looks fine')
}).catch(function (err) {
  console.log(err, 'Something went wrong with the Database Update!')
})

/**
 * Include Routes
 */
var indexRouter = require('./routes/index')
var rolesRouter = require('./routes/roles')
var userRouter = require('./routes/users')
var permissionRouter = require('./routes/permission')

/**
 * Set engine setup
 */
app.set('views/pages', path.join(__dirname, 'views'))

/**
 * Setting handlebars template
 * @type {ExpressHandlebars|*}
 */
// app.set('view engine', 'ejs');
var hbs = exphbs.create({
  defaultLayout: 'main',

  // Uses multiple partials dirs, templates in "shared/templates/" are shared
  // with the client-side of the app (see below).
  partialsDir: [
    'views/partials/'
  ],
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {}
      this._sections[name] = options.fn(this)
      return null
    }
  }
})

/**
 *  Register `hbs` as our view engine using its bound `engine()` function.
 */
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

/**
 * Set express use the module
 */
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser('secret'))

app.use(methodOverride('_method'))
app.use(function (req, res, next) {
  // this middleware will call for each requested
  // and we checked for the requested query properties
  // if _method was existed
  // then we know, clients need to call DELETE request instead
  if (req.query._method === 'DELETE') {
    // change the original METHOD
    // into DELETE method
    req.method = 'DELETE'
    // and set requested url to /user/12
    req.url = req.path
  }
  next()
})
/**
 * Setting session and save to DB
 */
var pgPool = new pg.Pool({
  database: 'node_postgres',
  user: 'postgres',
  password: 'postgres',
  port: 5432
})

/**
 * EXPRESS set session
 */
app.use(session({
  store: new pgSession({
    pool: pgPool,
    tableName: 'session' // Use another table-name than the default "session" one

  }),
  secret: config.session_secret,
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  saveUninitialized: false

}))

/**
 * Passport initialized
 */
app.use(passport.initialize())
app.use(passport.session())

/**
 * Use flash
 */

app.use(flash())

/**
 * Load passport
 */
require('./config/passport.js')(passport, models.users)
require('./routes/login')(app, passport)

/**
 * Config path
 */
app.use(express.static(path.join(__dirname, 'public')))

/**
 * Set express use router
 */
app.use('/', ensureLoggedIn, indexRouter)
app.use('/users', ensureLoggedIn, userRouter)
app.use('/roles', ensureLoggedIn, rolesRouter)
app.use('/permissions', ensureLoggedIn, permissionRouter)

/**
 *  catch 404 and forward to error handler
 */
app.use(function (req, res, next) {
  next(createError(404))
})

/**
 *  error handler
 */
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
