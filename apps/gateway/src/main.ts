import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import hbs from 'hbs';
import { AppModule } from './app.module';

const viewsDir = join(process.cwd(), 'apps/gateway/views');

hbs.registerHelper('eq', function (a: unknown, b: unknown) {
  return a === b;
});
hbs.registerHelper('toString', function (val: unknown) {
  return String(val);
});
hbs.registerHelper('multiply', function (a: unknown, b: unknown) {
  return (Number(a) * Number(b)).toFixed(2);
});
hbs.registerHelper('formatPrice', function (val: unknown) {
  return Number(val).toFixed(2);
});
hbs.registerHelper('gt', function (a: unknown, b: unknown) {
  return Number(a) > Number(b);
});
hbs.registerHelper('json', function (context: unknown) {
  return JSON.stringify(context);
});
hbs.registerHelper('add', function (a: unknown, b: unknown) {
  return Number(a) + Number(b);
});
hbs.registerHelper('subtract', function (a: unknown, b: unknown) {
  return Number(a) - Number(b);
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cookieParser());
  app.useStaticAssets(join(process.cwd(), 'apps/gateway/public'));
  app.setBaseViewsDir(viewsDir);
  app.setViewEngine('hbs');
  hbs.registerPartials(join(viewsDir, 'partials'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Gateway running on http://localhost:${port}`);
}

void bootstrap();
