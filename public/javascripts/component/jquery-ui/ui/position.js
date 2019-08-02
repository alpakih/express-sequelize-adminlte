/*!
 * jQuery UI Position 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([ 'jquery' ], factory)
  } else {
    // Browser globals
    factory(jQuery)
  }
}(function ($) {
  (function () {
    $.ui = $.ui || {}

    var cachedScrollbarWidth; var supportsOffsetFractions

    var max = Math.max

    var abs = Math.abs

    var round = Math.round

    var rhorizontal = /left|center|right/

    var rvertical = /top|center|bottom/

    var roffset = /[\+\-]\d+(\.[\d]+)?%?/

    var rposition = /^\w+/

    var rpercent = /%$/

    var _position = $.fn.position

    function getOffsets (offsets, width, height) {
      return [
        parseFloat(offsets[ 0 ]) * (rpercent.test(offsets[ 0 ]) ? width / 100 : 1),
        parseFloat(offsets[ 1 ]) * (rpercent.test(offsets[ 1 ]) ? height / 100 : 1)
      ]
    }

    function parseCss (element, property) {
      return parseInt($.css(element, property), 10) || 0
    }

    function getDimensions (elem) {
      var raw = elem[0]
      if (raw.nodeType === 9) {
        return {
          width: elem.width(),
          height: elem.height(),
          offset: { top: 0, left: 0 }
        }
      }
      if ($.isWindow(raw)) {
        return {
          width: elem.width(),
          height: elem.height(),
          offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
        }
      }
      if (raw.preventDefault) {
        return {
          width: 0,
          height: 0,
          offset: { top: raw.pageY, left: raw.pageX }
        }
      }
      return {
        width: elem.outerWidth(),
        height: elem.outerHeight(),
        offset: elem.offset()
      }
    }

    $.position = {
      scrollbarWidth: function () {
        if (cachedScrollbarWidth !== undefined) {
          return cachedScrollbarWidth
        }
        var w1; var w2

        var div = $("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>")

        var innerDiv = div.children()[0]

        $('body').append(div)
        w1 = innerDiv.offsetWidth
        div.css('overflow', 'scroll')

        w2 = innerDiv.offsetWidth

        if (w1 === w2) {
          w2 = div[0].clientWidth
        }

        div.remove()

        return (cachedScrollbarWidth = w1 - w2)
      },
      getScrollInfo: function (within) {
        var overflowX = within.isWindow || within.isDocument ? ''
          : within.element.css('overflow-x')

        var overflowY = within.isWindow || within.isDocument ? ''
          : within.element.css('overflow-y')

        var hasOverflowX = overflowX === 'scroll' ||
				(overflowX === 'auto' && within.width < within.element[0].scrollWidth)

        var hasOverflowY = overflowY === 'scroll' ||
				(overflowY === 'auto' && within.height < within.element[0].scrollHeight)
        return {
          width: hasOverflowY ? $.position.scrollbarWidth() : 0,
          height: hasOverflowX ? $.position.scrollbarWidth() : 0
        }
      },
      getWithinInfo: function (element) {
        var withinElement = $(element || window)

        var isWindow = $.isWindow(withinElement[0])

        var isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9
        return {
          element: withinElement,
          isWindow: isWindow,
          isDocument: isDocument,
          offset: withinElement.offset() || { left: 0, top: 0 },
          scrollLeft: withinElement.scrollLeft(),
          scrollTop: withinElement.scrollTop(),

          // support: jQuery 1.6.x
          // jQuery 1.6 doesn't support .outerWidth/Height() on documents or windows
          width: isWindow || isDocument ? withinElement.width() : withinElement.outerWidth(),
          height: isWindow || isDocument ? withinElement.height() : withinElement.outerHeight()
        }
      }
    }

    $.fn.position = function (options) {
      if (!options || !options.of) {
        return _position.apply(this, arguments)
      }

      // make a copy, we don't want to modify arguments
      options = $.extend({}, options)

      var atOffset; var targetWidth; var targetHeight; var targetOffset; var basePosition; var dimensions

      var target = $(options.of)

      var within = $.position.getWithinInfo(options.within)

      var scrollInfo = $.position.getScrollInfo(within)

      var collision = (options.collision || 'flip').split(' ')

      var offsets = {}

      dimensions = getDimensions(target)
      if (target[0].preventDefault) {
        // force left top to allow flipping
        options.at = 'left top'
      }
      targetWidth = dimensions.width
      targetHeight = dimensions.height
      targetOffset = dimensions.offset
      // clone to reuse original targetOffset later
      basePosition = $.extend({}, targetOffset)

      // force my and at to have valid horizontal and vertical positions
      // if a value is missing or invalid, it will be converted to center
      $.each([ 'my', 'at' ], function () {
        var pos = (options[ this ] || '').split(' ')

        var horizontalOffset

        var verticalOffset

        if (pos.length === 1) {
          pos = rhorizontal.test(pos[ 0 ])
            ? pos.concat([ 'center' ])
            : rvertical.test(pos[ 0 ])
              ? [ 'center' ].concat(pos)
              : [ 'center', 'center' ]
        }
        pos[ 0 ] = rhorizontal.test(pos[ 0 ]) ? pos[ 0 ] : 'center'
        pos[ 1 ] = rvertical.test(pos[ 1 ]) ? pos[ 1 ] : 'center'

        // calculate offsets
        horizontalOffset = roffset.exec(pos[ 0 ])
        verticalOffset = roffset.exec(pos[ 1 ])
        offsets[ this ] = [
          horizontalOffset ? horizontalOffset[ 0 ] : 0,
          verticalOffset ? verticalOffset[ 0 ] : 0
        ]

        // reduce to just the positions without the offsets
        options[ this ] = [
          rposition.exec(pos[ 0 ])[ 0 ],
          rposition.exec(pos[ 1 ])[ 0 ]
        ]
      })

      // normalize collision option
      if (collision.length === 1) {
        collision[ 1 ] = collision[ 0 ]
      }

      if (options.at[ 0 ] === 'right') {
        basePosition.left += targetWidth
      } else if (options.at[ 0 ] === 'center') {
        basePosition.left += targetWidth / 2
      }

      if (options.at[ 1 ] === 'bottom') {
        basePosition.top += targetHeight
      } else if (options.at[ 1 ] === 'center') {
        basePosition.top += targetHeight / 2
      }

      atOffset = getOffsets(offsets.at, targetWidth, targetHeight)
      basePosition.left += atOffset[ 0 ]
      basePosition.top += atOffset[ 1 ]

      return this.each(function () {
        var collisionPosition; var using

        var elem = $(this)

        var elemWidth = elem.outerWidth()

        var elemHeight = elem.outerHeight()

        var marginLeft = parseCss(this, 'marginLeft')

        var marginTop = parseCss(this, 'marginTop')

        var collisionWidth = elemWidth + marginLeft + parseCss(this, 'marginRight') + scrollInfo.width

        var collisionHeight = elemHeight + marginTop + parseCss(this, 'marginBottom') + scrollInfo.height

        var position = $.extend({}, basePosition)

        var myOffset = getOffsets(offsets.my, elem.outerWidth(), elem.outerHeight())

        if (options.my[ 0 ] === 'right') {
          position.left -= elemWidth
        } else if (options.my[ 0 ] === 'center') {
          position.left -= elemWidth / 2
        }

        if (options.my[ 1 ] === 'bottom') {
          position.top -= elemHeight
        } else if (options.my[ 1 ] === 'center') {
          position.top -= elemHeight / 2
        }

        position.left += myOffset[ 0 ]
        position.top += myOffset[ 1 ]

        // if the browser doesn't support fractions, then round for consistent results
        if (!supportsOffsetFractions) {
          position.left = round(position.left)
          position.top = round(position.top)
        }

        collisionPosition = {
          marginLeft: marginLeft,
          marginTop: marginTop
        }

        $.each([ 'left', 'top' ], function (i, dir) {
          if ($.ui.position[ collision[ i ] ]) {
            $.ui.position[ collision[ i ] ][ dir ](position, {
              targetWidth: targetWidth,
              targetHeight: targetHeight,
              elemWidth: elemWidth,
              elemHeight: elemHeight,
              collisionPosition: collisionPosition,
              collisionWidth: collisionWidth,
              collisionHeight: collisionHeight,
              offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset[ 1 ] + myOffset[ 1 ] ],
              my: options.my,
              at: options.at,
              within: within,
              elem: elem
            })
          }
        })

        if (options.using) {
          // adds feedback as second argument to using callback, if present
          using = function (props) {
            var left = targetOffset.left - position.left

            var right = left + targetWidth - elemWidth

            var top = targetOffset.top - position.top

            var bottom = top + targetHeight - elemHeight

            var feedback = {
              target: {
                element: target,
                left: targetOffset.left,
                top: targetOffset.top,
                width: targetWidth,
                height: targetHeight
              },
              element: {
                element: elem,
                left: position.left,
                top: position.top,
                width: elemWidth,
                height: elemHeight
              },
              horizontal: right < 0 ? 'left' : left > 0 ? 'right' : 'center',
              vertical: bottom < 0 ? 'top' : top > 0 ? 'bottom' : 'middle'
            }
            if (targetWidth < elemWidth && abs(left + right) < targetWidth) {
              feedback.horizontal = 'center'
            }
            if (targetHeight < elemHeight && abs(top + bottom) < targetHeight) {
              feedback.vertical = 'middle'
            }
            if (max(abs(left), abs(right)) > max(abs(top), abs(bottom))) {
              feedback.important = 'horizontal'
            } else {
              feedback.important = 'vertical'
            }
            options.using.call(this, props, feedback)
          }
        }

        elem.offset($.extend(position, { using: using }))
      })
    }

    $.ui.position = {
      fit: {
        left: function (position, data) {
          var within = data.within

          var withinOffset = within.isWindow ? within.scrollLeft : within.offset.left

          var outerWidth = within.width

          var collisionPosLeft = position.left - data.collisionPosition.marginLeft

          var overLeft = withinOffset - collisionPosLeft

          var overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset

          var newOverRight

          // element is wider than within
          if (data.collisionWidth > outerWidth) {
            // element is initially over the left side of within
            if (overLeft > 0 && overRight <= 0) {
              newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset
              position.left += overLeft - newOverRight
              // element is initially over right side of within
            } else if (overRight > 0 && overLeft <= 0) {
              position.left = withinOffset
              // element is initially over both left and right sides of within
            } else {
              if (overLeft > overRight) {
                position.left = withinOffset + outerWidth - data.collisionWidth
              } else {
                position.left = withinOffset
              }
            }
            // too far left -> align with left edge
          } else if (overLeft > 0) {
            position.left += overLeft
            // too far right -> align with right edge
          } else if (overRight > 0) {
            position.left -= overRight
            // adjust based on position and margin
          } else {
            position.left = max(position.left - collisionPosLeft, position.left)
          }
        },
        top: function (position, data) {
          var within = data.within

          var withinOffset = within.isWindow ? within.scrollTop : within.offset.top

          var outerHeight = data.within.height

          var collisionPosTop = position.top - data.collisionPosition.marginTop

          var overTop = withinOffset - collisionPosTop

          var overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset

          var newOverBottom

          // element is taller than within
          if (data.collisionHeight > outerHeight) {
            // element is initially over the top of within
            if (overTop > 0 && overBottom <= 0) {
              newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset
              position.top += overTop - newOverBottom
              // element is initially over bottom of within
            } else if (overBottom > 0 && overTop <= 0) {
              position.top = withinOffset
              // element is initially over both top and bottom of within
            } else {
              if (overTop > overBottom) {
                position.top = withinOffset + outerHeight - data.collisionHeight
              } else {
                position.top = withinOffset
              }
            }
            // too far up -> align with top
          } else if (overTop > 0) {
            position.top += overTop
            // too far down -> align with bottom edge
          } else if (overBottom > 0) {
            position.top -= overBottom
            // adjust based on position and margin
          } else {
            position.top = max(position.top - collisionPosTop, position.top)
          }
        }
      },
      flip: {
        left: function (position, data) {
          var within = data.within

          var withinOffset = within.offset.left + within.scrollLeft

          var outerWidth = within.width

          var offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left

          var collisionPosLeft = position.left - data.collisionPosition.marginLeft

          var overLeft = collisionPosLeft - offsetLeft

          var overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft

          var myOffset = data.my[ 0 ] === 'left'
            ? -data.elemWidth
            : data.my[ 0 ] === 'right'
              ? data.elemWidth
              : 0

          var atOffset = data.at[ 0 ] === 'left'
            ? data.targetWidth
            : data.at[ 0 ] === 'right'
              ? -data.targetWidth
              : 0

          var offset = -2 * data.offset[ 0 ]

          var newOverRight

          var newOverLeft

          if (overLeft < 0) {
            newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset
            if (newOverRight < 0 || newOverRight < abs(overLeft)) {
              position.left += myOffset + atOffset + offset
            }
          } else if (overRight > 0) {
            newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft
            if (newOverLeft > 0 || abs(newOverLeft) < overRight) {
              position.left += myOffset + atOffset + offset
            }
          }
        },
        top: function (position, data) {
          var within = data.within

          var withinOffset = within.offset.top + within.scrollTop

          var outerHeight = within.height

          var offsetTop = within.isWindow ? within.scrollTop : within.offset.top

          var collisionPosTop = position.top - data.collisionPosition.marginTop

          var overTop = collisionPosTop - offsetTop

          var overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop

          var top = data.my[ 1 ] === 'top'

          var myOffset = top
            ? -data.elemHeight
            : data.my[ 1 ] === 'bottom'
              ? data.elemHeight
              : 0

          var atOffset = data.at[ 1 ] === 'top'
            ? data.targetHeight
            : data.at[ 1 ] === 'bottom'
              ? -data.targetHeight
              : 0

          var offset = -2 * data.offset[ 1 ]

          var newOverTop

          var newOverBottom
          if (overTop < 0) {
            newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset
            if (newOverBottom < 0 || newOverBottom < abs(overTop)) {
              position.top += myOffset + atOffset + offset
            }
          } else if (overBottom > 0) {
            newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop
            if (newOverTop > 0 || abs(newOverTop) < overBottom) {
              position.top += myOffset + atOffset + offset
            }
          }
        }
      },
      flipfit: {
        left: function () {
          $.ui.position.flip.left.apply(this, arguments)
          $.ui.position.fit.left.apply(this, arguments)
        },
        top: function () {
          $.ui.position.flip.top.apply(this, arguments)
          $.ui.position.fit.top.apply(this, arguments)
        }
      }
    };

    // fraction support test
    (function () {
      var testElement; var testElementParent; var testElementStyle; var offsetLeft; var i

      var body = document.getElementsByTagName('body')[ 0 ]

      var div = document.createElement('div')

      // Create a "fake body" for testing based on method used in jQuery.support
      testElement = document.createElement(body ? 'div' : 'body')
      testElementStyle = {
        visibility: 'hidden',
        width: 0,
        height: 0,
        border: 0,
        margin: 0,
        background: 'none'
      }
      if (body) {
        $.extend(testElementStyle, {
          position: 'absolute',
          left: '-1000px',
          top: '-1000px'
        })
      }
      for (i in testElementStyle) {
        testElement.style[ i ] = testElementStyle[ i ]
      }
      testElement.appendChild(div)
      testElementParent = body || document.documentElement
      testElementParent.insertBefore(testElement, testElementParent.firstChild)

      div.style.cssText = 'position: absolute; left: 10.7432222px;'

      offsetLeft = $(div).offset().left
      supportsOffsetFractions = offsetLeft > 10 && offsetLeft < 11

      testElement.innerHTML = ''
      testElementParent.removeChild(testElement)
    })()
  })()

  return $.ui.position
}))
