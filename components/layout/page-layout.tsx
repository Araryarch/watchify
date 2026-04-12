import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeaderWrapper } from "@/components/header-wrapper";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderWrapper>
        <Navbar />
      </HeaderWrapper>
      <main className="flex-1">{children}</main>
      <HeaderWrapper>
        <Footer />
      </HeaderWrapper>
    </>
  );
}
