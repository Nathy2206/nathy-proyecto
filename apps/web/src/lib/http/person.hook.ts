// apps/web/src/lib/http/person.hook.ts
'use client';

import { useState, useCallback } from 'react';
import { useHttp } from './http.hook';
import { ENDPOINTS } from './endpoints';

export interface Person {
  id?: string | number;
  name: string;
  email: string;
}

export const useGetPersons = () => {
  const { get, loading, error } = useHttp();
  const [persons, setPersons] = useState<Person[]>([]);

  const fetchPersons = useCallback(async () => {
    const data = await get<Person[]>(ENDPOINTS.persons);
    setPersons(data);
    return data;
  }, [get]);

  return { persons, fetchPersons, loading, error };
};

export const useUpsertPerson = () => {
  const { post, put, loading, error } = useHttp();

  const upsertPerson = useCallback(
    async (person: Person): Promise<Person> => {
      if (person.id) {
        return await put<Person>(`${ENDPOINTS.persons}/${person.id}`, person);
      }
      return await post<Person>(ENDPOINTS.persons, person);
    },
    [post, put]
  );

  return { upsertPerson, loading, error };
};

export const useDeletePerson = () => {
  const { del, loading, error } = useHttp();

  const deletePerson = useCallback(
    async (id: string | number) => {
      return await del<{ success: boolean }>(`${ENDPOINTS.persons}/${id}`);
    },
    [del]
  );

  return { deletePerson, loading, error };
};