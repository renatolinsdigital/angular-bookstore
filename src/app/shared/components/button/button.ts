import { Component, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'outline' | 'cta' | 'download';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: { class: 'app-button-host' },
})
export class AppButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly disabled = input(false);
  readonly type = input<ButtonType>('button');
  readonly fullWidth = input(false);
}
