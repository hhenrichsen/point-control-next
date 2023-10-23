import type { NextRequest } from "next/server";
import { singleton } from "tsyringe";
import type { UserWebhookAuthorizer } from "./userwebhookauthorizer";

@singleton()
export class NullUserWebhookAuthorizer implements UserWebhookAuthorizer {
  isAuthorized(_request: NextRequest, _body: unknown): Promise<boolean> {
    return Promise.resolve(true);
  }
}
