import { MatProgressSpinnerModule, MatIconModule, MatInputModule,MatFormFieldModule,MatAutocompleteModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SearchService } from './service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';       

@NgModule({
imports: [BrowserAnimationsModule,MatProgressSpinnerModule, MatIconModule,MatInputModule,MatFormFieldModule,MatAutocompleteModule,BrowserModule, ReactiveFormsModule, FormsModule, HttpClientModule],
exports: [MatFormFieldModule,MatAutocompleteModule],
declarations: [AppComponent],
bootstrap: [AppComponent],
providers: [SearchService]
})
export class AppModule { }