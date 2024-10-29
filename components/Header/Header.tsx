'use client'

import { useContext } from 'react'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Avatar, Flex, Heading, IconButton, Select } from '@radix-ui/themes'
import NextLink from 'next/link'
import Image from 'next/image'
import { FaAdjust, FaGithub, FaMoon, FaRegSun } from 'react-icons/fa'
import { Link } from '../Link'
import { useTheme } from '../Themes'
import { ChatContext } from '@/components'

export const Header = () => {
  const { theme, setTheme } = useTheme()
  const { onToggleSidebar } = useContext(ChatContext)

  return (
    <header
      className="sticky top-0 z-30 flex items-center w-full h-[80px] px-4 border-b bg-background shadow-sm dark:shadow-gray-500"
    >
      <Flex align="center" gap="4" className="relative w-full">
        {/* Menu Button */}
        <IconButton
          size="3"
          variant="ghost"
          onClick={() => {
            console.log('Menu clicked');
            onToggleSidebar?.();
          }}
          className="flex-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <HamburgerMenuIcon width="24" height="24" />
        </IconButton>

        {/* Logo container */}
        <div className="flex-none w-[180px]">
          <NextLink href="/">
            <Image
              src="/ISUEO.jpg"
              alt="ISU Extension and Outreach"
              width={180}
              height={54}
              style={{
                height: '54px',
                width: 'auto',
                objectFit: 'contain',
                background: theme === 'dark' ? 'white' : 'transparent',
                borderRadius: '4px',
                padding: '2px'
              }}
              priority
              className="header-logo"
            />
          </NextLink>
        </div>

        {/* Title container */}
        <div className="flex-1 text-center">
          <Heading 
            as="h2" 
            size="4" 
            style={{ 
              margin: '0 auto',
              fontSize: '1.3rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}
          >
            Iowa State University Extensions and Outreach - CED
          </Heading>
        </div>

        {/* Controls container */}
        <div className="flex-none flex items-center gap-4">
          <Avatar
            color="gray"
            size="2"
            radius="full"
            fallback={
              <Link href="https://github.com/DSPG-2024-Work/Housing-AI/issues/new">
                <FaGithub />
              </Link>
            }
          />
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
        </div>
      </Flex>
    </header>
  )
}

export default Header