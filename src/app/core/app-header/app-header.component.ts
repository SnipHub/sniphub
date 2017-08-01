import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
    private isAuthenticated: boolean
    private name: string
    homePage = false
    searchEnabled: boolean
    searchTerms = ''
    @ViewChild('searchInput')
    searchInput: ElementRef
    // @ViewChild('mainSearchInput')
    // mainSearchInput: ElementRef
    searching = false

    constructor(private router: Router) { }

    ngOnInit() {
        this.searchEnabled = this.searchTerms.length > 0
        this.router
            .events
            .filter(event => event instanceof NavigationEnd)
            .subscribe( (event: NavigationEnd) => this.homePage = '/' === event.url )
    }

    toggleSearch() {
        if (this.searchTerms.length === 0) {
            this.searchEnabled = !this.searchEnabled
        }
    }

    search() {
        if (this.searchTerms.length > 0) {
            this.router.navigate(['/search', { terms: this.searchTerms }])
        }
    }
}
