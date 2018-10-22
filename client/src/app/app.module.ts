import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PlayersComponent } from './players/players.component';
import { RankingComponent } from './ranking/ranking.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { OktaAuthModule } from '@okta/okta-angular';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlayersComponent,
    RankingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    FormsModule,
    OktaAuthModule.initAuth({
      issuer: 'https://{YourOktaDomain}/oauth2/default',
      redirectUri: 'http://localhost:4200/implicit/callback',
      clientId: '{YourClientId}'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
