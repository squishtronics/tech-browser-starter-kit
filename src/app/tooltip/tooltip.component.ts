import { Component, inject } from '@angular/core';
import { TOOLTIP_CONTENT } from './tooltip.directive';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  standalone: true,
  selector: 'sqt-tooltip',
  imports: [NgTemplateOutlet],
  templateUrl: './tooltip.component.html',
  styleUrl: 'tooltip.component.scss'
})
export class TooltipComponent {
  content = inject(TOOLTIP_CONTENT);
}