export const getLazyRegisterSchema = () =>
  import("./authSchema").then((module) => module.registerSchema);

export const getLazyLoginSchema = () =>
  import("./authSchema").then((module) => module.loginSchema);

export const getLazyVerifyEmailSchema = () =>
  import("./authSchema").then((module) => module.verifyEmailSchema);

export const getLazyForgotPasswordSchema = () =>
  import("./authSchema").then((module) => module.forgotPasswordSchema);

export const getLazyResetPasswordSchema = () =>
  import("./authSchema").then((module) => module.resetPasswordSchema);
