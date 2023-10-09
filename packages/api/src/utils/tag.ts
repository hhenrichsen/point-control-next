import { inject, injectable } from "inversify";
import {
  PrismaClient,
  TagRuleType,
} from "@pointcontrol/db/lib/generated/client";
import { TRPCError } from "@trpc/server";
import { Types } from "../container";
import { MembershipManager } from "./membership";

@injectable()
export class TagManager {
  constructor(
    @inject(Types.Prisma) private readonly prisma: PrismaClient,
    @inject(MembershipManager) private readonly membership: MembershipManager,
  ) {}

  public async tag(tagUserId: string, codeText: string): Promise<void> {
    const code = await this.prisma.tagCode.findUniqueOrThrow({
      where: {
        code: codeText,
      },
      include: {
        user: true,
        game: true,
      },
    });

    const game = code.game;
    const target = code.user;

    const taggerMembership = await this.membership.getMembershipAndTeam(
      tagUserId,
      code.gameId,
    );

    if (!taggerMembership) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be a member of the game to tag.",
      });
    }

    const targetMembership = await this.membership.getMembershipAndTeam(
      target.id,
      game.id,
    );

    if (!targetMembership) {
      throw new Error(
        "Tagging a user who is not a member of the game that the code is for (how did we get here?).",
      );
    }

    const rules = await this.prisma.tagRule.findMany({
      where: {
        gameId: game.id,
        teamId: taggerMembership.team.id,
      },
    });

    let increment = 0;
    let targetTeam: string = targetMembership.teamId;
    let taggerTeam: string = taggerMembership.teamId;
    let tmp: string;
    for (const rule of rules.sort((a, b) => a.order - b.order)) {
      switch (rule.type) {
        case TagRuleType.DISALLOW:
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Members of ${taggerMembership.team.name} cannot tag members of ${targetMembership.team.name}.`,
          });
        case TagRuleType.ADD_POINTS:
          increment += rule.value ?? 1;
          break;
        case TagRuleType.SET_TEAM:
          targetTeam = rule.teamValueId ?? taggerMembership.teamId;
          break;
        case TagRuleType.SET_TAGGER_TEAM:
          taggerTeam = rule.teamValueId ?? taggerMembership.teamId;
          break;
        case TagRuleType.EXCHANGE_TEAM:
          tmp = targetTeam;
          targetTeam = taggerTeam;
          taggerTeam = tmp;
      }
    }
    if (targetTeam !== targetMembership.teamId) {
      await this.prisma.gameMembership.update({
        where: {
          id: targetMembership.id,
        },
        data: {
          teamId: targetTeam,
        },
      });
    }
    if (taggerTeam !== taggerMembership.teamId) {
      await this.prisma.gameMembership.update({
        where: {
          id: taggerMembership.id,
        },
        data: {
          teamId: taggerTeam,
        },
      });
    }
    await this.prisma.user.update({
      where: {
        id: tagUserId,
      },
      data: {
        lifetimeTags: {
          increment: 1,
        },
      },
    });
    if (increment > 0) {
      await this.prisma.team.update({
        where: {
          id: taggerMembership.team.id,
        },
        data: {
          points: {
            increment,
          },
        },
      });
    }
  }
}
