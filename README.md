# accessibilityjs

Client side accessibility error scanner.

## Usage

```javascript
import scanForProblems from 'accessibilityjs'

function logError(error) {
  error.element.addEventListener('click', function () {
    alert(`${error.name}\n\n${error.message}`)
  }, {once: true})

  if (onPageWarning) error.element.classList.add('accessibility-error')
}

document.addEventListener('ready', function() {
  scanForProblems(document, logError)
})
```

## Browser support

- Chrome
- Firefox
- Safari 6+
- Internet Explorer 9+
- Microsoft Edge

Internet Explorer and Edge require a polyfill for [`closest`](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill).

## Development

Test script changes with `test.html`.
