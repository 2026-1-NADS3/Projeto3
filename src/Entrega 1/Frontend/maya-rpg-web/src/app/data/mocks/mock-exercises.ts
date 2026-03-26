import { Exercise } from '../../core/entities/exercise.entity';
import { ExerciseCategory } from '../../core/enums/exercise-category.enum';

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: '1',
    title: 'Alongamento de cadeia posterior',
    description:
      'Alongamento global da cadeia posterior, incluindo isquiotibiais, lombar e panturrilha.',
    category: ExerciseCategory.STRETCHING,
    tags: ['posterior', 'lombar', 'isquiotibiais'],
    videoUrl: '',
    imageUrls: [],
    instructions:
      'Paciente sentado com pernas estendidas. Flexionar o tronco à frente mantendo os joelhos estendidos. Segurar 30 segundos. Repetir 3 vezes.',
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-03-01'),
  },
  {
    id: '2',
    title: 'Postura de rã no chão',
    description: 'Postura clássica de RPG para abertura de cadeia anterior e membros inferiores.',
    category: ExerciseCategory.POSTURE,
    tags: ['rã', 'cadeia anterior', 'quadril'],
    videoUrl: '',
    imageUrls: [],
    instructions:
      'Paciente em decúbito dorsal, planta dos pés unidas, joelhos abertos. Braços ao longo do corpo com palmas para cima. Manter 15-20 minutos com correções progressivas.',
    createdAt: new Date('2026-01-12'),
    updatedAt: new Date('2026-02-20'),
  },
  {
    id: '3',
    title: 'Respiração diafragmática',
    description: 'Exercício de conscientização respiratória para ativação do diafragma.',
    category: ExerciseCategory.BREATHING,
    tags: ['respiração', 'diafragma', 'relaxamento'],
    videoUrl: '',
    imageUrls: [],
    instructions:
      'Paciente em decúbito dorsal com joelhos flexionados. Inspirar pelo nariz expandindo o abdômen. Expirar pela boca lentamente. 10 ciclos.',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '4',
    title: 'Fortalecimento de core - prancha',
    description: 'Prancha isométrica para fortalecimento da musculatura estabilizadora do tronco.',
    category: ExerciseCategory.STRENGTHENING,
    tags: ['core', 'prancha', 'estabilização'],
    videoUrl: '',
    imageUrls: [],
    instructions:
      'Apoiar antebraços e pontas dos pés no chão. Manter o corpo alinhado como uma prancha. Contrair abdômen. Segurar 20-30 segundos. 3 séries.',
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-03-10'),
  },
  {
    id: '5',
    title: 'Mobilização cervical',
    description: 'Exercício de mobilidade articular para coluna cervical com movimentos suaves.',
    category: ExerciseCategory.MOBILITY,
    tags: ['cervical', 'pescoço', 'mobilidade'],
    videoUrl: '',
    imageUrls: [],
    instructions:
      'Sentado com postura ereta. Realizar flexão, extensão, inclinações laterais e rotações da cervical. Movimentos lentos, 5 repetições cada direção.',
    createdAt: new Date('2026-02-05'),
    updatedAt: new Date('2026-02-05'),
  },
  {
    id: '6',
    title: 'Equilíbrio unipodal',
    description: 'Exercício proprioceptivo de equilíbrio em apoio unipodal.',
    category: ExerciseCategory.BALANCE,
    tags: ['equilíbrio', 'propriocepção', 'unipodal'],
    videoUrl: '',
    imageUrls: [],
    instructions:
      'Em pé, apoiar-se em um pé só. Manter olhos abertos inicialmente, depois fechar. 30 segundos cada lado. 3 séries.',
    createdAt: new Date('2026-02-10'),
    updatedAt: new Date('2026-03-05'),
  },
];
