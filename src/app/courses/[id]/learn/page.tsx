
import { getCourseWithAccess } from "@/lib/actions/course-access";
import { ProtectedPlayer } from "@/components/courses/protected-player";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function LearnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  
  if (!session?.user) redirect("/login");

  const result = await getCourseWithAccess(id);

  if (!result.course || result.error) notFound();
  
  // 1. Authoritative Access Validation
  if (!result.canAccess) {
    redirect(`/courses/${id}`);
  }

  // 2. Fetch Concealed Lesson Registry via internal fetch 
  // (We use an absolute URL or a helper to call the API route)
  // For simplicity during MVP, we can also fetch directly from DB here 
  // but calling the API ensures we test the Concealed ID logic.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/lessons?courseId=${id}`, {
    headers: {
      Cookie: (await import('next/headers')).cookies().toString()
    }
  });

  const { lessons, watermark, error } = await response.json();

  if (error || !lessons) {
    return (
      <div className="min-h-screen bg-editorial-cream flex items-center justify-center p-8 text-center">
        <div className="max-w-md space-y-6">
          <h2 className="text-3xl font-serif italic text-editorial-black">Curriculum Unavailable</h2>
          <p className="text-editorial-black/60 font-serif">We encountered an error while initializing your secure curriculum stream. Please refresh the page or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen bg-black">
      <ProtectedPlayer 
        courseId={id}
        courseTitle={result.course.title}
        teacherName={result.course.teacherName}
        lessons={lessons}
        watermark={watermark}
      />
    </main>
  );
}
