import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

export class SearchItem {
    constructor(
      public track: string,
      public artist: string,
      public link: string,
      public thumbnail: string,
      public artistId: string
    ) { }
  }
  
  @Injectable()
  export class SearchService {
    apiRoot: string = "https://itunes.apple.com/search";
  
    constructor(private http: HttpClient) { }
  
  
    search(term: string): Observable<SearchItem[]> {
      let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      return this.http.get(apiURL).pipe(
        map(res => {
          return res.results.map(item => {
            return new SearchItem(
              item.trackName,
              item.artistName,
              item.trackViewUrl,
              item.artworkUrl30,
              item.artistId
            );
          });
        })
      );
    }
  }