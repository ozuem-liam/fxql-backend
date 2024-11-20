import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";

export type CustomErrorTypes =
  | BadRequestException
  | NotFoundException
  | InternalServerErrorException;

export interface GlobalResponseType<T> {
  message: string;
  code: string;
  data: T | CustomErrorTypes | null;
}

export interface GlobalSuccessRequestPayload<T> {
  message: string;
  data: T;
}

export interface LoggerSetupParams {
  node_env: string;
  sentry_dsn: string;
  log_to_console: boolean;
}

export interface IRandomize {
  number?: boolean;
  alphanumeric?: boolean;
  string?: boolean;
  mixed?: boolean;
  count?: number;
}