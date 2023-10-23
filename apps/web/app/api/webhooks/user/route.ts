import { prisma } from "@pointcontrol/db/lib/prisma";
import { HttpStatusCode } from "@pointcontrol/status-codes";
import { NextResponse } from "next/server";
import * as z from "zod";
import { inject, injectable } from "tsyringe";
import { serverContainer } from "../../../../util/server-container";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- TS wants this to be a type import
import type { UserWebhookAuthorizer } from "./userwebhookauthorizer";

@injectable()
export class UserWebhookHandler {
  private static UpdateSchema = z.object({
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

  private static Schema = z.discriminatedUnion("type", [
    UserWebhookHandler.UpdateSchema.extend({
      type: z.literal("user.created"),
    }),
    UserWebhookHandler.UpdateSchema.extend({
      type: z.literal("user.updated"),
    }),
    z.object({
      type: z.literal("user.deleted"),
      data: z.object({ id: z.string() }),
    }),
  ]);
  constructor(
    @inject("UserWebhookAuthorizer")
    private readonly webhookAuthorizer: UserWebhookAuthorizer,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Types seem fine, looks like a false positive
    this.POST = this._POST.bind(this);
  }

  public readonly POST: (request: Request) => Promise<NextResponse>;

  private async _POST(request: Request): Promise<NextResponse> {
    try {
      const json: unknown = await request.json();
      if (!(await this.webhookAuthorizer.isAuthorized(request, json))) {
        return new NextResponse(null, {
          status: HttpStatusCode.UNAUTHORIZED,
        });
      }
      const body = UserWebhookHandler.Schema.parse(json);
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
    } catch (e: unknown) {
      const isErrorWithCode = z.object({
        code: z.string(),
      });
      const errorWithCode = isErrorWithCode.safeParse(e);

      if (e instanceof z.ZodError) {
        return new NextResponse(JSON.stringify(e), {
          status: HttpStatusCode.BAD_REQUEST,
        });
      }
      // Prisma "not found" error
      else if (errorWithCode.success && errorWithCode.data.code === "P2025") {
        return new NextResponse(undefined, {
          status: HttpStatusCode.NOT_FOUND,
        });
      }
      return new NextResponse(undefined, {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }
}

const instance = serverContainer.resolve(UserWebhookHandler);

export const POST = instance.POST;
