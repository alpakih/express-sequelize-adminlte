const model = require('../models')

exports.findByUsername = (req, res) => {
  console.log(req.body.description)
  model.users.find({
    where: {
      username: req.body.username
    }
  })
    .then((user) => res.send('SUCCESS', user))
    .catch((error) => res.status(400).send(error))
}
