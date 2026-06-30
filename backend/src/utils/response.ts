import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '@/types';

export function successResponse<T>(res: Response, data: T, message = 'Success', status = 200): Response {
  return res.status(status).json({
    success: true,
    data,
    message,
  } as ApiResponse<T>);
}

export function errorResponse(res: Response, error: string, status = 400): Response {
  return res.status(status).json({
    success: false,
    error,
  });
}

export function paginatedResponse<T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  status = 200
): Response {
  const pages = Math.ceil(total / limit);
  
  return res.status(status).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  } as PaginatedResponse<T>);
}
