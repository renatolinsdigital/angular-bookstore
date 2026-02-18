import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AppButtonComponent } from './button';

describe('AppButtonComponent', () => {
  let component: AppButtonComponent;
  let fixture: ComponentFixture<AppButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const btn = () => fixture.nativeElement.querySelector('.app-btn') as HTMLButtonElement;

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have type="button" by default', () => {
    expect(btn().type).toBe('button');
  });

  it('should apply --primary class by default', () => {
    expect(btn().classList).toContain('app-btn--primary');
  });

  it('should apply --outline class for outline variant', () => {
    fixture.componentRef.setInput('variant', 'outline');
    fixture.detectChanges();
    expect(btn().classList).toContain('app-btn--outline');
    expect(btn().classList).not.toContain('app-btn--primary');
  });

  it('should apply --cta class for cta variant', () => {
    fixture.componentRef.setInput('variant', 'cta');
    fixture.detectChanges();
    expect(btn().classList).toContain('app-btn--cta');
  });

  it('should render the cta arrow SVG for cta variant', () => {
    fixture.componentRef.setInput('variant', 'cta');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.app-btn__cta-arrow')).toBeTruthy();
  });

  it('should NOT render the cta arrow SVG for primary variant', () => {
    expect(fixture.nativeElement.querySelector('.app-btn__cta-arrow')).toBeNull();
  });

  it('should apply --download class for download variant', () => {
    fixture.componentRef.setInput('variant', 'download');
    fixture.detectChanges();
    expect(btn().classList).toContain('app-btn--download');
  });

  it('should be disabled when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(btn().disabled).toBe(true);
  });

  it('should apply --full-width class when fullWidth is true', () => {
    fixture.componentRef.setInput('fullWidth', true);
    fixture.detectChanges();
    expect(btn().classList).toContain('app-btn--full-width');
  });
});
