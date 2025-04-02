import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "Video Editor App",
  description: "A web app for video editors with LUFS meter functionality",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
