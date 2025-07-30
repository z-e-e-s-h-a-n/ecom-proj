import {
  Catch,
  HttpException,
  HttpStatus,
  type ExceptionFilter,
  type ArgumentsHost,
} from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: any = "Internal server error";

    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      if (
        typeof res === "object" &&
        res &&
        "message" in res &&
        Array.isArray((res as any).message)
      ) {
        // Nest's ValidationPipe puts field errors in res.message
        message = (res as any).message;
      } else if (typeof res === "string") {
        message = res;
      } else if (typeof exception.message === "string") {
        message = exception.message;
      }
    }
    // if (response.headersSent) return;

    response.status(status).json({
      status,
      data: null,
      message,
      success: false,
    });
  }
}
