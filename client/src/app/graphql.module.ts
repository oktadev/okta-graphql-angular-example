import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {OktaAuthService} from '@okta/okta-angular';
import {setContext} from 'apollo-link-context';

const uri = 'http://localhost:4201/graphql';

export function createApollo(httpLink: HttpLink, oktaAuth: OktaAuthService) {
  const http = httpLink.create({uri});

  const auth = setContext((_, { headers }) => {
    return oktaAuth.getAccessToken().then(token => {
      return token?
        { headers: {'Authorization': `Bearer ${token}`} }:
        {};
    });
  });

  return {
    link: auth.concat(http),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, OktaAuthService],
    },
  ],
})
export class GraphQLModule {}
