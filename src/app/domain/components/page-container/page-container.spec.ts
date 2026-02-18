import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { PageContainerComponent } from './page-container';

describe('PageContainerComponent', () => {
  let component: PageContainerComponent;
  let fixture: ComponentFixture<PageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default isContentLoading to false', () => {
    expect(component.isContentLoading()).toBe(false);
  });

  it('should default isVertical to true', () => {
    expect(component.isVertical()).toBe(true);
  });

  it('should show a spinner when isContentLoading is true', () => {
    fixture.componentRef.setInput('isContentLoading', true);
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('.page-container__loading');
    expect(spinner).not.toBeNull();
  });

  it('should not show spinner when isContentLoading is false', () => {
    fixture.componentRef.setInput('isContentLoading', false);
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('.page-container__loading');
    expect(spinner).toBeNull();
  });
});
