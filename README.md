# web-component-modal-window
Self-contained HTML Modal Window element. **For Bootstrap 4**.

## Requirements

* ECMAScript2015-enabled browser,
* Web Components support (including Shadow DOM V0),
* Bootstrap **4**.

In Firefox enable flag `dom.webcomponents.enable` in `about:config` tab.

## Example

```html
<link rel="import" href="node_modules/web-component-modal-window/x-modal-window.html">

<div is="x-modal-window"
     url-bootstrap-css="node_modules/bootstrap/dist/css/bootstrap.css"
     class="fade"
     text-header="My Form"
     text-button-accept="Submit"
     text-button-reject="Dismiss">
  <form>
    <div class="radio">
      <label>
        <input type="radio" name="status" value="ok" checked> OK
      </label>
    </div>
    <div class="radio">
      <label>
        <input type="radio" name="status" value="notok"> NOT OK
      </label>
    </div>
  </form>
</div>
```

```javascript
const modal = document.querySelector('*[is="x-modal-window"]')

const result = modal.showModal((modalWindow) => {
  // 1st argument is a reference to the modal element
  const status = modalWindow.querySelector('form').status.value
  return (status === 'ok') ? Promise.resolve(status) : Promise.reject(status)
})
```

## API

Simply put your markup inside the `x-modal-window` tag and invoke the
`showModal` method. When modal is closed using primary button ('accept'),
`acceptHandler` is invoked.

Promise returned from `showModal` resolves to the one returned from
`acceptHandler`.

```javascript
/**
 * @param {function(modal: HTMLModalWindowElement): Promise<T,V>} acceptHandler
 * @return {Promise<T,V>}
 */
showModal (acceptHandler)
```

## Attributes

name | type | reflected property | default value | remark
-----|------|--------------------|---------------|-------
url-bootstrap-css | string | urlBootstrapCss | '' | **MANDATORY**
text-header | string | textHeader | '' | -
text-button-accept | string | textButtonAccept | 'Done' | -
text-button-reject | string | textButtonReject | 'Dismiss' | -
