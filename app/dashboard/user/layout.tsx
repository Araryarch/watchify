import { RoleGuard } from "@/components/role-guard";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard requiredRole="USER">
      <Navbar />
      <div className="flex-1 w-full bg-[#0b0c0f]">
        {children}
      </div>
      <Footer />
    </RoleGuard>
  );
}
