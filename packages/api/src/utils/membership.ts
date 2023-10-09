import { PrismaClient } from "@pointcontrol/db/lib/generated/client";
import type {
  GameMembership,
  Team,
} from "@pointcontrol/db/lib/generated/client";
import { Types } from "../types";
import { inject, injectable } from "inversify";

@injectable()
export class MembershipManager {
  constructor(@inject(Types.Prisma) private readonly prisma: PrismaClient) {}

  public async getMembershipAndTeam(
    userId: string,
    gameId: string,
  ): Promise<(GameMembership & { team: Team }) | null> {
    const membership = await this.prisma.gameMembership.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
      include: {
        team: true,
      },
    });
    return membership;
  }
}
