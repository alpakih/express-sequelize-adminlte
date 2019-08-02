const express = require('express')
const router = express.Router()
const model = require('../models')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('pages/role/index', {
    title: 'Index',
    features: 'Role ',
    judul: 'Input Roles',
    breadcrumb: { url: 'Config', view: 'Roles' }
  })
})
router.get('/create', function (req, res, next) {
  res.render('pages/role/roles_create', {
    title: 'Form',
    features: 'Create role',
    judul: 'Input Roles',
    breadcrumb: { url: 'Config', view: 'Roles' }
  })
})
router.post('/create', function (req, res, next) {
  console.log(req.body)

  model.roles.create({
    description: req.body.description,
    name: req.body.name
  })
    .then(newRole => {
      req.flash('success', 'Berhasi tambah data')
      res.redirect('/roles')
    })
    .catch(err => {
      req.flash('error', err)
      res.render('pages/role/roles_create')
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

  model.roles.count()
    .then(result => {
      console.log(result)
      recordsTotal = result
    })
    .catch(err => {
      console.log(err)
    })

  model.roles.findAll({
    limit: length,
    offset: start
  })
    .then(roleData => {
      res.send(JSON.stringify({
        'draw': parseInt(req.query.draw),
        'recordsFiltered': recordsTotal,
        'recordsTotal': recordsTotal,
        'data': roleData
      }))
    })
})

router.delete('/delete/:id', function (req, res, next) {
  var id = req.params.id

  model.roles.destroy({
    where: {
      id: id
    }
  })
    .then(roles => {
      if (roles === 1) {
        console.log('Deleted success')
      }
      req.flash('success', 'Data has been deleted')
      res.redirect('/roles')
    })
    .catch(err => {
      req.flash('error', err)
      console.log(err)
    })
})

router.get('/update/:id', function (req, res, next) {
  var id = req.params.id
  model.roles.find({
    where: {
      id: id
    }
  })
    .then(data => {
      console.log(data)

      res.render('pages/role/roles_edit', {
        title: 'Update',
        features: 'Update role',
        judul: 'Update Roles',
        breadcrumb: { url: 'Config', view: 'Roles' },
        roles: data
      })
    })
    .catch(err => {
      req.flash('error', err)
    })
})

router.put('/update/:id', function (req, res, next) {
  var id = req.params.id
  model.roles.update({
    description: req.body.description,
    name: req.body.name,
    updated_at: Date.now()
  },
  {
    where: {
      id: id
    }
  })
    .then(data => {
      console.log(data)

      req.flash('success', 'Data has been update')
      res.redirect('/roles')
    })
    .catch(err => {
      req.flash('error', err)
    })
})

router.get('/select2', function (req, res, next) {
  var param = req.query.q
  console.log('kesinisssss' + param)
  model.roles.find({
    where: {
      description: {
        $ilike: param
      }
    }
  })
    .then(datas => {
      console.log(datas.description)
      res.send(JSON.stringify({
        'results': datas.description
      }))
      console.log('Datasssss ' + datas)
    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = router
