import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import UserModel, { TProviderKeys } from "@/models/user";
import envConfig from "@/config/env";
import { sendOtp } from "@/lib/actions/user";

const normalizeProfile = ({
  id,
  displayName,
  _json,
  provider,
  emails,
}: any) => {
  const { email: jsonEmail, first_name, last_name, name: jsonName } = _json;
  const email = jsonEmail || emails?.[0]?.value;

  if (!email) {
    throw new Error(`${provider} profile is missing an email address.`);
  }

  return {
    id,
    firstName:
      first_name || ((displayName || jsonName) as string).split(" ")[0],
    lastName: last_name,
    email,
  };
};

const findOrCreateUser = async ({ provider, ...profile }: any) => {
  const { id, firstName, lastName, email } = normalizeProfile(profile);
  const providerKey = `${provider.toLowerCase()}Id` as TProviderKeys;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    if (!existingUser[providerKey]) {
      existingUser[providerKey] = id;
      await existingUser.save();
    }
    return existingUser;
  }
  const newUser = await UserModel.create({
    firstName,
    lastName,
    email,
    isAuth: true,
    [providerKey]: id,
  });

  if (newUser._id) {
    await sendOtp({ userId: newUser._id, email, purpose: "setPassword" });
  }

  return newUser;
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
