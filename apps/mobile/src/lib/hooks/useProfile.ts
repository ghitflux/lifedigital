import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryClient";
import { useAuthStore } from "../../stores/authStore";
import { useProfileStore } from "../../stores/profileStore";
import {
  getProfile,
  updateCPF as updateCPFRequest,
  updateProfile as updateProfileRequest,
  updateWhatsApp as updateWhatsAppRequest,
  verifyOTP as verifyOTPRequest,
} from "../../services/api";
import type {
  Profile,
  UpdateCPFRequest,
  UpdateCPFResponse,
  UpdateProfileRequest,
  UpdateWhatsAppRequest,
  UpdateWhatsAppResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from "../../services/api";

export function useProfile() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setProfile = useProfileStore((state) => state.setProfile);

  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: (): Promise<Profile> => getProfile(),
    enabled: Boolean(accessToken),
    onSuccess: (data) => setProfile(data),
  });
}

export function useUpdateCPF() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateCPFRequest): Promise<UpdateCPFResponse> =>
      updateCPFRequest(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
    onError: (error) => {
      console.error("Failed to update CPF:", error);
    },
  });
}

export function useUpdateWhatsApp() {
  return useMutation({
    mutationFn: (
      request: UpdateWhatsAppRequest,
    ): Promise<UpdateWhatsAppResponse> => updateWhatsAppRequest(request),
    onError: (error) => {
      console.error("Failed to update WhatsApp:", error);
    },
  });
}

export function useVerifyOTP() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: VerifyOTPRequest): Promise<VerifyOTPResponse> =>
      verifyOTPRequest(request),
    onSuccess: (data) => {
      if (data.verified) {
        queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      }
    },
    onError: (error) => {
      console.error("Failed to verify OTP:", error);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateProfileRequest): Promise<Profile> =>
      updateProfileRequest(request),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.profile, data);
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
    },
  });
}
