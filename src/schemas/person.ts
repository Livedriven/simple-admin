import { z } from 'zod';

export const MAX_NAME_LENGTH = 80;
export const MAX_PEOPLE = 200;

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/u;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function toLocalIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  return `${year}-${month}-${day}`;
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInMonth(year: number, month: number): number {
  const days = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  return days[month - 1] ?? 0;
}

function isValidCivilDate(value: string): boolean {
  const match = ISO_DATE_PATTERN.exec(value);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  return (
    year >= 1 &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= daysInMonth(year, month)
  );
}

export function normalizeName(value: string): string {
  return value.normalize('NFC').trim().replace(/\s+/gu, ' ');
}

export function getBirthDateBounds(today = new Date()): {
  min: string;
  max: string;
} {
  const oldestYear = today.getFullYear() - 130;
  const month = today.getMonth() + 1;
  const day = Math.min(today.getDate(), daysInMonth(oldestYear, month));

  return {
    min: `${oldestYear}-${pad(month)}-${pad(day)}`,
    max: toLocalIsoDate(today),
  };
}

const normalizedNameSchema = z
  .string()
  .transform(normalizeName)
  .pipe(
    z
      .string()
      .min(1, 'Informe o nome da pessoa.')
      .refine((value) => Array.from(value).length <= MAX_NAME_LENGTH, {
        message: `Use no máximo ${MAX_NAME_LENGTH} caracteres.`,
      }),
  );

const birthDateSchema = z.string().superRefine((value, context) => {
  if (!value) {
    context.addIssue({
      code: 'custom',
      message: 'Informe a data de nascimento.',
    });
    return;
  }

  if (!isValidCivilDate(value)) {
    context.addIssue({
      code: 'custom',
      message: 'Informe uma data de nascimento válida.',
    });
    return;
  }

  const bounds = getBirthDateBounds();

  if (value > bounds.max) {
    context.addIssue({
      code: 'custom',
      message: 'A data de nascimento não pode estar no futuro.',
    });
  } else if (value < bounds.min) {
    context.addIssue({
      code: 'custom',
      message: 'A idade máxima permitida é 130 anos.',
    });
  }
});

export const personInputSchema = z.object({
  name: normalizedNameSchema,
  birthDate: birthDateSchema,
});

export const personSchema = personInputSchema.extend({
  id: z.uuid(),
});

export const peopleSchema = z.array(personSchema).max(MAX_PEOPLE);

export type PersonInput = z.infer<typeof personInputSchema>;
export type Person = z.infer<typeof personSchema>;

function caselessName(value: string): string {
  let normalized = normalizeName(value);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const next = normalized.toUpperCase().toLowerCase().normalize('NFC');

    if (next === normalized) {
      break;
    }

    normalized = next;
  }

  return normalized;
}

export function isDuplicatePerson(
  first: PersonInput,
  second: PersonInput,
): boolean {
  return (
    caselessName(first.name) === caselessName(second.name) &&
    first.birthDate === second.birthDate
  );
}

export function createPerson(
  input: PersonInput,
  usedIds: ReadonlySet<string>,
): Person {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const id = globalThis.crypto.randomUUID();

    if (!usedIds.has(id)) {
      return { id, ...input };
    }
  }

  throw new Error('Não foi possível gerar um identificador único.');
}

export function formatBirthDate(value: string): string {
  const match = ISO_DATE_PATTERN.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}
