import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HomeComponent } from './home';
import { ResponsiveService } from '../../domain/services/responsive.service';

const mockResponsiveService = {
  youJokingRight: signal(false),
  isSmaller: signal(false),
  isSmall: signal(false),
  isSuperSmall: signal(false),
  isDesktopBigScreen: signal(true),
  isDesktopSmallScreen: signal(false),
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: ResponsiveService, useValue: mockResponsiveService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /store when browse() is called', () => {
    const spy = vi.spyOn(router, 'navigate');
    (component as any).browse();
    expect(spy).toHaveBeenCalledWith(['/store']);
  });

  it('should render the CTA button', () => {
    const btn = fixture.nativeElement.querySelector('.app-btn--cta');
    expect(btn).not.toBeNull();
  });

  it('should render at least one feature card', () => {
    const cards = fixture.nativeElement.querySelectorAll('.home__feature');
    expect(cards.length).toBeGreaterThan(0);
  });
});
