"use client";

import { useContext } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Flex, Heading, IconButton, Select } from "@radix-ui/themes";
import NextLink from "next/link";
import Image from "next/image";
import { FaAdjust, FaMoon, FaRegSun } from "react-icons/fa";
import { Link } from "../Link";
import { useTheme } from "../Themes";
import { ChatContext } from "@/components";
import { MdOutlineFeedback } from "react-icons/md";
import { useState } from "react";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { toggleSidebar, onToggleSidebar } = useContext(ChatContext);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-background shadow-sm dark:shadow-gray-500 border-b">
      <div className="max-w-[2000px] mx-auto">
        <Flex
          align="center"
          justify="between"
          className="px-3 md:px-4 lg:px-6 h-[60px] md:h-[70px] lg:h-[80px]"
        >
          {/* Left Section: Menu + Logo */}
          <Flex align="center" gap="3" className="flex-none">
            <IconButton
              size={{ initial: "2", md: "3" }}
              variant="ghost"
              onClick={() => onToggleSidebar?.()}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <HamburgerMenuIcon className="w-5 h-5" />
            </IconButton>

            <NextLink href="/" className="hidden sm:block">
              <div className="w-[120px] md:w-[150px] lg:w-[180px] h-[36px] md:h-[45px] lg:h-[54px] relative">
                <Image
                  src="/ISUEO_CED.png"
                  alt="ISU Extension and Outreach"
                  fill
                  style={{
                    objectFit: "contain",
                    background: theme === "dark" ? "white" : "transparent",
                    borderRadius: "4px",
                    padding: "2px",
                  }}
                  priority
                  className="header-logo"
                />
              </div>
            </NextLink>
          </Flex>

          {/* Center Section: Title */}
          <div className="flex-1 text-center px-2 md:px-4">
            <Heading
              as="h2"
              size={{ initial: "2", sm: "3", md: "4" }}
              className="truncate font-semibold"
              style={{
                fontSize: "clamp(0.875rem, 2vw, 1.3rem)",
                letterSpacing: "0.5px",
                lineHeight: "1.2",
              }}
            >
              <span className="hidden sm:inline">Iowa State University - </span>
              Extension AI Assistant
            </Heading>
          </div>

          {/* Right Section: Controls */}
          <Flex align="center" gap="3" className="flex-none">
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Link href="https://iastate.qualtrics.com/jfe/form/SV_0DkSXyKvW6odP1k">
                <IconButton
                  size="2"
                  variant="ghost"
                  radius="full"
                  className="cursor-pointer transition-transform duration-200 hover:scale-110 hover:bg-gray-100 dark:hover:bg-gray-800 h-9 w-9 flex items-center justify-center"
                >
                  <MdOutlineFeedback className="w-5 h-5" />
                </IconButton>
              </Link>
              {showTooltip && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 text-sm whitespace-nowrap">
                  Provide Feedback
                </div>
              )}
            </div>
            <Select.Root value={theme} onValueChange={setTheme}>
              <Select.Trigger radius="full" />
              <Select.Content>
                <Select.Item value="light">
                  <FaRegSun />
                </Select.Item>
                <Select.Item value="dark">
                  <FaMoon />
                </Select.Item>
                <Select.Item value="system">
                  <FaAdjust />
                </Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>
        </Flex>
      </div>
    </header>
  );
};

export default Header;
