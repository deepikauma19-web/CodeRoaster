import api from './api';
import type {
  AdminRoast,
  AdminRoastsQuery,
  AdminStats,
  AdminUser,
  AdminUsersQuery,
  AdminUserUpdate,
  Paginated,
} from '../types';

/** Drop undefined / empty-string params so they are not sent as `?search=`. */
const cleanParams = <T extends object>(query: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ) as Partial<T>;

export const getAdminStats = async (signal?: AbortSignal): Promise<AdminStats> => {
  const { data } = await api.get<AdminStats>('/admin/stats', { signal });
  return data;
};

export const listAdminUsers = async (
  query: AdminUsersQuery,
  signal?: AbortSignal,
): Promise<Paginated<AdminUser>> => {
  const { data } = await api.get<Paginated<AdminUser>>('/admin/users', {
    params: cleanParams(query),
    signal,
  });
  return data;
};

export const updateAdminUser = async (id: number, update: AdminUserUpdate): Promise<AdminUser> => {
  const { data } = await api.put<AdminUser>(`/admin/users/${id}`, update);
  return data;
};

export const listAdminRoasts = async (
  query: AdminRoastsQuery,
  signal?: AbortSignal,
): Promise<Paginated<AdminRoast>> => {
  const { data } = await api.get<Paginated<AdminRoast>>('/admin/roasts', {
    params: cleanParams(query),
    signal,
  });
  return data;
};

export const deleteAdminRoast = async (id: number): Promise<void> => {
  await api.delete(`/admin/roasts/${id}`);
};
