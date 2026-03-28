export default function RootLayout({
  children
}: Readonly<{ children: unknown }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
