import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/cta-footer"
import { StudentProfile } from "@/components/profile/student-profile"
import { TeacherProfile } from "@/components/profile/teacher-profile"
import { supabaseAdmin } from "@/lib/supabase"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const role = (session.user as any).role
  const table = role === "teacher" ? "teacher_profiles" : "student_profiles"

  const { data: userData, error } = await supabaseAdmin
    .from(table)
    .select(`
      *,
      users (
        bio,
        profile_image
      )
    `)
    .eq("user_id", session.user.id)
    .single()

  const userWithIdentity = userData ? {
    ...userData,
    bio: (userData as any).users?.bio,
    image: (userData as any).users?.profile_image, // Mapping profile_image to 'image' for component consistency
  } : null

  if (error || !userData) {
    if (error?.code === 'PGRST205') {
       console.warn(`Table ${table} is missing.`);
    }
    return (
      <main className="min-h-screen bg-editorial-cream">
        <Navbar />
        <div className="flex h-[80vh] items-center justify-center p-6 text-center">
          <div className="max-w-md p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500">
            <p className="font-black text-xl mb-2">Sync Error</p>
            <p className="text-sm opacity-80">We couldn't retrieve your profile data. Please try again later.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F3F0E8] text-[#002147] flex flex-col">
      <Navbar />
      <div className="flex-1 py-12 px-6">
        {role === "teacher" ? (
          <TeacherProfile user={{ ...userWithIdentity, teacher_code: session.user.teacherCode, email: session.user.email }} />
        ) : (
          <StudentProfile user={{ ...userWithIdentity, email: session.user.email }} />
        )}
      </div>
      <Footer />
    </main>
  )
}
