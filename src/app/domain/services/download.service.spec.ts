import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DownloadService } from './download.service';

describe('DownloadService', () => {
  let service: DownloadService;

  beforeEach(() => {
    vi.restoreAllMocks();
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadService);
  });

  it('should do nothing when no URL is provided', () => {
    const spy = vi.spyOn(document.body, 'appendChild');
    service.downloadFile(undefined);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should trigger a download link when given a URL', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => ({}) as Node);
    const removeSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => ({}) as Node);
    service.downloadFile('https://example.com/book.pdf');
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });
});
