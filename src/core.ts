export interface TooltipOptions {
  content?: string;
  contentAttr?: string;
}

export class TooltipCore {
  el: HTMLElement;
  options: TooltipOptions;
  tooltip: HTMLDivElement | null = null;

  private hideFunc = this.hide.bind(this);
  private showFunc = this.show.bind(this);
  private showFuncPrevent = (e: Event) => {
    e.preventDefault();

    this.show();
  };
  private updateFunc = this.update.bind(this);

  constructor(el: HTMLElement, options?: TooltipOptions) {
    this.el = el;
    this.options = Object.assign({
      contentAttr: 'data-title'
    }, options);

    this.init();

    if (!document.querySelector('#io-tooltip-styles')) this.addStyles();
  }

  private addStyles() {
    const style = document.createElement('style');

    style.id = 'io-tooltip-styles';
    style.innerHTML = `
      .io-tooltip {
        top: 0;
        left: 0;
        background-color: #6D6D6D;
        border-radius: 0.25em;
        color: rgba(255, 255, 255, 0.87);
        font-size: 0.8em;
        opacity: 0;
        padding: 0.5em;
        position: fixed;
        transition: opacity 0.125s ease-in-out;
      }

      .io-tooltip.active {
        opacity: 1;
      }
    `;

    document.head.appendChild(style);
  }

  destroy() {
    const title = this.el.getAttribute('data-title');

    if (this.options.contentAttr === 'data-title' && title) {
      this.el.setAttribute('title', title);
      this.el.removeAttribute('data-title');
    }

    this.el.removeEventListener('blur', this.hideFunc);
    document.removeEventListener('scroll', this.updateFunc, true);

    if (this.isTouch()) {
      this.el.removeEventListener('contextmenu', this.showFuncPrevent);
    } else {
      this.el.removeEventListener('focus', this.showFunc);
      this.el.removeEventListener('mouseover', this.showFunc);
      this.el.removeEventListener('mouseout', this.hideFunc);
    }
  }

  private getPosition() {
    const 
      elRect = this.el.getBoundingClientRect(),
      tooltipRect = (this.tooltip as HTMLDivElement).getBoundingClientRect()
    ;

    let position = {
      x: elRect.left + elRect.width / 2 - tooltipRect.width / 2,
      y: elRect.top > window.innerHeight / 2 ? elRect.top - tooltipRect.height - 8 : elRect.top + elRect.height + 8
    };

    if (position.x < 0 && elRect.left <= window.innerWidth / 2) position.x = elRect.left;

    if (position.x + tooltipRect.width > window.innerWidth) position.x = elRect.right - tooltipRect.width;

    return position;
  }

  hide() {
    if (!this.tooltip || document.activeElement === this.el) return;

    const tooltip = this.tooltip;

    this.tooltip = null;
    
    tooltip.classList.remove('active');
    tooltip.ontransitionend = () => tooltip.remove();
  }

  private init() {
    const title = this.el.getAttribute('title');

    if (this.options.contentAttr === 'data-title' && title) {
      this.el.setAttribute('data-title', title);
      this.el.removeAttribute('title');
    }

    this.el.addEventListener('blur', this.hideFunc);
    document.addEventListener('scroll', this.updateFunc, true);

    if (this.isTouch()) {
      this.el.addEventListener('contextmenu', this.showFuncPrevent);
    } else {
      this.el.addEventListener('focus', this.showFunc);
      this.el.addEventListener('mouseover', this.showFunc);
      this.el.addEventListener('mouseout', this.hideFunc);
    }
  }

  private isTouch = () => 'ontouchstart' in window || navigator.msMaxTouchPoints;

  show() {
    if (this.tooltip) return;

    const
      tooltip = document.createElement('div'),
      content = this.options.content ?? this.el.getAttribute(this.options.contentAttr as string) as string
    ;

    tooltip.className = 'io-tooltip';
    tooltip.innerHTML = content;

    document.body.appendChild(tooltip);

    this.tooltip = tooltip;

    this.update(); 
  }

  update() {
    if (!this.tooltip) return; 

    const position = this.getPosition();

    this.tooltip.style.transform = `translate(${position.x}px, ${position.y}px)`;
    this.tooltip.classList.add('active');
  }
}
