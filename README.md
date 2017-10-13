# accessibilityjs

Client side accessibility error scanner.

## Install

```
npm install @github/accessibilityjs --save
```

## Usage

```javascript
import {scanForProblems} from 'accessibilityjs'

function logError(error) {
  error.element.classList.add('accessibility-error')
  error.element.addEventListener('click', function () {
    alert(`${error.name}\n\n${error.message}`)
  }, {once: true})
}

document.addEventListener('ready', function() {
  scanForProblems(document, logError)
})
```

List of errors:

- `ImageWithoutAltAttributeError`
- `ElementWithoutLabelError`
- `LinkWithoutLabelOrRoleError`
- `LabelMissingControlError`
- `InputMissingLabelError`
- `ButtonWithoutLabelError`
- `ARIAAttributeMissingError`

## Scenario

In GitHub we use this script to scan for inaccessible elements in development and production staff mode. We style the elements with red borders in the `logError` function passed in, and add a click handler explaining the reasons.

![Red borders are added to offending elements example](https://user-images.githubusercontent.com/1153134/31491689-bb8d8068-af0d-11e7-862b-01b059e13ba1.png)

![An alert pops up on clicking the elements](https://user-images.githubusercontent.com/1153134/31491972-c8547512-af0e-11e7-9d0d-db116eb7cf58.png)

## Browser support

- Chrome
- Firefox
- Safari 6+
- Internet Explorer 9+
- Microsoft Edge

Internet Explorer and Edge require a polyfill for [`closest`](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill).

## Development

- `npm install`
- `npm test`
- `npm run example`
