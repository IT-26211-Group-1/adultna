import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
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
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
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

      {/* Mobile menu toggle (visible on small screens) */}
      <NavbarContent className="flex lg:hidden basis-1/3" justify="end">
        <NavbarItem>
          <NavbarMenuToggle className="p-2 rounded-md hover:bg-muted" />
        </NavbarItem>
      </NavbarContent>

      {/* Right side (buttons) */}
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem>
          <NextLink
            className="px-8 py-3 rounded-lg  text-sm font-medium hover:bg-adult-green hover:text-white transition"
            href="/auth/register"
          >
            Sign Up
          </NextLink>
        </NavbarItem>

        <NavbarItem>
          <NextLink
            className="px-8 py-3 rounded-lg text-sm font-medium bg-adult-green text-white hover:bg-orange-800 transition"
            href="/auth/login"
          >
            Login
          </NextLink>
        </NavbarItem>

        <NavbarItem className="hidden md:flex" />
      </NavbarContent>

      {/* Mobile menu (collapsible) */}
      <NavbarMenu className="lg:hidden">
        <ul className="flex flex-col gap-4 p-4">
          {siteConfig.navItems.map((item) => (
            <li key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "block w-full text-left text-base"
                )}
                href={item.href}
              >
                {item.label}
              </NextLink>
            </li>
          ))}

          <li>
            <NextLink
              className="block w-full px-4 py-2 rounded-lg text-base font-medium hover:bg-adult-green hover:text-white transition"
              href="/auth/register"
            >
              Sign Up
            </NextLink>
          </li>

          <li>
            <NextLink
              className="block w-full px-4 py-2 rounded-lg text-base font-medium bg-adult-green text-white hover:bg-orange-800 transition"
              href="/auth/login"
            >
              Login
            </NextLink>
          </li>
        </ul>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
