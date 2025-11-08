"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
} from "@heroui/navbar";
import NextLink from "next/link";
import clsx from "clsx";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";

export const Navbar = () => {
  const pathname = usePathname();

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
      <NavbarContent className="hidden md:flex basis-1/3" justify="center">
        <ul className="flex gap-8">
          {siteConfig.navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    "relative px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out",
                    "before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-0.5 before:bg-adult-green before:transition-all before:duration-300 before:ease-in-out before:-translate-x-1/2",
                    "hover:before:w-full hover:scale-105",
                    isActive
                      ? "text-adult-green font-semibold before:w-full"
                      : "text-gray-700 hover:text-adult-green",
                  )}
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            );
          })}
        </ul>
      </NavbarContent>

      {/* Mobile menu toggle (visible on small screens) */}
      <NavbarContent className="flex md:hidden basis-1/3" justify="end">
        <NavbarItem>
          <NavbarMenuToggle className="p-2 rounded-xl hover:bg-adult-green/10 hover:text-adult-green transition-all duration-300 ease-in-out transform hover:scale-110" />
        </NavbarItem>
      </NavbarContent>

      {/* Right side (buttons) */}
      <NavbarContent
        className="hidden md:flex basis-1/5 sm:basis-full gap-3"
        justify="end"
      >
        <NavbarItem>
          <NextLink
            className="relative px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-adult-green hover:bg-adult-green/10 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            href="/auth/register"
          >
            Sign Up
          </NextLink>
        </NavbarItem>

        <NavbarItem>
          <NextLink
            className="relative px-6 py-2.5 rounded-xl text-sm font-semibold bg-adult-green text-white hover:bg-adult-green/90 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl shadow-adult-green/25 overflow-hidden group"
            href="/auth/login"
          >
            <span className="relative z-10">Login</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -inset-1 bg-gradient-to-r from-adult-green to-green-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-all duration-300" />
          </NextLink>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile menu (collapsible) */}
      <NavbarMenu className="lg:hidden">
        <ul className="flex flex-col gap-4 p-4">
          {siteConfig.navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <NextLink
                  className={clsx(
                    "block w-full text-left text-base px-4 py-3 rounded-lg font-medium transition-all duration-300 ease-in-out transform hover:translate-x-1",
                    isActive
                      ? "text-adult-green bg-adult-green/10 font-semibold"
                      : "text-gray-700 hover:text-adult-green hover:bg-adult-green/5",
                  )}
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </li>
            );
          })}

          <li>
            <NextLink
              className="block w-full px-4 py-3 text-base font-medium text-gray-700 hover:text-adult-green hover:bg-adult-green/10 transition-all duration-300 ease-in-out text-center rounded-lg transform hover:scale-[1.02]"
              href="/auth/register"
            >
              Sign Up
            </NextLink>
          </li>

          <li>
            <NextLink
              className="relative block w-full px-5 py-3 rounded-xl text-base font-semibold bg-adult-green text-white hover:bg-adult-green/90 transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-xl shadow-adult-green/25 text-center overflow-hidden group"
              href="/auth/login"
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute -inset-1 bg-gradient-to-r from-adult-green to-green-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-all duration-300" />
            </NextLink>
          </li>
        </ul>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
