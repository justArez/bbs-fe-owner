import * as httpRequest from '@/libs/axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Court, CourtReq } from '../types';

const getListCourt = async (centerId: string): Promise<Court[]> => {
    try {
        const response: Court[] = await httpRequest.get(`/badminton-booking/api/court?centerId=${centerId}`);
        return response;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getCourt = async (centerId: string, courtId: string): Promise<Court | null> => {
    if (!centerId) return null;

    let url = `/badminton-booking/api/court?centerId=${centerId}`;
    if (courtId) {
        url += `&courtId=${courtId}`;
    }

    try {
        const response: Court = await httpRequest.get(url);
        return response;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const createCourt = async (data: CourtReq): Promise<Court> => {
    try {
        const response: Court = await httpRequest.post('/badminton-booking/api/court', data);
        return response;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const updateCourt = async (data: CourtReq): Promise<Court> => {
    try {
        const response: Court = await httpRequest.put(`/badminton-booking/api/court`, data);
        return response;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const useGetListCourt = (centerId: string) => {
    return useQuery({
        queryKey: ['courts', centerId],
        queryFn: () => getListCourt(centerId),
        staleTime: Infinity,
    });
};

export const useGetCourt = (centerId: string, courtId: string) => {
    return useQuery({
        queryKey: ['court', centerId, courtId],
        queryFn: () => getCourt(centerId, courtId),
        staleTime: Infinity,
        enabled: !!centerId && !!courtId,
    });
};

export const useCreateCourtMutation = (
    handleFn: {
        onError?: (error: unknown, variables: CourtReq, context: unknown) => void;
        onSuccess?: (data: Court, variables: CourtReq, context: unknown) => void;
        onMutate?: (variables: CourtReq) => Promise<Court>;
    },
    retry?: number,
) => {
    return useMutation({
        mutationFn: createCourt,
        onError: handleFn.onError,
        onSuccess: handleFn.onSuccess,
        onMutate: handleFn.onMutate,
        retry,
    });
};

export const useUpdateCourtMutation = (
    handleFn: {
        onError?: (error: unknown, variables: CourtReq, context: unknown) => void;
        onSuccess?: (data: Court, variables: CourtReq, context: unknown) => void;
        onMutate?: (variables: CourtReq) => Promise<Court>;
    },
    retry?: number,
) => {
    return useMutation({
        mutationFn: (data: CourtReq) => updateCourt(data),
        onError: handleFn.onError,
        onSuccess: handleFn.onSuccess,
        onMutate: handleFn.onMutate,
        retry,
    });
};