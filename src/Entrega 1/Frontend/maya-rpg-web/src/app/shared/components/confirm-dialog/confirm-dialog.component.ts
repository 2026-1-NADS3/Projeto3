import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overlay" *ngIf="visible" (click)="onCancel()">
      <div class="dialog" (click)="$event.stopPropagation()">
        <h3 class="dialog-title">{{ title }}</h3>
        <p class="dialog-message">{{ message }}</p>
        <div class="dialog-actions">
          <button class="btn btn--secondary" (click)="onCancel()">Cancelar</button>
          <button class="btn btn--danger" (click)="onConfirm()" [disabled]="loading">
            {{ loading ? 'Aguarde...' : confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .dialog {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
    .dialog-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #2E2D29;
      margin-bottom: 8px;
    }
    .dialog-message {
      font-size: 0.875rem;
      color: #6E6B62;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .btn {
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: background-color 0.2s;
    }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn--secondary {
      background: #F1EFE8;
      color: #4A4842;
    }
    .btn--secondary:hover { background: #E2DFD5; }
    .btn--danger {
      background: #E25C5C;
      color: #fff;
    }
    .btn--danger:hover:not(:disabled) { background: #c94444; }
  `],
})
export class ConfirmDialogComponent {
  @Input() visible = false;
  @Input() title = 'Confirmar ação';
  @Input() message = 'Tem certeza que deseja continuar?';
  @Input() confirmLabel = 'Confirmar';
  @Input() loading = false;
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
