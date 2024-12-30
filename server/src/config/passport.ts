import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import UserModel from "@/models/user";
import envConfig from "@/config/envConfig";

const normalizeProfile = ({
  id,
  displayName,
  _json,
  provider,
  emails,
}: any) => {
  const { email: jsonEmail, first_name, last_name, name: jsonName } = _json;
  const email = jsonEmail || emails?.[0]?.value;
  const name =
    jsonName || displayName || `${first_name || ""} ${last_name || ""}`.trim();

  if (!email) {
    throw new Error(`${provider} profile is missing an email address.`);
  }

  return { id, name, email };
};

const findOrCreateUser = async ({ provider, ...profile }: any) => {
  const { id, name, email } = normalizeProfile(profile);

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) return existingUser;

  const password = `${name.slice(-2)}${id.slice(-6)}`;
  return UserModel.create({
    name,
    email,
    password,
    [`${provider}Id`]: id,
  });
};

const handleOAuth = (profile: any, done: Function) => {
  findOrCreateUser(profile)
    .then((user) => done(null, user))
    .catch((error) => done(error, false));
};

passport.use(
  new GoogleStrategy(
    {
      clientID: envConfig.google.clientId,
      clientSecret: envConfig.google.clientSecret,
      callbackURL: envConfig.google.callbackURL,
      scope: ["email", "profile"],
    },
    (_, __, profile, done) => handleOAuth(profile, done)
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: envConfig.facebook.clientId,
      clientSecret: envConfig.facebook.clientSecret,
      callbackURL: envConfig.facebook.callbackURL,
      profileFields: ["id", "emails", "name"],
    },
    (_, __, profile, done) => handleOAuth(profile, done)
  )
);

export default passport;
