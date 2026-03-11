import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
} from 'remotion';

const MONO = '"DejaVu Sans Mono", monospace';

export const DoomGameplayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const kills = Math.floor(frame / 18) + 42;
  const ammo = Math.max(0, 32 - Math.floor(frame / 12) % 32);

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontFamily: MONO, background: 'radial-gradient(circle, #220601 0%, #050208 95%)'}}>
      {/* Damage vignette border */}
      <AbsoluteFill style={{boxShadow: 'inset 0 0 150px rgba(255, 30, 0, 0.45)', pointerEvents: 'none'}} />

      {/* Target Crosshair */}
      <div style={{position: 'absolute', width: 28, height: 28, border: '2px solid rgba(0,255,120,0.85)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{width: 4, height: 4, background: '#ff3b00', borderRadius: '50%'}} />
      </div>

      {/* Top Header / Objective */}
      <div style={{position: 'absolute', top: 40, left: 60, display: 'flex', flexDirection: 'column', gap: 6}}>
        <div style={{color: '#ff3b00', fontSize: 22, fontWeight: 700, letterSpacing: 2}}>OBJECTIVE: SLAY THE HORDE</div>
        <div style={{color: 'rgba(255,255,255,0.7)', fontSize: 18}}>LOCATION: UAC HELL BASE // SECTOR 04</div>
      </div>

      {/* Kill Log (Top Right) */}
      <div style={{position: 'absolute', top: 40, right: 60, textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 6}}>
        <div style={{color: '#00ffcc', fontSize: 20, fontWeight: 700}}>DEMONS SLAIN: {kills}</div>
        <div style={{color: '#ff3b00', fontSize: 18}}>GLORY KILL BONUS +50</div>
      </div>

      {/* Center Action Notification */}
      <div style={{
        position: 'absolute', top: '35%',
        fontSize: 36, fontWeight: 900, color: '#ff3b00',
        textTransform: 'uppercase', letterSpacing: 4,
        opacity: Math.sin(frame * 0.25) > 0 ? 1 : 0.5,
        textShadow: '0 0 25px #ff3b00',
      }}>
        {frame % 60 < 30 ? '⚠️ DEMON STAGGERED' : '⚡ CHAINSAW READY'}
      </div>

      {/* Bottom DOOM HUD Bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 130,
        background: 'linear-gradient(0deg, #120609 0%, rgba(18,6,9,0.92) 100%)',
        borderTop: '3px solid #ff3b00',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 80px',
      }}>
        <div style={{display: 'flex', gap: 50}}>
          <div>
            <div style={{color: '#888', fontSize: 15, fontFamily: MONO}}>HEALTH</div>
            <div style={{color: '#ff3b00', fontSize: 48, fontWeight: 900}}>100</div>
          </div>
          <div>
            <div style={{color: '#888', fontSize: 15, fontFamily: MONO}}>ARMOR</div>
            <div style={{color: '#00ffcc', fontSize: 48, fontWeight: 900}}>200</div>
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{color: '#ffe347', fontSize: 18, fontWeight: 700}}>SUPER SHOTGUN</div>
          <div style={{color: '#fff', fontSize: 40, fontWeight: 900}}>AMMO: {ammo} / 32</div>
        </div>

        <div style={{display: 'flex', gap: 50}}>
          <div>
            <div style={{color: '#888', fontSize: 15, fontFamily: MONO}}>EXTRA LIVES</div>
            <div style={{color: '#ffe347', fontSize: 48, fontWeight: 900}}>3</div>
          </div>
          <div>
            <div style={{color: '#888', fontSize: 15, fontFamily: MONO}}>MOD</div>
            <div style={{color: '#ff47d2', fontSize: 26, fontWeight: 900}}>MEAT HOOK</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
