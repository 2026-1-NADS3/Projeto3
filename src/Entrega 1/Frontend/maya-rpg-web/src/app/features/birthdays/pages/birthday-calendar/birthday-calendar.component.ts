import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import type { IPatientRepository, PaginatedRequest } from '../../../../core/interfaces';
import type { Patient } from '../../../../core/entities/patient.entity';
import { PATIENT_REPOSITORY } from '../../../../core/tokens/injection-tokens';

interface BirthdayPatient {
  patient: Patient;
  day: number;
  month: number;
  age: number;
  isToday: boolean;
  isThisWeek: boolean;
}

@Component({
  selector: 'app-birthday-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './birthday-calendar.component.html',
  styleUrl: './birthday-calendar.component.scss',
})
export class BirthdayCalendarComponent implements OnInit {
  isLoading = false;

  today = new Date();
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  displayMonth = new Date().getMonth();
  displayYear = new Date().getFullYear();

  allPatients: Patient[] = [];
  birthdaysThisMonth: BirthdayPatient[] = [];
  upcomingBirthdays: BirthdayPatient[] = [];
  todayBirthdays: BirthdayPatient[] = [];

  calendarDays: (BirthdayPatient[] | null)[] = [];
  firstDayOffset = 0;

  readonly monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  readonly weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  constructor(
    @Inject(PATIENT_REPOSITORY) private readonly patientRepo: IPatientRepository,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  private loadPatients(): void {
    this.isLoading = true;
    const params: PaginatedRequest = { page: 1, pageSize: 500 };
    this.patientRepo.getAll(params).subscribe({
      next: (res) => {
        this.allPatients = res.data;
        this.processData();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private processData(): void {
    const now = new Date();
    const todayDay = now.getDate();
    const todayMonth = now.getMonth();

    const mapped: BirthdayPatient[] = this.allPatients.map((p) => {
      const birth = new Date(p.birthDate);
      const day = birth.getUTCDate();
      const month = birth.getUTCMonth();
      const birthYear = birth.getUTCFullYear();
      const age = this.currentYear - birthYear;

      const isToday = day === todayDay && month === todayMonth;

      const thisYearBirthday = new Date(this.currentYear, month, day);
      const diffMs = thisYearBirthday.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const isThisWeek = diffDays >= 0 && diffDays <= 7;

      return { patient: p, day, month, age, isToday, isThisWeek };
    });

    this.todayBirthdays = mapped.filter((b) => b.isToday);
    this.upcomingBirthdays = mapped
      .filter((b) => b.isThisWeek && !b.isToday)
      .sort((a, b) => a.day - b.day);

    this.buildCalendar(mapped);
  }

  private buildCalendar(allBirthdays: BirthdayPatient[]): void {
    this.birthdaysThisMonth = allBirthdays
      .filter((b) => b.month === this.displayMonth)
      .sort((a, b) => a.day - b.day);

    const firstDay = new Date(this.displayYear, this.displayMonth, 1).getDay();
    const daysInMonth = new Date(this.displayYear, this.displayMonth + 1, 0).getDate();

    this.firstDayOffset = firstDay;
    const grid: (BirthdayPatient[] | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      grid.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const bdays = this.birthdaysThisMonth.filter((b) => b.day === d);
      grid.push(bdays);
    }

    this.calendarDays = grid;
  }

  prevMonth(): void {
    if (this.displayMonth === 0) {
      this.displayMonth = 11;
      this.displayYear--;
    } else {
      this.displayMonth--;
    }
    this.rebuildCalendar();
  }

  nextMonth(): void {
    if (this.displayMonth === 11) {
      this.displayMonth = 0;
      this.displayYear++;
    } else {
      this.displayMonth++;
    }
    this.rebuildCalendar();
  }

  goToToday(): void {
    this.displayMonth = this.currentMonth;
    this.displayYear = this.currentYear;
    this.rebuildCalendar();
  }

  private rebuildCalendar(): void {
    const mapped: BirthdayPatient[] = this.allPatients.map((p) => {
      const birth = new Date(p.birthDate);
      const day = birth.getUTCDate();
      const month = birth.getUTCMonth();
      const birthYear = birth.getUTCFullYear();
      const age = this.currentYear - birthYear;

      const now = new Date();
      const isToday = day === now.getDate() && month === now.getMonth();
      const thisYearBirthday = new Date(this.currentYear, month, day);
      const diffMs = thisYearBirthday.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const isThisWeek = diffDays >= 0 && diffDays <= 7;

      return { patient: p, day, month, age, isToday, isThisWeek };
    });

    this.buildCalendar(mapped);
    this.cdr.detectChanges();
  }

  isCurrentMonth(): boolean {
    return this.displayMonth === this.currentMonth && this.displayYear === this.currentYear;
  }

  isToday(day: number): boolean {
    return (
      day === this.today.getDate() &&
      this.displayMonth === this.currentMonth &&
      this.displayYear === this.currentYear
    );
  }

  getDayFromIndex(i: number): number {
    return i - this.firstDayOffset + 1;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
}
