import React, { useState } from 'react';
import { Sparkles, Heart, Zap, Check, Edit2 } from 'lucide-react';
import { BuddyMoodInfo, BuddySessionState, BuddySettings } from '../types/buddy';
import { POPULAR_BUDDIES } from '../utils/buddyConstants';

interface MoodHeroProps {
  state: BuddySessionState;
  settings: BuddySettings;
  moodInfo: BuddyMoodInfo;
  onUpdateBuddy: (name: string, species: string, candyKm: number) => void;
}

export const MoodHero: React.FC<MoodHeroProps> = ({
  state,
  settings,
  moodInfo,
  onUpdateBuddy,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(state.buddyName);
  const [tempSpecies, setTempSpecies] = useState(state.pokemonSpecies);
  const [imgError, setImgError] = useState(false);

  const percent = Math.min(100, Math.round((state.totalEp / 32) * 100));
  const halvedDistance = (settings.candyDistanceKm / 2).toFixed(1).replace('.0', '');

  // PokeAPI official artwork URL format (fallback gracefully on error)
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
    tempSpecies.toLowerCase().trim() === 'lucario' ? '448' :
    tempSpecies.toLowerCase().trim() === 'mewtwo' ? '150' :
    tempSpecies.toLowerCase().trim() === 'rayquaza' ? '384' :
    tempSpecies.toLowerCase().trim() === 'kyogre' ? '382' :
    tempSpecies.toLowerCase().trim() === 'groudon' ? '383' :
    tempSpecies.toLowerCase().trim() === 'garchomp' ? '445' :
    tempSpecies.toLowerCase().trim() === 'charizard' ? '6' :
    tempSpecies.toLowerCase().trim() === 'eevee' ? '133' :
    tempSpecies.toLowerCase().trim() === 'pikachu' ? '25' :
    tempSpecies.toLowerCase().trim() === 'magikarp' ? '129' :
    tempSpecies.toLowerCase().trim() === 'larvitar' ? '246' :
    tempSpecies.toLowerCase().trim() === 'beldum' ? '374' : '448'
  }.png`;

  const handleSave = () => {
    const matched = POPULAR_BUDDIES.find(
      (b) => b.species.toLowerCase() === tempSpecies.toLowerCase()
    );
    onUpdateBuddy(tempName || 'Buddy', tempSpecies, matched ? matched.km : settings.candyDistanceKm);
    setIsEditing(false);
    setImgError(false);
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 p-5 ${
      state.isExcited
        ? 'bg-gradient-to-br from-rose-950/40 via-slate-900 to-pink-950/30 border-rose-500/50 shadow-lg shadow-rose-950/50'
        : 'bg-slate-900/80 border-slate-800 shadow-md'
    }`}>
      {/* Excited ambient flare */}
      {state.isExcited && (
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="flex items-start justify-between gap-4">
        {/* Left: Avatar & Identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center p-1.5 transition-transform ${
              state.isExcited
                ? 'bg-gradient-to-tr from-rose-500/30 to-amber-500/30 ring-2 ring-rose-400 animate-excited-float'
                : 'bg-slate-800/80 border border-slate-700/60'
            }`}>
              {!imgError ? (
                <img
                  src={spriteUrl}
                  alt={state.buddyName}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain drop-shadow"
                />
              ) : (
                <span className="text-3xl select-none">{moodInfo.emoji}</span>
              )}
            </div>

            {/* Floating Mood Badge Emoji */}
            <span
              className="absolute -bottom-1 -right-1 text-base bg-slate-900 rounded-full p-0.5 shadow border border-slate-700"
              title={`Mood: ${moodInfo.label}`}
            >
              {moodInfo.emoji}
            </span>
          </div>

          <div>
            {!isEditing ? (
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {state.buddyName}
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                  title="Change buddy"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-sm text-white font-semibold w-28 focus:outline-none focus:border-emerald-500"
                  placeholder="Buddy Name"
                />
                <button
                  onClick={handleSave}
                  className="p-1 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 rounded"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${moodInfo.badgeColor}`}>
                {moodInfo.label}
              </span>
              <span className="text-xs text-slate-400">{moodInfo.description}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Preset Switcher (when editing) */}
        {isEditing && (
          <div className="flex flex-col gap-1 items-end">
            <span className="text-[10px] text-slate-400 font-medium">Quick Presets:</span>
            <select
              value={tempSpecies}
              onChange={(e) => {
                const s = e.target.value;
                setTempSpecies(s);
                const found = POPULAR_BUDDIES.find((b) => b.species === s);
                if (found) {
                  setTempName(found.name);
                }
              }}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
            >
              {POPULAR_BUDDIES.map((b) => (
                <option key={b.species} value={b.species}>
                  {b.name} ({b.km}km)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Emotion Points Progress Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center gap-1.5">
            <Zap className={`w-3.5 h-3.5 ${state.isExcited ? 'text-rose-400' : 'text-amber-400'}`} />
            <span className="font-semibold text-slate-200">Emotion Points</span>
          </div>
          <div className="font-mono font-bold text-slate-100">
            <span className={state.isExcited ? 'text-rose-400' : 'text-emerald-400'}>
              {state.totalEp}
            </span>
            <span className="text-slate-500"> / 32 EP</span>
            <span className="text-slate-400 text-[11px] ml-1.5">({percent}%)</span>
          </div>
        </div>

        {/* The Track */}
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              state.isExcited
                ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Excited Perks & Status Highlights */}
      <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
        {/* Halved Candy Distance */}
        <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/60 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-medium">Candy Distance</div>
            <div className="font-bold text-slate-200">
              {state.isExcited ? (
                <span className="text-emerald-400">
                  {halvedDistance} km <span className="text-[10px] text-emerald-500 font-normal">(-50%)</span>
                </span>
              ) : (
                <span>
                  {settings.candyDistanceKm} km{' '}
                  <span className="text-[10px] text-slate-500 font-normal">➔ {halvedDistance} km</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Double Hearts Bonus */}
        <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/60 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-medium">Daily Hearts</div>
            <div className="font-bold text-slate-200">
              {state.isExcited ? (
                <span className="text-rose-400 font-bold">2× Double Hearts Active</span>
              ) : (
                <span>Up to 20-24 Hearts</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
