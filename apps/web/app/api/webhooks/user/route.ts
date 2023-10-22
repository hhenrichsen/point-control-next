import { prisma } from "@pointcontrol/db/lib/prisma";
import { HttpStatusCode } from "@pointcontrol/status-codes";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Webhook, WebhookVerificationError } from "svix";
import * as z from "zod";

const UserWebhookUpdateSchema = z.object({
  data: z.object({
    id: z.string(),
    email_addresses: z.array(
      z.object({
        email_address: z.string(),
      }),
    ),
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
  }),
});

const UserWebhookSchema = z.discriminatedUnion("type", [
  UserWebhookUpdateSchema.extend({
    type: z.literal("user.created"),
  }),
  UserWebhookUpdateSchema.extend({
    type: z.literal("user.updated"),
  }),
  z.object({
    type: z.literal("user.deleted"),
    data: z.object({ id: z.string() }),
  }),
]);

const { CLERK_USER_WEBHOOK_SECRET_KEY } = process.env;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload: unknown = await request.json();

    if (!CLERK_USER_WEBHOOK_SECRET_KEY) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET_KEY");
    }

    const wh = new Webhook(CLERK_USER_WEBHOOK_SECRET_KEY);
    const evt = wh.verify(
      JSON.stringify(payload),
      Object.fromEntries(request.headers.entries()),
    );

    const body = UserWebhookSchema.parse(evt);
    if (body.type === "user.deleted") {
      await prisma.user.delete({
        where: {
          id: body.data.id,
        },
      });
    } else {
      await prisma.user.upsert({
        where: {
          id: body.data.id,
        },
        update: {
          email: body.data.email_addresses[0]?.email_address,
          name: `${body.data.first_name} ${body.data.last_name ?? ""}`.trim(),
        },
        create: {
          id: body.data.id,
          email: body.data.email_addresses[0]?.email_address,
          name: `${body.data.first_name} ${body.data.last_name ?? ""}`.trim(),
        },
      });
    }
    return new NextResponse(undefined, {
      status: HttpStatusCode.OK,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(e), {
        status: HttpStatusCode.BAD_REQUEST,
      });
    } else if (e instanceof WebhookVerificationError) {
      return new NextResponse(JSON.stringify(e), {
        status: HttpStatusCode.UNAUTHORIZED,
      });
    }
    return new NextResponse(undefined, {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
}
