import { Adapter, AdapterSession, AdapterUser } from 'next-auth/adapters'
import { prisma } from '../prisma'
import { destroyCookie, parseCookies } from 'nookies'
import { NextApiRequest, NextApiResponse } from 'next'

export function PrismaAdapter(
  req: NextApiRequest,
  res: NextApiResponse,
): Adapter {
  return {
    async createUser(user) {
      const { '@ignitecall:userId': userIdOnCookies } = parseCookies({ req })

      if (!userIdOnCookies) {
        throw new Error('User ID not fount on cookies')
      }

      const prismaUser = await prisma.user.update({
        where: {
          id: userIdOnCookies,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      })

      destroyCookie({ res }, '@ignitecall:userId', {
        path: '/',
      })

      return {
        id: prismaUser?.id,
        name: prismaUser?.name,
        email: prismaUser?.email,
        username: prismaUser?.username,
        emailVerified: null,
        avatar_url: prismaUser?.avatar_url,
      } as AdapterUser
    },
    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!user) {
        return null
      }

      return {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        username: user?.username,
        emailVerified: null,
        avatar_url: user?.avatar_url,
      } as AdapterUser
    },
    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        return null
      }

      return {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        username: user?.username,
        emailVerified: null,
        avatar_url: user?.avatar_url,
      } as AdapterUser
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
        include: {
          user: true,
        },
      })

      if (!account) {
        return null
      }

      const { user } = account

      return {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        username: user?.username,
        emailVerified: null,
        avatar_url: user?.avatar_url,
      } as AdapterUser
    },
    async updateUser(user) {
      const prismaUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      })

      return {
        id: prismaUser?.id,
        name: prismaUser?.name,
        email: prismaUser?.email,
        username: prismaUser?.username,
        emailVerified: null,
        avatar_url: prismaUser?.avatar_url,
      } as AdapterUser
    },
    async deleteUser(userId) {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      })
    },
    async linkAccount(account) {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          session_token: sessionToken,
          user_id: userId,
          expires,
        },
      })

      return {
        sessionToken,
        userId,
        expires,
      }
    },
    async getSessionAndUser(sessionToken) {
      const prismaSession = await prisma.session.findUnique({
        where: {
          session_token: sessionToken,
        },
        include: {
          user: true,
        },
      })

      if (!prismaSession) {
        return null
      }

      const { user, ...session } = prismaSession

      return {
        session: {
          expires: session.expires,
          sessionToken: session.session_token,
          userId: session.user_id,
        } as AdapterSession,
        user: {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          username: user?.username,
          emailVerified: null,
          avatar_url: user?.avatar_url,
        } as AdapterUser,
      }
    },
    async updateSession({ sessionToken, expires, userId }) {
      if (sessionToken) {
        const prismaSession = await prisma.session.update({
          where: { session_token: sessionToken },
          data: {
            expires,
            user_id: userId,
          },
        })

        return {
          sessionToken: prismaSession.session_token,
          userId: prismaSession.user_id,
          expires: prismaSession.expires,
        } as AdapterSession
      }
    },
  }
}
