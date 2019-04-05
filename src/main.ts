import { NgModule, Component, Injectable } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { ReactiveFormsModule, FormControl, FormsModule } from "@angular/forms";

import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap
} from "rxjs/operators";

class SearchItem {
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

@Component({
  selector: "app",
  template: `
<form class="example-form">
  <mat-form-field class="example-full-width">
  <input matInput placeholder="Buscar" aria-label="State" [matAutocomplete]="auto" [formControl]="searchField"> 

    <mat-icon *ngIf="loading" matSuffix>refresh</mat-icon>

    <mat-autocomplete #auto="matAutocomplete">
      <mat-option *ngFor="let track of results | async" [value]="track.track" (click)='seleccionarPersona(track)'>
        <img class="example-option-img" aria-hidden [src]="track.thumbnail" height="25">
        <span>{{track.track}}</span>
      </mat-option>
    </mat-autocomplete>
  </mat-form-field>  

</form>

<div class="text-center">
  <p class="lead" *ngIf="loading">Loading...</p>
</div>


<div *ngFor='let t of seleccionados'>
  <span>{{ t.track}}</span>
</div>

<div>Cargando: {{loading}}</div>
 `
})
class AppComponent {
  private loading: boolean = false;
  private results: Observable<SearchItem[]>;
  private searchField: FormControl;
  seleccionados: SearchItem[] = [];
  constructor(private itunes: SearchService) { }

  ngOnInit() {
    this.searchField = new FormControl();
    this.results = this.searchField.valueChanges.pipe(      
      debounceTime(1000),
      distinctUntilChanged(),
      tap(_ => (this.loading = true)),
      switchMap(term => this.itunes.search(term)),
      tap(_ => (this.loading = false))
    );
  }

  seleccionarPersona(track:SearchItem) {
    console.log(track);
    this.seleccionados.push(track);
  }

  doSearch(term: string) {
    this.itunes.search(term);
  }
}

import { MatProgressSpinnerModule, MatIconModule, MatInputModule,MatFormFieldModule,MatAutocompleteModule
       } from '@angular/material';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';       

@NgModule({
  imports: [BrowserAnimationsModule,MatProgressSpinnerModule, MatIconModule,MatInputModule,MatFormFieldModule,MatAutocompleteModule,BrowserModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  exports: [MatFormFieldModule,MatAutocompleteModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [SearchService]
})
class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
