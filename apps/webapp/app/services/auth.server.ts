import { Authenticator } from "remix-auth";
import type { AuthUser } from "./authUser";
import { addEmailLinkStrategy } from "./emailAuth.server";
import { addMicrosoftStrategy } from "./microsoftAuth.server";
import { addGitHubStrategy } from "./gitHubAuth.server";
import { sessionStorage } from "./sessionStorage.server";
import { env } from "~/env.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
const authenticator = new Authenticator<AuthUser>(sessionStorage);

const isGithubAuthSupported =
  typeof env.AUTH_GITHUB_CLIENT_ID === "string" &&
  typeof env.AUTH_GITHUB_CLIENT_SECRET === "string";

if (env.AUTH_GITHUB_CLIENT_ID && env.AUTH_GITHUB_CLIENT_SECRET) {
  addGitHubStrategy(authenticator, env.AUTH_GITHUB_CLIENT_ID, env.AUTH_GITHUB_CLIENT_SECRET);
}

const isMicrosoftAuthSupported =
  typeof env.AUTH_MICROSOFT_CLIENT_ID === "string" &&
  typeof env.AUTH_MICROSOFT_CLIENT_SECRET === "string" &&
  typeof env.AUTH_MICROSOFT_TENANT_ID === "string"

if (env.AUTH_MICROSOFT_CLIENT_ID && env.AUTH_MICROSOFT_CLIENT_SECRET && env.AUTH_MICROSOFT_TENANT_ID) {
  addMicrosoftStrategy(authenticator, env.AUTH_MICROSOFT_CLIENT_ID, env.AUTH_MICROSOFT_CLIENT_SECRET, env.AUTH_MICROSOFT_TENANT_ID)
}

addEmailLinkStrategy(authenticator);

export { authenticator, isGithubAuthSupported, isMicrosoftAuthSupported };
