const express = require('express')
const router = express.Router()

const model = require('../models')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('pages/permission/index',
    {
      title: 'Permission',
      features: 'Create permission',
      judul: 'Input permission',
      breadcrumb: {
        url: 'Config', view: 'Permission'
      }
    })
})
router.get('/create', function (req, res, next) {
  res.render('pages/permission/permissions_create', {
    title: 'Form',
    features: 'Create Permissions',
    judul: 'Input Permissions',
    breadcrumb: { url: 'Config', view: 'Permissions' }
  })
})

router.post('/create', function (req, res, next) {
  console.log(req.body)

  model.permissions.create({
    label: req.body.label,
    value: req.body.value
  })
    .then(newRole => {
      req.flash('success', 'Berhasi tambah data ' + newRole.value)
      res.redirect('/permissions')
    })
    .catch(err => {
      req.flash('error', err)
      res.render('pages/permissions/permissions_create')
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

  model.permissions.count()
    .then(result => {
      console.log(result)
      recordsTotal = result
    })
    .catch(err => {
      console.log(err)
    })

  model.permissions.findAll({
    limit: length,
    offset: start
  })
    .then(permissionsData => {
      res.send(JSON.stringify({
        'draw': parseInt(req.query.draw),
        'recordsFiltered': recordsTotal,
        'recordsTotal': recordsTotal,
        'data': permissionsData
      }))
    })
})

router.delete('/delete/:id', function (req, res, next) {
  var id = req.params.id

  model.permissions.destroy({
    where: {
      id: id
    }
  })
    .then(permissions => {
      if (permissions === 1) {
        console.log('Deleted success')
      }
      req.flash('success', 'Data has been deleted')
      res.redirect('/permissions')
    })
    .catch(err => {
      req.flash('error', err)
      console.log(err)
    })
})

router.get('/update/:id', function (req, res, next) {
  var id = req.params.id
  model.permissions.find({
    where: {
      id: id
    }
  })
    .then(data => {
      console.log(data)

      res.render('pages/permission/permissions_edit', {
        title: 'Update',
        features: 'Update Permissions',
        judul: 'Update Permissions',
        breadcrumb: { url: 'Config', view: 'Permissions' },
        permissions: data
      })
    })
    .catch(err => {
      req.flash('error', err)
    })
})

router.put('/update/:id', function (req, res, next) {
  var id = req.params.id
  model.permissions.update({
    label: req.body.label,
    value: req.body.value,
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
      res.redirect('/permissions')
    })
    .catch(err => {
      req.flash('error', err)
    })
})
module.exports = router
