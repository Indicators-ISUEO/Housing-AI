import { Toaster } from 'react-hot-toast';
import { Header } from '@/components/Header';
import ThemesProvider from '@/providers/ThemesProvider';
import { ChatWidgetProvider } from "@/components/ChatWidget";
import '@/styles/globals.scss';
import '@/styles/theme-config.css';

export const metadata = {
  title: {
    default: "Iowa State University Extensions and Outreach - CED",
    template: `%s - ISU Extensions and Outreach - CED`,
  },
  description:
    "Iowa State University Extensions and Outreach - CED Chat Interface",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="flex flex-col min-h-full">
        <ThemesProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <ChatWidgetProvider />
          <Toaster />
        </ThemesProvider>
      </body>
    </html>
  );
}