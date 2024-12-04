import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSheetComponent } from './technical-sheet.component';

describe('TechnicalSheetComponent', () => {
  let component: TechnicalSheetComponent;
  let fixture: ComponentFixture<TechnicalSheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechnicalSheetComponent]
    });
    fixture = TestBed.createComponent(TechnicalSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
