import { container } from "tsyringe";
import { SvixUserWebhookAuthorizer } from "../app/api/webhooks/user/svixuserwebhookauthorizer";
import "reflect-metadata";

export const serverContainer = container.createChildContainer();

serverContainer.registerSingleton(
  "UserWebhookAuthorizer",
  SvixUserWebhookAuthorizer,
);
