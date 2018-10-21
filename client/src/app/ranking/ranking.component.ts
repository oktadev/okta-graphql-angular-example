import { Component, OnInit } from '@angular/core';
import {Apollo, QueryRef} from 'apollo-angular';
import gql from 'graphql-tag';

const RANKINGS_QUERY = gql`
  query rankings($rank:Int!) {
    rankings(rank: $rank) {
      date
      rank
      points
      player {
        first_name
        last_name
      }
    }
  }
`;

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  rank:number = 1;
  rankings: any[];

  private query: QueryRef<any>;
  constructor(private apollo: Apollo) { }
  ngOnInit() {
    this.query = this.apollo
      .watchQuery({
        query: RANKINGS_QUERY,
        variables: {rank : Math.round(this.rank)}
      });

      this.query.valueChanges.subscribe(result => {
        this.rankings = result.data && result.data.rankings;
      });
  }

  update() {
    return this.query.refetch({rank: Math.round(this.rank)});
  }
}
