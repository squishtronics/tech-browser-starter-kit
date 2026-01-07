import {
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  InjectionToken,
  Injector,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { TooltipComponent } from './tooltip.component';
import { TooltipService } from './tooltip.service';

export const TOOLTIP_CONTENT = new InjectionToken<TemplateRef<unknown>>(
  'tooltipContent'
);

@Directive({
  selector: '[sqtTooltip]',
})
export class TooltipDirective implements OnInit {
  @Input('sqtTooltip') content: TemplateRef<unknown>;
  private overlayRef: OverlayRef;

  private overlay = inject(Overlay);
  private overlayPositionBuilder = inject(OverlayPositionBuilder);
  private elementRef = inject(ElementRef);
  private tooltips = inject(TooltipService);

  ngOnInit() {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        {
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: 8,
        },
        {
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'top',
          offsetX: -8,
        },
      ]);

    this.overlayRef = this.overlay.create({ positionStrategy });
  }

  @HostListener('click', ['$event'])
  show(event: MouseEvent) {
    event.stopPropagation();
    if (this.overlayRef.hasAttached()) {
      return;
    }

    const injector = Injector.create({
      providers: [{ provide: TOOLTIP_CONTENT, useValue: this.content }],
    });
    this.tooltips.register(
      true,
      this.overlayRef.attach(
        new ComponentPortal(TooltipComponent, null, injector)
      ),
      () => this.overlayRef.detach()
    );
  }
}

