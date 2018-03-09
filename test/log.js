document.addEventListener('DOMNodeInserted', function() {
  accessibilityjs.scanForProblems(document, function(err) {
    err.element.setAttribute('data-error', err.name)
    err.element.setAttribute('data-error-message', err.message)
  }, {
    ariaPairs: {
      ".js-menu-target": ["aria-expanded", "aria-haspopup"],
      ".js-details-target": ["aria-expanded"]
    }
  })
})
