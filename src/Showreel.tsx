import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import UseAnimations from 'react-useanimations';
import zap from 'react-useanimations/lib/zap';
import activity from 'react-useanimations/lib/activity';
import mapIcon from 'react-useanimations/lib/map';
import star from 'react-useanimations/lib/star';
import settings from 'react-useanimations/lib/settings';
import refresh from 'react-useanimations/lib/refresh';
import award from 'react-useanimations/lib/award';
import globe from 'react-useanimations/lib/globe';
import camera from 'react-useanimations/lib/camera';

const FONT = 'Inter, "Inter Display", sans-serif';
const MONO = '"DejaVu Sans Mono", monospace';
const PALETTE = ['#ff5f6d', '#ffc371', '#47e5bc', '#5b8cff', '#c56cf0', '#ffe347', '#ff47d2'];
const BG = '#0b0917';

/* ─── Background ─────────────────────────────────────────────────────────── */
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const blobs = [
    {c: PALETTE[0], x: 20, y: 30, r: 750, s: 0.012},
    {c: PALETTE[3], x: 80, y: 70, r: 850, s: 0.009},
    {c: PALETTE[4], x: 60, y: 15, r: 650, s: 0.014},
    {c: PALETTE[2], x: 15, y: 85, r: 550, s: 0.011},
    {c: PALETTE[5], x: 50, y: 50, r: 600, s: 0.016},
  ];
  const dust = React.useMemo(() =>
    Array.from({length: 40}).map((_, i) => ({
      x: (i * 37) % 100, y: (i * 53) % 100,
      size: 2 + (i % 4), speed: 0.2 + (i % 5) * 0.15, opacity: 0.2 + (i % 6) * 0.1,
    })), []);
  return (
    <AbsoluteFill style={{backgroundColor: BG, overflow: 'hidden'}}>
      {blobs.map((b, i) => {
        const dx = Math.sin(frame * b.s + i) * 200;
        const dy = Math.cos(frame * b.s * 1.2 + i * 2) * 160;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `calc(${b.x}% - ${b.r / 2}px)`, top: `calc(${b.y}% - ${b.r / 2}px)`,
            width: b.r, height: b.r, borderRadius: '50%',
            background: b.c, opacity: 0.3, filter: 'blur(150px)',
            transform: `translate(${dx}px, ${dy}px)`,
          }} />
        );
      })}
      <AbsoluteFill style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '90px 90px',
        backgroundPosition: `${frame * 0.5}px ${frame * 0.7}px`,
      }} />
      {dust.map((d, i) => {
        const py = (d.y * 1080 - frame * d.speed * 8) % 1080;
        const px = d.x * 1920 + Math.sin(frame * 0.03 + i) * 20;
        return (
          <div key={i} style={{
            position: 'absolute', left: px, top: py < 0 ? py + 1080 : py,
            width: d.size, height: d.size, borderRadius: '50%',
            backgroundColor: 'white',
            opacity: d.opacity * (0.5 + 0.5 * Math.sin(frame * 0.1 + i)),
            boxShadow: '0 0 8px white',
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

/* ─── SceneWrap ──────────────────────────────────────────────────────────── */
const SceneWrap: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10, dur - 10, dur], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const scale = interpolate(frame, [0, dur], [1.04, 1], {easing: Easing.out(Easing.cubic)});
  return <AbsoluteFill style={{opacity, transform: `scale(${scale})`}}>{children}</AbsoluteFill>;
};

/* ─── Scene 1: Title ─────────────────────────────────────────────────────── */
const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const word = 'РЕАКТИВНО!';
  const sub = interpolate(frame, [30, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const badgeSpring = spring({frame: frame - 40, fps, config: {damping: 12}});
  const pills = [
    {label: 'TypeScript', anim: zap,      color: PALETTE[3]},
    {label: 'Remotion',   anim: activity, color: PALETTE[0]},
    {label: 'Zero Adobe', anim: mapIcon,  color: PALETTE[1]},
    {label: '60 FPS',     anim: star,     color: PALETTE[2]},
  ];
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontFamily: FONT, flexDirection: 'column'}}>
      <div style={{display: 'flex', gap: 20, marginBottom: 40, opacity: badgeSpring, transform: `translateY(${(1 - badgeSpring) * -30}px)`}}>
        {pills.map((p) => (
          <div key={p.label} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 26px',
            borderRadius: 50, background: 'rgba(255,255,255,0.08)', border: `1px solid ${p.color}66`,
            color: 'white', fontSize: 22, fontWeight: 600, boxShadow: `0 8px 32px ${p.color}22`,
          }}>
            <UseAnimations animation={p.anim} size={28} strokeColor={p.color} autoplay loop />
            <span>{p.label}</span>
          </div>
        ))}
      </div>
      <div style={{display: 'flex', gap: 14}}>
        {word.split('').map((ch, i) => {
          const s = spring({frame: frame - i * 3, fps, config: {damping: 8, mass: 0.5}});
          const wobble = Math.sin((frame - i * 3) / 5) * 5 * Math.max(0, 1 - frame / 90);
          return (
            <span key={i} style={{
              fontSize: 210, fontWeight: 900, color: PALETTE[i % PALETTE.length],
              display: 'inline-block',
              transform: `translateY(${(1 - s) * -450}px) rotate(${wobble}deg) scale(${s})`,
              textShadow: `0 25px 60px ${PALETTE[i % PALETTE.length]}55`,
            }}>
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          );
        })}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, marginTop: 20,
        fontSize: 48, fontWeight: 600, color: 'rgba(255,255,255,0.85)',
        opacity: sub, transform: `translateY(${(1 - sub) * 30}px)`, letterSpacing: 3,
      }}>
        <span>Видеоролики пишутся кодом. Буквально.</span>
        <UseAnimations animation={star} size={42} strokeColor={PALETTE[5]} autoplay loop />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Code Editor ───────────────────────────────────────────────── */
const CODE = `export const Video = () => {
  const frame = useCurrentFrame();
  const scale = spring({
    frame, fps: 30,
    config: { damping: 10 }
  });
  return (
    <div style={{
      transform: \`scale(\${scale})\`,
      background: 'linear-gradient(...)'
    }}>
      <h1>Чистый код = Кино</h1>
    </div>
  );
};`;

const highlight = (line: string) => {
  const parts = line.split(/(export|const|return|useCurrentFrame|spring|div|h1|style|=>|'[^']*'|`[^`]*`|\d+)/g);
  return parts.map((p, i) => {
    let color = '#e6e6f0';
    if (['export', 'const', 'return'].includes(p)) color = PALETTE[4];
    else if (['useCurrentFrame', 'spring'].includes(p)) color = PALETTE[3];
    else if (['div', 'h1'].includes(p)) color = PALETTE[0];
    else if (p === '=>' || p === 'style') color = PALETTE[1];
    else if (/^\d+$/.test(p)) color = PALETTE[2];
    else if (p.startsWith("'") || p.startsWith('`')) color = '#47e5bc';
    return <span key={i} style={{color}}>{p}</span>;
  });
};

const CodeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chars = Math.floor(interpolate(frame, [10, 80], [0, CODE.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const typed = CODE.slice(0, chars);
  const enter = spring({frame, fps, config: {damping: 14}});
  const preview = spring({frame: frame - 85, fps, config: {damping: 9}});
  const caretOn = Math.floor(frame / 7) % 2 === 0;
  const lines = typed.split('\n');
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 60, fontFamily: FONT}}>
      <div style={{
        width: 960, height: 720, borderRadius: 28,
        background: 'rgba(16,14,35,0.92)', border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 40px 140px rgba(0,0,0,0.6)',
        transform: `translateX(${(1 - enter) * -300}px) rotate(${(1 - enter) * -6}deg)`,
        opacity: enter, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{display: 'flex', alignItems: 'center', padding: '20px 26px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)'}}>
          <div style={{display: 'flex', gap: 10}}>
            {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
              <div key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />
            ))}
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginLeft: 30, background: 'rgba(255,255,255,0.06)', padding: '6px 18px', borderRadius: 10}}>
            <UseAnimations animation={settings} size={22} strokeColor={PALETTE[3]} autoplay loop />
            <span style={{color: 'rgba(255,255,255,0.8)', fontSize: 20, fontFamily: MONO}}>Showreel.tsx</span>
          </div>
          <div style={{marginLeft: 'auto', color: PALETTE[3], fontSize: 18, fontFamily: MONO, fontWeight: 600}}>● Live Compile</div>
        </div>
        <div style={{display: 'flex', padding: '20px 0', overflow: 'hidden', flex: 1}}>
          <div style={{width: 60, paddingRight: 16, textAlign: 'right', fontFamily: MONO, fontSize: 22, lineHeight: 1.4, color: 'rgba(255,255,255,0.25)', userSelect: 'none' as const}}>
            {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          <div style={{flex: 1, fontFamily: MONO, fontSize: 22, lineHeight: 1.4, paddingRight: 20}}>
            {lines.map((ln, i, arr) => (
              <div key={i} style={{background: i === arr.length - 1 ? 'rgba(91,140,255,0.1)' : 'transparent', borderRadius: 6, paddingLeft: 8}}>
                {highlight(ln)}
                {i === arr.length - 1 && caretOn ? <span style={{color: PALETTE[2]}}>▎</span> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{
        width: 620, height: 720, borderRadius: 28,
        background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
        border: '1.5px solid rgba(255,255,255,0.18)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        boxShadow: '0 40px 140px rgba(0,0,0,0.6)',
        transform: `translateY(${(1 - Math.min(preview, 1)) * 200}px)`,
        opacity: interpolate(frame, [83, 92], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{position: 'absolute', top: 24, left: 28, color: 'rgba(255,255,255,0.4)', fontSize: 18, fontFamily: MONO, textTransform: 'uppercase' as const, letterSpacing: 2}}>Live Render Output</div>
        <div style={{
          padding: '30px 50px', borderRadius: 24,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)',
          transform: `scale(${preview})`, boxShadow: '0 20px 50px rgba(0,0,0,0.4)', textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: 64, fontWeight: 900, margin: 0,
            background: `linear-gradient(90deg, ${PALETTE[0]}, ${PALETTE[1]}, ${PALETTE[2]})`,
            WebkitBackgroundClip: 'text', color: 'transparent',
          }}>Чистый код = Кино</h1>
          <div style={{marginTop: 14, color: 'rgba(255,255,255,0.7)', fontSize: 22}}>Рендерится в реальном времени ⚡️</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: Architecture ──────────────────────────────────────────────── */
const ArchitectureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 14}});
  const nodes = [
    {title: '<Composition>', desc: 'Главный контейнер (1920×1080, 60fps)', color: PALETTE[3], x: 0, y: -180},
    {title: '<Sequence>',    desc: 'Временной интервал сцены',              color: PALETTE[1], x: -350, y: 40},
    {title: '<AbsoluteFill>',desc: 'Полноэкранный слой позиционирования',   color: PALETTE[2], x: 0, y: 40},
    {title: '<React.FC>',    desc: 'Кастомные анимационные компоненты',     color: PALETTE[4], x: 350, y: 40},
  ];
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontFamily: FONT, flexDirection: 'column'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, color: 'white', fontSize: 64, fontWeight: 900, marginBottom: 80, opacity: enter, transform: `translateY(${(1 - enter) * -40}px)`, textAlign: 'center'}}>
        <UseAnimations animation={mapIcon} size={52} strokeColor={PALETTE[3]} autoplay loop />
        <span>Архитектура — чистый <span style={{color: PALETTE[3]}}>React Tree</span></span>
      </div>
      <div style={{position: 'relative', width: 1200, height: 350, display: 'flex', justifyContent: 'center'}}>
        <div style={{
          position: 'absolute', top: 0,
          background: 'rgba(255,255,255,0.06)', border: `2px solid ${nodes[0].color}`,
          borderRadius: 20, padding: '24px 40px', textAlign: 'center',
          boxShadow: `0 0 50px ${nodes[0].color}44`, transform: `scale(${enter})`,
        }}>
          <div style={{color: nodes[0].color, fontSize: 32, fontWeight: 800, fontFamily: MONO}}>{nodes[0].title}</div>
          <div style={{color: 'rgba(255,255,255,0.7)', fontSize: 20, marginTop: 8}}>{nodes[0].desc}</div>
        </div>
        <div style={{position: 'absolute', bottom: 0, display: 'flex', gap: 60, width: '100%', justifyContent: 'center'}}>
          {nodes.slice(1).map((n, i) => {
            const ns = spring({frame: frame - 15 - i * 8, fps, config: {damping: 12}});
            return (
              <div key={n.title} style={{
                background: 'rgba(255,255,255,0.04)', border: `1.5px solid ${n.color}`,
                borderRadius: 20, padding: '24px 30px', width: 340, textAlign: 'center',
                boxShadow: `0 0 40px ${n.color}33`,
                opacity: ns, transform: `translateY(${(1 - ns) * 40}px) scale(${ns})`,
              }}>
                <div style={{color: n.color, fontSize: 28, fontWeight: 800, fontFamily: MONO}}>{n.title}</div>
                <div style={{color: 'rgba(255,255,255,0.7)', fontSize: 18, marginTop: 8}}>{n.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 4: Stats ─────────────────────────────────────────────────────── */
const STATS = [
  {label: 'Кадров в секунду', value: 60,  suffix: 'FPS', color: PALETTE[0], anim: undefined},
  {label: 'React Компонентов', value: 24, suffix: '',    color: PALETTE[1], anim: undefined},
  {label: 'Строк магии',      value: 450, suffix: '+',   color: PALETTE[2], anim: undefined},
  {label: 'Чашек эспрессо',   value: 5,  suffix: '',    color: PALETTE[3], anim: award},
];

const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const max = Math.max(...STATS.map((s) => s.value));
  const headerSpring = spring({frame, fps, config: {damping: 14}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontFamily: FONT, flexDirection: 'column'}}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 18,
        color: 'white', fontSize: 68, fontWeight: 900, marginBottom: 70,
        opacity: headerSpring, transform: `translateY(${(1 - headerSpring) * -30}px)`, textAlign: 'center',
      }}>
        <UseAnimations animation={star} size={50} strokeColor={PALETTE[2]} autoplay loop />
        <span><span style={{color: PALETTE[2]}}>Данные</span> мгновенно оживают в графику</span>
      </div>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 60, height: 500}}>
        {STATS.map((s, i) => {
          const p = spring({frame: frame - 12 - i * 6, fps, config: {damping: 12}});
          const h = Math.max(0.15, s.value / max) * 380 * p;
          return (
            <div key={s.label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', width: 260,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24, padding: '30px 20px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: 10, color: 'white', fontSize: 52, fontWeight: 900, marginBottom: 16, fontVariantNumeric: 'tabular-nums' as const}}>
                {Math.round(s.value * p)}{s.suffix}
                {s.anim && <UseAnimations animation={s.anim} size={32} strokeColor={s.color} autoplay loop />}
              </div>
              <div style={{
                width: 130, height: h, borderRadius: 20,
                background: `linear-gradient(180deg, ${s.color}, ${s.color}22)`,
                boxShadow: `0 0 50px ${s.color}66`, border: `1px solid ${s.color}88`,
              }} />
              <div style={{color: 'rgba(255,255,255,0.7)', fontSize: 24, marginTop: 24, textAlign: 'center', fontWeight: 500}}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 5: DOOM Gameplay ─────────────────────────────────────────────── */

/* Псевдо-3D колонки стен (простой рейкастинг через div'ы) */
const DoomWalls: React.FC<{frame: number}> = ({frame}) => {
  const COLS = 48;
  const W = 1920;
  const MID_Y = 540; // горизонт
  const VIEW_H = 800; // высота игровой области

  /* угол камеры плавно вращается */
  const camAngle = frame * 0.025;

  const columns: React.ReactNode[] = [];
  for (let col = 0; col < COLS; col++) {
    const rayAngle = camAngle + (col / COLS - 0.5) * 1.1;
    /* фейковая дистанция: синусоидальный «лабиринт» */
    const dist = 2.5 + 1.8 * Math.abs(Math.sin(rayAngle * 3.7 + 0.8)) + 1.2 * Math.abs(Math.cos(rayAngle * 2.1));
    const wallH = Math.min(VIEW_H, (VIEW_H / dist) * 1.4);

    /* Цвет стены: тёмно-красный → светлее ближе */
    const bright = Math.max(0, Math.min(1, 1 - dist / 7));
    const r = Math.round(160 * bright + 30);
    const g = Math.round(20 * bright);
    const b = Math.round(20 * bright);

    /* горизонтальная полоса текстуры */
    const texOffset = Math.floor((rayAngle * 120) % 12);

    columns.push(
      <div
        key={col}
        style={{
          position: 'absolute',
          left: (col / COLS) * W,
          width: W / COLS + 1,
          top: MID_Y - wallH / 2,
          height: wallH,
          background: `repeating-linear-gradient(
            90deg,
            rgb(${r},${g},${b}) 0px,
            rgb(${Math.max(0, r - 18)},${g},${b}) ${texOffset}px,
            rgb(${r},${g},${b}) ${texOffset + 6}px
          )`,
          boxShadow: bright > 0.5 ? `inset -3px 0 12px rgba(255,60,0,0.3)` : undefined,
        }}
      />
    );
  }
  return <>{columns}</>;
};

/* Пол и потолок */
const DoomFloorCeiling: React.FC<{frame: number}> = ({frame}) => {
  const scroll = (frame * 4) % 60;
  return (
    <>
      {/* потолок */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 540,
        background: 'linear-gradient(180deg, #0a0008 0%, #1a0612 60%, #2a0a1a 100%)',
      }} />
      {/* пол */}
      <div style={{
        position: 'absolute', bottom: 130, left: 0, right: 0, height: 410,
        backgroundImage:
          `repeating-linear-gradient(0deg, rgba(120,40,10,0.4) 0px, transparent 1px, transparent ${30 + scroll * 0.3}px),` +
          `repeating-linear-gradient(90deg, rgba(120,40,10,0.25) 0px, transparent 1px, transparent 60px)`,
        backgroundSize: `60px ${30 + scroll * 0.3}px`,
        background: `linear-gradient(0deg, #1a0a04 0%, #2d1008 60%, #3a1510 100%)`,
      }} />
    </>
  );
};

/* Спрайт демона */
type DemonProps = {x: number; y: number; scale: number; dying?: boolean; frame: number; seed: number};
const Demon: React.FC<DemonProps> = ({x, y, scale, dying = false, frame, seed}) => {
  const bob = Math.sin(frame * 0.18 + seed) * 6;
  const deathScale = dying ? Math.max(0, 1 - ((frame % 40) / 40)) : 1;
  const alpha = dying ? Math.max(0, 1 - ((frame % 40) / 40)) : 1;

  /* "пиксельное" тело из блоков */
  const bodyColor = '#8B1A00';
  const eyeColor  = '#FF3B00';
  const hornColor = '#3D0A00';

  return (
    <div style={{
      position: 'absolute', left: x, top: y + bob,
      transform: `scale(${scale * deathScale})`,
      transformOrigin: 'bottom center',
      opacity: alpha,
    }}>
      {/* рога */}
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: -4}}>
        <div style={{width: 14, height: 28, background: hornColor, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)', marginLeft: 18}} />
        <div style={{width: 14, height: 28, background: hornColor, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)', marginRight: 18}} />
      </div>
      {/* голова */}
      <div style={{width: 100, height: 80, background: bodyColor, borderRadius: '12px 12px 4px 4px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
        <div style={{width: 18, height: 14, background: eyeColor, borderRadius: 3, boxShadow: `0 0 10px ${eyeColor}`}} />
        <div style={{width: 18, height: 14, background: eyeColor, borderRadius: 3, boxShadow: `0 0 10px ${eyeColor}`}} />
        {/* рот */}
        <div style={{position: 'absolute', bottom: 12, width: 44, height: 10, background: '#FF0000', borderRadius: 4}} />
      </div>
      {/* тело */}
      <div style={{width: 100, height: 90, background: '#6B1200', marginTop: 2, borderRadius: '4px 4px 8px 8px', position: 'relative'}}>
        {/* руки */}
        <div style={{position: 'absolute', left: -28, top: 10, width: 32, height: 16, background: bodyColor, borderRadius: 8, transform: `rotate(${Math.sin(frame * 0.15 + seed) * 20}deg)`}} />
        <div style={{position: 'absolute', right: -28, top: 10, width: 32, height: 16, background: bodyColor, borderRadius: 8, transform: `rotate(${-Math.sin(frame * 0.15 + seed) * 20}deg)`}} />
      </div>
      {/* ноги */}
      <div style={{display: 'flex', gap: 10, justifyContent: 'center', marginTop: 2}}>
        <div style={{width: 34, height: 40, background: '#4A0E00', borderRadius: '4px 4px 6px 6px', transform: `translateY(${Math.sin(frame * 0.2 + seed) * 5}px)`}} />
        <div style={{width: 34, height: 40, background: '#4A0E00', borderRadius: '4px 4px 6px 6px', transform: `translateY(${-Math.sin(frame * 0.2 + seed) * 5}px)`}} />
      </div>
    </div>
  );
};

/* Кровавые брызги при убийстве */
const BloodSplatter: React.FC<{x: number; y: number; frame: number; startFrame: number}> = ({x, y, frame, startFrame}) => {
  const t = frame - startFrame;
  if (t < 0 || t > 25) return null;
  const drops = 8;
  return (
    <>
      {Array.from({length: drops}).map((_, i) => {
        const angle = (i / drops) * Math.PI * 2;
        const speed = 8 + (i % 3) * 5;
        const dx = Math.cos(angle) * speed * t * 0.5;
        const dy = Math.sin(angle) * speed * t * 0.5 + t * t * 0.15;
        const sz = Math.max(0, (12 - t * 0.4) * (0.6 + (i % 3) * 0.3));
        return (
          <div key={i} style={{
            position: 'absolute', left: x + dx, top: y + dy,
            width: sz, height: sz, borderRadius: '50%',
            background: '#cc0000',
            opacity: Math.max(0, 1 - t / 25),
            boxShadow: '0 0 6px #ff0000',
          }} />
        );
      })}
    </>
  );
};

/* Оружие — супердробовик */
const DoomWeapon: React.FC<{frame: number; shooting: boolean}> = ({frame, shooting}) => {
  const bob = Math.sin(frame * 0.12) * 8;
  const kickback = shooting ? Math.min(frame % 15, 8) * 14 : 0;
  return (
    <div style={{
      position: 'absolute', bottom: 128, left: '50%',
      transform: `translateX(-50%) translateY(${bob + kickback}px)`,
      width: 420, display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      {/* вспышка выстрела */}
      {shooting && frame % 15 < 5 && (
        <div style={{
          position: 'absolute', top: -90, width: 80, height: 80,
          background: 'radial-gradient(circle, #fff 0%, #ffee00 30%, #ff6600 65%, transparent 100%)',
          borderRadius: '50%',
          opacity: 1 - (frame % 15) / 5,
          filter: 'blur(3px)',
          boxShadow: '0 0 40px 20px #ff660088',
        }} />
      )}
      {/* стволы */}
      <div style={{display: 'flex', gap: 18, marginBottom: -6}}>
        {[0, 1].map((i) => (
          <div key={i} style={{
            width: 28, height: 120,
            background: 'linear-gradient(180deg, #444 0%, #888 30%, #555 60%, #333 100%)',
            borderRadius: '6px 6px 2px 2px',
            boxShadow: '0 0 12px rgba(0,0,0,0.8)',
          }} />
        ))}
      </div>
      {/* корпус дробовика */}
      <div style={{
        width: 320, height: 70,
        background: 'linear-gradient(180deg, #777 0%, #555 40%, #3a3a3a 100%)',
        borderRadius: '8px 8px 4px 4px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
        position: 'relative',
      }}>
        <div style={{position: 'absolute', left: 20, top: 18, width: 100, height: 12, background: '#222', borderRadius: 4}} />
        <div style={{position: 'absolute', right: 20, top: 14, width: 60, height: 20, background: '#8B6914', borderRadius: 4}} />
      </div>
      {/* приклад */}
      <div style={{
        width: 200, height: 50,
        background: 'linear-gradient(180deg, #8B6914 0%, #6B4E0E 100%)',
        borderRadius: '4px 4px 14px 14px',
        marginTop: -4,
        boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
      }} />
    </div>
  );
};

/* Главная DOOM-сцена */
const DoomGameplayScene: React.FC = () => {
  const frame = useCurrentFrame();

  const kills = 42 + Math.floor(frame / 18);
  const ammo  = Math.max(0, 32 - (Math.floor(frame / 15) % 32));
  const shooting = frame % 15 < 6;
  const health = Math.max(55, 100 - Math.floor(frame / 40) * 5);
  const armor  = Math.max(80, 200 - Math.floor(frame / 60) * 10);

  /* позиции демонов — 3 штуки на разных дистанциях */
  const demons = [
    {bx: 750,  by: 330, sc: 0.9,  seed: 0,   deathAt: 55},
    {bx: 1020, by: 290, sc: 0.7,  seed: 1.5, deathAt: 90},
    {bx: 1280, by: 310, sc: 0.55, seed: 3.0, deathAt: 999},
  ];

  /* экранный шейк при выстреле */
  const shake = shooting && frame % 15 < 4
    ? `translate(${(Math.random() - 0.5) * 6}px, ${(Math.random() - 0.5) * 4}px)`
    : 'none';

  /* красная вспышка ущерба */
  const damagePulse = Math.max(0, 0.35 * Math.sin(frame * 0.28 - 0.5));

  return (
    <AbsoluteFill style={{fontFamily: MONO, overflow: 'hidden', transform: shake}}>

      {/* ── пол и потолок ── */}
      <DoomFloorCeiling frame={frame} />

      {/* ── стены ── */}
      <DoomWalls frame={frame} />

      {/* ── демоны ── */}
      {demons.map((d, i) => {
        const dying = frame >= d.deathAt;
        const visible = frame < d.deathAt + 30;
        if (!visible) return null;
        const walk = Math.max(0, 1 - Math.max(0, frame - 20) / 40);
        const approachX = d.bx - walk * 60 * (i + 1);
        const approachY = d.by + walk * 30 * (i + 1);
        return (
          <React.Fragment key={i}>
            <Demon x={approachX} y={approachY} scale={d.sc} dying={dying} frame={frame} seed={d.seed} />
            {dying && (
              <BloodSplatter
                x={approachX + 50 * d.sc}
                y={approachY + 100 * d.sc}
                frame={frame}
                startFrame={d.deathAt}
              />
            )}
          </React.Fragment>
        );
      })}

      {/* ── оружие ── */}
      <DoomWeapon frame={frame} shooting={shooting} />

      {/* ── виньетка урона ── */}
      <AbsoluteFill style={{
        boxShadow: `inset 0 0 180px rgba(255,20,0,${0.4 + damagePulse})`,
        pointerEvents: 'none',
      }} />

      {/* ── прицел ── */}
      <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
        <div style={{position: 'relative', width: 40, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          {/* крест */}
          <div style={{position: 'absolute', width: 30, height: 2, background: 'rgba(0,255,100,0.85)'}} />
          <div style={{position: 'absolute', width: 2, height: 30, background: 'rgba(0,255,100,0.85)'}} />
          {/* окружность */}
          <div style={{width: 24, height: 24, borderRadius: '50%', border: '2px solid rgba(0,255,100,0.6)'}} />
          {/* центральная точка */}
          <div style={{position: 'absolute', width: 4, height: 4, background: '#ff3b00', borderRadius: '50%', boxShadow: '0 0 8px #ff3b00'}} />
        </div>
      </div>

      {/* ── верхний HUD: цель и локация ── */}
      <div style={{position: 'absolute', top: 32, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 60px', alignItems: 'flex-start'}}>
        <div>
          <div style={{color: '#ff3b00', fontSize: 22, fontWeight: 700, letterSpacing: 3, textShadow: '0 0 14px #ff3b00'}}>
            ⚠ OBJECTIVE: SLAY THE HORDE
          </div>
          <div style={{color: 'rgba(255,180,100,0.7)', fontSize: 17, marginTop: 4, letterSpacing: 2}}>
            LOCATION: UAC HELL BASE // SECTOR 04
          </div>
        </div>

        {/* правый: счётчик убийств */}
        <div style={{textAlign: 'right'}}>
          <div style={{color: '#00ffcc', fontSize: 22, fontWeight: 700, textShadow: '0 0 12px #00ffcc'}}>
            DEMONS SLAIN: {kills}
          </div>
          <div style={{color: '#ff3b00', fontSize: 17, marginTop: 4, opacity: shooting ? 1 : 0.4}}>
            GLORY KILL +50
          </div>
        </div>
      </div>

      {/* ── центральный экшн-текст ── */}
      <div style={{
        position: 'absolute', top: '32%', left: 0, right: 0, textAlign: 'center',
        fontSize: 38, fontWeight: 900, letterSpacing: 5,
        color: '#ff3b00', textTransform: 'uppercase',
        textShadow: '0 0 30px #ff3b00, 0 0 60px #ff000055',
        opacity: frame % 60 < 40 ? 1 : 0,
      }}>
        {frame % 90 < 45 ? '⚡ CHAINSAW READY' : '☠ DEMON STAGGERED'}
      </div>

      {/* ── нижний HUD ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 130,
        background: 'linear-gradient(0deg, #0e0305 0%, rgba(14,3,5,0.95) 100%)',
        borderTop: '3px solid #ff3b00',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 80px',
      }}>
        {/* левый: хп и броня */}
        <div style={{display: 'flex', gap: 54}}>
          <div>
            <div style={{color: '#666', fontSize: 15, letterSpacing: 2}}>HEALTH</div>
            <div style={{
              color: health > 60 ? '#ff3b00' : '#ff0000',
              fontSize: 52, fontWeight: 900, lineHeight: 1,
              textShadow: `0 0 20px ${health > 60 ? '#ff3b00' : '#ff000088'}`,
            }}>
              {health}%
            </div>
          </div>
          <div>
            <div style={{color: '#666', fontSize: 15, letterSpacing: 2}}>ARMOR</div>
            <div style={{color: '#00ffcc', fontSize: 52, fontWeight: 900, lineHeight: 1, textShadow: '0 0 18px #00ffcc88'}}>
              {armor}
            </div>
          </div>
        </div>

        {/* центр: оружие и патроны */}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <div style={{color: PALETTE[5], fontSize: 20, fontWeight: 700, letterSpacing: 2}}>SUPER SHOTGUN</div>
          {/* полоска патронов */}
          <div style={{display: 'flex', gap: 5, marginBottom: 2}}>
            {Array.from({length: 32}).map((_, i) => (
              <div key={i} style={{
                width: 10, height: 18, borderRadius: 2,
                background: i < ammo ? '#ffe347' : '#333',
                boxShadow: i < ammo ? '0 0 6px #ffe34788' : 'none',
              }} />
            ))}
          </div>
          <div style={{color: '#fff', fontSize: 28, fontWeight: 900, letterSpacing: 1}}>
            {ammo} <span style={{color: '#555', fontSize: 22}}>/ 32</span>
          </div>
        </div>

        {/* правый: жизни и мод */}
        <div style={{display: 'flex', gap: 54}}>
          <div>
            <div style={{color: '#666', fontSize: 15, letterSpacing: 2}}>EXTRA LIVES</div>
            <div style={{color: PALETTE[5], fontSize: 52, fontWeight: 900, lineHeight: 1}}>
              {'♥'.repeat(3)}
            </div>
          </div>
          <div>
            <div style={{color: '#666', fontSize: 15, letterSpacing: 2}}>MOD</div>
            <div style={{color: '#ff47d2', fontSize: 28, fontWeight: 900, textShadow: '0 0 14px #ff47d288'}}>
              MEAT HOOK
            </div>
          </div>
        </div>
      </div>

    </AbsoluteFill>
  );
};

/* ─── Scene 6: Features ──────────────────────────────────────────────────── */
const FEATURES = [
  {title: 'Экспорт в MP4 / WebM', desc: 'Аппаратное кодирование с FFmpeg прямо на вашем ПК', anim: camera,  color: PALETTE[0]},
  {title: 'Hot Module Reload',    desc: 'Мгновенный отклик при изменении кода и стилей',      anim: zap,     color: PALETTE[1]},
  {title: 'Tailwind & CSS Modules',desc:'Используйте любые привычные веб-технологии',          anim: settings,color: PALETTE[2]},
  {title: 'Динамические данные',  desc: 'Генерация тысяч уникальных видео под каждого клиента',anim: refresh, color: PALETTE[4]},
];

const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleSpring = spring({frame, fps, config: {damping: 14}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontFamily: FONT, flexDirection: 'column'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, color: 'white', fontSize: 64, fontWeight: 900, marginBottom: 70, opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * -30}px)`, textAlign: 'center'}}>
        <UseAnimations animation={mapIcon} size={50} strokeColor={PALETTE[2]} autoplay loop />
        <span>Вся мощь веб-разработки для <span style={{color: PALETTE[2]}}>вашего видео</span></span>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40, width: 1400}}>
        {FEATURES.map((f, i) => {
          const cs = spring({frame: frame - 10 - i * 6, fps, config: {damping: 13}});
          return (
            <div key={f.title} style={{
              background: 'rgba(255,255,255,0.03)', border: `1.5px solid ${f.color}55`,
              borderRadius: 24, padding: '36px 40px',
              display: 'flex', alignItems: 'flex-start', gap: 28,
              boxShadow: `0 20px 60px ${f.color}1a`,
              opacity: cs, transform: `translateY(${(1 - cs) * 40}px)`,
            }}>
              <div style={{background: `${f.color}22`, padding: 22, borderRadius: 20, border: `1px solid ${f.color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <UseAnimations animation={f.anim} size={32} strokeColor={f.color} autoplay loop />
              </div>
              <div>
                <div style={{color: 'white', fontSize: 32, fontWeight: 800, marginBottom: 10}}>{f.title}</div>
                <div style={{color: 'rgba(255,255,255,0.7)', fontSize: 22, lineHeight: 1.5}}>{f.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 7: Outro ─────────────────────────────────────────────────────── */
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const atomIn  = spring({frame: frame - 5,  fps, config: {damping: 12}});
  const textIn  = spring({frame: frame - 12, fps, config: {damping: 16}});
  const subIn   = spring({frame: frame - 26, fps, config: {damping: 16}});
  const ctaIn   = spring({frame: frame - 40, fps, config: {damping: 16}});
  const nucleusPulse = 1 + 0.12 * Math.sin(frame * 0.15);
  const ATOM_SIZE = 500;
  const NUCLEUS = 96;
  const dots = 24;
  return (
    <AbsoluteFill style={{fontFamily: FONT, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
      <div style={{flex: '0 0 1000px', paddingLeft: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          fontSize: 26, fontWeight: 700, letterSpacing: 8, textTransform: 'uppercase' as const,
          color: PALETTE[2], marginBottom: 24,
          opacity: textIn, transform: `translateX(${(1 - textIn) * -40}px)`,
        }}>
          <UseAnimations animation={star} size={28} strokeColor={PALETTE[2]} autoplay loop />
          <span>Финал нового поколения</span>
        </div>
        <div style={{fontSize: 100, fontWeight: 900, lineHeight: 1.05, color: 'white', opacity: textIn, transform: `translateX(${(1 - textIn) * -50}px)`}}>
          {'Создавай видео'}
          <br />{'как '}
          <span style={{background: `linear-gradient(110deg, ${PALETTE[3]} 0%, ${PALETTE[2]} 50%, ${PALETTE[4]} 100%)`, WebkitBackgroundClip: 'text', color: 'transparent'}}>
            Web-приложение
          </span>
        </div>
        <div style={{marginTop: 38, height: 3, width: 560 * subIn, borderRadius: 2, background: `linear-gradient(90deg, ${PALETTE[3]}, ${PALETTE[4]}00)`}} />
        <div style={{marginTop: 28, fontSize: 36, lineHeight: 1.5, color: 'rgba(255,255,255,0.65)', opacity: subIn, transform: `translateX(${(1 - subIn) * -30}px)`}}>
          Никаких таймлайнов. Только{' '}
          <span style={{color: 'white', fontWeight: 700}}>React, TypeScript и воображение</span>.
        </div>
        <div style={{
          marginTop: 44, display: 'inline-flex', alignItems: 'center', gap: 18,
          padding: '20px 52px', borderRadius: 100, width: 'fit-content',
          background: `linear-gradient(110deg, ${PALETTE[3]}33, ${PALETTE[4]}33)`,
          border: `1.5px solid ${PALETTE[3]}77`, color: 'white', fontSize: 32, fontWeight: 700, letterSpacing: 1,
          boxShadow: `0 15px 40px ${PALETTE[3]}33`,
          opacity: ctaIn, transform: `translateY(${(1 - ctaIn) * 22}px)`,
        }}>
          <UseAnimations animation={globe} size={32} strokeColor={PALETTE[3]} autoplay loop />
          <span>remotion.dev</span>
          <span style={{color: PALETTE[2], fontSize: 28, transform: `translateX(${5 * Math.sin(frame * 0.15)}px)`, display: 'inline-block'}}>→</span>
        </div>
      </div>
      <div style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
        <div style={{position: 'absolute', width: 620, height: 620, borderRadius: '50%', background: `radial-gradient(circle, ${PALETTE[3]}25 0%, transparent 70%)`, transform: `scale(${atomIn * nucleusPulse})`}} />
        <div style={{position: 'relative', width: ATOM_SIZE, height: ATOM_SIZE, transform: `scale(${atomIn}) rotate(${frame * 0.4}deg)`}}>
          {[0, 45, 90, 135].map((rot, i) => {
            const c = PALETTE[[3, 2, 4, 5][i]];
            return (
              <div key={rot} style={{
                position: 'absolute', left: 0, right: 0, top: '50%', marginTop: -90,
                width: ATOM_SIZE, height: 180, borderRadius: '50%', border: `5px solid ${c}`,
                transform: `rotate(${rot}deg)`, boxShadow: `0 0 25px ${c}88, inset 0 0 25px ${c}33`,
              }} />
            );
          })}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            width: NUCLEUS, height: NUCLEUS, marginLeft: -NUCLEUS / 2, marginTop: -NUCLEUS / 2,
            borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, #fff, ${PALETTE[1]})`,
            boxShadow: `0 0 50px ${PALETTE[1]}, 0 0 120px ${PALETTE[1]}aa`,
            transform: `scale(${nucleusPulse}) rotate(${-frame * 0.4}deg)`,
          }} />
        </div>
        {new Array(dots).fill(0).map((_, i) => {
          const a  = (i / dots) * Math.PI * 2 + frame * 0.022;
          const rx = 280 + Math.sin(frame * 0.05 + i) * 32;
          const ry = 200 + Math.sin(frame * 0.05 + i) * 22;
          return (
            <div key={i} style={{
              position: 'absolute',
              width: 14 + (i % 3) * 6, height: 14 + (i % 3) * 6,
              borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '4px' : '50% 50% 0 50%',
              background: PALETTE[i % PALETTE.length],
              transform: `translate(${Math.cos(a) * rx * atomIn}px, ${Math.sin(a) * ry * atomIn}px) rotate(${frame * 5 + i * 18}deg)`,
              boxShadow: `0 0 10px ${PALETTE[i % PALETTE.length]}aa`,
            }} />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Timeline ───────────────────────────────────────────────────────────── */
export const Showreel: React.FC = () => {
  const scenes: {from: number; dur: number; el: React.ReactNode}[] = [
    {from: 0,   dur: 100, el: <Title />},
    {from: 100, dur: 140, el: <CodeScene />},
    {from: 240, dur: 130, el: <ArchitectureScene />},
    {from: 370, dur: 125, el: <StatsScene />},
    {from: 495, dur: 110, el: <DoomGameplayScene />},
    {from: 605, dur: 145, el: <FeaturesScene />},
    {from: 750, dur: 130, el: <Outro />},
  ];
  return (
    <AbsoluteFill>
      <Background />
      {scenes.map((s) => (
        <Sequence key={s.from} from={s.from} durationInFrames={s.dur}>
          <SceneWrap dur={s.dur}>{s.el}</SceneWrap>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
