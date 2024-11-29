import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaizenComponent } from './kaizen.component';

describe('KaizenComponent', () => {
  let component: KaizenComponent;
  let fixture: ComponentFixture<KaizenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KaizenComponent]
    });
    fixture = TestBed.createComponent(KaizenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
