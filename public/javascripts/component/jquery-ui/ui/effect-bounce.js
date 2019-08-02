/*!
 * jQuery UI Effects Bounce 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/bounce-effect/
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
  return $.effects.effect.bounce = function (o, done) {
    var el = $(this)

    var props = [ 'position', 'top', 'bottom', 'left', 'right', 'height', 'width' ]

    // defaults:

    var mode = $.effects.setMode(el, o.mode || 'effect')

    var hide = mode === 'hide'

    var show = mode === 'show'

    var direction = o.direction || 'up'

    var distance = o.distance

    var times = o.times || 5

    // number of internal animations

    var anims = times * 2 + (show || hide ? 1 : 0)

    var speed = o.duration / anims

    var easing = o.easing

    // utility:

    var ref = (direction === 'up' || direction === 'down') ? 'top' : 'left'

    var motion = (direction === 'up' || direction === 'left')

    var i

    var upAnim

    var downAnim

    // we will need to re-assemble the queue to stack our animations in place

    var queue = el.queue()

    var queuelen = queue.length

    // Avoid touching opacity to prevent clearType and PNG issues in IE
    if (show || hide) {
      props.push('opacity')
    }

    $.effects.save(el, props)
    el.show()
    $.effects.createWrapper(el) // Create Wrapper

    // default distance for the BIGGEST bounce is the outer Distance / 3
    if (!distance) {
      distance = el[ ref === 'top' ? 'outerHeight' : 'outerWidth' ]() / 3
    }

    if (show) {
      downAnim = { opacity: 1 }
      downAnim[ ref ] = 0

      // if we are showing, force opacity 0 and set the initial position
      // then do the "first" animation
      el.css('opacity', 0)
        .css(ref, motion ? -distance * 2 : distance * 2)
        .animate(downAnim, speed, easing)
    }

    // start at the smallest distance if we are hiding
    if (hide) {
      distance = distance / Math.pow(2, times - 1)
    }

    downAnim = {}
    downAnim[ ref ] = 0
    // Bounces up/down/left/right then back to 0 -- times * 2 animations happen here
    for (i = 0; i < times; i++) {
      upAnim = {}
      upAnim[ ref ] = (motion ? '-=' : '+=') + distance

      el.animate(upAnim, speed, easing)
        .animate(downAnim, speed, easing)

      distance = hide ? distance * 2 : distance / 2
    }

    // Last Bounce when Hiding
    if (hide) {
      upAnim = { opacity: 0 }
      upAnim[ ref ] = (motion ? '-=' : '+=') + distance

      el.animate(upAnim, speed, easing)
    }

    el.queue(function () {
      if (hide) {
        el.hide()
      }
      $.effects.restore(el, props)
      $.effects.removeWrapper(el)
      done()
    })

    // inject all the animations we just queued to be first in line (after "inprogress")
    if (queuelen > 1) {
      queue.splice.apply(queue,
        [ 1, 0 ].concat(queue.splice(queuelen, anims + 1)))
    }
    el.dequeue()
  }
}))
