/**
 * Implement Singleton Patterns in config file
 */

import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

const configFileSchema = z.object({
  env: z.enum(["development", "production", "test"]),
  port: z
    .number({
      required_error: "App Port is required",
    })
    .int()
    .gte(3000),
  mongodb: z.object({
    uri: z
      .string({
        required_error: "Mongodb uri is required",
      })
      .min(1),
    options: z.object({
      useUnifiedTopology: z.boolean().optional(),
      useNewUrlParser: z.boolean().optional(),
    }),
  }),
  logLevel: z.string({
    required_error: "Log level is required",
  }),
  saltWorkFactor: z.number({
    required_error: "Salt work factor is required",
  }),
  accessTokenTtl: z.string({
    required_error: "Access token expire is required",
  }),
  refreshTokenTtl: z.string({
    required_error: "Refresh token expire is required",
  }),
  accessTokenPrivateKey: z.string({
    required_error: "Access token private key is required",
  }),
  accessTokenPublicKey: z.string({
    required_error: "Access token public key is required",
  }),
  refreshTokenPrivateKey: z.string({
    required_error: "Refresh token private key is required",
  }),
  refreshTokenPublicKey: z.string({
    required_error: "Refresh token public key is required",
  }),
  email: z.object({
    smtp: z.object({
      host: z.string({
        required_error: "Smtp host is required",
      }),
      port: z.number({
        required_error: "Smtp port is required",
      }),
      secure: z.boolean({
        required_error: "Smtp secure is required",
      }),
    }),
    auth: z.object({
      user: z.string({
        required_error: "Smtp auth user is required",
      }),
      pass: z.string({
        required_error: "Smtp auth password is required",
      }),
    }),
    defaults: z.object({
      from: z
        .string({
          required_error: "Email from is required",
        })
        .email("From does not a valid email"),
    }),
  }),
});

type ConfigFile = z.TypeOf<typeof configFileSchema>;

export default class AppConfig {
  private static instance: AppConfig;
  config: ConfigFile;
  private constructor() {
    dotenv.config({ path: path.join(__dirname, "../../.env") });
    const envConfig = {
      env: process.env.NODE_ENV,
      port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
      mongodb: {
        uri: process.env.MONGODB_URI,
        // this options does not exist in mongoose v6+
        options: {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        },
      },
      logLevel: "debug",
      saltWorkFactor: 10,
      accessTokenTtl: "15m",
      refreshTokenTtl: "1y",
      accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
      accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
      refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
      refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY,
      email: {
        smtp: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT
            ? parseInt(process.env.SMTP_PORT)
            : undefined,
          secure: process.env.SMTP_SECURE
            ? process.env.SMTP_SECURE === "true"
            : false,
        },
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
        defaults: {
          from: process.env.EMAIL_FROM,
        },
      },
    };
    this.config = configFileSchema.parse(envConfig);
  }
  static getInstance(): AppConfig {
    return (this.instance ??= new AppConfig());
  }
}
