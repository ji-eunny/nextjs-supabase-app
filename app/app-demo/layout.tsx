import { Header } from "@/components/layout/header";
import { dummyUser } from "@/lib/dummy-data";

export default function AppDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header isAuthenticated userName={dummyUser.name} />
      {children}
    </>
  );
}
