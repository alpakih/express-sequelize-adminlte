const db = require('../models')

exports.index = (req, res, next) => {
  res.render('pages/role/index', {
    title: 'Index',
    features: 'Role ',
    judul: 'Input Roles',
    breadcrumb: { url: 'Config', view: 'Roles' }
  })
}

exports.form = (req, res, next) => {
  res.render('pages/role/roles_create', {
    title: 'Form',
    features: 'Create role',
    judul: 'Input Roles',
    breadcrumb: { url: 'Config', view: 'Roles' }
  })
}
