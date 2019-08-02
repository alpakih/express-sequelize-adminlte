function UTCDate () {
  return new Date(Date.UTC.apply(Date, arguments))
}

function format_date (date) {
  var y = date.getUTCFullYear()

  var m = date.getUTCMonth() + 1

  var d = date.getUTCDate()

  var h = date.getUTCHours()

  var i = date.getUTCMinutes()

  var s = date.getUTCSeconds()

  var l = date.getUTCMilliseconds()
  function z (i) { return (i <= 9 ? '0' + i : i) }
  return y + '-' + z(m) + '-' + z(d) + ' ' + z(h) + ':' + z(i) + ':' + z(s) + '.' + z(l)
}

function datesEqual (actual, expected, message) {
  QUnit.push(QUnit.equiv(actual, expected), format_date(actual), format_date(expected), message)
}
