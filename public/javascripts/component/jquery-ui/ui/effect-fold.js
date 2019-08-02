/*!
 * jQuery UI Effects Fold 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/fold-effect/
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
  return $.effects.effect.fold = function (o, done) {
    // Create element
    var el = $(this)

    var props = [ 'position', 'top', 'bottom', 'left', 'right', 'height', 'width' ]

    var mode = $.effects.setMode(el, o.mode || 'hide')

    var show = mode === 'show'

    var hide = mode === 'hide'

    var size = o.size || 15

    var percent = /([0-9]+)%/.exec(size)

    var horizFirst = !!o.horizFirst

    var widthFirst = show !== horizFirst

    var ref = widthFirst ? [ 'width', 'height' ] : [ 'height', 'width' ]

    var duration = o.duration / 2

    var wrapper; var distance

    var animation1 = {}

    var animation2 = {}

    $.effects.save(el, props)
    el.show()

    // Create Wrapper
    wrapper = $.effects.createWrapper(el).css({
      overflow: 'hidden'
    })
    distance = widthFirst
      ? [ wrapper.width(), wrapper.height() ]
      : [ wrapper.height(), wrapper.width() ]

    if (percent) {
      size = parseInt(percent[ 1 ], 10) / 100 * distance[ hide ? 0 : 1 ]
    }
    if (show) {
      wrapper.css(horizFirst ? {
        height: 0,
        width: size
      } : {
        height: size,
        width: 0
      })
    }

    // Animation
    animation1[ ref[ 0 ] ] = show ? distance[ 0 ] : size
    animation2[ ref[ 1 ] ] = show ? distance[ 1 ] : 0

    // Animate
    wrapper
      .animate(animation1, duration, o.easing)
      .animate(animation2, duration, o.easing, function () {
        if (hide) {
          el.hide()
        }
        $.effects.restore(el, props)
        $.effects.removeWrapper(el)
        done()
      })
  }
}))
