
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  Play, 
  Book, 
  Video, 
  ChevronRight, 
  ChevronLeft, 
  Lock, 
  ShieldCheck, 
  Clock,
  ArrowLeft,
  Calendar,
  Monitor
} from 'lucide-react'
import Link from 'next/link'

interface Lesson {
  id: string
  title: string
  content: string
  contentType: 'video' | 'note' | 'live'
  embedUrl: string
  orderIndex: number
}

interface ProtectedPlayerProps {
  courseId: string
  courseTitle: string
  teacherName: string
  lessons: Lesson[]
  watermark: {
    email: string
    timestamp: string
  }
}

export function ProtectedPlayer({ courseId, courseTitle, teacherName, lessons, watermark }: ProtectedPlayerProps) {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(lessons[0] || null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [tabFocused, setTabFocused] = useState(true)
  const [watermarkPos, setWatermarkPos] = useState({ top: '20%', left: '20%' })
  const playerRef = useRef<HTMLDivElement>(null)

  // 1. Watermark Random Positioning (Deters static cropping)
  useEffect(() => {
    const interval = setInterval(() => {
      const top = Math.floor(Math.random() * 70) + 10 + '%'
      const left = Math.floor(Math.random() * 70) + 10 + '%'
      setWatermarkPos({ top, left })
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  // 2. Anti-Leak Handshake (Tab switching deterrence)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setTabFocused(!document.hidden)
    }
    
    const handleBlur = () => setTabFocused(false)
    const handleFocus = () => setTabFocused(true)

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)

    // Right-click liquidation
    const handleContextMenu = (e: MouseEvent) => e.preventDefault()
    document.addEventListener('contextmenu', handleContextMenu)

    // Shortcut liquidation (Ctrl+S, PrintScreen, Ctrl+C)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'c' || e.key === 'p')) {
        e.preventDefault()
      }
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        alert('Screenshots are discouraged for premium content protection.')
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  if (!activeLesson) return null

  return (
    <div className="flex h-screen bg-editorial-cream overflow-hidden">
      {/* 📚 Lesson Sidebar (Left) */}
      <div 
        className={`${
          isSidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-500 border-r border-editorial-black/10 bg-white flex flex-col overflow-hidden`}
      >
        <div className="p-6 border-b border-editorial-black/5 bg-editorial-black/[0.02]">
          <Link 
            href={`/courses/${courseId}`} 
            className="group flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-editorial-black/40 hover:text-editorial-black mb-4 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Course Page</span>
          </Link>
          <h2 className="text-xl font-serif text-editorial-black leading-tight line-clamp-2">{courseTitle}</h2>
          <p className="text-xs font-serif italic text-editorial-black/40 mt-1">Instructor: {teacherName}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson)}
              className={`w-full text-left p-4 flex items-start space-x-3 transition-all ${
                activeLesson.id === lesson.id 
                ? 'bg-editorial-black text-editorial-cream' 
                : 'hover:bg-editorial-black/5 text-editorial-black'
              }`}
            >
              <div className="mt-1">
                {lesson.contentType === 'video' ? <Video className="h-4 w-4" /> : <Book className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Lesson {index + 1}</p>
                <p className="text-sm font-serif">{lesson.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 🎥 Player Stage (Right) */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Header */}
        <div className="h-16 flex items-center justify-between px-8 border-b border-editorial-black/5 bg-white">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-editorial-black/5 rounded-full transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
          
          <div className="flex items-center space-x-4">
            {/* Security badges removed as per instructor requirement */}
          </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 relative bg-black flex items-center justify-center">
          {/* Active Player Overlay (Deters viewing when tab blurred) */}
          {!tabFocused && (
            <div className="absolute inset-0 z-50 backdrop-blur-3xl bg-editorial-black/95 flex items-center justify-center text-center p-12">
              <div className="space-y-6">
                <Lock className="h-12 w-12 text-editorial-cream/10 mx-auto" />
              </div>
            </div>
          )}

          {/* Secure Watermark Registry (Deters recording) */}
          <div 
            className="absolute z-40 pointer-events-none select-none transition-all duration-1000 ease-in-out"
            style={{ 
              top: watermarkPos.top, 
              left: watermarkPos.left,
              opacity: 0.08
            }}
          >
            <div className="flex flex-col text-white font-serif italic whitespace-nowrap">
              <span className="text-xs">{watermark.email}</span>
              <span className="text-[10px] opacity-50">{watermark.timestamp}</span>
            </div>
          </div>

          {/* Dynamic Content Renderer */}
          {activeLesson.contentType === 'video' ? (
            <iframe
              src={activeLesson.embedUrl}
              className="w-full h-full border-none"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : activeLesson.contentType === 'note' ? (
            <iframe
              src={activeLesson.embedUrl}
              className="w-full h-full bg-white border-none"
            />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-editorial-cream bg-editorial-black p-20 text-center">
                <div className="max-w-md space-y-8">
                   <div className="h-20 w-20 mx-auto border border-editorial-cream/20 flex items-center justify-center">
                      <Play className="h-10 w-10 text-[#C5A059]" />
                   </div>
                   <div className="space-y-4">
                      <h2 className="text-4xl font-serif italic">Live Session</h2>
                      <p className="text-editorial-cream/40 font-serif leading-relaxed">This session is currently scheduled. Follow the secure link below to join the mentor's live broadcast.</p>
                   </div>
                   <a 
                     href={activeLesson.embedUrl} 
                     target="_blank" 
                     className="inline-block border border-editorial-cream px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-editorial-cream hover:text-editorial-black transition-all"
                   >
                     Join Secure Session
                   </a>
                </div>
             </div>
          )}
        </div>

        {/* Bottom Bar / Lesson Context */}
        <div className="h-24 bg-white border-t border-editorial-black/5 flex items-center justify-between px-8">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-editorial-black/20 uppercase tracking-widest">{activeLesson.contentType}</span>
              <h3 className="text-xl font-serif text-editorial-black">{activeLesson.title}</h3>
           </div>
           
           <div className="flex space-x-4">
              <button className="px-8 py-3 border border-editorial-black/10 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                Mark as Complete
              </button>
           </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  )
}
