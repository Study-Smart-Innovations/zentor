"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, FileText, Radio, Clock, ExternalLink, Trash2, Calendar, Lock, Play, Download, Loader2, Sparkles } from "lucide-react";
import { getAuthorizedAsset, deleteCourseContent } from "@/lib/actions/course";

interface CourseTabsProps {
  contents: any[];
}

export function CourseTabs({ contents }: CourseTabsProps) {
  const [activeTab, setActiveTab] = useState<"video" | "note" | "live">("video");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const tabs = [
    { id: "video", label: "Recorded Classes", icon: Video, color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: "note", label: "Study Notes", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "live", label: "Live Schedule", icon: Radio, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  const handleAccess = async (contentId: string) => {
    // Open window immediately to satisfy browser gesture requirements
    const newWindow = window.open("", "_blank");
    if (!newWindow) {
      alert("Please allow popups to view course materials.");
      return;
    }
    newWindow.document.write("Loading your content securely...");
    
    setLoadingId(contentId);
    try {
      const result = await getAuthorizedAsset(contentId) as { success?: boolean, url?: string, error?: string };
      if (result.success && result.url) {
        newWindow.location.href = result.url;
      } else {
        newWindow.close();
        alert(result.error || "Access denied.");
      }
    } catch (err) {
      newWindow.close();
      alert("Failed to access content.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (contentId: string) => {
    const courseId = contents.find(c => c.id === contentId)?.course_id || "";
    if (!confirm("Are you sure you want to delete this content? This cannot be undone.")) return;

    setDeletingId(contentId);
    try {
      const result = await deleteCourseContent(contentId, courseId);
      if (!result.success) {
        alert(result.error || "Failed to delete.");
      }
    } catch (err) {
      alert("An error occurred during deletion.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredContents = contents.filter((c) => c.type === activeTab);

  return (
    <div className="space-y-8">
      {/* ... Tab Navigation remains similar ... */}
      <div className="flex flex-wrap gap-4 p-1.5 bg-foreground/5 rounded-[2rem] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-3 px-8 py-4 rounded-[1.5rem] text-sm font-black transition-all relative ${
              activeTab === tab.id ? "text-primary-blue" : "text-foreground/40 hover:text-foreground/60"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-background rounded-[1.5rem] shadow-xl z-0"
              />
            )}
            <div className={`relative z-10 p-2 rounded-xl ${activeTab === tab.id ? tab.bg : "bg-transparent"}`}>
              <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? tab.color : "text-current"}`} />
            </div>
            <span className="relative z-10 uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-4"
        >
          {filteredContents.length === 0 ? (
            <div className="glass-card p-20 rounded-[3rem] text-center border-dashed border-2 border-foreground/5 flex flex-col items-center">
               <div className="h-20 w-20 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/20 mb-6">
                {activeTab === "video" ? <Video className="h-10 w-10" /> : activeTab === "note" ? <FileText className="h-10 w-10" /> : <Radio className="h-10 w-10" />}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No {activeTab}s found</h3>
              <p className="text-foreground/40 font-medium">This curriculum section is currently empty.</p>
            </div>
          ) : (
            filteredContents.map((content) => (
              <div 
                key={content.id}
                className="group glass-card p-6 rounded-[2.5rem] flex items-center justify-between border border-foreground/5 transition-all hover:scale-[1.01] hover:shadow-2xl hover:bg-background"
              >
                <div className="flex items-center space-x-6">
                  <div className="h-16 w-16 rounded-2xl bg-foreground/[0.03] flex items-center justify-center shadow-inner relative overflow-hidden">
                     {activeTab === "video" ? <Play className="h-6 w-6 text-primary-purple" /> : <FileText className="h-6 w-6 text-primary-blue" />}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-foreground mb-1 group-hover:text-primary-blue transition-colors flex items-center gap-3">
                      {content.title}
                      {content.is_free ? (
                        <span className="text-[10px] bg-primary-mint/10 text-primary-mint px-2 py-0.5 rounded-lg border border-primary-mint/20 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          FREE PREVIEW
                        </span>
                      ) : content.sell_individually && content.price > 0 && (
                        <span className="text-[10px] bg-primary-blue/10 text-primary-blue px-2 py-0.5 rounded-lg border border-primary-blue/20">
                          ₹{content.price}
                        </span>
                      )}
                    </h4>
                    <p className="text-xs font-bold text-foreground/30 uppercase tracking-widest flex items-center">
                      <Clock className="h-3 w-3 mr-2" />
                      {new Date(content.created_at).toLocaleDateString()}
                      {content.description && <span className="mx-2">•</span>}
                      {content.description && <span className="normal-case transition-all group-hover:text-foreground/60">{content.description}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleAccess(content.id)}
                    disabled={loadingId === content.id}
                    className="h-12 px-6 rounded-2xl bg-foreground text-background font-black text-xs flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    {loadingId === content.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : activeTab === "video" ? (
                      <>
                        <Play className="h-4 w-4" />
                        <span>WATCH</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>OPEN</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => handleDelete(content.id)}
                    disabled={deletingId === content.id}
                    className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    {deletingId === content.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
