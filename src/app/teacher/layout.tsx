import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/cta-footer";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || (session.user as any).role !== "teacher") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-editorial-cream">
      <Navbar />
      <main className="flex-1 pt-0 pb-12 px-8 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col space-y-6">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
