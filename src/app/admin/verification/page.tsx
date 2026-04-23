import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { AdminReviewCard } from "@/components/admin/admin-review-card"
import { getPendingTeachers } from "@/lib/actions/admin"
import { ShieldCheck, AlertCircle } from "lucide-react"

export default async function AdminVerificationPage() {
  const session = await auth()
  
  // Basic security: only allow if user is authenticated and role is admin (or handle properly)
  // For now, let's assume session role needs to be verified
  if (!session?.user?.id) {
    redirect("/login")
  }

  const { teachers = [], error } = await getPendingTeachers()

  return (
    <main className="min-h-screen bg-editorial-cream dark:bg-black transition-colors duration-500">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-editorial-black text-white rounded-xl">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h1 className="text-[10px] font-bold uppercase tracking-[0.4em] text-editorial-black/40">Admin Console</h1>
            </div>
            <h2 className="text-4xl font-serif text-editorial-black dark:text-white">Verification Queue</h2>
            <p className="text-sm text-editorial-black/60 dark:text-white/60 mt-2">Reviewing credentials for new faculty applications.</p>
          </div>
          
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-[10px] font-bold text-editorial-black/30 uppercase tracking-widest mb-1">Pending Requests</p>
              <p className="text-4xl font-serif text-editorial-black dark:text-white">{teachers.length}</p>
            </div>
          </div>
        </header>

        {error && (
          <div className="p-6 bg-red-50 text-red-600 rounded-3xl flex items-center gap-4 border border-red-100">
            <AlertCircle className="h-6 w-6" />
            <p className="text-sm font-bold uppercase tracking-widest">{error}</p>
          </div>
        )}

        {!error && teachers.length === 0 && (
          <div className="text-center py-24 glass-morphism">
            <ShieldCheck className="h-16 w-16 text-editorial-black/10 mx-auto mb-6" />
            <h3 className="text-2xl font-serif text-editorial-black/40 mb-2">Queue is Empty</h3>
            <p className="text-sm text-editorial-black/30 uppercase tracking-widest font-bold">All faculty members are verified</p>
          </div>
        )}

        <div className="grid gap-6">
          {teachers.map((teacher: any) => (
            <AdminReviewCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </div>
    </main>
  )
}
