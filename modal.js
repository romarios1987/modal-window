class ModalWindow extends HTMLElement {
  constructor() {
    super();

    this.text = {
      header: '',
      content: '',
      accept: 'accept',
      dismiss: 'dismiss'
    };

    this.events = {
      close: new CustomEvent('modal-window.changed', {
        bubbles: true,
        detail: { opened: false }
      }),
      open: new CustomEvent('modal-window.changed', {
        bubbles: true,
        detail: { opened: true }
      })
    };

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
              <style >
                    @import url("style.css");
              </style>
              
              <div class="overlay"></div>
              <div class="menu">
                    <a class="escape">+</a>
                    <h1>${this.text['header']}</h1>
                    <main><h2>${this.text['content']}</h2></main>
                    <a class="accept">${this.text['accept']}</a>
                    <a class="cancel">${this.text['dismiss']}</a>
              </div>
        `;
  }

  addAcceptEventListener(event, handler) {
    this.shadowRoot.querySelector('.accept').addEventListener(event, handler);
  }
  addDismissEventListener(event, handler) {
    this.shadowRoot.querySelector('.cancel').addEventListener(event, handler);
  }

  show() {
    if (!this.opened) {
      this.opened = !this.opened;
    }
  }
  close() {
    if (this.opened) {
      this.opened = !this.opened;
    }
  }

  get opened() {
    return this.getAttribute('opened') !== null;
  }

  set opened(state) {
    if (!!state) {
      this.setAttribute('opened', '');
    } else {
      this.removeAttribute('opened');
    }
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'opened':
        const opened = newVal !== null;
        this.dispatchEvent(this.events[opened ? 'open' : 'close']);
        break;

      case 'header':
        this.text['header'] = newVal;
        this.shadowRoot.querySelector('h1').textContent = newVal;
        break;

      case 'accept':
        this.text['accept'] = newVal;
        this.shadowRoot.querySelector('.accept').textContent = newVal;
        break;

      case 'dismiss':
        this.text['dismiss'] = newVal;
        this.shadowRoot.querySelector('.cancel').textContent = newVal;
        break;

      case 'content':
        this.text['content'] = newVal;
        this.shadowRoot.querySelector('h2').textContent = newVal;
        break;

      case 'esc':
        this.text['esc'] = '';
        window.addEventListener('keyup', this.eventHandler.bind(this));
        break;

      case 'cross':
        this.text['cross'] = '';
        this.shadowRoot
          .querySelector('.escape')
          .addEventListener('click', () => {
            this.opened = !this.opened;
          });
        break;

      case 'overlay':
        this.text['overlay'] = '';
        this.shadowRoot
          .querySelector('.overlay')
          .addEventListener('click', () => {
            this.opened = !this.opened;
          });
        break;
    }
  }

  static get observedAttributes() {
    return [
      'opened',
      'header',
      'content',
      'accept',
      'dismiss',
      'esc',
      'overlay',
      'cross'
    ];
  }

  eventHandler(e) {
    const keyCode = e.keyCode;
    if (this.opened && keyCode == 27) {
      this.opened = !this.opened;
    }
  }
}

customElements.define('modal-window', ModalWindow);
