(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.invariant = factory();
  }
}(this, function() {
  const scanForProblems = function (context, logError) {
    for (const img of context.querySelectorAll('img')) {
      if (!img.hasAttribute('alt')) {
        logError(new ImageWithoutAltAttributeError(img))
      }
    }

    for (const a of context.querySelectorAll('a')) {
      if (a.hasAttribute('name') || elementIsHidden(a)) {
        continue
      }
      if (a.getAttribute('href') == null && a.getAttribute('role') !== 'button') {
        logError(new LinkWithoutLabelOrRoleError(a))
      } else if (!accessibleText(a)) {
        logError(new ElementWithoutLabelError(a))
      }
    }

    for (const button of context.querySelectorAll('button')) {
      if (!elementIsHidden(button) && !accessibleText(button)) {
        logError(new ButtonWithoutLabelError(button))
      }
    }

    for (const label of context.querySelectorAll('label')) {
      // In case label.control isn't supported by browser, find the control manually (IE)
      const control = label.control || document.getElementById(label.getAttribute('for')) || label.querySelector('input')

      if (!control) {
        logError(new LabelMissingControl(label), false)
      }
    }

    for (const input of context.querySelectorAll('input[type=text], textarea')) {
      if (input.labels && !input.labels.length && !elementIsHidden(input) && !input.hasAttribute('aria-label')) {
        logError(new ElementWithoutLabelError(input))
      }
    }

    for (const selector of Object.keys(SelectorARIAPairs)) {
      const ARIAAttrsRequired = SelectorARIAPairs[selector]
      for (const target of context.querySelectorAll(selector)) {
        const missingAttrs = []
        for (const attr of ARIAAttrsRequired) {
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
    fn.prototype.constructor = fn
  }

  function ImageWithoutAltAttributeError(element) {
    this.name = 'ImageWithoutAltAttributeError'
    this.stack = new Error().stack
    this.element = element
    this.message = `Missing alt attribute on ${element.outerHTML}`
  }
  errorSubclass(ImageWithoutAltAttributeError)

  function ElementWithoutLabelError(element) {
    this.name = 'ElementWithoutLabelError'
    this.stack = new Error().stack
    this.element = element
    this.message = `Missing text, title, or aria-label attribute on ${element.outerHTML}`
  }
  errorSubclass(ElementWithoutLabelError)

  function LinkWithoutLabelOrRoleError(element) {
    this.name = 'LinkWithoutLabelOrRoleError'
    this.stack = new Error().stack
    this.element = element
    this.message = `Missing href or role=button on ${element.outerHTML}`
  }
  errorSubclass(LinkWithoutLabelOrRoleError)

  function LabelMissingControl(element) {
    this.name = 'LabelMissingControl'
    this.stack = new Error().stack
    this.element = element
    this.message = `Label missing control on ${element.outerHTML}`
  }
  errorSubclass(LabelMissingControl)

  function ButtonWithoutLabelError(element) {
    this.name = 'ButtonWithoutLabelError'
    this.stack = new Error().stack
    this.element = element
    this.message = `Missing text or aria-label attribute on ${element.outerHTML}`
  }
  errorSubclass(ButtonWithoutLabelError)

  function ARIAAttributeMissingError(element, attr) {
    this.name = 'ARIAAttributeMissingError'
    this.stack = new Error().stack
    this.element = element
    this.message = `Missing ${attr} attribute on ${element.outerHTML}`
  }
  errorSubclass(ARIAAttributeMissingError)

  const SelectorARIAPairs = {
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
        for (const child of node.childNodes) {
          if (accessibleText(child)) return true
        }
        break
      case Node.TEXT_NODE:
        return isText(node.data)
    }
  }

  return scanForProblems
}));
