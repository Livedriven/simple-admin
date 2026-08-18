import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Swal from 'sweetalert2';
import {
  getBirthDateBounds,
  personInputSchema,
  type PersonInput,
} from '../schemas/person';

export type AddPersonResult = { ok: true } | { ok: false; message: string };

type PersonFormProps = {
  onAddPerson: (person: PersonInput) => AddPersonResult;
  onClearPeople: () => Promise<boolean>;
  canClear: boolean;
};

type FormErrors = Partial<Record<keyof PersonInput, string>>;

const EMPTY_PERSON: PersonInput = { name: '', birthDate: '' };

export default function PersonForm({
  onAddPerson,
  onClearPeople,
  canClear,
}: PersonFormProps) {
  const [person, setPerson] = useState<PersonInput>(EMPTY_PERSON);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const birthDateInputRef = useRef<HTMLInputElement>(null);
  const dateBounds = getBirthDateBounds();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.currentTarget;
    const field = name as keyof PersonInput;

    setPerson((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus('');
  }

  async function showError(message: string, fieldErrors: FormErrors) {
    await Swal.fire({
      title: 'Revise os dados',
      text: message,
      icon: 'error',
      confirmButtonText: 'Entendi',
    });

    if (fieldErrors.name) {
      nameInputRef.current?.focus();
    } else if (fieldErrors.birthDate) {
      birthDateInputRef.current?.focus();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = personInputSchema.safeParse(person);

    if (!validation.success) {
      const fieldErrors: FormErrors = {};

      for (const issue of validation.error.issues) {
        const field = issue.path[0];

        const isFormField = field === 'name' || field === 'birthDate';

        if (isFormField && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }

      const message =
        fieldErrors.name ??
        fieldErrors.birthDate ??
        'Não foi possível validar os dados.';

      setErrors(fieldErrors);
      setStatus('');
      await showError(message, fieldErrors);
      return;
    }

    const result = onAddPerson(validation.data);

    if (!result.ok) {
      setStatus(result.message);
      await showError(result.message, {});
      return;
    }

    setPerson(EMPTY_PERSON);
    setErrors({});
    setStatus('Pessoa adicionada.');
    nameInputRef.current?.focus();
  }

  async function handleClear() {
    if (await onClearPeople()) {
      setStatus('Lista limpa.');
      nameInputRef.current?.focus();
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <label className="label-title" htmlFor="name">
        Nome
      </label>
      <input
        ref={nameInputRef}
        className="field"
        id="name"
        name="name"
        type="text"
        value={person.name}
        autoComplete="name"
        required
        aria-invalid={Boolean(errors.name)}
        aria-describedby={errors.name ? 'name-error' : undefined}
        onChange={handleChange}
      />
      {errors.name && (
        <p className="field-error" id="name-error">
          {errors.name}
        </p>
      )}

      <label className="label-title" htmlFor="birthDate">
        Data de nascimento
      </label>
      <input
        ref={birthDateInputRef}
        className="field"
        id="birthDate"
        name="birthDate"
        type="date"
        value={person.birthDate}
        min={dateBounds.min}
        max={dateBounds.max}
        autoComplete="bday"
        required
        aria-invalid={Boolean(errors.birthDate)}
        aria-describedby={errors.birthDate ? 'birthDate-error' : undefined}
        onChange={handleChange}
      />
      {errors.birthDate && (
        <p className="field-error" id="birthDate-error">
          {errors.birthDate}
        </p>
      )}

      <p className="privacy-note">Os dados ficam salvos neste navegador.</p>

      <div className="form-actions">
        <button className="register-person" type="submit">
          Salvar
        </button>
        <button
          className="clear-button"
          type="button"
          disabled={!canClear}
          onClick={() => void handleClear()}
        >
          Limpar
        </button>
      </div>

      {status && (
        <p className="form-status" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </form>
  );
}
