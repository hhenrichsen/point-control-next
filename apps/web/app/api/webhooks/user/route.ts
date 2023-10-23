import { serverContainer } from "../../../../util/server-container";
import { UserWebhookHandler } from "./userwebhookhandler";

const instance = serverContainer.resolve(UserWebhookHandler);

export const POST = instance.POST;
