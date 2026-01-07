import { ComponentRef, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TooltipService {
  private refs = new Map<ComponentRef<unknown>, () => void>();

  constructor() {
    document.addEventListener(
      'click',
      (event) => {
        if (event.target == null) {
          return;
        }
        if ((event.target as Element).closest('sqt-tooltip') == null)
          if (this.reset()) {
            if ((event.target as Element).closest('.clickable') == null) {
              event.stopPropagation();
              event.preventDefault();
              event.stopImmediatePropagation();
            }
          }
      },
      { capture: true }
    );
  }

  register(reset: boolean, ref: ComponentRef<unknown>, detach: () => void) {
    if (reset) {
      this.reset();
    }
    this.refs.set(ref, detach);
  }

  reset(): boolean {
    for (const [, refDetach] of this.refs) {
      refDetach();
    }
    const result = this.refs.size > 0;
    this.refs.clear();
    return result;
  }
}
