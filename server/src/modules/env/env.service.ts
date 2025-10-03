import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { EnvSchema } from "@/common/schemas/env.schema";

@Injectable()
export class EnvService {
  constructor(private readonly config: ConfigService<EnvSchema>) {}

  get<K extends keyof EnvSchema>(key: K): EnvSchema[K] {
    const value = this.config.get(key);
    if (value === undefined) {
      throw new Error(`Missing env key: ${String(key)}`);
    }
    return value;
  }
}
