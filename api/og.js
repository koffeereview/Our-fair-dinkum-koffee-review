// DYNAMIC OG IMAGE GENERATOR — Edge Function
// /api/og?name=Hope+%26+Anchor&score=6.9&suburb=Paddington&city=Brisbane
// Generates 1200x630 branded score card for social sharing

import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

function getColor(s) {
  if (s >= 9) return '#ffffff';
  if (s >= 8) return '#4ade80';
  if (s >= 7) return '#2dd4bf';
  if (s >= 6) return '#facc15';
  if (s >= 5) return '#fb923c';
  return '#f87171';
}

function getVerdict(s) {
  if (s >= 9) return 'ELITE';
  if (s >= 8) return 'GREAT';
  if (s >= 7) return 'SOLID';
  if (s >= 6) return 'DECENT';
  if (s >= 5) return 'JUST OKAY';
  return 'AVOID';
}

export default function handler(req) {
  var u = new URL(req.url);
  var name = u.searchParams.get('name') || 'Cafe';
  var score = parseFloat(u.searchParams.get('score')) || 0;
  var suburb = u.searchParams.get('suburb') || '';
  var city = u.searchParams.get('city') || 'Brisbane';
  var notes = u.searchParams.get('notes') || '';
  var color = getColor(score);
  var verdict = getVerdict(score);
  var displayName = name.length > 26 ? name.substring(0, 26) + '...' : name;
  var displayNotes = notes.length > 90 ? notes.substring(0, 90) + '...' : notes;

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '1200px', height: '630px', background: '#0a0a0a', fontFamily: 'sans-serif', padding: '48px 56px' },
        children: [
          // Header
          { type: 'div', props: { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }, children: [
            { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '12px' }, children: [
              { type: 'div', props: { style: { width: '44px', height: '44px', borderRadius: '50%', background: '#E6C073', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700', color: '#000' }, children: 'K' } },
              { type: 'div', props: { style: { fontSize: '16px', letterSpacing: '4px', color: '#E6C073', fontWeight: '700' }, children: 'KOFFEE REVIEW' } }
            ] } },
            { type: 'div', props: { style: { fontSize: '14px', color: 'rgba(255,255,255,0.35)', letterSpacing: '2px' }, children: 'koffeereview.com.au' } }
          ] } },
          // Gold line
          { type: 'div', props: { style: { width: '100%', height: '2px', background: 'linear-gradient(90deg, #E6C073, rgba(230,192,115,0.2))', marginBottom: '36px' } } },
          // Main content
          { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '48px', flex: '1' }, children: [
            // Score circle + verdict
            { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: '0' }, children: [
              { type: 'div', props: { style: { width: '190px', height: '190px', borderRadius: '50%', border: '6px solid ' + color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }, children: [
                { type: 'div', props: { style: { fontSize: '76px', fontWeight: '700', color: color, lineHeight: '1' }, children: score.toFixed(1) } },
                { type: 'div', props: { style: { fontSize: '18px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }, children: '/10' } }
              ] } },
              { type: 'div', props: { style: { marginTop: '16px', padding: '8px 28px', borderRadius: '20px', background: color, color: '#000', fontSize: '14px', fontWeight: '700', letterSpacing: '4px' }, children: verdict } }
            ] } },
            // Cafe info
            { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', flex: '1' }, children: [
              { type: 'div', props: { style: { fontSize: '52px', fontWeight: '700', color: '#fff', lineHeight: '1.1', marginBottom: '12px' }, children: displayName } },
              { type: 'div', props: { style: { fontSize: '24px', color: 'rgba(255,255,255,0.5)', marginBottom: displayNotes ? '20px' : '0' }, children: suburb + (city ? ', ' + city : '') } },
              displayNotes ? { type: 'div', props: { style: { fontSize: '19px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', lineHeight: '1.5', borderLeft: '3px solid ' + color, paddingLeft: '16px' }, children: '"' + displayNotes + '"' } } : null
            ].filter(Boolean) } }
          ] } },
          // Footer
          { type: 'div', props: { style: { display: 'flex', justifyContent: 'center', marginTop: '24px' }, children: [
            { type: 'div', props: { style: { fontSize: '13px', color: 'rgba(255,255,255,0.2)', letterSpacing: '4px' }, children: 'ONE LATTE \u00b7 ONE DOUBLE SHOT \u00b7 EVERY TIME' } }
          ] } }
        ]
      }
    },
    { width: 1200, height: 630 }
  );
}
