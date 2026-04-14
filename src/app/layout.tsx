import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PitLane News | B2B Portal',
  description: 'Sistema de Notícias e Agregador B2B do Automobilismo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
