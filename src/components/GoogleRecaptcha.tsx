import { PropsWithChildren } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const APP_RECAPTCHA_V3_KEY = import.meta.env.VITE_RECAPTCHA_V3_KEY;

const Captcha = ({ children }: PropsWithChildren) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={APP_RECAPTCHA_V3_KEY}
      language="ru"
      scriptProps={{
        defer: true,
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default Captcha;
