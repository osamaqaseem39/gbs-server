import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

let cachedApp: NestExpressApplication;

async function createApp(): Promise<NestExpressApplication> {
  if (cachedApp) {
    return cachedApp;
  }

  console.log('Initializing NestJS application...');
  const startTime = Date.now();
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug'],
    abortOnError: false, // Don't abort on errors, let the app continue
  });
  
  console.log(`NestJS application created in ${Date.now() - startTime}ms`);

  // Get config service
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Static assets from /public (only if directory exists, skip in serverless if needed)
  try {
    const publicPath = join(__dirname, '..', 'public');
    app.useStaticAssets(publicPath);
  } catch (error) {
    // Silently fail if public directory doesn't exist in serverless
    console.warn('Static assets directory not found, skipping...');
  }

  // CORS configuration
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || 'http://localhost:3000,https://shestrends.com,https://gbs-dashboard-ten.vercel.app';
  const allowedOrigins = allowedOriginsEnv
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

  const allowedOriginSuffixesEnv = process.env.ALLOWED_ORIGIN_SUFFIXES || '.vercel.app,.localhost';
  const allowedOriginSuffixes = allowedOriginSuffixesEnv
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  console.log('CORS Configuration:', {
    allowedOrigins,
    allowedOriginSuffixes,
    nodeEnv: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
  });

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, etc.)
      if (!origin) {
        console.log('CORS: Allowing request with no origin');
        return callback(null, true);
      }

      // Normalize origin to lowercase for comparison
      const normalizedOrigin = origin.toLowerCase();

      // Check for wildcard
      const wildcardAllowed = allowedOrigins.some(o => o.toLowerCase() === '*');
      
      // Check for exact match (case-insensitive)
      const exactAllowed = allowedOrigins.some(o => o.toLowerCase() === normalizedOrigin);
      
      // Check for suffix match
      const suffixAllowed = allowedOriginSuffixes.some(suffix => {
        const matches = normalizedOrigin.endsWith(suffix);
        if (matches) {
          console.log(`CORS: Origin ${origin} matched suffix ${suffix}`);
        }
        return matches;
      });

      // Also check if origin contains vercel.app (for any vercel deployment)
      const isVercelApp = normalizedOrigin.includes('.vercel.app');

      if (wildcardAllowed || exactAllowed || suffixAllowed || isVercelApp) {
        console.log(`CORS: Allowing origin ${origin} (wildcard: ${wildcardAllowed}, exact: ${exactAllowed}, suffix: ${suffixAllowed}, vercel: ${isVercelApp})`);
        return callback(null, true);
      }

      // Log for debugging
      console.warn(`CORS blocked origin: ${origin}. Allowed origins:`, allowedOrigins, 'Suffixes:', allowedOriginSuffixes);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With', 
      'Accept', 
      'Origin', 
      'Access-Control-Request-Method', 
      'Access-Control-Request-Headers',
      'X-API-Key'
    ],
    exposedHeaders: ['Content-Range', 'X-Total-Count'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400, // 24 hours
  });

  // Set global prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  const swaggerConfig = configService.get('swagger');
  if (swaggerConfig?.enabled) {
    const config = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const initStartTime = Date.now();
  await app.init();
  console.log(`NestJS application initialized in ${Date.now() - initStartTime}ms`);
  
  cachedApp = app;
  console.log('✅ NestJS application ready');
  return app;
}

export { createApp };

// For local development
if (process.env.NODE_ENV !== 'production') {
  async function bootstrap() {
    const app = await createApp();
    const configService = app.get(ConfigService);
    const port = configService.get('app.port') || 3001;
    
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
  }
  
  bootstrap();
} 