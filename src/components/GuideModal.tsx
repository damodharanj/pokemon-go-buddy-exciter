import React from 'react';
import { X, ExternalLink, Lightbulb, ShieldCheck, Heart, Sparkles, AlertTriangle } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white">How It Works: Free Excited Buddy</h2>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Based on the community findings from{' '}
          <a
            href="https://www.reddit.com/r/pokemongo/comments/1qph1qy/excited_without_a_poffin/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline inline-flex items-center gap-0.5"
          >
            r/pokemongo <ExternalLink className="w-3 h-3 inline" />
          </a>
        </p>

        {/* Section 1: The Core Formula */}
        <div className="space-y-4 text-sm text-slate-300">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              The 32 Emotion Point (EP) Rule
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your buddy enters the <strong className="text-rose-400">Excited Mood</strong> once it reaches <strong>32 Emotion Points</strong>. In this state, candy distance is cut by 50% and heart slots are doubled.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              The 30-Minute Cooldown Loop
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-2">
              Each core activity gives <strong>+2 EP</strong>, but has a <strong>30-minute cooldown</strong> before it can reward points again:
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li><strong className="text-slate-200">Feed Buddy:</strong> Give 3 berries for Round 1, then 1 berry in later rounds (+2 EP).</li>
              <li><strong className="text-slate-200">Play / Pet:</strong> Swipe until hearts appear (+2 EP).</li>
              <li><strong className="text-slate-200">Snapshot:</strong> Take a photo in AR/camera (+2 EP).</li>
              <li><strong className="text-slate-200">Team Leader Battle:</strong> Train against Blanche, Candela, or Spark in Master League and surrender immediately (+2 EP).</li>
            </ul>
            <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300">
              💡 <strong>Math:</strong> 4 core actions = +8 EP per round. 4 rounds × 8 EP = <strong>32 EP in ~90 minutes!</strong>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              Decay & Maintenance
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-2">
              Points naturally decay by 1 point every 25 minutes of total inactivity.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Once excited, this app will switch to <strong>Maintenance Mode</strong> with 20-minute reminders. Simply pet or photograph your buddy once every 20 minutes to keep them excited all day!
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-rose-400" />
              Pro Walking Trick
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              If walking a 20 km Legendary, try to achieve Excited status right around 19.5 km. The threshold will instantly drop to 10 km, awarding your candy immediately and rolling your extra distance into the next cycle!
            </p>
          </div>
        </div>

        {/* Close button bottom */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Got it, let&apos;s go!
          </button>
        </div>
      </div>
    </div>
  );
};
