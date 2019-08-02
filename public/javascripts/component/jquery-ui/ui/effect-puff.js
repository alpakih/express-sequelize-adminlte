/*!
 * jQuery UI Effects Puff 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/puff-effect/
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([
      'jquery',
      './effect',
      './effect-scale'
    ], factory)
  } else {
    // Browser globals
    factory(jQuery)
  }
}(function ($) {
  return $.effects.effect.puff = function (o, done) {
    var elem = $(this)

    var mode = $.effects.setMode(elem, o.mode || 'hide')

    var hide = mode === 'hide'

    var percent = parseInt(o.percent, 10) || 150

    var factor = percent / 100

    var original = {
      height: elem.height(),
      width: elem.width(),
      outerHeight: elem.outerHeight(),
      outerWidth: elem.outerWidth()
    }

    $.extend(o, {
      effect: 'scale',
      queue: false,
      fade: true,
      mode: mode,
      complete: done,
      percent: hide ? percent : 100,
      from: hide
        ? original
        : {
          height: original.height * factor,
          width: original.width * factor,
          outerHeight: original.outerHeight * factor,
          outerWidth: original.outerWidth * factor
        }
    })

    elem.effect(o)
  }
}))
