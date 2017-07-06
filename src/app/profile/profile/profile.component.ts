import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs/Subscription'
import { Snippet } from '../../snippet/interfaces/snippet'
import { User } from '../../core/interfaces/user/user'
import { SnippetService } from '../../snippet/services/snippet.service'
import { AuthenticationService } from '../../authentication/services/authentication.service'
import { NotificationService } from '../../notification/services/notification.service'
import { Notification } from '../../notification/interfaces/notification'
import { Observable } from 'rxjs/Observable'
import { UserService } from '../../core/services/user/user.service'
import { FirebaseService } from '../../core/services/firebase/firebase.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
    routeDataObserver: Subscription
    authorSnippets: Snippet[]
    contributorSnippets: Snippet[]
    snippetsLoaded = false
    snippetsObserver: Subscription
    user: User
    userSnapshot: User
    loggedUser: User
    pendingNotifications: boolean
    notifications: Notification[]
    editing = false
    username: ElementRef
    @ViewChild('username') set usernameRef(username: ElementRef) {
        this.username = username
    }

    constructor(
        private snippetService: SnippetService,
        private route: ActivatedRoute,
        private router: Router,
        private authentication: AuthenticationService,
        private notification: NotificationService,
        private userService: UserService,
        private firebaseService: FirebaseService,
        private cdr: ChangeDetectorRef) { }

    async ngOnInit() {
        this.notifications = await this.notification.all()
        this.pendingNotifications = this.notifications.length > 0

        if (this.authentication.logged) {
            this.user = Object.assign({}, this.authentication.currentUser())
            this.loggedUser = Object.assign({}, this.user)
            this.newUserSnapshot()
        }

        if (this.route.snapshot.params['id']) {
            const userId = this.route.snapshot.params['id']

            if (this.loggedUser && userId === this.loggedUser.id) {
                this.user = Object.assign({}, this.loggedUser)
                this.newUserSnapshot()
            } else {
                this.routeDataObserver = this
                    .route
                    .data
                    .subscribe((data: { user: User }) => {
                        this.user = Object.assign({}, data[0])
                        this.newUserSnapshot()
                    })
            }
        }

        this.loadSnippets()
    }

    loadSnippets() {
        this.snippetsObserver = this.snippetService
            .author(this.user)
            .mergeMap(authorSnippets => {
                this.authorSnippets = authorSnippets

                return this.snippetService.contributor(this.user)
            })
            .subscribe(contributorSnippets => {
                this.contributorSnippets = contributorSnippets
                this.snippetsLoaded = true
            })
    }

    ngOnDestroy() {
        this.closeSubscriptions()
    }

    closeSubscriptions() {
        this.snippetsObserver.unsubscribe()
    }

    newUserSnapshot() {
        this.userSnapshot = Object.assign({}, this.user)
    }

    ownProfile() {
        return this.loggedUser && this.user && this.loggedUser.id === this.user.id
    }

    signOut() {
        this.authentication.logout()
    }

    containsRequestsNotifications() {
        return this.notification.containsRequestsNotifications(this.notifications)
    }

    goToRequests() {
        this.router.navigate(['/requests'])
    }

    setUsernameEditable() {
        if (this.ownProfile()) {
            this.editing = true
            // if we remove timeout, focus() won't work because the input won't be displayed yet
            setTimeout(() => this.username.nativeElement.focus(), 0)
        }
    }

    editUsername() {
        if (this.ownProfile()) {
            this.editing = false

            if (this.userSnapshot.username !== this.user.username) {
                this.userService.changeUsername(this.user)
                this.newUserSnapshot()
            }

            this.cdr.detectChanges()
        }
    }

    syncAvatar() {
        const firebaseUser = this.firebaseService.currentUser()

        if (this.user.avatar !== firebaseUser.photoURL) {
            this.user.avatar = firebaseUser.photoURL
            this.userService.changeAvatar(this.user)
            this.authentication.reloadUser(this.user)
        }
    }
}
