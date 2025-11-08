export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link href="https://jsearch.p.rapidapi.com" rel="preconnect" />
      <link href="https://jsearch.p.rapidapi.com" rel="dns-prefetch" />
      {children}
    </>
  );
}
