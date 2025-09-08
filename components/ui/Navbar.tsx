import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import Image from "next/image";

import { siteConfig } from "@/config/site";

export const Navbar = () => {
  return (
    <HeroUINavbar
      className="z-50 fixed top-3 left-1/2 -translate-x-1/2 w-full max-w-6xl mx-auto px-4 rounded-2xl"
      maxWidth="full"
    >
      {/* Left side (logo) */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink
            className="flex justify-start items-center gap-2 stroke-background"
            href="/"
          >
            <Image alt="Logo" height={102} src="/Logo.png" width={130} />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      {/* Center navigation */}
      <NavbarContent className="hidden lg:flex basis-1/3" justify="center">
        <ul className="flex gap-8">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      {/* Right side (buttons) */}
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem>
          <NextLink
            className="px-4 py-2 rounded-lg border-2 border-adult-green text-sm font-medium hover:bg-adult-green hover:text-white transition"
            href="/auth/register"
          >
            Sign Up
          </NextLink>
        </NavbarItem>

        <NavbarItem>
          <NextLink
            className="px-4 py-2 rounded-lg text-sm font-medium bg-crayola-orange border-2 border-orange-800 text-white hover:bg-orange-800 transition"
            href="/auth/login"
          >
            Login
          </NextLink>
        </NavbarItem>

        <NavbarItem className="hidden md:flex" />
      </NavbarContent>
    </HeroUINavbar>
  );
};
