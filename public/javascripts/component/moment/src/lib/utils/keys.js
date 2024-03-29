import hasOwnProp from './has-own-prop'

var keys

if (Object.keys) {
  keys = Object.keys
} else {
  keys = function (obj) {
    var i; var res = []
    for (i in obj) {
      if (hasOwnProp(obj, i)) {
        res.push(i)
      }
    }
    return res
  }
}

export { keys as default }
