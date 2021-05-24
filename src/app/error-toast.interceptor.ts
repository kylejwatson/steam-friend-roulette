import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorToastInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let error: HttpErrorResponse;
    return next.handle(request)
      .pipe(
        tap(
          () => {
          },
          err => {
            error = err;
          }
        ),
        finalize(() => {
          if (error) {
            let errorMessage = 'Something went wrong';
            switch (error.status) {
              case 0:
                errorMessage = 'Unable to connect to the server';
                break;
              case 500:
                errorMessage = 'Something on the server went wrong!';
                break;
              case 404:
                errorMessage = 'We can\'t find that resource';
                break;
            }
            this.snackBar.open(errorMessage, 'Close', {
              duration: 3000,
              verticalPosition: 'top'
            });
          }
        })
      );
  }
}
