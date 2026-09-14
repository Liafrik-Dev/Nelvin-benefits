import { db } from "@/services/api/base44Client";

import React, { useState, useRef } from "react";
import { Save, Loader2, Camera, Trash2 } from "lucide-react";

import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import Avatar from "@/components/nelvin/Avatar";

export default function Profile() {
  const { user, checkUserAuth } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    await db.auth.updateMe({ full_name: fullName });
    await checkUserAuth();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (e.target) e.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast({ title: "Unsupported file", description: "Please upload a JPG, PNG or WebP image.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = async () => {
        const sz = Math.min(img.width, img.height);
        const sx = (img.width - sz) / 2;
        const sy = (img.height - sz) / 2;
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        canvas.getContext("2d").drawImage(img, sx, sy, sz, sz, 0, 0, 256, 256);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setUploading(true);
        try {
          await db.auth.updateMe({ photo_url: dataUrl });
          await checkUserAuth();
          toast({ title: "Profile photo updated" });
        } catch (err) {
          toast({ title: "Upload failed", description: "Could not save your photo. Please try again.", variant: "destructive" });
        } finally {
          setUploading(false);
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
    setUploading(true);
    try {
      await db.auth.updateMe({ photo_url: "" });
      await checkUserAuth();
      toast({ title: "Profile photo removed" });
    } catch (err) {
      toast({ title: "Could not remove photo", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#062B23] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 pb-16">
        <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-8">
          <h1 className="text-2xl font-bold font-heading text-ivory mb-6">Profile</h1>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar user={user} className="w-20 h-20" fallbackClassName="bg-[#D6B56D] text-white font-bold text-2xl" />
              <div className="flex flex-col gap-2">
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="hidden" />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="bg-[#0A3A2F]/5 hover:bg-[#0A3A2F]/10 text-ivory rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" /> {uploading ? "Saving..." : "Upload photo"}
                </button>
                {user?.photo_url && (
                  <button
                    onClick={handleRemovePhoto}
                    disabled={uploading}
                    className="text-rose-600 text-xs font-medium flex items-center gap-1 disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove photo
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-ivory-dim">JPG, PNG or WebP. Image is auto-cropped to a square and shown everywhere your avatar appears.</p>
            <div>
              <label className="text-sm font-medium text-ivory block mb-1.5">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-white/12 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#D6B56D]/25"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ivory block mb-1.5">Email</label>
              <input value={user?.email || ""} disabled className="w-full border border-white/12 rounded-xl px-4 py-2.5 text-sm bg-forest-secondary/60 text-ivory-dim" />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#D6B56D] hover:bg-[#E5C77A] text-white rounded-full px-6 py-2.5 text-sm font-semibold flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saved ? "Saved!" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}