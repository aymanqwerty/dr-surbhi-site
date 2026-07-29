"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchBlogCategories } from "@/lib/blog-api";
import {
  addMember,
  deleteMember,
  getMe,
  getPublicDoctor,
  getPublicSettings,
  listAvailabilityDates,
  listMembers,
  listMyAppointments,
  listSlots,
  updateMember,
  upsertProfile,
  type MemberPayload,
  type ProfilePayload,
} from "@/lib/patient-api";

export const ME_KEY = ["me"] as const;
export const MEMBERS_KEY = ["members"] as const;
export const APPOINTMENTS_KEY = ["appointments"] as const;

/**
 * Blog categories, for the nav dropdown.
 *
 * Only categories with published posts come back, so an entry never leads to
 * an empty page. Cached for the session — these change rarely.
 */
export function useBlogCategories() {
  return useQuery({
    queryKey: ["blog-categories"],
    queryFn: fetchBlogCategories,
    staleTime: 5 * 60_000,
  });
}

/** Current patient session (null when signed out). */
export function usePatientSession() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: getMe,
    staleTime: 60_000,
  });
}

export function useSessionRefresh() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: ME_KEY });
    void queryClient.invalidateQueries({ queryKey: MEMBERS_KEY });
    void queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
  };
}

export function usePublicDoctor() {
  return useQuery({ queryKey: ["public-doctor"], queryFn: getPublicDoctor });
}

export function usePublicSettings() {
  return useQuery({ queryKey: ["public-settings"], queryFn: getPublicSettings });
}

export function useSlots(clinicId: string | null, slotDate: string | null) {
  return useQuery({
    queryKey: ["slots", clinicId, slotDate],
    queryFn: () => listSlots(clinicId as string, slotDate as string),
    enabled: Boolean(clinicId && slotDate),
  });
}

export function useAvailabilityDates(
  clinicId: string | null,
  dateFrom: string | null,
  dateTo: string | null,
) {
  return useQuery({
    queryKey: ["availability-dates", clinicId, dateFrom, dateTo],
    queryFn: () =>
      listAvailabilityDates(clinicId as string, dateFrom as string, dateTo as string),
    enabled: Boolean(clinicId && dateFrom && dateTo),
  });
}

export function useMyMembers(enabled = true) {
  return useQuery({ queryKey: MEMBERS_KEY, queryFn: listMembers, enabled });
}

export function useMyAppointments(enabled = true) {
  return useQuery({
    queryKey: APPOINTMENTS_KEY,
    queryFn: listMyAppointments,
    enabled,
  });
}

export function useUpsertProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProfilePayload) => upsertProfile(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ME_KEY }),
  });
}

export function useAddMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MemberPayload) => addMember(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MEMBERS_KEY }),
  });
}

export function useUpdateMember(memberId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<MemberPayload>) => updateMember(memberId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MEMBERS_KEY }),
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => deleteMember(memberId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MEMBERS_KEY }),
  });
}
