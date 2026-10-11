import api from './api';
import type { PublicRoastResponse, ShareToggleRequest } from '../types/roast';
import type { ShareToggleResult } from '../types/share';

/** PATCH /roasts/{id}/share — toggle public visibility (auth). 409 if not completed. */
export const toggleRoastShare = async (roastId: number, isPublic: boolean): Promise<ShareToggleResult> => {
  const body: ShareToggleRequest = { is_public: isPublic };
  const { data } = await api.patch<ShareToggleResult>(`/roasts/${roastId}/share`, body);
  return data;
};

/** GET /public/roasts/{slug} — public roast view (no auth). 404 when not public. */
export const getPublicRoast = async (shareSlug: string): Promise<PublicRoastResponse> => {
  const { data } = await api.get<PublicRoastResponse>(`/public/roasts/${encodeURIComponent(shareSlug)}`);
  return data;
};

/** Backend OG-tag share page that redirects to /r/:slug — this is the URL people share. */
export const buildShareUrl = (shareSlug: string): string =>
  `${import.meta.env.VITE_API_URL ?? ''}/api/v1/public/share/${encodeURIComponent(shareSlug)}`;
