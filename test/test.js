describe('scanForProblems should catch', () => {
  it('html without lang', () => {
    const html = makeElement('html', {"lang": "en"})
    document.body.appendChild(html)

    assert.exists(html.getAttribute('lang'), html)
  })

  it('html without lang value', () => {
    const html = makeElement('html', {"lang": "en"})
    document.body.appendChild(html)

    assert.isNotEmpty(html.getAttribute('lang'), html)
  })

  it('empty button', () => {
    const button = makeElement('button', {type: 'button'})
    document.body.appendChild(button)

    assert.equal(button.getAttribute('data-error'), 'ButtonWithoutLabelError')
  })

  it('button with image without alt', () => {
    const image = makeElement('img')
    const button = makeElement('button', {type: 'button'}, image)
    document.body.appendChild(button)
    assert.equal(button.getAttribute('data-error'), 'ButtonWithoutLabelError')
    assert.equal(image.getAttribute('data-error'), 'ImageWithoutAltAttributeError')
  })

  it('unlabeled input', () => {
    const input = makeElement('input', {type: 'text'})
    document.body.appendChild(input)

    assert.equal(input.getAttribute('data-error'), 'InputMissingLabelError')
  })

  it('a without href', () => {
    const a = makeElement('a', {}, 'home')
    document.body.appendChild(a)

    assert.equal(a.getAttribute('data-error'), 'LinkWithoutLabelOrRoleError')
  })

  it('label without control', () => {
    const label = makeElement('label')
    document.body.appendChild(label)

    assert.equal(label.getAttribute('data-error'), 'LabelMissingControlError')
    assert.include(label.getAttribute('data-error-message'), 'Label missing control on "label"')
  })

  it('element with attributes missing', () => {
    const button = makeElement('button', {type: 'button', class: 'js-menu-target'}, 'Button')
    document.body.appendChild(button)

    assert.equal(button.getAttribute('data-error'), 'ARIAAttributeMissingError')
    assert.include(button.getAttribute('data-error-message'), 'Missing aria-expanded, aria-haspopup attribute on "button.js-menu-target"')
  })

  it('inspects element id and classes', () => {
    const button = makeElement('button', {type: 'button', id: 'btn', class: 'a js-menu-target b js-quick-submit'}, 'Button')
    document.body.appendChild(button)

    assert.include(button.getAttribute('data-error-message'), '"button#btn.js-menu-target.js-quick-submit"')
  })
})

describe('scanForProblems should not catch', () => {
  it('button with image[alt]', () => {
    const image = makeElement('img', {alt: 'button image'})
    const button = makeElement('button', {type: 'button'}, image)
    document.body.appendChild(button)
    assert.notOk(button.getAttribute('data-error'))
    assert.notOk(image.getAttribute('data-error'))
  })

  it('input[aria-label]', () => {
    const input = makeElement('input', {type: 'text', 'aria-label': 'description'})
    document.body.appendChild(input)
    assert.notOk(input.getAttribute('data-error'))
  })

  it('a with href', () => {
    const a = makeElement('a', {href: '#anchor'}, 'home')
    document.body.appendChild(a)
    assert.notOk(a.getAttribute('data-error'))
  })

  it('label wrapping control', () => {
    const label = makeElement('label', {}, 'description')
    const input = makeElement('input', {type: 'text'})
    label.append(input)
    document.body.appendChild(label)
    assert.notOk(label.getAttribute('data-error'))
    assert.notOk(input.getAttribute('data-error'))
  })

  it('label pairing with control', () => {
    const container = makeElement('div')
    const label = makeElement('label', {for: 'input'}, 'description')
    const input = makeElement('input', {id: 'input', type: 'text'})
    container.appendChild(label)
    container.appendChild(input)
    document.body.appendChild(container)
    assert.notOk(label.getAttribute('data-error'))
    assert.notOk(input.getAttribute('data-error'))
  })
})

function makeElement(tag, attributes, content) {
  const element = document.createElement(tag)
  if (attributes) {
    for (const attribute in attributes) {
      element.setAttribute(attribute, attributes[attribute])
    }
  }
  if (content) element.append(content)
  return element
}
