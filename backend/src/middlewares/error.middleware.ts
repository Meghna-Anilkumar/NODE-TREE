import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../constants/http.status";

interface IAppError extends Error {
  statusCode?: number;
}

export const errorMiddleware = (
  err: IAppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
  console.error(`Error:${err.message}`);
  res.status(statusCode).json({
    success: false,
    message: err.message ?? "Internal Server Error",
  });
};