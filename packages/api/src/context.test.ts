import type {
  SignedInAuthObject,
  SignedOutAuthObject,
  User,
} from "@clerk/backend";
import { prisma } from "@pointcontrol/db/lib/prisma";
import { faker } from "@faker-js/faker";

export function withAnonContext<R extends void | Promise<void>>(
  run: (params: {
    ctx: { prisma: typeof prisma; auth: SignedOutAuthObject };
  }) => R,
): R {
  return run({
    ctx: {
      prisma,
      auth: {
        sessionClaims: null,
        sessionId: null,
        session: null,
        actor: null,
        userId: null,
        user: null,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        organization: null,
      },
    } as {
      prisma: typeof prisma;
      auth: SignedOutAuthObject;
    },
  });
}

export async function withAuthContext(
  run: (params: {
    userId: string;
    ctx: {
      prisma: typeof prisma;
      auth: SignedInAuthObject;
    };
  }) => void | Promise<void>,
  authPartial?: Partial<Exclude<SignedInAuthObject, "userId">>,
  userPartial?: Partial<Exclude<Exclude<User, "id">, "email_addresses">>,
): Promise<void> {
  const userId = `user_${faker.string.fromCharacters(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    27,
  )}`;

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  const email = faker.internet.email({
    firstName,
    lastName,
    provider: "example.com",
  });

  const data = {
    ...authPartial,
    userId,
  };

  await prisma.user.create({
    data: {
      id: userId,
      email,
      name: `${firstName} ${lastName}`,
    },
  });

  const params = {
    userId,
    ctx: {
      prisma,
      auth: {
        sessionClaims: null,
        sessionId: null,
        session: null,
        actor: null,
        user: {
          id: data.userId,
          passwordEnabled: false,
          totpEnabled: false,
          backupCodeEnabled: false,
          twoFactorEnabled: false,
          banned: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          profileImageUrl: "",
          imageUrl: "",
          hasImage: false,
          gender: "",
          birthday: "",
          primaryEmailAddressId: null,
          primaryPhoneNumberId: null,
          primaryWeb3WalletId: null,
          lastSignInAt: null,
          externalId: null,
          username: null,
          firstName,
          lastName,
          emailAddresses: [
            {
              email,
            },
          ],
          ...userPartial,
        },
        orgId: null,
        orgRole: null,
        orgSlug: null,
        organization: null,
        ...data,
      },
    } as {
      prisma: typeof prisma;
      auth: SignedInAuthObject;
    },
  };

  const res = run(params);
  if (res instanceof Promise) {
    await res;
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
}
