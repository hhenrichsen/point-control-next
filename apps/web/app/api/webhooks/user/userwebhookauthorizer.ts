export interface UserWebhookAuthorizer {
  isAuthorized: (request: Request, body: unknown) => Promise<boolean>;
}
