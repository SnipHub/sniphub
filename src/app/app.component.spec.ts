import { TestBed, async } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { HomeComponent } from './home/home.component'
import { RouterTestingModule } from '@angular/router/testing'
import { AppHeaderComponent } from 'app/core/app-header/app-header.component'

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        AppHeaderComponent,
        HomeComponent
      ],
      imports: [
           RouterTestingModule
      ]
    }).compileComponents()
  }))

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.debugElement.componentInstance
    expect(app).toBeTruthy()
  }))

//   it(`should have as title 'app works!'`, async(() => {
//     const fixture = TestBed.createComponent(AppComponent)
//     const app = fixture.debugElement.componentInstance
//     expect(app.title).toEqual('app works!')
//   }))

//   it('should render title in a h1 tag', async(() => {
//     const fixture = TestBed.createComponent(AppComponent)
//     fixture.detectChanges()
//     const compiled = fixture.debugElement.nativeElement
//     expect(compiled.querySelector('h1').textContent).toContain('app works!')
//   }))
})
