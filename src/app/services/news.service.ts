import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Article, ArticlesByCategoryAndPage, NewsResponse } from '../interfaces';
import { Observable } from 'rxjs';
import { count, map } from 'rxjs/operators';

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class NewsService {

  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = {

  };



  constructor( private http: HttpClient) { }

  private executeQuery<T>( endpoint: string ) {
    console.log('Petición HTTP realizada');
    return this.http.get<T>(`${ apiUrl }${ endpoint }`,{
      params: {
        apiKey: apiKey,
        country: 'us',
      }
    })
  }

/**
 *Estos metodos fueron reemplazados por executeQuery
 *
  getTopHeadlines(): Observable<Article[]> {

    return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=business`, {
      params: { apiKey }
    }).pipe(
      map( ({ articles }) => articles )
    );


  }
  **/

  /**
  getTopHeadlinesByCategory( category: string ):Observable<Article[]>{

    return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=${ category }`, {
      params: { apiKey}
    }).pipe(
      map( ({ articles }) => articles )
    );

  }
  **/


    getTopHeadlines( ):Observable<Article[]>{

      return this.executeQuery<NewsResponse>(`/top-headlines?category=business`)
        .pipe(
        map( ({ articles }) => articles )
      );

    }




    getTopHeadlinesByCategory( category: string, loadMore: boolean = false ):Observable<Article[]>{

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${ category }`)
      .pipe(
      map( ({ articles }) => articles )
    );

  }

  private getArticlesByCategory( category: string ): Observable<Article[]> {
    if ( Object.keys( this.articlesByCategoryAndPage ).includes( category ) ) {
      // ya existe
      //this.articlesByCategoryAndPage[category].page += 0;
    } else {
      // no existe
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      }
    }

    const page = this.articlesByCategoryAndPage[category].page + 1;

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${ category }&page=${ page }`)
      .pipe(
        map( ({ articles }) => articles )
      );

  }



}
