"use client";

import { LoadingButton } from "@/components/ui/button";
import { IconBrandFacebook, IconBrandGoogle } from "@tabler/icons-react";
import { useTransition } from "react";
import { facebookLogin, googleLogin } from "../actions";

const socialProviders = {
  google: {
    icon: <IconBrandGoogle className="w-5 h-5" />,
  },
  facebook: {
    icon: <IconBrandFacebook className="w-5 h-5" />,
  },
};

export function SocialButton({
  provider,
  type,
}: {
  provider: "google" | "facebook";
  type: "sign-in" | "sign-up";
}) {
  const [isPending, startTransition] = useTransition();
  const { icon } = socialProviders[provider];

  const handleSocialLogin = async () => {
    startTransition(async () => {
      if (provider === "google") {
        await googleLogin();
      } else if (provider === "facebook") {
        await facebookLogin();
      }
    });
  };

  return (
    <LoadingButton
      onClick={handleSocialLogin}
      className="w-full gap-2"
      type="button"
      loading={isPending}
      disabled={isPending}
    >
      {icon}
      <span className="text-sm">
        {isPending
          ? `${type === "sign-in" ? "Signing in" : "Signing up"} with ${
              provider === "google" ? "Google" : "Facebook"
            }...`
          : `${type === "sign-in" ? "Sign in" : "Sign up"} with ${
              provider === "google" ? "Google" : "Facebook"
            }`}
      </span>
    </LoadingButton>
  );
}
