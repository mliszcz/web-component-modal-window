
import { document, HTMLDivElement } from 'window'
import jQuery from 'jQuery'

const template = (document._currentScript || document.currentScript)
  .ownerDocument
  .querySelector('template')

const Attributes = {
  URL_BOOTSTRAP_CSS: 'url-bootstrap-css',
  TEXT_HEADER: 'text-header',
  TEXT_BUTTON_ACCEPT: 'text-button-accept',
  TEXT_BUTTON_REJECT: 'text-button-reject'
}

const Properties = {
  URL_BOOTSTRAP_CSS: 'urlBootstrapCss',
  TEXT_HEADER: 'textHeader',
  TEXT_BUTTON_ACCEPT: 'textButtonAccept',
  TEXT_BUTTON_REJECT: 'textButtonReject'
}

function createReflectedProperty (prototype,
                                  property,
                                  attribute,
                                  _default = '') {
  Object.defineProperty(prototype, property, {
    get: function () {
      const value = this.getAttribute(attribute)
      return (value === null) ? _default : value
    },
    set: function (value) {
      this.setAttribute(attribute, value)
    }
  })
}

class HTMLModalWindowElement extends HTMLDivElement {

  createdCallback () {

    const root = this.createShadowRoot()
    const clone = document.importNode(template.content, true)
    root.appendChild(clone)

    this.dom = {
      btnReject: root.querySelector('.modal-footer button:nth-child(1)'),
      btnAccept: root.querySelector('.modal-footer button:nth-child(2)'),
      txtHeader: root.querySelector('.modal-header .modal-title'),
      nodeStyle: root.querySelector('style')
    }

    this.classList.add('modal')
    this.setAttribute('tabindex', '-1')

    this.onUrlBootstrapCssChanged(this.urlBootstrapCss)
    this.onTextHeaderChanged(this.textHeader)
    this.onTextButtonAcceptChanged(this.textButtonAccept)
    this.onTextButtonRejectChanged(this.textButtonReject)
  }

  attributeChangedCallback (name, oldValue, newValue) {
    switch (name) {
      case Attributes.URL_BOOTSTRAP_CSS:
        return this.onUrlBootstrapCssChanged(newValue)
      case Attributes.TEXT_HEADER:
        return this.onTextHeaderChanged(newValue)
      case Attributes.TEXT_BUTTON_ACCEPT:
        return this.onTextButtonAcceptChanged(newValue)
      case Attributes.TEXT_BUTTON_REJECT:
        return this.onTextButtonRejectChanged(newValue)
    }
  }

  /**
   * @param {string} urlBootstrapCss
   * @private
   */
  onUrlBootstrapCssChanged (urlBootstrapCss) {
    this.dom.nodeStyle.innerText = `@import url('${urlBootstrapCss}');`
  }

  /**
   * @param {string} textTitle
   * @private
   */
  onTextHeaderChanged (textTitle) {
    this.dom.txtHeader.innerText = textTitle
  }

  /**
   * @param {string} textButtonAccept
   * @private
   */
  onTextButtonAcceptChanged (textButtonAccept) {
    this.dom.btnAccept.innerText = textButtonAccept
  }

  /**
   * @param {string} textButtonReject
   * @private
   */
  onTextButtonRejectChanged (textButtonReject) {
    this.dom.btnReject.innerText = textButtonReject
  }

  /**
   * @param {function(m: HTMLModalWindowElement): Promise<T,V>} acceptHandler
   * @return {Promise<T,V>}
   */
  showModal (acceptHandler) {
    return new Promise((resolve, reject) => {

      let rejectListener
      let acceptListener

      const removeEventListeners = () => {
        this.dom.btnReject.removeEventListener('click', rejectListener)
        this.dom.btnAccept.removeEventListener('click', acceptListener)
      }

      rejectListener = () => {
        removeEventListeners()
        // http://stackoverflow.com/questions/20068467/do-never-resolved-promises-cause-memory-leak
        // reject(undefined)
      }

      acceptListener = () => {
        removeEventListeners()
        acceptHandler(this).then(resolve, reject)
      }

      this.dom.btnReject.addEventListener('click', rejectListener)
      this.dom.btnAccept.addEventListener('click', acceptListener)

      jQuery(this).modal()

    })
  }

}

createReflectedProperty(HTMLModalWindowElement.prototype,
                        Properties.URL_BOOTSTRAP_CSS,
                        Attributes.URL_BOOTSTRAP_CSS)

createReflectedProperty(HTMLModalWindowElement.prototype,
                        Properties.TEXT_HEADER,
                        Attributes.TEXT_HEADER)

createReflectedProperty(HTMLModalWindowElement.prototype,
                        Properties.TEXT_BUTTON_ACCEPT,
                        Attributes.TEXT_BUTTON_ACCEPT,
                        'Done')

createReflectedProperty(HTMLModalWindowElement.prototype,
                        Properties.TEXT_BUTTON_REJECT,
                        Attributes.TEXT_BUTTON_REJECT,
                        'Dismiss')

const constructor = document.registerElement('x-modal-window', {
  prototype: HTMLModalWindowElement.prototype,
  extends: 'div'
})

export { constructor as HTMLModalWindowElement }
