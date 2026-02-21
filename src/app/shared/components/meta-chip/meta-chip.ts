import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type MetaChipVariant = 'chip' | 'meta';

@Component({
  selector: 'app-meta-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styleUrl: './meta-chip.scss',
  host: {
    '[class.app-meta-chip--chip]': `variant() === 'chip'`,
    '[class.app-meta-chip--meta]': `variant() === 'meta'`,
    '[style.animation-delay]': 'animationDelay()',
  },
})
export class MetaChipComponent {
  readonly variant = input<MetaChipVariant>('chip');
  /** Used by the chip variant to stagger the entrance animation. */
  readonly animationDelay = input<string>('');
}
