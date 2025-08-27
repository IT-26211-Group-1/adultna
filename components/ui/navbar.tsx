import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/ui/theme-switch";

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink
            className="flex justify-start items-center gap-2 stroke-background"
            href="/"
          >
            <img src="/Logo.png" alt="Logo" style={{ height: "32px" }} />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden lg:flex basis-1/3" justify="center">
        <ul className="flex gap-8">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium "
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
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem>
          <NextLink
            href="/register"
            className="px-4 py-2 rounded-lg border-2 border-adult-green text-sm font-medium hover:bg-adult-green hover:text-white transition"
          >
            Sign Up
          </NextLink>
        </NavbarItem>
        <NavbarItem>
          <NextLink
            href="/login"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-crayola-orange border-2 border-orange-800 text-white hover:bg-orange-800 transition"
          >
            Login
          </NextLink>
        </NavbarItem>

        <NavbarItem className="hidden md:flex"></NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
