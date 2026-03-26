import { Component, Output, EventEmitter, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-wrapper">
      <span class="search-icon">🔍</span>
      <input
        type="text"
        [placeholder]="placeholder"
        [(ngModel)]="value"
        (ngModelChange)="onInput($event)"
        class="search-input"
      />
      <button
        *ngIf="value"
        class="clear-btn"
        (click)="clear()"
        type="button"
      >
        ✕
      </button>
    </div>
  `,
  styles: [`
    .search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 360px;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      font-size: 14px;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 8px 36px 8px 36px;
      border: 1px solid #C4C0B4;
      border-radius: 8px;
      font-family: 'Roboto', sans-serif;
      font-size: 0.875rem;
      color: #2E2D29;
      background-color: #fff;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .search-input:focus {
      outline: none;
      border-color: #2B7A8C;
      box-shadow: 0 0 0 3px rgba(43, 122, 140, 0.15);
    }
    .search-input::placeholder { color: #9A9689; }
    .clear-btn {
      position: absolute;
      right: 8px;
      border: none;
      background: none;
      color: #9A9689;
      cursor: pointer;
      font-size: 14px;
      padding: 4px;
      line-height: 1;
    }
    .clear-btn:hover { color: #4A4842; }
  `],
})
export class SearchInputComponent implements OnInit, OnDestroy {
  @Input() placeholder = 'Buscar...';
  @Output() search = new EventEmitter<string>();

  value = '';
  private searchSubject = new Subject<string>();
  private subscription!: Subscription;

  ngOnInit(): void {
    this.subscription = this.searchSubject
      .pipe(debounceTime(350), distinctUntilChanged())
      .subscribe((term) => this.search.emit(term));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onInput(value: string): void {
    this.searchSubject.next(value);
  }

  clear(): void {
    this.value = '';
    this.search.emit('');
  }
}
