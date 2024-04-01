import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ConfigService } from './config/config.service';
import { ChatComponent } from './chat/chat.component';
import { GoogleSigninButtonModule, SocialAuthService, SocialLoginModule, SocialUser } from '@abacritt/angularx-social-login';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, ChatComponent, SocialLoginModule, GoogleSigninButtonModule, MatToolbarModule, MatIconModule, MatButtonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {

    version = '';
    user: SocialUser | null = null;
    loggedIn: boolean = false;

    constructor(private authService: SocialAuthService, private config: ConfigService) {
        this.config.getConfig().subscribe(c => {
            this.version = c.version;
        })
    }

    ngOnInit() {
        this.authService.authState.subscribe((user) => {
            this.user = user;
            this.loggedIn = (user != null);
        });
    }

    signOut(): void {
        this.authService.signOut();
        this.user = null;
        this.loggedIn = false;
    }

} 
