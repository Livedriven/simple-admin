import type { Person } from "../validators/validator";

export function save(people: Person[]) {
    localStorage.setItem('people', JSON.stringify(people));
}

export function getPeople(): Person[] {
    const storedPeople = localStorage.getItem('people');

    if (storedPeople) {
        return JSON.parse(storedPeople) as Person[];
    }

    return [];
}