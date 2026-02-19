import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AboutComponent } from './about';
import { ResponsiveService } from '../../domain/services/responsive.service';

const mockResponsiveService = {
  youJokingRight: signal(false),
  isSmaller: signal(false),
  isSmall: signal(false),
  isSuperSmall: signal(false),
  isDesktopBigScreen: signal(true),
  isDesktopSmallScreen: signal(false),
};

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [
        provideRouter([]),
        { provide: ResponsiveService, useValue: mockResponsiveService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the page title', () => {
    const title = fixture.nativeElement.querySelector('.about__title');
    expect(title.textContent.trim()).toContain('BookStore');
  });

  it('should navigate to /store when goToStore() is called', () => {
    const spy = vi.spyOn(router, 'navigate');
    (component as unknown as { goToStore(): void }).goToStore();
    expect(spy).toHaveBeenCalledWith(['/store']);
  });
});
