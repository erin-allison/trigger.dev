import type { Authenticator } from "remix-auth";
import { MicrosoftStrategy } from "remix-auth-microsoft";
import { env } from "~/env.server";
import { findOrCreateUser } from "~/models/user.server";
import type { AuthUser } from "./authUser";
import { postAuthentication } from "./postAuth.server";
import { logger } from "./logger.server";

export function addMicrosoftStrategy(
  authenticator: Authenticator<AuthUser>,
  clientId: string,
  clientSecret: string,
  tenantId: string
) {
  const microsoftStrategy = new MicrosoftStrategy(
    {
      clientId,
      clientSecret,
      tenantId,
      redirectUri: `${env.LOGIN_ORIGIN}/auth/microsoft/callback`,
    },
    async ({ extraParams, profile, accessToken }) => {
      const emails = profile.emails;

      if (!emails) {
        throw new Error("Microsoft login requires an email address");
      }

      try {
        logger.debug("Microsoft login", {
          emails,
          profile,
          extraParams,
        });

        // TODO add ability for roles to be passed to specify admin access
        // TODO handle the access token to manually load profile pictures
        const { user, isNewUser } = await findOrCreateUser({
          email: emails[0].value,
          authenticationMethod: "MICROSOFT",
          authenticationProfile: profile,
          authenticationExtraParams: extraParams,
        });

        await postAuthentication({ user, isNewUser, loginMethod: "MICROSOFT" });


        return {
          userId: user.id,
        };
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  );

  authenticator.use(microsoftStrategy);
}
