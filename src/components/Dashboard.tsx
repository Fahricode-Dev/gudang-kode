import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import {
  Copy, Check, Lock, Code, Server, Plug,
  Search, Crown, Zap, Package,
  MessageCircle, ChevronDown,
} from 'lucide-react';
import { cn } from '../lib/utils';

// ── Music Widget (Spotify-style, floating minimal) ────────────────────────────
function MusicWidget({ musicUrl }: { musicUrl: string }) {
  const [open, setOpen] = useState(false);

  const getEmbed = (url: string) => {
    const m = url.match(/spotify\.com\/(track|playlist|album)\/([a-zA-Z0-9]+)/);
    if (m) return `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0`;
    return '';
  };

  const embed = getEmbed(musicUrl);
  if (!musicUrl) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="w-[320px] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10"
          >
            {embed ? (
              <iframe
                src={embed}
                width="320"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ display: 'block' }}
              />
            ) : (
              <div className="bg-[#121212] p-4 text-neutral-400 text-xs font-mono">
                URL tidak dapat diputar
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button — Spotify-style with waveform decoration */}
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          "group relative w-12 h-12 rounded-full flex items-center justify-center",
          "bg-[#1DB954] hover:bg-[#1ed760]",
          "shadow-xl shadow-[#1DB954]/30 hover:shadow-[#1DB954]/50",
          "transition-all duration-300 hover:scale-110"
        )}
        title="Musik Nevano"
      >
        {/* Spotify icon */}
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-black relative z-10">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>

        {/* Animated waveform bars when open */}
        {open && (
          <span className="absolute -top-1.5 -right-1.5 flex items-end gap-[2px] h-3.5 px-1 bg-black/70 rounded-full overflow-hidden">
            {[0, 0.15, 0.3, 0.45].map((delay, i) => (
              <span
                key={i}
                className="w-[2px] bg-[#1DB954] rounded-full music-bar"
                style={{ height: '100%', animationDelay: `${delay}s` }}
              />
            ))}
          </span>
        )}

        {/* Ripple pulse when open */}
        {open && (
          <span className="absolute inset-0 rounded-full bg-[#1DB954]/30 animate-ping pointer-events-none" />
        )}
      </button>

      {/* Visualizer arcs — decorative, Spotify-like */}
      {open && (
        <div className="absolute bottom-1 right-1 w-12 h-12 pointer-events-none">
          {[1, 2, 3].map(n => (
            <span
              key={n}
              className="absolute inset-0 rounded-full border border-[#1DB954]/20"
              style={{
                transform: `scale(${1 + n * 0.45})`,
                opacity: 1 / (n + 1),
                animation: `ping ${1 + n * 0.4}s cubic-bezier(0,0,0.2,1) infinite`,
                animationDelay: `${n * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Elegant Premium CTA (inline, not a banner) ────────────────────────────────
function PremiumCallout({ waLink }: { waLink: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 dark:border-amber-400/15">
      {/* Subtle gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/6 via-transparent to-violet-500/6 dark:from-amber-400/8 dark:to-violet-400/8 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-violet-400/10 blur-2xl pointer-events-none" />

      <div className="relative px-6 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Crown with halo */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-400/30 flex items-center justify-center">
              <Crown size={18} className="text-amber-500 dark:text-amber-400" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-white dark:border-neutral-950 animate-pulse" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-neutral-800 dark:text-neutral-100 leading-tight tracking-tight">
              Gudang Premium
            </p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
              Akses penuh &#x2022; Update rutin &#x2022; Support langsung
            </p>
          </div>
        </div>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl",
            "text-[11px] font-bold text-white tracking-wide whitespace-nowrap",
            "bg-gradient-to-r from-amber-500 to-amber-600",
            "shadow-md shadow-amber-500/20 hover:shadow-amber-500/35",
            "hover:-translate-y-px transition-all duration-200"
          )}
        >
          <MessageCircle size={12} />
          Upgrade
        </a>
      </div>
    </div>
  );
}

// ── V-Logo Expand Button ──────────────────────────────────────────────────────
function VExpandButton({ expanded, onClick }: { expanded: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className={cn(
        "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
        "border transition-all duration-200",
        expanded
          ? "bg-indigo-500 border-indigo-400 text-white shadow-md shadow-indigo-500/30"
          : "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-indigo-400 hover:text-indigo-500"
      )}
      title={expanded ? "Tutup kode" : "Lihat kode lengkap"}
    >
      <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
        {/* Custom V shape using chevron down */}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </motion.button>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export function Dashboard() {
  const { currentUser, endpoints, musicUrl } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!currentUser) return null;

  const isPremium = currentUser.role === 'premium' || currentUser.role === 'admin';

  const filtered = endpoints.filter(ep =>
    ep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ep.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'plugin': return <Plug size={15} />;
      case 'case': return <Code size={15} />;
      case 'script': return <Zap size={15} />;
      default: return <Server size={15} />;
    }
  };

  const waLink = `https://wa.me/819070424636?text=Halo%20kak%2C%20mau%20berlangganan%20Premium%20Gudang%20Nevano`;
  const basicCount = endpoints.filter(e => e.accessLevel === 'basic').length;
  const premCount = endpoints.filter(e => e.accessLevel === 'premium').length;

  return (
    <div className="w-full flex flex-col gap-6 pb-28">

      {/* ── Page title ── */}
      <div className="flex items-end justify-between gap-6 mt-1">
        <div>
          <p className="text-[10px] font-bold tracking-[0.22em] text-indigo-500 dark:text-indigo-400 uppercase mb-1.5">
            Koleksi Bot AI WhatsApp
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight leading-none" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Gudang Nevano
          </h1>
        </div>

        {isPremium ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-400/30 text-amber-600 dark:text-amber-400 text-[10px] font-black tracking-widest uppercase">
            <Crown size={11} />
            Premium
          </span>
        ) : null}
      </div>

      {/* ── Stats micro-row ── */}
      <div className="flex items-center gap-4 text-[11px] text-neutral-500 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
          {basicCount} Gratis
        </span>
        <span className="w-px h-3 bg-neutral-300 dark:bg-neutral-700" />
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
          {premCount} Premium
        </span>
        <span className="w-px h-3 bg-neutral-300 dark:bg-neutral-700" />
        <span>{endpoints.length} Total</span>
      </div>

      {/* ── Premium CTA (elegant, not a banner) — only for non-premium ── */}
      {!isPremium && <PremiumCallout waLink={waLink} />}

      {/* ── Search bar ── */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Cari kode, plugin, script..."
          className={cn(
            "w-full pl-9 pr-4 py-2.5 text-[13px]",
            "bg-white dark:bg-neutral-900",
            "border border-neutral-200 dark:border-neutral-800",
            "rounded-xl outline-none",
            "focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500",
            "placeholder:text-neutral-400 transition-all"
          )}
        />
      </div>

      {/* ── Endpoint cards ── */}
      <div className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {filtered.map((ep, i) => {
            const isLocked = ep.accessLevel === 'premium' && !isPremium;
            const isExpanded = expandedId === ep.id;

            // Preview: always 4 lines visible
            const allLines = (ep.codeSnippet || '').split('\n');
            const previewLines = allLines.slice(0, 4);
            const hasMore = allLines.length > 4;

            return (
              <motion.div
                key={ep.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.035 }}
                className={cn(
                  "rounded-2xl border overflow-hidden transition-shadow duration-200",
                  "bg-white dark:bg-neutral-900",
                  isLocked
                    ? "border-amber-200/50 dark:border-amber-800/25"
                    : "border-neutral-200 dark:border-neutral-800 hover:shadow-lg hover:shadow-indigo-500/6"
                )}
              >
                {/* Card header */}
                <div className="flex items-center gap-3 px-5 py-4">
                  {/* Icon */}
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                    ep.accessLevel === 'premium'
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                      : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                  )}>
                    {ep.accessLevel === 'premium' ? <Crown size={15} /> : getIcon(ep.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[14px] leading-tight">{ep.name}</span>
                      {ep.accessLevel === 'premium' && (
                        <span className="text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 uppercase border border-amber-200/50 dark:border-amber-800/30">
                          Premium
                        </span>
                      )}
                      <span className="text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 uppercase">
                        {ep.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 truncate">{ep.description}</p>
                  </div>

                  {/* V expand button — only for unlocked items */}
                  {!isLocked && (
                    <VExpandButton
                      expanded={isExpanded}
                      onClick={() => setExpandedId(isExpanded ? null : ep.id)}
                    />
                  )}
                </div>

                {/* ── Code preview block (always visible) ── */}
                <div className="px-5 pb-4">
                  <div className="rounded-xl overflow-hidden border border-neutral-800/80 dark:border-neutral-700/50">

                    {/* macOS-style toolbar */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e]">
                      <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                      <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                      <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                      <span className="ml-2 text-[9px] tracking-widest text-neutral-500 font-mono uppercase">{ep.type}</span>
                    </div>

                    {/* Preview body */}
                    <div className={cn("relative bg-[#0d0d1a] px-4 py-3", isLocked && "select-none")}>
                      <pre
                        className={cn(
                          "text-[12px] leading-[1.75] font-mono overflow-hidden",
                          isLocked
                            ? "text-[#6b7db3] blur-[3px] opacity-70"
                            : "text-[#a5b4fc]"
                        )}
                        style={{ maxHeight: '6rem' }}
                      >
                        <code>{previewLines.join('\n')}{hasMore ? '\n...' : ''}</code>
                      </pre>

                      {/* Fade gradient for free code */}
                      {!isLocked && !isExpanded && hasMore && (
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0d0d1a] to-transparent pointer-events-none" />
                      )}

                      {/* Locked overlay */}
                      {isLocked && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0d1a]/75 backdrop-blur-[2px]">
                          <Lock size={13} className="text-amber-500 mb-1.5" />
                          <p className="text-[11px] font-semibold text-neutral-200 mb-0.5">Konten eksklusif Premium</p>
                          <p className="text-[10px] text-neutral-500 mb-3 text-center max-w-[170px] leading-relaxed">
                            Langganan untuk membuka semua kode premium
                          </p>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold shadow-lg shadow-amber-500/25 hover:opacity-90 transition-opacity"
                          >
                            <Crown size={10} />
                            Hubungi Admin
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Expanded full code — animates down from preview ── */}
                <AnimatePresence initial={false}>
                  {isExpanded && !isLocked && (
                    <motion.div
                      key="expanded"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="px-5 pb-5">
                        <div className="w-full h-px bg-neutral-100 dark:bg-neutral-800 mb-4" />

                        <p className="text-[12px] text-neutral-500 dark:text-neutral-400 mb-4 leading-relaxed">
                          {ep.description}
                        </p>

                        {/* Full code block */}
                        <div className="rounded-xl overflow-hidden border border-neutral-800">

                          {/* Toolbar — deliberately different bg from code body */}
                          <div className="flex items-center justify-between px-4 py-2.5 bg-[#20213a]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                              <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                              <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                              <span className="ml-2 text-[9px] tracking-widest text-neutral-400 font-mono uppercase">
                                {ep.type} &nbsp;/&nbsp; {ep.name}
                              </span>
                            </div>

                            {/* Copy button — bg contrasts clearly from code body #0a0a14 */}
                            <button
                              onClick={e => { e.stopPropagation(); handleCopy(ep.codeSnippet, ep.id); }}
                              className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                                copiedId === ep.id
                                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                                  : "bg-[#4f46e5] text-white hover:bg-[#4338ca] shadow-md shadow-indigo-500/30"
                              )}
                            >
                              {copiedId === ep.id
                                ? <><Check size={11} /> Tersalin</>
                                : <><Copy size={11} /> Salin Kode</>
                              }
                            </button>
                          </div>

                          {/* Code body — darkest layer, clearly distinct from toolbar */}
                          <div className="bg-[#080810] px-5 py-4 overflow-x-auto max-h-[400px] overflow-y-auto">
                            <pre className="text-[12.5px] leading-[1.8] font-mono text-[#c4ceff]">
                              <code>{ep.codeSnippet}</code>
                            </pre>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
              <Package size={28} className="mx-auto mb-3 opacity-25" />
              <p className="text-sm font-semibold">Tidak ada hasil</p>
              <p className="text-xs mt-1 text-neutral-500">Coba kata kunci yang berbeda</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Music floating widget */}
      <MusicWidget musicUrl={musicUrl || ''} />
    </div>
  );
}
