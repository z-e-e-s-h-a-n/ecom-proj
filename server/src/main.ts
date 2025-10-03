import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import cookieParser from "cookie-parser";
import { GlobalValidationPipe } from "@/common/pipes/validation.pipe";
import { AllExceptionsFilter } from "@/common/filters/exceptions.filter";
import { ResponseInterceptor } from "@/common/interceptors/response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(GlobalValidationPipe);
  await app.listen(4000);
}
bootstrap();
