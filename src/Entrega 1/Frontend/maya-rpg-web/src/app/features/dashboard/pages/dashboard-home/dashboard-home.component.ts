import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import type { IPatientRepository, IExerciseRepository, IPrescriptionRepository, PaginatedRequest } from '../../../../core/interfaces';
import { PatientStatus } from '../../../../core/enums/patient-status.enum';
import {
  PATIENT_REPOSITORY,
  EXERCISE_REPOSITORY,
  PRESCRIPTION_REPOSITORY,
} from '../../../../core/tokens/injection-tokens';

interface StatCard {
  label: string;
  value: number | string;
  icon: string;
  route: string;
  color: 'teal' | 'coral' | 'blue' | 'success';
  isLoading: boolean;
}

interface BirthdayToday {
  name: string;
  age: number;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
})
export class DashboardHomeComponent implements OnInit {
  isLoading = true;

  totalActivePatients = 0;
  totalExercises = 0;
  totalPrescriptions = 0;
  birthdaysToday: BirthdayToday[] = [];

  greeting = '';
  today = new Date();

  constructor(
    @Inject(PATIENT_REPOSITORY) private readonly patientRepo: IPatientRepository,
    @Inject(EXERCISE_REPOSITORY) private readonly exerciseRepo: IExerciseRepository,
    @Inject(PRESCRIPTION_REPOSITORY) private readonly prescriptionRepo: IPrescriptionRepository,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.greeting = this.getGreeting();
    this.loadData();
  }

  private loadData(): void {
    const minParams: PaginatedRequest = { page: 1, pageSize: 1 };
    const allPatientsParams: PaginatedRequest = { page: 1, pageSize: 500 };

    forkJoin({
      activePatients: this.patientRepo.getAll(minParams, PatientStatus.ACTIVE),
      exercises: this.exerciseRepo.getAll(minParams),
      allPatients: this.patientRepo.getAll(allPatientsParams),
    }).subscribe({
      next: ({ activePatients, exercises, allPatients }) => {
        this.totalActivePatients = activePatients.total;
        this.totalExercises = exercises.total;
        this.birthdaysToday = this.getBirthdaysToday(allPatients.data);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private getBirthdaysToday(patients: any[]): BirthdayToday[] {
    const now = new Date();
    const todayDay = now.getDate();
    const todayMonth = now.getMonth();

    return patients
      .filter((p) => {
        const birth = new Date(p.birthDate);
        return birth.getUTCDate() === todayDay && birth.getUTCMonth() === todayMonth;
      })
      .map((p) => ({
        name: p.fullName,
        age: now.getFullYear() - new Date(p.birthDate).getUTCFullYear(),
      }));
  }

  private getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  getFirstName(): string {
    return 'Maya';
  }
}
