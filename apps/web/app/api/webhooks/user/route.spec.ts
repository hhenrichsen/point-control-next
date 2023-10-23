import { describe, it, expect } from "vitest";
import { faker } from "@faker-js/faker";
import { container } from "tsyringe";
import { UserWebhookHandler } from "./route";
import { NullUserWebhookAuthorizer } from "./nulluserwebhookauthorizer";

// @vitest-environment node
describe(module.id, () => {
  const POST = container
    .createChildContainer()
    .register("UserWebhookAuthorizer", NullUserWebhookAuthorizer)
    .resolve(UserWebhookHandler).POST;

  describe("create and delete a user", () => {
    const userId = `user_${faker.string.fromCharacters(
      "abcdefghijklmnopqrstuvwxyz0123456789",
      27,
    )}`;

    it("should create a user", async () => {
      const first = faker.person.firstName();
      const last = faker.person.lastName();
      const createReq = new Request("localhost:3000/api/webhooks/user", {
        body: JSON.stringify({
          type: "user.created",
          data: {
            id: userId,
            email_addresses: [
              {
                email_address: faker.internet.email({
                  firstName: first,
                  lastName: last,
                  provider: "example.com",
                }),
              },
            ],
            first_name: first,
            last_name: last,
          },
        }),
        method: "POST",
      });

      const createRes = await POST(createReq);
      expect(createRes.status).toBe(200);
    });

    it("should 400 on mangled bodies", async () => {
      const first = faker.person.firstName();
      const last = faker.person.lastName();
      const createReq = new Request("localhost:3000/api/webhooks/user", {
        body: JSON.stringify({
          type: "user.created",
          data: {
            email_addresses: [
              {
                email_address: faker.internet.email({
                  firstName: first,
                  lastName: last,
                  provider: "example.com",
                }),
              },
            ],
          },
        }),
        method: "POST",
      });

      const createRes = await POST(createReq);
      expect(createRes.status).toBe(400);
    });

    it("should 400 on invalid 'type's", async () => {
      const first = faker.person.firstName();
      const last = faker.person.lastName();
      const createReq = new Request("localhost:3000/api/webhooks/user", {
        body: JSON.stringify({
          type: "user.other",
          data: {
            id: userId,
            email_addresses: [
              {
                email_address: faker.internet.email({
                  firstName: first,
                  lastName: last,
                  provider: "example.com",
                }),
              },
            ],
            first_name: first,
            last_name: last,
          },
        }),
        method: "POST",
      });

      const createRes = await POST(createReq);
      expect(createRes.status).toBe(400);
    });

    it("should delete a user", async () => {
      const body = {
        type: "user.deleted",
        data: {
          id: userId,
        },
      };

      const deleteReq = new Request("localhost:3000/api/webhooks/user", {
        body: JSON.stringify(body),
        method: "POST",
      });

      // Should be fine the first time we ask for it
      const deleteRes = await POST(deleteReq);
      expect(deleteRes.status).toBe(200);

      const deleteReq2 = new Request("localhost:3000/api/webhooks/user", {
        body: JSON.stringify(body),
        method: "POST",
      });
      // Shouldn't find anything the next time and error
      const deleteRes2 = await POST(deleteReq2);
      expect(deleteRes2.status).toBe(404);
    });
  });
});
