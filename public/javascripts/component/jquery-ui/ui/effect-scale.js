/*!
 * jQuery UI Effects Scale 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/scale-effect/
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([
      'jquery',
      './effect',
      './effect-size'
    ], factory)
  } else {
    // Browser globals
    factory(jQuery)
  }
}(function ($) {
  return $.effects.effect.scale = function (o, done) {
    // Create element
    var el = $(this)

    var options = $.extend(true, {}, o)

    var mode = $.effects.setMode(el, o.mode || 'effect')

    var percent = parseInt(o.percent, 10) ||
			(parseInt(o.percent, 10) === 0 ? 0 : (mode === 'hide' ? 0 : 100))

    var direction = o.direction || 'both'

    var origin = o.origin

    var original = {
      height: el.height(),
      width: el.width(),
      outerHeight: el.outerHeight(),
      outerWidth: el.outerWidth()
    }

    var factor = {
      y: direction !== 'horizontal' ? (percent / 100) : 1,
      x: direction !== 'vertical' ? (percent / 100) : 1
    }

    // We are going to pass this effect to the size effect:
    options.effect = 'size'
    options.queue = false
    options.complete = done

    // Set default origin and restore for show/hide
    if (mode !== 'effect') {
      options.origin = origin || [ 'middle', 'center' ]
      options.restore = true
    }

    options.from = o.from || (mode === 'show' ? {
      height: 0,
      width: 0,
      outerHeight: 0,
      outerWidth: 0
    } : original)
    options.to = {
      height: original.height * factor.y,
      width: original.width * factor.x,
      outerHeight: original.outerHeight * factor.y,
      outerWidth: original.outerWidth * factor.x
    }

    // Fade option to support puff
    if (options.fade) {
      if (mode === 'show') {
        options.from.opacity = 0
        options.to.opacity = 1
      }
      if (mode === 'hide') {
        options.from.opacity = 1
        options.to.opacity = 0
      }
    }

    // Animate
    el.effect(options)
  }
}))
