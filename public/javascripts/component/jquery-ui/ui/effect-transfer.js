/*!
 * jQuery UI Effects Transfer 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/transfer-effect/
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([
      'jquery',
      './effect'
    ], factory)
  } else {
    // Browser globals
    factory(jQuery)
  }
}(function ($) {
  return $.effects.effect.transfer = function (o, done) {
    var elem = $(this)

    var target = $(o.to)

    var targetFixed = target.css('position') === 'fixed'

    var body = $('body')

    var fixTop = targetFixed ? body.scrollTop() : 0

    var fixLeft = targetFixed ? body.scrollLeft() : 0

    var endPosition = target.offset()

    var animation = {
      top: endPosition.top - fixTop,
      left: endPosition.left - fixLeft,
      height: target.innerHeight(),
      width: target.innerWidth()
    }

    var startPosition = elem.offset()

    var transfer = $("<div class='ui-effects-transfer'></div>")
      .appendTo(document.body)
      .addClass(o.className)
      .css({
        top: startPosition.top - fixTop,
        left: startPosition.left - fixLeft,
        height: elem.innerHeight(),
        width: elem.innerWidth(),
        position: targetFixed ? 'fixed' : 'absolute'
      })
      .animate(animation, o.duration, o.easing, function () {
        transfer.remove()
        done()
      })
  }
}))
