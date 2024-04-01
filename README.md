# Python + Angular Chat template

## Restore development environment

```bash
cd frontend
npm install
cd ..
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements-dev.txt
```

## Deployment

First, build Angular project.

```bash
cd frontend
ng build
cd ..
```

Create GCP project as described in
<https://cloud.google.com/appengine/docs/standard/python3/building-app/creating-gcp-project>.

Then beploy Python project into GCP:

```bash
gcloud app deploy backend/app.yaml
```

## Login with Google

Install <https://www.npmjs.com/package/@abacritt/angularx-social-login>

```bash
npm i @abacritt/angularx-social-login
```

Add provider in `app.config.ts`

```typescript
...
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        provideHttpClient(),
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(
                            '{clientId}'
                        )
                    }
                ],
                onError: (err: any) => {
                    console.error(err);
                }
            } as SocialAuthServiceConfig,
        }
    ]
};
```

Modify `app.component.ts`.

- add SocialAuthService in constructor
- read authState in ngOnInit
- add signOut() method

```typescript
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
```

Add toolbar with user photo and logout button in header.
Add login button in main section in `app.component.html`

```html
<header>
    <mat-toolbar color="primary">
        <h1>Chat demo</h1>
        @if(user != null){
        <div class="flex-spacer"></div>
        <img src="{{ user.photoUrl }}" class="profile-photo" referrerpolicy="no-referrer">
        <button mat-icon-button aria-label="Logout" (click)="signOut()">
            <mat-icon aria-hidden="false" aria-label="Logout">logout</mat-icon>
        </button>
        }
    </mat-toolbar>
</header>
<main [class.login]="!loggedIn">
    @if(loggedIn){<app-chat></app-chat>}
    @else{
    <asl-google-signin-button type='standard' size='large'></asl-google-signin-button>
    }
</main>
...
```

Add profile photo styling and login button centering in 
`app.component.css`

```css
.profile-photo {
    border-radius: 50%;
    width: calc(var(--mat-toolbar-standard-height) * 0.8);
    height: calc(var(--mat-toolbar-standard-height) * 0.8);
    border: 2px solid white;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}
...
main.login {
    display: grid;
    place-items: center;
}
```
