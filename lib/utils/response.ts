import { ApiResponse } from "@/types/api.types";

export function apiSuccess<T = unknown>({
  data,
  message = "Success",
  statusCode = 200,
}: {
  data: T;
  message?: string;
  statusCode?: number;
}): Response {
  return Response.json(
    {
      success: true,
      statusCode,
      message,
      data,
    },
    { status: statusCode }
  );
}

export function apiError({
  message = "Something went wrong",
  statusCode = 400,
  data = null,
}: {
  message?: string;
  statusCode?: number;
  data?: unknown;
}): Response {
  return Response.json(
    {
      success: false,
      statusCode,
      message,
      data,
    },
    { status: statusCode }
  );
}

export function actionSuccess<T = unknown>({
  data,
  message = "Success",
  statusCode = 200,
}: {
  data: T;
  message?: string;
  statusCode?: number;
}): ApiResponse<T> {
  return {
    success: true,
    statusCode,
    message,
    data,
  };
}

export function actionError<T = unknown>({
  message = "Something went wrong",
  statusCode = 400,
  data = null,
}: {
  message?: string;
  statusCode?: number;
  data?: T | null;
}): ApiResponse<T> {
  return {
    success: false,
    statusCode,
    message,
    data,
  };
}
