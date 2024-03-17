import { ThemeProvider } from '@/components/theme-provider';
import AuthContext from '@/context/auth-context';
import { ModalProvider } from '@/context/modal-context';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { DataProvider } from '@/context/data-context';
import './globals.css';
import { SelectedUsersProvider } from '@/context/selected-users-context';
import Sidebar from '@/components/sidebar';
import { SocketProvider } from '@/context/socket-context';
import { GroupsProvider } from '@/context/groups-context';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ChatX',
  description: 'Simple chat app',
};

export function generateStaticParams() {
  return [{ locale: 'vi' }, { locale: 'en' }];
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`../../locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang='locale' suppressHydrationWarning>
      <body className={`${montserrat.className} bg-[#F7F7F9] dark:bg-[#09202B] dark:text-white`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthContext>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              <DataProvider>
                <SocketProvider>
                  <GroupsProvider>
                    <ModalProvider>
                      <SelectedUsersProvider>
                        <Sidebar>{children}</Sidebar>
                      </SelectedUsersProvider>
                    </ModalProvider>
                  </GroupsProvider>
                </SocketProvider>
              </DataProvider>
              <Toaster position='top-right' reverseOrder={false} />
            </ThemeProvider>
          </AuthContext>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
