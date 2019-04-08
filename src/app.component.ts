import { Component } from '@angular/core';
import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
  filter
} from "rxjs/operators";

import { Observable } from 'rxjs';
import { SearchItem, SearchService } from './service';
import { FormControl } from "@angular/forms";

@Component({
  selector: "app",
  templateUrl: './app.component.html'
})

export class AppComponent {
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
      filter( v => this.seleccionados.length <= 0 || v != this.seleccionados[this.seleccionados.length - 1].track),
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