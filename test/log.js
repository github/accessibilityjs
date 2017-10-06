document.addEventListener('DOMNodeInserted', function() {
  accessibilityjs.scanForProblems(document, function(err) {
    err.element.setAttribute('data-error', err.name)
  })
})
