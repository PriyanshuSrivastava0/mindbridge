import { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Lock,
  Tag
} from 'lucide-react';
import { db } from '../services/db/mockDatabase';
import { useAuth } from '../context/AuthContext';
import { CommunityPost } from '../types';
import confetti from 'canvas-confetti';

export function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>(db.communityPosts);
  const [selectedCircle, setSelectedCircle] = useState<'ALL' | 'mild-stress' | 'anxiety-panic' | 'burnout' | 'low-mood'>('ALL');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCircle, setNewPostCircle] = useState<'mild-stress' | 'anxiety-panic' | 'burnout' | 'low-mood'>('mild-stress');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);

  const circles = [
    { id: 'ALL', name: 'All Peer Circles', icon: '🌟', desc: 'Browse all shared spaces' },
    { id: 'mild-stress', name: 'Study & Mild Stress Circle', icon: '🌿', desc: 'Matched for students & mild situational stress' },
    { id: 'anxiety-panic', name: 'Anxiety & Panic Reset Circle', icon: '🌊', desc: 'Matched for generalized anxiety & somatic grounding' },
    { id: 'burnout', name: 'Career & Work Fatigue Circle', icon: '🌅', desc: 'Matched for workload pressure & boundaries' },
    { id: 'low-mood', name: 'Gentle Recovery & Low Mood Circle', icon: '🌙', desc: 'Matched for low energy, sadness & tiny daily wins' }
  ];

  const filteredPosts = posts.filter(p => selectedCircle === 'ALL' || p.circleId === selectedCircle);

  const handleLike = (postId: string) => {
    db.toggleLikePost(postId);
    setPosts([...db.communityPosts]);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const circleName = circles.find(c => c.id === newPostCircle)?.name || 'Peer Circle';
    const randomHandle = `KindSoul#${Math.floor(10 + Math.random() * 89)}`;

    db.addCommunityPost({
      circleId: newPostCircle,
      circleName: circleName,
      authorHandle: randomHandle,
      authorMentalHealthLevel: newPostCircle === 'mild-stress' ? 'Mild' : newPostCircle === 'low-mood' ? 'Elevated' : 'Moderate',
      content: newPostContent.trim(),
      tags: ['Support', 'PeerConnection']
    });

    setPosts([...db.communityPosts]);
    setNewPostContent('');
    setIsCreatingPost(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const randomHandle = `SupportiveFriend#${Math.floor(10 + Math.random() * 89)}`;
    db.addCommunityComment(postId, randomHandle, text);
    setPosts([...db.communityPosts]);
    setCommentInputs({ ...commentInputs, [postId]: '' });
    setActiveCommentPostId(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#303F70] to-[#202b4d] rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-[#A99CE0] text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5 text-[#64B6AC]" />
            <span>Anonymous Peer Support Circles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Connect with People on the Same Journey
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
            Talk openly with peers navigating similar mental health spaces. Anonymous handles protect your identity, while compassionate community moderation keeps the space safe.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingPost(true)}
          className="shrink-0 px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-[#303F70] text-xs font-bold shadow-md transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4 text-[#A99CE0]" />
          <span>Share with Your Circle</span>
        </button>
      </div>

      {/* Safety & Anonymity Guidelines Card */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start space-x-3 text-xs text-[#20283D]">
        <ShieldCheck className="w-5 h-5 text-[#303F70] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#303F70]">Safe Space & Stigma-Free Peer Network:</strong>
          <span className="text-[#697386] ml-1">
            All participants post using randomized anonymous handles (e.g. <em>CalmPebble#42</em>). Clinical scores are kept private. Zero harassment or triggering advice permitted.
          </span>
        </div>
      </div>

      {/* Circle Selection Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {circles.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCircle(c.id as any)}
            className={`py-2 px-3.5 rounded-2xl text-xs font-bold transition-all border flex items-center space-x-1.5 ${
              selectedCircle === c.id
                ? 'bg-[#303F70] text-white border-[#303F70] shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* Create Post Modal / Box */}
      {isCreatingPost && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-md animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-[#20283D]">Share a Thought or Question with Peers</h3>
            <button
              onClick={() => setIsCreatingPost(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-[#20283D] block mb-1">Select Peer Circle:</label>
            <select
              value={newPostCircle}
              onChange={(e) => setNewPostCircle(e.target.value as any)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
            >
              <option value="mild-stress">🌿 Study & Mild Stress Circle (Exam prep, routine balance)</option>
              <option value="anxiety-panic">🌊 Anxiety & Panic Reset Circle (Grounding, nervous system)</option>
              <option value="burnout">🌅 Career & Work Fatigue Circle (Workplace stress, boundaries)</option>
              <option value="low-mood">🌙 Gentle Recovery & Low Mood Circle (Sadness, small daily steps)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#20283D] block mb-1">Your Message (Posted anonymously):</label>
            <textarea
              rows={4}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What have you learned lately, or what support are you looking for right now?..."
              className="w-full text-xs sm:text-sm p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#303F70]/20"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-[#697386]">Your name and student ID are never shown.</span>
            <button
              onClick={handleCreatePost}
              disabled={!newPostContent.trim()}
              className="px-6 py-2.5 rounded-xl bg-[#303F70] hover:bg-[#202b4d] text-white text-xs font-bold disabled:opacity-40 shadow-xs"
            >
              Publish Anonymous Post
            </button>
          </div>
        </div>
      )}

      {/* Community Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            {/* Header: Anonymous Handle + Circle Pill */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#303F70] to-[#A99CE0] text-white flex items-center justify-center text-xs font-black shadow-xs">
                  {post.authorHandle.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#20283D]">{post.authorHandle}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-[#303F70] font-semibold">
                      {post.authorMentalHealthLevel} Level
                    </span>
                  </div>
                  <span className="text-[10px] text-[#697386]">
                    {new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-[#303F70] bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
                {post.circleName}
              </span>
            </div>

            {/* Post Content */}
            <p className="text-xs sm:text-sm text-[#20283D] leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Action Buttons: Support / Reaction & Comments */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-1.5 transition-colors font-semibold ${
                    post.hasLiked ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{post.likesCount} {post.likesCount === 1 ? 'Support' : 'Supports'}</span>
                </button>

                <button
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                  className="flex items-center space-x-1.5 text-slate-500 hover:text-[#303F70] font-semibold"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments.length} Comments</span>
                </button>
              </div>

              <span className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Peer Discussion</span>
              </span>
            </div>

            {/* Existing Comments */}
            {post.comments.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2.5 text-xs">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="space-y-0.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#303F70]">{comment.authorHandle}</span>
                      <span className="text-slate-400 text-[10px]">
                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Composer */}
            {activeCommentPostId === post.id && (
              <div className="pt-2 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Write an encouraging reply..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  className="flex-1 text-xs py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="px-3.5 py-2 rounded-xl bg-[#303F70] text-white text-xs font-bold hover:bg-[#202b4d]"
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

