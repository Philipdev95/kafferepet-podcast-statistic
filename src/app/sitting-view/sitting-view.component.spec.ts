import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SittingViewComponent } from './sitting-view.component';

describe('SittingViewComponent', () => {
  let component: SittingViewComponent;
  let fixture: ComponentFixture<SittingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SittingViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SittingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
