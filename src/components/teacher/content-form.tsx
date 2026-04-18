
'use client'

import { useState } from "react";
import { addCourseContent, deleteCourseContent } from "@/lib/actions/course";
import { 
  Plus, 
  Trash2, 
  Video, 
  Book, 
  Monitor, 
  Loader2, 
  Layout, 
  GripVertical
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  content_type: 'video' | 'note' | 'live';
  drive_file_id?: string;
  meeting_url?: string;
  order_index: number;
}

interface ContentFormProps {
  courseId: string;
  initialLessons: Lesson[];
}

export function ContentForm({ courseId, initialLessons }: ContentFormProps) {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New Lesson State
  const [newLesson, setNewLesson] = useState({
    title: "",
    contentType: "video",
    driveFileId: "",
    meetingUrl: "",
    duration: "",
    description: "",
    content: ""
  });

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("title", newLesson.title);
    formData.append("description", newLesson.description);
    formData.append("duration", newLesson.duration);
    formData.append("contentType", newLesson.contentType);
    formData.append("driveFileId", newLesson.driveFileId);
    formData.append("meetingUrl", newLesson.meetingUrl);
    formData.append("content", newLesson.content);
    formData.append("orderIndex", lessons.length.toString());

    const result = await addCourseContent(formData);
    if (result.success) {
      setLessons([...lessons, { 
        id: result.lessonId!, 
        title: newLesson.title, 
        content_type: newLesson.contentType as any,
        drive_file_id: newLesson.driveFileId,
        meeting_url: newLesson.meetingUrl,
        order_index: lessons.length
      }]);
      setNewLesson({ title: "", contentType: "video", driveFileId: "", meetingUrl: "", duration: "", description: "", content: "" });
      setIsAdding(false);
    } else {
      alert(result.error);
    }
    setIsLoading(false);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Are you sure you want to liquidate this module?")) return;
    
    const result = await deleteCourseContent(lessonId, courseId);
    if (result.success) {
      setLessons(lessons.filter(l => l.id !== lessonId));
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif italic text-editorial-black">Curriculum Modules</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center space-x-3 bg-editorial-black text-editorial-cream px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-editorial-black/90 transition-all shadow-xl"
        >
          {isAdding ? <span>Cancel Entry</span> : <><Plus className="h-4 w-4" /> <span>Add Module</span></>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddLesson} className="p-12 border-2 border-editorial-black bg-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="grid gap-8 md:grid-cols-2">
              <div className="md:col-span-2 space-y-2">
                 <label className="text-[10px] font-black uppercase text-editorial-black/30 tracking-widest">Module Title</label>
                 <input 
                    required
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                    placeholder="e.g. Introduction to Secure Systems"
                    className="w-full bg-editorial-black/[0.02] border-b-2 border-editorial-black/10 px-0 py-4 text-xl font-serif text-editorial-black focus:border-editorial-black transition-all outline-none"
                 />
              </div>

              <div className="md:col-span-2 space-y-2">
                 <label className="text-[10px] font-black uppercase text-editorial-black/30 tracking-widest">Module Duration</label>
                 <input 
                    value={newLesson.duration}
                    onChange={(e) => setNewLesson({...newLesson, duration: e.target.value})}
                    placeholder="e.g. 45 mins / 1.5 hours"
                    className="w-full bg-editorial-black/[0.02] border-b-2 border-editorial-black/10 px-0 py-4 text-xl font-serif text-editorial-black focus:border-editorial-black transition-all outline-none"
                 />
              </div>

              <div className="md:col-span-2 space-y-2">
                 <label className="text-[10px] font-black uppercase text-editorial-black/30 tracking-widest">Module Description</label>
                 <textarea 
                    value={newLesson.description}
                    onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
                    placeholder="Summarize the learning outcomes..."
                    rows={2}
                    className="w-full bg-editorial-black/[0.02] border-b-2 border-editorial-black/10 px-0 py-4 text-xl font-serif text-editorial-black focus:border-editorial-black transition-all outline-none resize-none"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-editorial-black/30 tracking-widest">Content Type</label>
                 <select 
                    value={newLesson.contentType}
                    onChange={(e) => setNewLesson({...newLesson, contentType: e.target.value})}
                    className="w-full bg-editorial-black/[0.02] border-b-2 border-editorial-black/10 px-0 py-4 text-lg font-serif text-editorial-black focus:border-editorial-black transition-all outline-none"
                 >
                    <option value="video">Video Lecture (GDrive)</option>
                    <option value="note">Study Notes (GDrive)</option>
                    <option value="live">Live Stream (Meeting Link)</option>
                 </select>
              </div>

              {newLesson.contentType !== 'live' ? (
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-editorial-black/30 tracking-widest">Google Drive File ID</label>
                   <input 
                      required
                      value={newLesson.driveFileId}
                      onChange={(e) => setNewLesson({...newLesson, driveFileId: e.target.value})}
                      placeholder="Enter 33-char ID only"
                      className="w-full bg-editorial-black/[0.02] border-b-2 border-editorial-black/10 px-0 py-4 text-lg font-serif text-editorial-black focus:border-editorial-black transition-all outline-none"
                   />
                </div>
              ) : (
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-editorial-black/30 tracking-widest">Meeting URL</label>
                   <input 
                      required
                      value={newLesson.meetingUrl}
                      onChange={(e) => setNewLesson({...newLesson, meetingUrl: e.target.value})}
                      placeholder="Zoom / Google Meet Link"
                      className="w-full bg-editorial-black/[0.02] border-b-2 border-editorial-black/10 px-0 py-4 text-lg font-serif text-editorial-black focus:border-editorial-black transition-all outline-none"
                   />
                </div>
              )}
           </div>

           <button 
              disabled={isLoading}
              className="mt-12 w-full h-20 bg-editorial-black text-editorial-cream flex items-center justify-center space-x-4 group overflow-hidden"
           >
              {isLoading ? (
                 <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                 <span className="text-sm font-black uppercase tracking-[0.3em]">Authorize Entry</span>
              )}
           </button>
        </form>
      )}

      {/* Modules List */}
      <div className="space-y-4">
        {lessons.length === 0 ? (
          <div className="p-20 border border-editorial-black/10 bg-white/50 text-center">
            <Layout className="h-12 w-12 text-editorial-black/5 mx-auto mb-6" />
            <p className="text-xl font-serif italic text-editorial-black/40">No modules in the current registry.</p>
          </div>
        ) : (
          lessons.map((lesson, idx) => (
            <div key={lesson.id} className="group p-8 border border-editorial-black/10 bg-white hover:border-editorial-black transition-all flex items-center space-x-6">
              <div className="text-[10px] font-black text-editorial-black/20 group-hover:text-editorial-black transition-colors">
                {String(idx + 1).padStart(2, '0')}
              </div>
              
              <div className="flex-1 flex items-center space-x-4">
                 <div className="h-10 w-10 bg-editorial-black/5 flex items-center justify-center text-editorial-black/40">
                    {lesson.content_type === 'video' ? <Video className="h-5 w-5" /> : lesson.content_type === 'live' ? <Monitor className="h-5 w-5" /> : <Book className="h-5 w-5" />}
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-editorial-black/30">{lesson.content_type}</span>
                    <h4 className="text-lg font-serif text-editorial-black">{lesson.title}</h4>
                 </div>
              </div>

              <div className="flex items-center space-x-4">
                 <div className="text-[10px] font-serif italic text-editorial-black/20 mr-4">
                    {lesson.drive_file_id || lesson.meeting_url ? "Asset Linked" : "No Asset"}
                 </div>
                 <button 
                   onClick={() => handleDeleteLesson(lesson.id)}
                   className="p-3 text-red-300 hover:text-red-600 hover:bg-red-50 transition-all rounded-lg"
                 >
                    <Trash2 className="h-5 w-5" />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
