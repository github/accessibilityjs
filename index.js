(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.scanForProblems = factory();
  }
}(this, function() {
  function scanForProblems(context, logError) {
    var i

    var imgElements = context.querySelectorAll('img')
    for (i = 0; i < imgElements.length; i++) {
      var img = imgElements[i]
      if (!img.hasAttribute('alt')) {
        logError(new ImageWithoutAltAttributeError(img))
      }
    }

    var aElements = context.querySelectorAll('a')
    for (i = 0; i < aElements.length; i++) {
      var a = aElements[i]
      if (a.hasAttribute('name') || elementIsHidden(a)) {
        continue
      }
      if (a.getAttribute('href') == null && a.getAttribute('role') !== 'button') {
        logError(new LinkWithoutLabelOrRoleError(a))
      } else if (!accessibleText(a)) {
        logError(new ElementWithoutLabelError(a))
      }
    }

    var buttonElements = context.querySelectorAll('button')
    for (i = 0; i < buttonElements.length; i++) {
      var button = buttonElements[i]
      if (!elementIsHidden(button) && !accessibleText(button)) {
        logError(new ButtonWithoutLabelError(button))
      }
    }

    var labelElements = context.querySelectorAll('label')
    for (i = 0; i < labelElements.length; i++) {
      var label = labelElements[i]
      // In case label.control isn't supported by browser, find the control manually (IE)
      var control = label.control || document.getElementById(label.getAttribute('for')) || label.querySelector('input')

      if (!control) {
        logError(new LabelMissingControl(label), false)
      }
    }

    var inputElements = context.querySelectorAll('input[type=text], textarea')
    for (i = 0; i < inputElements.length; i++) {
      var input = inputElements[i]
      if (input.labels && !input.labels.length && !elementIsHidden(input) && !input.hasAttribute('aria-label')) {
        logError(new ElementWithoutLabelError(input))
      }
    }

    for (var selector in SelectorARIAPairs) {
      var ARIAAttrsRequired = SelectorARIAPairs[selector]
      var targetElements = context.querySelectorAll(selector)

      for (var j = 0; j < targetElements.length; j++) {
        var target = targetElements[j]
        var missingAttrs = []

        for (var k = 0; k < ARIAAttrsRequired.length; k++) {
          var attr = ARIAAttrsRequired[k]
          if (!target.hasAttribute(attr)) missingAttrs.push(attr)
        }

        if (missingAttrs.length > 0) {
          logError(new ARIAAttributeMissingError(target, missingAttrs.join(', ')))
        }
      }
    }
  }

  function errorSubclass(fn) {
    fn.prototype = new Error()
    fn.prototype.varructor = fn
  }

  function ImageWithoutAltAttributeError(element) {
    this.name = 'ImageWithoutAltAttributeError'
    this.stack = new Error().stack
    this.element = element
    this.message = 'Missing alt attribute on ' + element.outerHTML
  }
  errorSubclass(ImageWithoutAltAttributeError)

  function ElementWithoutLabelError(element) {
    this.name = 'ElementWithoutLabelError'
    this.stack = new Error().stack
    this.element = element
    this.message = 'Missing text, title, or aria-label attribute on ' + element.outerHTML
  }
  errorSubclass(ElementWithoutLabelError)

  function LinkWithoutLabelOrRoleError(element) {
    this.name = 'LinkWithoutLabelOrRoleError'
    this.stack = new Error().stack
    this.element = element
    this.message = 'Missing href or role=button on ' + element.outerHTML
  }
  errorSubclass(LinkWithoutLabelOrRoleError)

  function LabelMissingControl(element) {
    this.name = 'LabelMissingControl'
    this.stack = new Error().stack
    this.element = element
    this.message = 'Label missing control on ' + element.outerHTML
  }
  errorSubclass(LabelMissingControl)

  function ButtonWithoutLabelError(element) {
    this.name = 'ButtonWithoutLabelError'
    this.stack = new Error().stack
    this.element = element
    this.message = 'Missing text or aria-label attribute on ' + element.outerHTML
  }
  errorSubclass(ButtonWithoutLabelError)

  function ARIAAttributeMissingError(element, attr) {
    this.name = 'ARIAAttributeMissingError'
    this.stack = new Error().stack
    this.element = element
    this.message = 'Missing '+attr+' attribute on ' + element.outerHTML
  }
  errorSubclass(ARIAAttributeMissingError)

  var SelectorARIAPairs = {
    ".js-menu-target": ["aria-expanded", "aria-haspopup"],
    ".js-details-target": ["aria-expanded"]
  }

  function elementIsHidden(element) {
    return element.getAttribute('aria-hidden') === 'true' || element.closest('[aria-hidden="true"]')
  }

  function isText(value) {
    return typeof value === 'string' && !!value.trim()
  }

  // Public: Check if an element has text visible by sight or screen reader.
  //
  // Examples
  //
  //   <img alt="github" src="github.png">
  //   # => true
  //
  //   <span aria-label="Open"></span>
  //   # => true
  //
  //   <button></button>
  //   # => false
  //
  // Returns String text.
  function accessibleText(node) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        if (isText(node.getAttribute('alt')) || isText(node.getAttribute('aria-label')) || isText(node.getAttribute('title'))) return true
        for (var i = 0; i < node.childNodes.length; i++) {
          if (accessibleText(node.childNodes[i])) return true
        }
        break
      case Node.TEXT_NODE:
        return isText(node.data)
    }
  }

  return scanForProblems
}));
