
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get('courseId')

  if (!courseId) {
    return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
  }

  // 1. Authenticate user using NextAuth
  const session = await auth()
  const user = session?.user

  if (!user || !user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Authoritative Access Handshake (Check course_access)
  // We check for active access that has not expired
  const now = new Date().toISOString()
  const { data: access, error: accessError } = await supabaseAdmin
    .from('course_access')
    .select('id, access_end')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .eq('is_active', true)
    .gt('access_end', now)
    .maybeSingle()

  if (accessError || !access) {
    // Check if the course is free
    const { data: course } = await supabaseAdmin
      .from('courses')
      .select('is_free')
      .eq('id', courseId)
      .maybeSingle()

    if (!course?.is_free) {
      return NextResponse.json({ error: 'Access Denied', expired: !!accessError }, { status: 403 })
    }
  }

  // 3. Fetch Concealed Registry (Fetching lessons for authorized user)
  const { data: lessons, error: lessonError } = await supabaseAdmin
    .from('lessons')
    .select('id, title, content, content_type, drive_file_id, platform, meeting_url, order_index')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })

  if (lessonError) {
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 })
  }

  // 4. Server-Side Link Construction (Liquidating raw IDs from client visibility)
  const securedLessons = lessons.map(lesson => {
    let embedUrl = null

    if (lesson.content_type === 'video' && lesson.drive_file_id) {
      embedUrl = `https://drive.google.com/file/d/${lesson.drive_file_id}/preview`
    } else if (lesson.content_type === 'note' && lesson.drive_file_id) {
       embedUrl = `https://drive.google.com/file/d/${lesson.drive_file_id}/preview`
    } else if (lesson.content_type === 'live' && lesson.meeting_url) {
       embedUrl = lesson.meeting_url
    }

    return {
      id: lesson.id,
      title: lesson.title,
      content: lesson.content,
      contentType: lesson.content_type,
      embedUrl,
      orderIndex: lesson.order_index
    }
  })

  return NextResponse.json({ 
    lessons: securedLessons,
    watermark: {
      email: user.email,
      timestamp: new Date().toISOString()
    }
  })
}
