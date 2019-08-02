const express = require('express')
const router = express.Router()
const model = require('../models')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('pages/users/index', {
    title: 'Index',
    features: 'Users ',
    judul: 'List Users',
    breadcrumb: { url: 'Config', view: 'Users' }
  })
})

router.get('/create', function (req, res, next) {
  res.render('pages/users/users_create', {
    title: 'Form',
    features: 'Create Users',
    judul: 'Input Users',
    breadcrumb: { url: 'Config', view: 'Users' }
  })
})

/**
 * METHOD for datatables
 */
router.get('/list', function (req, res, next) {
  console.log(req.query)
  let recordsTotal = 0
  let start = req.query.start
  let length = req.query.length

  model.users.count()
    .then(result => {
      console.log(result)
      recordsTotal = result
    })
    .catch(err => {
      console.log(err)
    })

  model.users.findAll({
    include: [{
      model: model.roles
    }],
    limit: length,
    offset: start
  })
    .then(userData => {
      res.send(JSON.stringify({
        'draw': parseInt(req.query.draw),
        'recordsFiltered': recordsTotal,
        'recordsTotal': recordsTotal,
        'data': userData
      }))
    })
})

module.exports = router
