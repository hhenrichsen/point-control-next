import type { NextRequest } from "next/server";
import { singleton } from "tsyringe";
import { Webhook } from "svix";

const { CLERK_USER_WEBHOOK_SECRET_KEY } = process.env;

@singleton()
export class SvixUserWebhookAuthorizer {
  private readonly key: string;

  constructor() {
    if (!CLERK_USER_WEBHOOK_SECRET_KEY) {
      throw new Error("Missing CLERK_USER_WEBHOOK_SECRET_KEY");
    }
    this.key = CLERK_USER_WEBHOOK_SECRET_KEY;
  }

  isAuthorized(request: NextRequest, body: unknown): Promise<boolean> {
    try {
      const wh = new Webhook(this.key);
      const _ = wh.verify(
        JSON.stringify(body),
        Object.fromEntries(request.headers.entries()),
      );
      return Promise.resolve(true);
    } catch (_) {
      return Promise.resolve(false);
    }
  }
}
