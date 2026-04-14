/* =============================================
   D&D TRAINER — UPGRADES.JS
   Patch: Avatar Customizer + Scene Animations + AI Coach Chat
         + Character Library + New Armors/Weapons + Chibi Avatar
         + 6-Question Quiz + Expression Picker
   ============================================= */

// ============================================================
// UPGRADE 1: AVATAR SYSTEM
// ============================================================

let avatarState = {
  race: 'human',
  hairColor: '#d4a017',
  hairStyle: 'long',   // long, short, ponytail, buns, mohawk, braid, buzz, curly, pigtails, bob
  skinColor: '#f5deb3',
  armor: 'robe',
  weapon: 'staff',
  cloak: 'none',
  extra: 'none',
  expression: 'happy',
  name: 'My Hero',
  archetype: '',      // e.g. 'Life Cleric' — set when quiz completes
  archetypeIcon: ''   // emoji icon for the archetype
};

// ─── CHIBI / POKÉMON-TRAINER PROPORTIONS ────────────────────
// ViewBox: 0 0 200 320
// Head radius ~42 (big chibi), body height 70, leg height 65

function buildAvatarSVG(stateOverride) {
  const s = stateOverride || avatarState;
  const skin = s.skinColor;
  const hair = s.hairColor;
  const expr = s.expression || 'happy';

  // Armor fills
  const armorFill = s.armor === 'robe'   ? '#1a3a6b'
    : s.armor === 'mail'   ? '#8a8a8a'
    : s.armor === 'plate'  ? '#c0a960'
    : s.armor === 'witch'  ? '#2a0a3a'
    : s.armor === 'ranger' ? '#2a4a1a'
    : s.armor === 'noble'  ? '#6b1a2a'
    : '#1a3a6b';

  const armorStroke = s.armor === 'robe'   ? '#2a5aab'
    : s.armor === 'mail'   ? '#aaaaaa'
    : s.armor === 'plate'  ? '#e0c880'
    : s.armor === 'witch'  ? '#7a2a9a'
    : s.armor === 'ranger' ? '#4a7a2a'
    : s.armor === 'noble'  ? '#c9a84c'
    : '#2a5aab';

  // Cloak
  const cloakFill = s.cloak === 'none'     ? 'none'
    : s.cloak === 'short'    ? '#8b1a1a'
    : s.cloak === 'long'     ? '#1a1a4a'
    : s.cloak === 'tattered' ? '#1a0a2a'
    : '#1a1a4a';
  const showCloak = s.cloak !== 'none';

  // Race config (chibi: bigger head, shorter body)
  const raceConfig = {
    human:    { bodyW: 52, bodyH: 70, legH: 65, headR: 42, earType: 'normal',  neckH: 14 },
    elf:      { bodyW: 48, bodyH: 68, legH: 62, headR: 40, earType: 'pointed', neckH: 15 },
    dwarf:    { bodyW: 60, bodyH: 66, legH: 52, headR: 44, earType: 'normal',  neckH: 12 },
    halfling: { bodyW: 50, bodyH: 60, legH: 50, headR: 45, earType: 'round',   neckH: 10 },
    tiefling: { bodyW: 52, bodyH: 70, legH: 65, headR: 41, earType: 'pointed', neckH: 14 }
  };
  const rc = raceConfig[s.race] || raceConfig.human;
  const cx = 100;

  // Chibi layout positions
  const headCY  = 60;
  const neckY   = headCY + rc.headR - 2;
  const torsoTop = neckY + rc.neckH;
  const torsoBot = torsoTop + rc.bodyH;
  const legBot   = torsoBot + rc.legH;
  const halfW    = rc.bodyW / 2;
  const legW     = 16;

  // ─── IRIS COLOR (derived from hair, kept vibrant) ─────────
  // Parse hair hex to get a hue-shifted iris color
  const irisColor = (() => {
    const h = hair.replace('#', '');
    const r = parseInt(h.substring(0,2), 16);
    const g = parseInt(h.substring(2,4), 16);
    const b = parseInt(h.substring(4,6), 16);
    // Make a saturated version
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    if (max === min) return '#4488cc';
    if (r === max)   return '#cc4444';
    if (g === max)   return '#44aa44';
    return '#4455cc';
  })();

  // ─── EXPRESSION FACE PARTS ───────────────────────────────
  let eyesPath = '', mouthPath = '', cheeksPath = '';
  const eLx = cx - 14, eRx = cx + 14, eY = headCY - 4;

  if (expr === 'happy') {
    // Big round eyes, arc smile, rosy cheeks
    eyesPath = `
      <ellipse cx="${eLx}" cy="${eY}" rx="7" ry="8" fill="#1a1a2e"/>
      <ellipse cx="${eRx}" cy="${eY}" rx="7" ry="8" fill="#1a1a2e"/>
      <ellipse cx="${eLx}" cy="${eY}" rx="4.5" ry="5" fill="${irisColor}" opacity="0.85"/>
      <ellipse cx="${eRx}" cy="${eY}" rx="4.5" ry="5" fill="${irisColor}" opacity="0.85"/>
      <ellipse cx="${eLx-2}" cy="${eY-3}" rx="1.8" ry="1.8" fill="white" opacity="0.9"/>
      <ellipse cx="${eRx-2}" cy="${eY-3}" rx="1.8" ry="1.8" fill="white" opacity="0.9"/>`;
    mouthPath = `<path d="M${cx-9},${headCY+18} Q${cx},${headCY+26} ${cx+9},${headCY+18}"
      stroke="#c06060" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    cheeksPath = `
      <ellipse cx="${cx-20}" cy="${headCY+10}" rx="8" ry="5" fill="#ffaaaa" opacity="0.45"/>
      <ellipse cx="${cx+20}" cy="${headCY+10}" rx="8" ry="5" fill="#ffaaaa" opacity="0.45"/>`;
  } else if (expr === 'fierce') {
    // Angled brows, narrow eyes, tight line mouth
    eyesPath = `
      <ellipse cx="${eLx}" cy="${eY}" rx="7" ry="5.5" fill="#1a1a2e"/>
      <ellipse cx="${eRx}" cy="${eY}" rx="7" ry="5.5" fill="#1a1a2e"/>
      <ellipse cx="${eLx}" cy="${eY}" rx="4" ry="3.5" fill="${irisColor}" opacity="0.85"/>
      <ellipse cx="${eRx}" cy="${eY}" rx="4" ry="3.5" fill="${irisColor}" opacity="0.85"/>
      <ellipse cx="${eLx-2}" cy="${eY-2}" rx="1.5" ry="1.5" fill="white" opacity="0.8"/>
      <ellipse cx="${eRx-2}" cy="${eY-2}" rx="1.5" ry="1.5" fill="white" opacity="0.8"/>
      <line x1="${eLx-8}" y1="${eY-9}" x2="${eLx+5}" y2="${eY-5}" stroke="#1a1a2e" stroke-width="3" stroke-linecap="round"/>
      <line x1="${eRx-5}" y1="${eY-5}" x2="${eRx+8}" y2="${eY-9}" stroke="#1a1a2e" stroke-width="3" stroke-linecap="round"/>`;
    mouthPath = `<line x1="${cx-8}" y1="${headCY+20}" x2="${cx+8}" y2="${headCY+20}"
      stroke="#804040" stroke-width="2.5" stroke-linecap="round"/>`;
    cheeksPath = '';
  } else if (expr === 'nervous') {
    // One normal eye, one squinting, wavy mouth
    eyesPath = `
      <ellipse cx="${eLx}" cy="${eY}" rx="7" ry="8" fill="#1a1a2e"/>
      <ellipse cx="${eLx}" cy="${eY}" rx="4.5" ry="5" fill="${irisColor}" opacity="0.85"/>
      <ellipse cx="${eLx-2}" cy="${eY-3}" rx="1.8" ry="1.8" fill="white" opacity="0.9"/>
      <ellipse cx="${eRx}" cy="${eY+1}" rx="7" ry="3.5" fill="#1a1a2e"/>
      <ellipse cx="${eRx}" cy="${eY+1}" rx="4" ry="2" fill="${irisColor}" opacity="0.85"/>
      <ellipse cx="${eRx-2}" cy="${eY}" rx="1.2" ry="1.2" fill="white" opacity="0.8"/>`;
    mouthPath = `<path d="M${cx-8},${headCY+20} Q${cx-4},${headCY+17} ${cx},${headCY+21} Q${cx+4},${headCY+25} ${cx+8},${headCY+20}"
      stroke="#a06060" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    cheeksPath = `<ellipse cx="${cx+18}" cy="${headCY+8}" rx="7" ry="4" fill="#ffaaaa" opacity="0.35"/>`;
  } else if (expr === 'cool') {
    // Half-lidded, smirk, one eyebrow raised
    eyesPath = `
      <ellipse cx="${eLx}" cy="${eY+1}" rx="7" ry="5" fill="#1a1a2e"/>
      <ellipse cx="${eLx}" cy="${eY+1}" rx="4" ry="3" fill="${irisColor}" opacity="0.85"/>
      <path d="M${eLx-7},${eY-2} Q${eLx},${eY-6} ${eLx+7},${eY-2}" fill="#1a1a2e"/>
      <ellipse cx="${eRx}" cy="${eY+1}" rx="7" ry="5" fill="#1a1a2e"/>
      <ellipse cx="${eRx}" cy="${eY+1}" rx="4" ry="3" fill="${irisColor}" opacity="0.85"/>
      <path d="M${eRx-7},${eY-2} Q${eRx},${eY-6} ${eRx+7},${eY-2}" fill="#1a1a2e"/>
      <ellipse cx="${eLx-1}" cy="${eY-1}" rx="1.4" ry="1.4" fill="white" opacity="0.8"/>
      <ellipse cx="${eRx-1}" cy="${eY-1}" rx="1.4" ry="1.4" fill="white" opacity="0.8"/>
      <line x1="${eRx-7}" y1="${eY-8}" x2="${eRx+7}" y2="${eY-11}" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round"/>`;
    mouthPath = `<path d="M${cx-2},${headCY+21} Q${cx+5},${headCY+19} ${cx+9},${headCY+22}"
      stroke="#a06060" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    cheeksPath = '';
  }

  // ─── CLOAK ───────────────────────────────────────────────
  let cloakPath = '';
  if (showCloak) {
    if (s.cloak === 'short') {
      const cloakBot = torsoBot + 14;
      cloakPath = `<g id="avatar-layer-cloak">
        <path d="M${cx-halfW-8},${torsoTop+6}
                 C${cx-halfW-18},${torsoTop+24} ${cx-halfW-20},${torsoTop+44}
                 ${cx},${cloakBot}
                 C${cx+halfW+20},${torsoTop+44} ${cx+halfW+18},${torsoTop+24}
                 ${cx+halfW+8},${torsoTop+6}
                 C${cx+halfW+2},${torsoTop} ${cx-halfW-2},${torsoTop}
                 ${cx-halfW-8},${torsoTop+6}Z"
              fill="${cloakFill}" opacity="0.92"/>
      </g>`;
    } else if (s.cloak === 'tattered') {
      // Jagged torn-hem cloak
      const cloakBase = legBot + 6;
      cloakPath = `<g id="avatar-layer-cloak">
        <path d="M${cx-halfW-10},${torsoTop+5}
                 C${cx-halfW-20},${torsoTop+50} ${cx-halfW-26},${torsoTop+110}
                 ${cx-halfW-8},${cloakBase}
                 L${cx-halfW},${cloakBase-16} L${cx-halfW+8},${cloakBase}
                 L${cx-halfW+14},${cloakBase-20} L${cx-halfW+20},${cloakBase}
                 L${cx},${cloakBase-12} L${cx+halfW-20},${cloakBase}
                 L${cx+halfW-14},${cloakBase-20} L${cx+halfW-8},${cloakBase}
                 L${cx+halfW},${cloakBase-16} L${cx+halfW+8},${cloakBase}
                 C${cx+halfW+26},${torsoTop+110} ${cx+halfW+20},${torsoTop+50}
                 ${cx+halfW+10},${torsoTop+5}
                 C${cx+halfW+2},${torsoTop-2} ${cx-halfW-2},${torsoTop-2}
                 ${cx-halfW-10},${torsoTop+5}Z"
              fill="${cloakFill}" opacity="0.92"/>
        <path d="M${cx-halfW-8},${torsoTop+9}
                 C${cx-halfW-18},${torsoTop+55} ${cx-halfW-24},${torsoTop+115}
                 ${cx-halfW},${cloakBase-6}
                 L${cx},${cloakBase-10} L${cx+halfW},${cloakBase-6}
                 C${cx+halfW+24},${torsoTop+115} ${cx+halfW+18},${torsoTop+55}
                 ${cx+halfW+8},${torsoTop+9}
                 C${cx+6},${torsoTop+2} ${cx-6},${torsoTop+2}
                 ${cx-halfW-8},${torsoTop+9}Z"
              fill="${cloakFill}" opacity="0.5"/>
      </g>`;
    } else {
      // Long cloak
      const cloakBase = legBot + 10;
      cloakPath = `<g id="avatar-layer-cloak">
        <path d="M${cx-halfW-10},${torsoTop+5}
                 C${cx-halfW-22},${torsoTop+55} ${cx-halfW-28},${torsoTop+120}
                 ${cx-20},${cloakBase}
                 L${cx+20},${cloakBase}
                 C${cx+halfW+28},${torsoTop+120} ${cx+halfW+22},${torsoTop+55}
                 ${cx+halfW+10},${torsoTop+5}
                 C${cx+halfW+2},${torsoTop-2} ${cx-halfW-2},${torsoTop-2}
                 ${cx-halfW-10},${torsoTop+5}Z"
              fill="${cloakFill}" opacity="0.92"/>
        <path d="M${cx-halfW-8},${torsoTop+8}
                 C${cx-halfW-18},${torsoTop+65} ${cx-halfW-24},${torsoTop+130}
                 ${cx-16},${cloakBase}
                 L${cx+16},${cloakBase}
                 C${cx+halfW+24},${torsoTop+130} ${cx+halfW+18},${torsoTop+65}
                 ${cx+halfW+8},${torsoTop+8}
                 C${cx+6},${torsoTop+2} ${cx-6},${torsoTop+2}
                 ${cx-halfW-8},${torsoTop+8}Z"
              fill="${cloakFill}" opacity="0.55"/>
      </g>`;
    }
  }

  // ─── LEGS ─────────────────────────────────────────────────
  const legPath = `<g id="avatar-layer-legs">
    <path d="M${cx-legW+2},${torsoBot} C${cx-legW},${torsoBot+rc.legH*0.4} ${cx-legW-5},${torsoBot+rc.legH*0.75} ${cx-legW-3},${legBot} L${cx-3},${legBot} C${cx-3},${torsoBot+rc.legH*0.75} ${cx-3},${torsoBot+rc.legH*0.4} ${cx-3},${torsoBot}Z" fill="${skin}"/>
    <path d="M${cx+3},${torsoBot} C${cx+3},${torsoBot+rc.legH*0.4} ${cx+3},${torsoBot+rc.legH*0.75} ${cx+3},${legBot} L${cx+legW+3},${legBot} C${cx+legW+5},${torsoBot+rc.legH*0.75} ${cx+legW+1},${torsoBot+rc.legH*0.4} ${cx+legW-2},${torsoBot}Z" fill="${skin}"/>
    <path d="M${cx-legW-5},${legBot-10} C${cx-legW-7},${legBot-4} ${cx-legW-7},${legBot} ${cx-legW-1},${legBot+7} L${cx-2},${legBot+7} L${cx-2},${legBot} L${cx-3},${legBot-10}Z" fill="#2a1a0e"/>
    <path d="M${cx+3},${legBot-10} L${cx+2},${legBot} L${cx+2},${legBot+7} L${cx+legW+1},${legBot+7} C${cx+legW+7},${legBot} ${cx+legW+7},${legBot-4} ${cx+legW+5},${legBot-10}Z" fill="#2a1a0e"/>
  </g>`;

  // ─── TORSO / ARMOR ────────────────────────────────────────
  let torsoPath = '';
  if (s.armor === 'robe') {
    torsoPath = `<g id="avatar-layer-torso">
      <path d="M${cx-halfW},${torsoTop+3} C${cx-halfW-4},${torsoTop+26} ${cx-halfW-7},${torsoTop+52} ${cx-halfW-9},${torsoBot} L${cx-legW-3},${torsoBot} L${cx+legW+3},${torsoBot} L${cx+halfW+9},${torsoBot} C${cx+halfW+7},${torsoTop+52} ${cx+halfW+4},${torsoTop+26} ${cx+halfW},${torsoTop+3} C${cx+halfW-7},${torsoTop-2} ${cx-halfW+7},${torsoTop-2} ${cx-halfW},${torsoTop+3}Z" fill="${armorFill}"/>
      <path d="M${cx-halfW-9},${torsoBot-8} Q${cx},${torsoBot+10} ${cx+halfW+9},${torsoBot-8}" stroke="${armorStroke}" stroke-width="2" fill="none" opacity="0.7"/>
      <rect x="${cx-halfW-1}" y="${torsoTop+rc.bodyH*0.48-5}" width="${rc.bodyW+2}" height="10" fill="${armorStroke}" rx="3" opacity="0.8"/>
      <path d="M${cx-12},${torsoTop+1} L${cx-7},${torsoTop+13} L${cx},${torsoTop+8} L${cx+7},${torsoTop+13} L${cx+12},${torsoTop+1}" stroke="${armorStroke}" stroke-width="2" fill="none"/>
    </g>`;
  } else if (s.armor === 'mail') {
    torsoPath = `<g id="avatar-layer-torso">
      <path d="M${cx-halfW},${torsoTop} L${cx-halfW-5},${torsoBot} L${cx+halfW+5},${torsoBot} L${cx+halfW},${torsoTop} C${cx+halfW-5},${torsoTop-4} ${cx-halfW+5},${torsoTop-4} ${cx-halfW},${torsoTop}Z" fill="${armorFill}"/>
      ${generateHexPattern(cx, torsoTop, rc.bodyW, rc.bodyH, armorStroke)}
      <ellipse cx="${cx-halfW+3}" cy="${torsoTop+9}" rx="12" ry="7" fill="${armorFill}" stroke="${armorStroke}" stroke-width="1.5"/>
      <ellipse cx="${cx+halfW-3}" cy="${torsoTop+9}" rx="12" ry="7" fill="${armorFill}" stroke="${armorStroke}" stroke-width="1.5"/>
    </g>`;
  } else if (s.armor === 'plate') {
    torsoPath = `<g id="avatar-layer-torso">
      <path d="M${cx-halfW-2},${torsoTop-2} L${cx-halfW-7},${torsoBot} L${cx+halfW+7},${torsoBot} L${cx+halfW+2},${torsoTop-2} C${cx+halfW-5},${torsoTop-7} ${cx-halfW+5},${torsoTop-7} ${cx-halfW-2},${torsoTop-2}Z" fill="${armorFill}"/>
      <path d="M${cx-18},${torsoTop+7} C${cx-20},${torsoTop+24} ${cx-16},${torsoTop+38} ${cx-4},${torsoTop+46}" stroke="${armorStroke}" stroke-width="2.5" fill="none"/>
      <path d="M${cx+18},${torsoTop+7} C${cx+20},${torsoTop+24} ${cx+16},${torsoTop+38} ${cx+4},${torsoTop+46}" stroke="${armorStroke}" stroke-width="2.5" fill="none"/>
      <path d="M${cx-14},${torsoTop+18} L${cx+14},${torsoTop+18}" stroke="${armorStroke}" stroke-width="1.5" fill="none" opacity="0.7"/>
      <path d="M${cx-halfW-4},${torsoTop+1} C${cx-halfW-14},${torsoTop-2} ${cx-halfW-18},${torsoTop+12} ${cx-halfW-12},${torsoTop+20} L${cx-halfW+2},${torsoTop+17}Z" fill="${armorFill}" stroke="${armorStroke}" stroke-width="1.5"/>
      <path d="M${cx+halfW+4},${torsoTop+1} C${cx+halfW+14},${torsoTop-2} ${cx+halfW+18},${torsoTop+12} ${cx+halfW+12},${torsoTop+20} L${cx+halfW-2},${torsoTop+17}Z" fill="${armorFill}" stroke="${armorStroke}" stroke-width="1.5"/>
      <path d="M${cx-16},${torsoTop-4} L${cx+16},${torsoTop-4} L${cx+12},${torsoTop+10} L${cx-12},${torsoTop+10}Z" fill="${armorFill}" stroke="${armorStroke}" stroke-width="1.5"/>
    </g>`;
  } else if (s.armor === 'witch') {
    // Dark tattered robes, deep purple/black, star/moon on skirt, pointy collar
    torsoPath = `<g id="avatar-layer-torso">
      <path d="M${cx-halfW},${torsoTop+3} C${cx-halfW-5},${torsoTop+28} ${cx-halfW-10},${torsoTop+55} ${cx-halfW-14},${torsoBot} L${cx-legW-5},${torsoBot} L${cx+legW+5},${torsoBot} L${cx+halfW+14},${torsoBot} C${cx+halfW+10},${torsoTop+55} ${cx+halfW+5},${torsoTop+28} ${cx+halfW},${torsoTop+3} C${cx+halfW-7},${torsoTop-3} ${cx-halfW+7},${torsoTop-3} ${cx-halfW},${torsoTop+3}Z" fill="${armorFill}"/>
      <path d="M${cx-halfW-14},${torsoBot-5} L${cx-halfW-8},${torsoBot+8} L${cx-halfW},${torsoBot-2} L${cx-halfW+8},${torsoBot+9} L${cx},${torsoBot-4} L${cx+halfW-8},${torsoBot+9} L${cx+halfW},${torsoBot-2} L${cx+halfW+8},${torsoBot+8} L${cx+halfW+14},${torsoBot-5}" stroke="${armorStroke}" stroke-width="1.5" fill="none"/>
      <text x="${cx-8}" y="${torsoTop+rc.bodyH*0.55}" text-anchor="middle" fill="${armorStroke}" font-size="10" opacity="0.8">★</text>
      <path d="M${cx+4},${torsoTop+rc.bodyH*0.45}" fill="${armorStroke}" opacity="0.7"/>
      <text x="${cx+8}" y="${torsoTop+rc.bodyH*0.38}" text-anchor="middle" fill="${armorStroke}" font-size="8" opacity="0.6">☽</text>
      <path d="M${cx-10},${torsoTop+1} L${cx-5},${torsoTop+12} L${cx},${torsoTop+5} L${cx+5},${torsoTop+12} L${cx+10},${torsoTop+1}" fill="${armorStroke}" opacity="0.9"/>
    </g>`;
  } else if (s.armor === 'ranger') {
    // Forest-green leather vest, brown straps, bracers
    torsoPath = `<g id="avatar-layer-torso">
      <path d="M${cx-halfW},${torsoTop+2} L${cx-halfW-4},${torsoBot} L${cx+halfW+4},${torsoBot} L${cx+halfW},${torsoTop+2} C${cx+halfW-5},${torsoTop-3} ${cx-halfW+5},${torsoTop-3} ${cx-halfW},${torsoTop+2}Z" fill="${armorFill}"/>
      <path d="M${cx-8},${torsoTop} L${cx-4},${torsoBot}" stroke="#5a3a1a" stroke-width="3" opacity="0.8"/>
      <path d="M${cx+8},${torsoTop} L${cx+4},${torsoBot}" stroke="#5a3a1a" stroke-width="3" opacity="0.8"/>
      <rect x="${cx-halfW-2}" y="${torsoTop+rc.bodyH*0.35-4}" width="${rc.bodyW+4}" height="8" fill="#5a3a1a" rx="2" opacity="0.7"/>
      <rect x="${cx-halfW-2}" y="${torsoTop+rc.bodyH*0.65-4}" width="${rc.bodyW+4}" height="8" fill="#5a3a1a" rx="2" opacity="0.7"/>
      <path d="M${cx-halfW-3},${torsoTop-1} C${cx-halfW-12},${torsoTop+3} ${cx-halfW-14},${torsoTop+16} ${cx-halfW-8},${torsoTop+22} L${cx-halfW+1},${torsoTop+18}Z" fill="${armorFill}" stroke="${armorStroke}" stroke-width="1"/>
      <path d="M${cx+halfW+3},${torsoTop-1} C${cx+halfW+12},${torsoTop+3} ${cx+halfW+14},${torsoTop+16} ${cx+halfW+8},${torsoTop+22} L${cx+halfW-1},${torsoTop+18}Z" fill="${armorFill}" stroke="${armorStroke}" stroke-width="1"/>
    </g>`;
  } else if (s.armor === 'noble') {
    // Rich burgundy doublet, gold trim, puffed sleeves, decorative buttons
    torsoPath = `<g id="avatar-layer-torso">
      <path d="M${cx-halfW-2},${torsoTop+2} C${cx-halfW-6},${torsoTop+26} ${cx-halfW-8},${torsoTop+50} ${cx-halfW-8},${torsoBot} L${cx+halfW+8},${torsoBot} C${cx+halfW+8},${torsoTop+50} ${cx+halfW+6},${torsoTop+26} ${cx+halfW+2},${torsoTop+2} C${cx+halfW-5},${torsoTop-4} ${cx-halfW+5},${torsoTop-4} ${cx-halfW-2},${torsoTop+2}Z" fill="${armorFill}"/>
      <path d="M${cx},${torsoTop} L${cx},${torsoBot}" stroke="${armorStroke}" stroke-width="1.5" opacity="0.6"/>
      <circle cx="${cx}" cy="${torsoTop+rc.bodyH*0.25}" r="3" fill="${armorStroke}"/>
      <circle cx="${cx}" cy="${torsoTop+rc.bodyH*0.45}" r="3" fill="${armorStroke}"/>
      <circle cx="${cx}" cy="${torsoTop+rc.bodyH*0.65}" r="3" fill="${armorStroke}"/>
      <path d="M${cx-halfW-2},${torsoTop+4} C${cx-halfW-14},${torsoTop+2} ${cx-halfW-20},${torsoTop+20} ${cx-halfW-14},${torsoTop+32} L${cx-halfW+1},${torsoTop+24}Z" fill="${armorFill}" stroke="${armorStroke}" stroke-width="1.5"/>
      <path d="M${cx+halfW+2},${torsoTop+4} C${cx+halfW+14},${torsoTop+2} ${cx+halfW+20},${torsoTop+20} ${cx+halfW+14},${torsoTop+32} L${cx+halfW-1},${torsoTop+24}Z" fill="${armorFill}" stroke="${armorStroke}" stroke-width="1.5"/>
      <path d="M${cx-halfW-2},${torsoTop+6} C${cx-halfW-18},${torsoTop+4} ${cx-halfW-26},${torsoTop+26} ${cx-halfW-18},${torsoTop+38}" stroke="${armorStroke}" stroke-width="2" fill="none" opacity="0.8"/>
      <path d="M${cx+halfW+2},${torsoTop+6} C${cx+halfW+18},${torsoTop+4} ${cx+halfW+26},${torsoTop+26} ${cx+halfW+18},${torsoTop+38}" stroke="${armorStroke}" stroke-width="2" fill="none" opacity="0.8"/>
      <path d="M${cx-18},${torsoTop-4} L${cx+18},${torsoTop-4} L${cx+14},${torsoTop+10} L${cx-14},${torsoTop+10}Z" fill="${armorFill}" stroke="${armorStroke}" stroke-width="1.5"/>
    </g>`;
  }

  // ─── ARMS ─────────────────────────────────────────────────
  const armTop = torsoTop + 5;
  const armBot = torsoTop + rc.bodyH * 0.78;
  const armPath = `<g id="avatar-layer-arms">
    <path d="M${cx-halfW+2},${armTop} C${cx-halfW-9},${armTop+16} ${cx-halfW-14},${armTop+34} ${cx-halfW-12},${armBot} L${cx-halfW-3},${armBot+3} C${cx-halfW-1},${armTop+32} ${cx-halfW+2},${armTop+14} ${cx-halfW+10},${armTop+3}Z" fill="${armorFill}" stroke="${armorStroke}" stroke-width="0.8"/>
    <ellipse cx="${cx-halfW-9}" cy="${armBot+9}" rx="7" ry="6" fill="${skin}"/>
    <path d="M${cx+halfW-2},${armTop} C${cx+halfW+9},${armTop+16} ${cx+halfW+14},${armTop+34} ${cx+halfW+12},${armBot} L${cx+halfW+3},${armBot+3} C${cx+halfW+1},${armTop+32} ${cx+halfW-2},${armTop+14} ${cx+halfW-10},${armTop+3}Z" fill="${armorFill}" stroke="${armorStroke}" stroke-width="0.8"/>
    <ellipse cx="${cx+halfW+9}" cy="${armBot+9}" rx="7" ry="6" fill="${skin}"/>
  </g>`;

  // ─── HEAD ────────────────────────────────────────────────
  let headExtras = '';
  if (rc.earType === 'pointed') {
    headExtras += `
      <path d="M${cx-rc.headR+5},${headCY-10} L${cx-rc.headR-12},${headCY-28} L${cx-rc.headR+3},${headCY-5}" fill="${skin}" stroke="${skin}" stroke-width="1"/>
      <path d="M${cx+rc.headR-5},${headCY-10} L${cx+rc.headR+12},${headCY-28} L${cx+rc.headR-3},${headCY-5}" fill="${skin}" stroke="${skin}" stroke-width="1"/>`;
  }
  if (s.race === 'tiefling') {
    headExtras += `
      <path d="M${cx-14},${headCY-rc.headR+2} C${cx-18},${headCY-rc.headR-10} ${cx-16},${headCY-rc.headR-22} ${cx-12},${headCY-rc.headR-12}" stroke="#6b2a6b" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M${cx+14},${headCY-rc.headR+2} C${cx+18},${headCY-rc.headR-10} ${cx+16},${headCY-rc.headR-22} ${cx+12},${headCY-rc.headR-12}" stroke="#6b2a6b" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M${cx+halfW+4},${torsoBot-14} C${cx+halfW+22},${torsoBot+2} ${cx+halfW+28},${torsoBot+18} ${cx+halfW+18},${torsoBot+26}" stroke="#6b2a6b" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  }
  if (rc.earType === 'round') {
    headExtras += `
      <circle cx="${cx-rc.headR+2}" cy="${headCY-2}" r="8" fill="${skin}"/>
      <circle cx="${cx+rc.headR-2}" cy="${headCY-2}" r="8" fill="${skin}"/>`;
  }

  const headPath = `<g id="avatar-layer-head">
    ${headExtras}
    <ellipse cx="${cx}" cy="${headCY}" rx="${rc.headR}" ry="${rc.headR+3}" fill="${skin}"/>
    <rect x="${cx-11}" y="${neckY}" width="22" height="${rc.neckH}" fill="${skin}" rx="5"/>
  </g>`;

  // ─── FACE ────────────────────────────────────────────────
  const facePath = `<g id="avatar-layer-face">
    ${eyesPath}
    <circle cx="${cx}" cy="${headCY+10}" r="1.8" fill="${skin}" opacity="0.6" filter="url(#avatar-darken)"/>
    ${mouthPath}
    ${cheeksPath}
  </g>`;

  // ─── HAIR ────────────────────────────────────────────────
  const hs = s.hairStyle || 'long';
  const hTop = headCY - rc.headR; // top of head
  let hairShape = '';

  if (hs === 'long') {
    // Long flowing hair on both sides
    hairShape = `
      <path d="M${cx-rc.headR+5},${hTop+5} C${cx-rc.headR-8},${hTop-12} ${cx-rc.headR-18},${headCY-6} ${cx-rc.headR-12},${headCY+30} C${cx-rc.headR-5},${headCY+48} ${cx-rc.headR+4},${headCY+58} ${cx-rc.headR+8},${headCY+62}" stroke="${hair}" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.92"/>
      <path d="M${cx+rc.headR-5},${hTop+5} C${cx+rc.headR+8},${hTop-12} ${cx+rc.headR+18},${headCY-6} ${cx+rc.headR+12},${headCY+30} C${cx+rc.headR+5},${headCY+48} ${cx+rc.headR-4},${headCY+58} ${cx+rc.headR-8},${headCY+62}" stroke="${hair}" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.92"/>
      <path d="M${cx-rc.headR-2},${hTop+6} C${cx-rc.headR+2},${hTop-6} ${cx},${hTop-18} ${cx+rc.headR+2},${hTop+6} L${cx+rc.headR+3},${hTop+10} C${cx+rc.headR+2},${hTop+4} ${cx+4},${hTop-8} ${cx},${hTop-10} C${cx-4},${hTop-8} ${cx-rc.headR-2},${hTop+4} ${cx-rc.headR-3},${hTop+10}Z" fill="${hair}" opacity="0.92"/>`;
  } else if (hs === 'short') {
    // Short cropped hair, neat
    hairShape = `
      <path d="M${cx-rc.headR-2},${headCY-8} C${cx-rc.headR},${hTop-4} ${cx-rc.headR+10},${hTop-12} ${cx},${hTop-10} C${cx+rc.headR-10},${hTop-12} ${cx+rc.headR},${hTop-4} ${cx+rc.headR+2},${headCY-8} L${cx+rc.headR+2},${headCY-14} C${cx+rc.headR+6},${hTop-18} ${cx+12},${hTop-26} ${cx},${hTop-22} C${cx-12},${hTop-26} ${cx-rc.headR-6},${hTop-18} ${cx-rc.headR-2},${headCY-14}Z" fill="${hair}" opacity="0.95"/>`;
  } else if (hs === 'ponytail') {
    // Side ponytail with flowing tail
    hairShape = `
      <path d="M${cx-rc.headR-2},${hTop+6} C${cx-rc.headR+2},${hTop-6} ${cx},${hTop-16} ${cx+rc.headR+2},${hTop+6} L${cx+rc.headR+3},${hTop+12} C${cx+rc.headR},${hTop} ${cx+4},${hTop-10} ${cx},${hTop-12} C${cx-4},${hTop-10} ${cx-rc.headR},${hTop} ${cx-rc.headR-3},${hTop+12}Z" fill="${hair}" opacity="0.93"/>
      <path d="M${cx+rc.headR+2},${headCY-10} C${cx+rc.headR+14},${headCY-6} ${cx+rc.headR+22},${headCY+10} ${cx+rc.headR+18},${headCY+40} C${cx+rc.headR+14},${headCY+58} ${cx+rc.headR+6},${headCY+66} ${cx+rc.headR+4},${headCY+70}" stroke="${hair}" stroke-width="9" fill="none" stroke-linecap="round" opacity="0.9"/>
      <ellipse cx="${cx+rc.headR+2}" cy="${headCY-12}" rx="7" ry="5" fill="${hair}" opacity="0.8"/>`;
  } else if (hs === 'buns') {
    // Two big buns on top
    hairShape = `
      <path d="M${cx-rc.headR-2},${hTop+8} C${cx-rc.headR},${hTop-2} ${cx-8},${hTop-10} ${cx+8},${hTop-10} C${cx+rc.headR},${hTop-2} ${cx+rc.headR+2},${hTop+8} L${cx+rc.headR+2},${hTop+14} C${cx+rc.headR},${hTop+4} ${cx+8},${hTop-4} ${cx-8},${hTop-4} C${cx-rc.headR},${hTop+4} ${cx-rc.headR-2},${hTop+14}Z" fill="${hair}" opacity="0.9"/>
      <circle cx="${cx-18}" cy="${hTop-18}" r="14" fill="${hair}" opacity="0.95"/>
      <circle cx="${cx+18}" cy="${hTop-18}" r="14" fill="${hair}" opacity="0.95"/>
      <circle cx="${cx-18}" cy="${hTop-18}" r="7" fill="${hair}" stroke="rgba(255,255,255,0.18)" stroke-width="2" opacity="0.6"/>
      <circle cx="${cx+18}" cy="${hTop-18}" r="7" fill="${hair}" stroke="rgba(255,255,255,0.18)" stroke-width="2" opacity="0.6"/>`;
  } else if (hs === 'mohawk') {
    // Bold mohawk strip down the center
    hairShape = `
      <path d="M${cx-rc.headR-2},${hTop+10} C${cx-rc.headR},${hTop} ${cx-10},${hTop-6} ${cx-6},${hTop-10} C${cx-4},${hTop-12} ${cx+4},${hTop-12} ${cx+6},${hTop-10} C${cx+10},${hTop-6} ${cx+rc.headR},${hTop} ${cx+rc.headR+2},${hTop+10} L${cx+rc.headR+2},${hTop+14} C${cx+rc.headR},${hTop+4} ${cx+8},${hTop-6} ${cx+4},${hTop-8} L${cx-4},${hTop-8} C${cx-8},${hTop-6} ${cx-rc.headR},${hTop+4} ${cx-rc.headR-2},${hTop+14}Z" fill="${hair}" opacity="0.85"/>
      <path d="M${cx-5},${hTop-8} L${cx-7},${hTop-28} L${cx-3},${hTop-38} L${cx},${hTop-48} L${cx+3},${hTop-38} L${cx+7},${hTop-28} L${cx+5},${hTop-8}Z" fill="${hair}" opacity="0.96"/>
      <path d="M${cx-3},${hTop-8} L${cx-5},${hTop-26} L${cx-2},${hTop-34} L${cx},${hTop-40} L${cx+2},${hTop-34} L${cx+5},${hTop-26} L${cx+3},${hTop-8}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" fill="none"/>`;
  } else if (hs === 'braid') {
    // Single thick braid on one side
    hairShape = `
      <path d="M${cx-rc.headR-2},${hTop+6} C${cx-rc.headR+2},${hTop-8} ${cx},${hTop-18} ${cx+rc.headR+2},${hTop+6} L${cx+rc.headR+3},${hTop+12} C${cx+rc.headR},${hTop+2} ${cx+4},${hTop-10} ${cx},${hTop-12} C${cx-4},${hTop-10} ${cx-rc.headR},${hTop+2} ${cx-rc.headR-3},${hTop+12}Z" fill="${hair}" opacity="0.92"/>
      <path d="M${cx-rc.headR+2},${headCY+5} C${cx-rc.headR-4},${headCY+15} ${cx-rc.headR},${headCY+28} ${cx-rc.headR-2},${headCY+44} C${cx-rc.headR},${headCY+56} ${cx-rc.headR+4},${headCY+64} ${cx-rc.headR+6},${headCY+68}" stroke="${hair}" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="8,4" opacity="0.9"/>
      <path d="M${cx-rc.headR-2},${headCY+5} C${cx-rc.headR-8},${headCY+15} ${cx-rc.headR-4},${headCY+28} ${cx-rc.headR-6},${headCY+44} C${cx-rc.headR-4},${headCY+56} ${cx-rc.headR},${headCY+64} ${cx-rc.headR+2},${headCY+68}" stroke="${hair}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7"/>`;
  } else if (hs === 'buzz') {
    // Ultra-short buzz cut, just a light cap
    hairShape = `
      <path d="M${cx-rc.headR},${hTop+16} C${cx-rc.headR+2},${hTop} ${cx-rc.headR+8},${hTop-12} ${cx},${hTop-14} C${cx+rc.headR-8},${hTop-12} ${cx+rc.headR-2},${hTop} ${cx+rc.headR},${hTop+16} C${cx+rc.headR-2},${hTop+6} ${cx+6},${hTop-4} ${cx},${hTop-6} C${cx-6},${hTop-4} ${cx-rc.headR+2},${hTop+6} ${cx-rc.headR},${hTop+16}Z" fill="${hair}" opacity="0.7"/>`;
  } else if (hs === 'curly') {
    // Poofy curly cloud of hair
    hairShape = `
      <circle cx="${cx-20}" cy="${hTop-10}" r="16" fill="${hair}" opacity="0.9"/>
      <circle cx="${cx}" cy="${hTop-18}" r="18" fill="${hair}" opacity="0.9"/>
      <circle cx="${cx+20}" cy="${hTop-10}" r="16" fill="${hair}" opacity="0.9"/>
      <circle cx="${cx-34}" cy="${hTop+4}" r="12" fill="${hair}" opacity="0.85"/>
      <circle cx="${cx+34}" cy="${hTop+4}" r="12" fill="${hair}" opacity="0.85"/>
      <path d="M${cx-rc.headR-2},${hTop+14} C${cx-rc.headR},${hTop+4} ${cx-8},${hTop-4} ${cx+8},${hTop-4} C${cx+rc.headR},${hTop+4} ${cx+rc.headR+2},${hTop+14}Z" fill="${hair}" opacity="0.88"/>`;
  } else if (hs === 'pigtails') {
    // Two side pigtails
    hairShape = `
      <path d="M${cx-rc.headR-2},${hTop+6} C${cx-rc.headR+2},${hTop-8} ${cx},${hTop-16} ${cx+rc.headR+2},${hTop+6} L${cx+rc.headR+3},${hTop+12} C${cx+rc.headR},${hTop+2} ${cx+4},${hTop-8} ${cx},${hTop-10} C${cx-4},${hTop-8} ${cx-rc.headR},${hTop+2} ${cx-rc.headR-3},${hTop+12}Z" fill="${hair}" opacity="0.92"/>
      <path d="M${cx-rc.headR-6},${headCY+2} C${cx-rc.headR-18},${headCY+10} ${cx-rc.headR-22},${headCY+28} ${cx-rc.headR-18},${headCY+50}" stroke="${hair}" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.9"/>
      <ellipse cx="${cx-rc.headR-8}" cy="${headCY+2}" rx="7" ry="5" fill="${hair}" opacity="0.8"/>
      <path d="M${cx+rc.headR+6},${headCY+2} C${cx+rc.headR+18},${headCY+10} ${cx+rc.headR+22},${headCY+28} ${cx+rc.headR+18},${headCY+50}" stroke="${hair}" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.9"/>
      <ellipse cx="${cx+rc.headR+8}" cy="${headCY+2}" rx="7" ry="5" fill="${hair}" opacity="0.8"/>`;
  } else if (hs === 'bob') {
    // Neat bob cut — ends at chin level
    hairShape = `
      <path d="M${cx-rc.headR-8},${headCY+18} C${cx-rc.headR-10},${headCY} ${cx-rc.headR-4},${hTop} ${cx},${hTop-10} C${cx+rc.headR+4},${hTop} ${cx+rc.headR+10},${headCY} ${cx+rc.headR+8},${headCY+18} C${cx+rc.headR+6},${headCY+28} ${cx+rc.headR+2},${headCY+32} ${cx+rc.headR-2},${headCY+32} L${cx-rc.headR+2},${headCY+32} C${cx-rc.headR-2},${headCY+32} ${cx-rc.headR-6},${headCY+28} ${cx-rc.headR-8},${headCY+18}Z" fill="${hair}" opacity="0.92"/>
      <path d="M${cx-rc.headR-6},${headCY+16} C${cx-rc.headR-4},${headCY+26} ${cx-rc.headR+2},${headCY+30} ${cx-rc.headR+6},${headCY+30}" stroke="rgba(255,255,255,0.15)" stroke-width="2" fill="none"/>`;
  } else {
    // fallback = long
    hairShape = `
      <path d="M${cx-rc.headR+5},${hTop+5} C${cx-rc.headR-8},${hTop-12} ${cx-rc.headR-18},${headCY-6} ${cx-rc.headR-12},${headCY+30} C${cx-rc.headR-5},${headCY+48} ${cx-rc.headR+4},${headCY+58} ${cx-rc.headR+8},${headCY+62}" stroke="${hair}" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.92"/>
      <path d="M${cx+rc.headR-5},${hTop+5} C${cx+rc.headR+8},${hTop-12} ${cx+rc.headR+18},${headCY-6} ${cx+rc.headR+12},${headCY+30} C${cx+rc.headR+5},${headCY+48} ${cx+rc.headR-4},${headCY+58} ${cx+rc.headR-8},${headCY+62}" stroke="${hair}" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.92"/>
      <path d="M${cx-rc.headR-2},${hTop+6} C${cx-rc.headR+2},${hTop-6} ${cx},${hTop-18} ${cx+rc.headR+2},${hTop+6} L${cx+rc.headR+3},${hTop+10} C${cx+rc.headR+2},${hTop+4} ${cx+4},${hTop-8} ${cx},${hTop-10} C${cx-4},${hTop-8} ${cx-rc.headR-2},${hTop+4} ${cx-rc.headR-3},${hTop+10}Z" fill="${hair}" opacity="0.92"/>`;
  }

  const hairPath = `<g id="avatar-layer-hair">${hairShape}</g>`;

  // ─── WEAPON ──────────────────────────────────────────────
  const weaponX = cx + halfW + 18;
  let weaponPath = '';

  if (s.weapon === 'staff') {
    weaponPath = `<g id="avatar-layer-weapon">
      <line x1="${weaponX}" y1="${headCY-50}" x2="${weaponX}" y2="${legBot+6}" stroke="#5a3a1a" stroke-width="7" stroke-linecap="round"/>
      <circle cx="${weaponX}" cy="${headCY-50}" r="11" fill="#2a0a4a" stroke="#8b5cf6" stroke-width="2"/>
      <circle cx="${weaponX-3}" cy="${headCY-53}" r="3.5" fill="rgba(139,92,246,0.6)"/>
      <path d="M${weaponX},${headCY-62} C${weaponX-11},${headCY-68} ${weaponX-15},${headCY-56} ${weaponX-8},${headCY-50}" stroke="#5a3a1a" stroke-width="4" fill="none" stroke-linecap="round"/>
      <line x1="${weaponX-11}" y1="${torsoTop+38}" x2="${weaponX+11}" y2="${torsoTop+38}" stroke="#5a3a1a" stroke-width="5" stroke-linecap="round"/>
    </g>`;
  } else if (s.weapon === 'sword') {
    weaponPath = `<g id="avatar-layer-weapon">
      <path d="M${weaponX-3},${headCY-58} L${weaponX-3},${torsoTop+42} L${weaponX+3},${torsoTop+42} L${weaponX+3},${headCY-58} L${weaponX},${headCY-68}Z" fill="#c8c8d8" stroke="#a0a0b0" stroke-width="1"/>
      <rect x="${weaponX-15}" y="${torsoTop+40}" width="30" height="6" fill="#8a6020" rx="3"/>
      <rect x="${weaponX-4}" y="${torsoTop+46}" width="8" height="22" fill="#4a2a0a" rx="3"/>
      <circle cx="${weaponX}" cy="${torsoTop+72}" r="6" fill="#8a6020"/>
      <line x1="${weaponX}" y1="${headCY-56}" x2="${weaponX}" y2="${torsoTop+36}" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
    </g>`;
  } else if (s.weapon === 'broom') {
    // Witch's broom — diagonal 45°, glowing green trail
    const bx1 = cx + halfW + 8, by1 = headCY - 50;
    const bx2 = cx + halfW + 48, by2 = torsoBot + 20;
    weaponPath = `<g id="avatar-layer-weapon">
      <line x1="${bx1}" y1="${by1}" x2="${bx2}" y2="${by2}" stroke="#5a3a1a" stroke-width="6" stroke-linecap="round"/>
      <path d="M${bx2-6},${by2-8} C${bx2-2},${by2+2} ${bx2+2},${by2+10} ${bx2-4},${by2+18} L${bx2-14},${by2+20} C${bx2-16},${by2+10} ${bx2-14},${by2+2} ${bx2-10},${by2-4}Z" fill="#5a3a1a"/>
      <path d="M${bx2-8},${by2-6} C${bx2},${by2+4} ${bx2+4},${by2+12} ${bx2-2},${by2+22}" stroke="#7a5a2a" stroke-width="2" fill="none" opacity="0.6"/>
      <path d="M${bx2-12},${by2-2} C${bx2-4},${by2+8} ${bx2},${by2+16} ${bx2-6},${by2+24}" stroke="#7a5a2a" stroke-width="2" fill="none" opacity="0.6"/>
      <ellipse cx="${bx1+4}" cy="${by1+6}" rx="14" ry="5" fill="rgba(60,220,60,0.18)" transform="rotate(45,${bx1+4},${by1+6})"/>
      <ellipse cx="${bx1+8}" cy="${by1+12}" rx="18" ry="4" fill="rgba(60,220,60,0.12)" transform="rotate(45,${bx1+8},${by1+12})"/>
      <ellipse cx="${bx1+12}" cy="${by1+18}" rx="22" ry="3" fill="rgba(60,220,60,0.08)" transform="rotate(45,${bx1+12},${by1+18})"/>
    </g>`;
  } else if (s.weapon === 'bow') {
    // Elven bow — left hand
    const bwx = cx - halfW - 22;
    weaponPath = `<g id="avatar-layer-weapon">
      <path d="M${bwx},${headCY-46} C${bwx-16},${headCY-10} ${bwx-16},${torsoTop+30} ${bwx},${torsoBot+4}" stroke="#5a3a1a" stroke-width="4" fill="none" stroke-linecap="round"/>
      <line x1="${bwx}" y1="${headCY-44}" x2="${bwx}" y2="${torsoBot+2}" stroke="#7a5a1a" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.7"/>
      <line x1="${bwx}" y1="${torsoTop+6}" x2="${bwx+22}" y2="${torsoTop+6}" stroke="#c8a860" stroke-width="2" stroke-linecap="round"/>
      <line x1="${bwx}" y1="${torsoTop+14}" x2="${bwx+22}" y2="${torsoTop+14}" stroke="#888" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M${bwx+22},${torsoTop+8} L${bwx+30},${torsoTop+14} L${bwx+22},${torsoTop+20}" fill="#c8a860"/>
    </g>`;
  } else {
    // Axe
    weaponPath = `<g id="avatar-layer-weapon">
      <line x1="${weaponX}" y1="${headCY-42}" x2="${weaponX}" y2="${torsoBot+8}" stroke="#4a2a0a" stroke-width="9" stroke-linecap="round"/>
      <path d="M${weaponX-4},${headCY-40} C${weaponX-28},${headCY-46} ${weaponX-36},${headCY-24} ${weaponX-28},${headCY-2} C${weaponX-22},${headCY+9} ${weaponX-10},${headCY+5} ${weaponX-4},${headCY-1}Z" fill="#8a8a9a" stroke="#aaaabc" stroke-width="1.5"/>
      <path d="M${weaponX-28},${headCY-42} C${weaponX-32},${headCY-26} ${weaponX-30},${headCY-8} ${weaponX-26},${headCY+2}" stroke="rgba(255,255,255,0.35)" stroke-width="2" fill="none"/>
      <path d="M${weaponX-4},${headCY-30} L${weaponX+14},${headCY-36} L${weaponX+12},${headCY-18}Z" fill="#8a8a9a"/>
    </g>`;
  }

  // ─── EXTRAS (Hood/Hat/Crown) ──────────────────────────────
  let extraPath = '';
  if (s.extra === 'hood') {
    extraPath = `<g id="avatar-layer-extra">
      <path d="M${cx-rc.headR-10},${headCY-rc.headR+10} C${cx-rc.headR-14},${headCY-rc.headR-6} ${cx-rc.headR-4},${headCY-rc.headR-18} ${cx},${headCY-rc.headR-22} C${cx+rc.headR+4},${headCY-rc.headR-18} ${cx+rc.headR+14},${headCY-rc.headR-6} ${cx+rc.headR+10},${headCY-rc.headR+10} C${cx+rc.headR+6},${headCY+24} ${cx+rc.headR},${headCY+40} ${cx+rc.headR+4},${torsoTop+24} C${cx+10},${torsoTop+14} ${cx-10},${torsoTop+14} ${cx-rc.headR-4},${torsoTop+24} C${cx-rc.headR},${headCY+40} ${cx-rc.headR-6},${headCY+24} ${cx-rc.headR-10},${headCY-rc.headR+10}Z" fill="#1a1a2e" opacity="0.92"/>
      <path d="M${cx-rc.headR-4},${headCY-rc.headR} C${cx-rc.headR-2},${headCY-10} ${cx-rc.headR+8},${headCY-4} ${cx},${headCY-2} C${cx+rc.headR-8},${headCY-4} ${cx+rc.headR+2},${headCY-10} ${cx+rc.headR+4},${headCY-rc.headR} C${cx+rc.headR-4},${headCY-rc.headR-12} ${cx+10},${headCY-rc.headR-16} ${cx},${headCY-rc.headR-16} C${cx-10},${headCY-rc.headR-16} ${cx-rc.headR+4},${headCY-rc.headR-12} ${cx-rc.headR-4},${headCY-rc.headR}Z" fill="rgba(10,8,24,0.6)"/>
    </g>`;
  } else if (s.extra === 'hat') {
    extraPath = `<g id="avatar-layer-extra">
      <ellipse cx="${cx+4}" cy="${headCY-rc.headR}" rx="${rc.headR+14}" ry="9" fill="#1a1a3a" stroke="#2a2a5a" stroke-width="1.5"/>
      <path d="M${cx-rc.headR-4},${headCY-rc.headR+4} C${cx-rc.headR+4},${headCY-rc.headR-14} ${cx-8},${headCY-rc.headR-54} ${cx+8},${headCY-rc.headR-80} C${cx+14},${headCY-rc.headR-62} ${cx+rc.headR+8},${headCY-rc.headR-10} ${cx+rc.headR+12},${headCY-rc.headR+4}" fill="#1a1a3a"/>
      <text x="${cx+2}" y="${headCY-rc.headR-30}" text-anchor="middle" fill="#c9a84c" font-size="13" opacity="0.85">★</text>
      <path d="M${cx-rc.headR-2},${headCY-rc.headR+2} L${cx+rc.headR+10},${headCY-rc.headR+2}" stroke="#8b5cf6" stroke-width="3" opacity="0.7"/>
    </g>`;
  } else if (s.extra === 'crown') {
    extraPath = `<g id="avatar-layer-extra">
      <path d="M${cx-rc.headR+4},${headCY-rc.headR+6} C${cx-rc.headR+2},${headCY-rc.headR-4} ${cx-8},${headCY-rc.headR-8} ${cx},${headCY-rc.headR-8} C${cx+8},${headCY-rc.headR-8} ${cx+rc.headR-2},${headCY-rc.headR-4} ${cx+rc.headR-4},${headCY-rc.headR+6}" stroke="#c9a84c" stroke-width="6" fill="none" stroke-linecap="round"/>
      <polygon points="${cx-18},${headCY-rc.headR-4} ${cx-22},${headCY-rc.headR-22} ${cx-14},${headCY-rc.headR-4}" fill="#c9a84c"/>
      <polygon points="${cx-3},${headCY-rc.headR-7} ${cx},${headCY-rc.headR-28} ${cx+3},${headCY-rc.headR-7}" fill="#c9a84c"/>
      <polygon points="${cx+14},${headCY-rc.headR-4} ${cx+22},${headCY-rc.headR-22} ${cx+18},${headCY-rc.headR-4}" fill="#c9a84c"/>
      <circle cx="${cx-18}" cy="${headCY-rc.headR}" r="3" fill="#fb7185"/>
      <circle cx="${cx}" cy="${headCY-rc.headR-2}" r="4" fill="#2dd4bf"/>
      <circle cx="${cx+18}" cy="${headCY-rc.headR}" r="3" fill="#fb7185"/>
    </g>`;
  }

  // Ground shadow
  const shadow = `<ellipse cx="${cx}" cy="${legBot+10}" rx="${halfW+10}" ry="7" fill="rgba(0,0,0,0.4)"/>`;

  const totalH = legBot + 20;

  return `<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 200 ${totalH}"
     width="160" height="${Math.round(totalH * 0.85)}"
     id="avatar-svg">
  <defs>
    <filter id="avatar-shadow" x="-20%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.5)"/>
    </filter>
    <filter id="avatar-darken" x="-50%" y="-50%" width="200%" height="200%">
      <feColorMatrix type="matrix" values="0.7 0 0 0 0  0 0.7 0 0 0  0 0 0.7 0 0  0 0 0 1 0"/>
    </filter>
  </defs>
  <g filter="url(#avatar-shadow)">
    ${cloakPath}
    ${legPath}
    ${torsoPath}
    ${armPath}
    ${headPath}
    ${facePath}
    ${hairPath}
    ${weaponPath}
    ${extraPath}
  </g>
  ${shadow}
</svg>`;
}

// Helper: hex chainmail pattern
function generateHexPattern(cx, torsoTop, bodyW, bodyH, stroke) {
  let hexes = '';
  const hexSize = 6;
  const startX = cx - bodyW / 2;
  const rows = Math.ceil(bodyH / (hexSize * 1.7));
  const cols = Math.ceil(bodyW / (hexSize * 2)) + 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * hexSize * 1.9 + (r % 2 === 1 ? hexSize * 0.95 : 0);
      const y = torsoTop + r * hexSize * 1.6;
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        pts.push(`${(x + hexSize * Math.cos(angle)).toFixed(1)},${(y + hexSize * Math.sin(angle)).toFixed(1)}`);
      }
      hexes += `<polygon points="${pts.join(' ')}" fill="none" stroke="${stroke}" stroke-width="0.8" opacity="0.5"/>`;
    }
  }
  return hexes;
}

function updateAvatar() {
  const wrapper = document.getElementById('avatar-svg-container');
  if (!wrapper) return;
  wrapper.innerHTML = buildAvatarSVG();

  document.querySelectorAll('.swatch[data-type="hair"]').forEach(s => {
    s.classList.toggle('active', s.dataset.value === avatarState.hairColor);
  });
  document.querySelectorAll('.swatch[data-type="skin"]').forEach(s => {
    s.classList.toggle('active', s.dataset.value === avatarState.skinColor);
  });
  document.querySelectorAll('.accessory-btn[data-type="race"]').forEach(b => {
    b.classList.toggle('active', b.dataset.value === avatarState.race);
  });
  document.querySelectorAll('.accessory-btn[data-type="armor"]').forEach(b => {
    b.classList.toggle('active', b.dataset.value === avatarState.armor);
  });
  document.querySelectorAll('.accessory-btn[data-type="weapon"]').forEach(b => {
    b.classList.toggle('active', b.dataset.value === avatarState.weapon);
  });
  document.querySelectorAll('.accessory-btn[data-type="cloak"]').forEach(b => {
    b.classList.toggle('active', b.dataset.value === avatarState.cloak);
  });
  document.querySelectorAll('.accessory-btn[data-type="extra"]').forEach(b => {
    b.classList.toggle('active', b.dataset.value === avatarState.extra);
  });
  document.querySelectorAll('.accessory-btn[data-type="hairstyle"]').forEach(b => {
    b.classList.toggle('active', b.dataset.value === (avatarState.hairStyle || 'long'));
  });
  document.querySelectorAll('.expr-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.value === avatarState.expression);
  });
}

function setRace(race)         { avatarState.race      = race;  updateAvatar(); }
function setHair(color)        { avatarState.hairColor  = color; updateAvatar(); }
function setSkin(color)        { avatarState.skinColor  = color; updateAvatar(); }
function setArmor(type) {
  avatarState.armor = type;
  // Witch forces broom
  if (type === 'witch' && avatarState.weapon !== 'broom') {
    avatarState.weapon = 'broom';
  }
  updateAvatar();
}
function setWeapon(type)       { avatarState.weapon    = type;  updateAvatar(); }
function setCloak(type)        { avatarState.cloak     = type;  updateAvatar(); }
function setExtra(type)        { avatarState.extra     = type;  updateAvatar(); }
function setExpression(expr)   { avatarState.expression = expr; updateAvatar(); }
function setHairStyle(style)   { avatarState.hairStyle  = style; updateAvatar(); }

function downloadAvatar() {
  const svgEl = document.getElementById('avatar-svg');
  if (!svgEl) return;
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  const img = new Image();
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  img.onload = function() {
    ctx.fillStyle = '#0f0e0d';
    ctx.fillRect(0, 0, 320, 480);
    const vbW = svgEl.viewBox?.baseVal?.width || 200;
    const vbH = svgEl.viewBox?.baseVal?.height || 300;
    const scale = Math.min(320 / vbW, 480 / vbH);
    const w = vbW * scale, h = vbH * scale;
    ctx.drawImage(img, (320 - w) / 2, (480 - h) / 2, w, h);
    URL.revokeObjectURL(url);
    const link = document.createElement('a');
    link.download = (avatarState.name || 'My Hero').replace(/\s+/g, '_') + '_avatar.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  img.src = url;
}

function buildAvatarPanel() {
  return `
  <div class="avatar-panel">
    <div class="avatar-panel-title">Your Character</div>
    <div id="avatar-archetype-display" class="avatar-archetype-badge" style="display:none"></div>

    <input type="text" class="avatar-name-input" id="avatar-name-input"
           placeholder="Character Name"
           value="${avatarState.name}"
           oninput="avatarState.name = this.value"/>

    <div class="avatar-svg-wrapper" id="avatar-svg-container">
      <!-- SVG rendered here by JS -->
    </div>

    <div class="avatar-picker-section">
      <!-- RACE -->
      <div class="avatar-picker-row">
        <span class="avatar-picker-label">Race</span>
        <div class="avatar-race-btns">
          <button class="accessory-btn active" data-type="race" data-value="human"    onclick="setRace('human')">Human</button>
          <button class="accessory-btn"        data-type="race" data-value="elf"      onclick="setRace('elf')">Elf</button>
          <button class="accessory-btn"        data-type="race" data-value="dwarf"    onclick="setRace('dwarf')">Dwarf</button>
          <button class="accessory-btn"        data-type="race" data-value="halfling" onclick="setRace('halfling')">Halfling</button>
          <button class="accessory-btn"        data-type="race" data-value="tiefling" onclick="setRace('tiefling')">Tiefling</button>
        </div>
      </div>

      <!-- HAIR -->
      <div class="avatar-picker-row">
        <span class="avatar-picker-label">Hair</span>
        <button class="swatch active" data-type="hair" data-value="#d4a017" style="background:#d4a017" title="Gold"    onclick="setHair('#d4a017')"></button>
        <button class="swatch"        data-type="hair" data-value="#1a1a2e" style="background:#1a1a2e" title="Black"   onclick="setHair('#1a1a2e')"></button>
        <button class="swatch"        data-type="hair" data-value="#8b3a2a" style="background:#8b3a2a" title="Auburn"  onclick="setHair('#8b3a2a')"></button>
        <button class="swatch"        data-type="hair" data-value="#c0c0c0" style="background:#c0c0c0" title="Silver"  onclick="setHair('#c0c0c0')"></button>
        <button class="swatch"        data-type="hair" data-value="#f0f0f0" style="background:#f0f0f0;border:1px solid #888" title="White" onclick="setHair('#f0f0f0')"></button>
        <button class="swatch"        data-type="hair" data-value="#6a2a8a" style="background:#6a2a8a" title="Violet"  onclick="setHair('#6a2a8a')"></button>
        <button class="swatch"        data-type="hair" data-value="#1a7a4a" style="background:#1a7a4a" title="Forest"  onclick="setHair('#1a7a4a')"></button>
        <button class="swatch"        data-type="hair" data-value="#e85c8a" style="background:#e85c8a" title="Pink"    onclick="setHair('#e85c8a')"></button>
        <button class="swatch"        data-type="hair" data-value="#e87a2a" style="background:#e87a2a" title="Copper"  onclick="setHair('#e87a2a')"></button>
      </div>

      <!-- HAIR STYLE -->
      <div class="avatar-picker-row">
        <span class="avatar-picker-label">Style</span>
        <button class="accessory-btn active" data-type="hairstyle" data-value="long"     onclick="setHairStyle('long')">Long</button>
        <button class="accessory-btn"        data-type="hairstyle" data-value="short"    onclick="setHairStyle('short')">Short</button>
        <button class="accessory-btn"        data-type="hairstyle" data-value="ponytail" onclick="setHairStyle('ponytail')">Ponytail</button>
        <button class="accessory-btn"        data-type="hairstyle" data-value="buns"     onclick="setHairStyle('buns')">Buns</button>
        <button class="accessory-btn"        data-type="hairstyle" data-value="mohawk"   onclick="setHairStyle('mohawk')">Mohawk</button>
        <button class="accessory-btn"        data-type="hairstyle" data-value="braid"    onclick="setHairStyle('braid')">Braid</button>
        <button class="accessory-btn"        data-type="hairstyle" data-value="buzz"     onclick="setHairStyle('buzz')">Buzz</button>
        <button class="accessory-btn"        data-type="hairstyle" data-value="curly"    onclick="setHairStyle('curly')">Curly</button>
        <button class="accessory-btn"        data-type="hairstyle" data-value="pigtails" onclick="setHairStyle('pigtails')">Pigtails</button>
        <button class="accessory-btn"        data-type="hairstyle" data-value="bob"      onclick="setHairStyle('bob')">Bob</button>
      </div>

      <!-- SKIN -->
      <div class="avatar-picker-row">
        <span class="avatar-picker-label">Skin</span>
        <button class="swatch active" data-type="skin" data-value="#f5deb3" style="background:#f5deb3;border:1px solid #888" title="Pale"   onclick="setSkin('#f5deb3')"></button>
        <button class="swatch"        data-type="skin" data-value="#c8a47e" style="background:#c8a47e" title="Medium"  onclick="setSkin('#c8a47e')"></button>
        <button class="swatch"        data-type="skin" data-value="#a0785a" style="background:#a0785a" title="Tan"     onclick="setSkin('#a0785a')"></button>
        <button class="swatch"        data-type="skin" data-value="#6b4226" style="background:#6b4226" title="Dark"    onclick="setSkin('#6b4226')"></button>
        <button class="swatch"        data-type="skin" data-value="#9b6b9b" style="background:#9b6b9b" title="Tiefling" onclick="setSkin('#9b6b9b')"></button>
        <button class="swatch"        data-type="skin" data-value="#4a8c6a" style="background:#4a8c6a" title="Forest Green (Dryad)" onclick="setSkin('#4a8c6a')"></button>
        <button class="swatch"        data-type="skin" data-value="#2a6b8a" style="background:#2a6b8a" title="Ocean Blue (Water Genasi)" onclick="setSkin('#2a6b8a')"></button>
        <button class="swatch"        data-type="skin" data-value="#c44a4a" style="background:#c44a4a" title="Flame Red (Fire Genasi)" onclick="setSkin('#c44a4a')"></button>
        <button class="swatch"        data-type="skin" data-value="#b8a0d4" style="background:#b8a0d4" title="Lavender (Fey)" onclick="setSkin('#b8a0d4')"></button>
        <button class="swatch"        data-type="skin" data-value="#d4c44a" style="background:#d4c44a" title="Sunstone (Radiant)" onclick="setSkin('#d4c44a')"></button>
        <button class="swatch"        data-type="skin" data-value="#1a2a1a" style="background:#1a2a1a;border:1px solid #444" title="Shadow Black" onclick="setSkin('#1a2a1a')"></button>
      </div>

      <!-- ARMOR -->
      <div class="avatar-picker-row">
        <span class="avatar-picker-label">Armor</span>
        <button class="accessory-btn active" data-type="armor" data-value="robe"   onclick="setArmor('robe')">Robe</button>
        <button class="accessory-btn"        data-type="armor" data-value="mail"   onclick="setArmor('mail')">Mail</button>
        <button class="accessory-btn"        data-type="armor" data-value="plate"  onclick="setArmor('plate')">Plate</button>
        <button class="accessory-btn"        data-type="armor" data-value="witch"  onclick="setArmor('witch')">Witch</button>
        <button class="accessory-btn"        data-type="armor" data-value="ranger" onclick="setArmor('ranger')">Ranger</button>
        <button class="accessory-btn"        data-type="armor" data-value="noble"  onclick="setArmor('noble')">Noble</button>
      </div>

      <!-- WEAPON -->
      <div class="avatar-picker-row">
        <span class="avatar-picker-label">Weapon</span>
        <button class="accessory-btn active" data-type="weapon" data-value="staff"  onclick="setWeapon('staff')">Staff</button>
        <button class="accessory-btn"        data-type="weapon" data-value="sword"  onclick="setWeapon('sword')">Sword</button>
        <button class="accessory-btn"        data-type="weapon" data-value="axe"    onclick="setWeapon('axe')">Axe</button>
        <button class="accessory-btn"        data-type="weapon" data-value="broom"  onclick="setWeapon('broom')">Broom</button>
        <button class="accessory-btn"        data-type="weapon" data-value="bow"    onclick="setWeapon('bow')">Bow</button>
      </div>

      <!-- CLOAK -->
      <div class="avatar-picker-row">
        <span class="avatar-picker-label">Cloak</span>
        <button class="accessory-btn active" data-type="cloak" data-value="none"     onclick="setCloak('none')">None</button>
        <button class="accessory-btn"        data-type="cloak" data-value="short"    onclick="setCloak('short')">Short</button>
        <button class="accessory-btn"        data-type="cloak" data-value="long"     onclick="setCloak('long')">Long</button>
        <button class="accessory-btn"        data-type="cloak" data-value="tattered" onclick="setCloak('tattered')">Tattered</button>
      </div>

      <!-- EXTRAS -->
      <div class="avatar-picker-row">
        <span class="avatar-picker-label">Extras</span>
        <button class="accessory-btn active" data-type="extra" data-value="none"        onclick="setExtra('none')">None</button>
        <button class="accessory-btn"        data-type="extra" data-value="hood"        onclick="setExtra('hood')">Hood</button>
        <button class="accessory-btn"        data-type="extra" data-value="hat"         onclick="setExtra('hat')">Hat</button>
        <button class="accessory-btn"        data-type="extra" data-value="crown"       onclick="setExtra('crown')">Crown</button>
        <button class="accessory-btn"        data-type="extra" data-value="mustache"    onclick="setExtra('mustache')">Mustache</button>
        <button class="accessory-btn"        data-type="extra" data-value="glasses"     onclick="setExtra('glasses')">Glasses</button>
        <button class="accessory-btn"        data-type="extra" data-value="monocle"     onclick="setExtra('monocle')">Monocle</button>
        <button class="accessory-btn"        data-type="extra" data-value="eyepatch"    onclick="setExtra('eyepatch')">Eye Patch</button>
        <button class="accessory-btn"        data-type="extra" data-value="partyhat"    onclick="setExtra('partyhat')">Party Hat</button>
        <button class="accessory-btn"        data-type="extra" data-value="flowercrown" onclick="setExtra('flowercrown')">Flower Crown</button>
        <button class="accessory-btn"        data-type="extra" data-value="vikinghelm"  onclick="setExtra('vikinghelm')">Viking Helm</button>
        <button class="accessory-btn"        data-type="extra" data-value="fez"         onclick="setExtra('fez')">Fez</button>
      </div>

      <!-- MOOD / EXPRESSION -->
      <div class="avatar-picker-row">
        <span class="avatar-picker-label">Mood</span>
        <button class="expr-btn active" data-value="happy"     onclick="setExpression('happy')"     title="Happy">😊</button>
        <button class="expr-btn"        data-value="fierce"    onclick="setExpression('fierce')"    title="Fierce">😤</button>
        <button class="expr-btn"        data-value="nervous"   onclick="setExpression('nervous')"   title="Nervous">😰</button>
        <button class="expr-btn"        data-value="cool"      onclick="setExpression('cool')"      title="Cool">😎</button>
        <button class="expr-btn"        data-value="surprised" onclick="setExpression('surprised')" title="Surprised">😲</button>
        <button class="expr-btn"        data-value="sleepy"    onclick="setExpression('sleepy')"    title="Sleepy">😴</button>
        <button class="expr-btn"        data-value="smug"      onclick="setExpression('smug')"      title="Smug">😏</button>
        <button class="expr-btn"        data-value="wink"      onclick="setExpression('wink')"      title="Wink">😉</button>
        <button class="expr-btn"        data-value="grumpy"    onclick="setExpression('grumpy')"    title="Grumpy">😠</button>
        <button class="expr-btn"        data-value="loveeyes"  onclick="setExpression('loveeyes')"  title="Love Eyes">😍</button>
        <button class="expr-btn"        data-value="thinking"  onclick="setExpression('thinking')"  title="Thinking">🤔</button>
        <button class="expr-btn"        data-value="crylaugh"  onclick="setExpression('crylaugh')"  title="Cry Laugh">😂</button>
      </div>
    </div>

    <button class="avatar-download-btn" onclick="downloadAvatar()">⬇ Download Avatar</button>

    <div class="avatar-save-row">
      <input type="text" class="avatar-creator-input" id="avatar-creator-input"
             placeholder="Your Name (player)"/>
      <button class="avatar-save-btn" id="avatar-save-btn" onclick="saveCharacter()">💾 Save to Library</button>
      <span class="save-flash" id="save-flash" style="display:none;">Saved! ✓</span>
    </div>
  </div>`;
}

// ============================================================
// UPGRADE 2: ENHANCED SCENE ANIMATIONS
// ============================================================

const SCENE_ICONS = {
  safe: `<svg class="anim-icon" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M36 6 L60 16 L60 36 C60 52 48 64 36 68 C24 64 12 52 12 36 L12 16 Z"
          fill="rgba(45,212,191,0.2)" stroke="#2dd4bf" stroke-width="3"/>
    <path d="M24 36 L32 44 L50 26" stroke="#2dd4bf" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  smart: `<svg class="anim-icon" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="36" cy="36" r="12" fill="rgba(201,168,76,0.2)" stroke="#c9a84c" stroke-width="2.5"/>
    <path d="M36 8 L38 20 L36 20 L34 20 Z" fill="#c9a84c" stroke="#c9a84c" stroke-width="1"/>
    <path d="M36 64 L38 52 L36 52 L34 52 Z" fill="#c9a84c" stroke="#c9a84c" stroke-width="1"/>
    <path d="M8 36 L20 38 L20 36 L20 34 Z" fill="#c9a84c" stroke="#c9a84c" stroke-width="1"/>
    <path d="M64 36 L52 38 L52 36 L52 34 Z" fill="#c9a84c" stroke="#c9a84c" stroke-width="1"/>
    <path d="M15 15 L24 24" stroke="#c9a84c" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M57 57 L48 48" stroke="#c9a84c" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M57 15 L48 24" stroke="#c9a84c" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M15 57 L24 48" stroke="#c9a84c" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="36" cy="36" r="6" fill="#c9a84c"/>
  </svg>`,

  creative: `<svg class="anim-icon" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M36 8 L39 27 L58 27 L43 39 L49 58 L36 47 L23 58 L29 39 L14 27 L33 27 Z"
          fill="rgba(139,92,246,0.25)" stroke="#8b5cf6" stroke-width="2.5" stroke-linejoin="round"/>
  </svg>`,

  bold: `<svg class="anim-icon" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M36 8 C34 18 26 22 24 32 C22 40 28 46 36 50 C44 46 50 40 48 32 C46 22 38 18 36 8Z"
          fill="rgba(249,115,22,0.3)" stroke="#f97316" stroke-width="2.5"/>
    <path d="M36 20 C35 27 31 29 30 35 C29 40 32 44 36 46 C40 44 43 40 42 35 C41 29 37 27 36 20Z"
          fill="#f97316" opacity="0.8"/>
    <line x1="36" y1="52" x2="36" y2="64" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
    <line x1="30" y1="58" x2="36" y2="52" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
    <line x1="42" y1="58" x2="36" y2="52" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  roleplay: `<svg class="anim-icon" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="14" width="42" height="30" rx="8" fill="rgba(251,113,133,0.2)" stroke="#fb7185" stroke-width="2.5"/>
    <path d="M20 50 L14 62 L28 54" fill="rgba(251,113,133,0.2)" stroke="#fb7185" stroke-width="2.5" stroke-linejoin="round"/>
    <line x1="20" y1="26" x2="40" y2="26" stroke="#fb7185" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="20" y1="34" x2="36" y2="34" stroke="#fb7185" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M52 8 C64 10 66 24 56 28 C62 18 58 12 52 8Z" fill="#fb7185" opacity="0.7"/>
    <line x1="56" y1="28" x2="46" y2="48" stroke="#fb7185" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`
};

function buildSceneParticles(type) {
  if (type === 'safe') {
    return `<div class="anim-particles"><div class="spark"></div><div class="spark"></div><div class="spark"></div><div class="spark"></div><div class="spark"></div></div>`;
  } else if (type === 'smart') {
    return `<div class="anim-particles"><div class="tact-dot"></div><div class="tact-dot"></div><div class="tact-dot"></div><div class="tact-dot"></div></div>`;
  } else if (type === 'creative') {
    return `<div class="anim-particles"><div class="sparkle"></div><div class="sparkle"></div><div class="sparkle"></div><div class="sparkle"></div><div class="sparkle"></div><div class="sparkle"></div></div>`;
  } else if (type === 'bold') {
    return `<div class="anim-particles"><div class="flare"></div><div class="flare"></div><div class="flare"></div></div>`;
  } else if (type === 'roleplay') {
    return `<div class="anim-particles"><div class="float-char">✦</div><div class="float-char">✧</div><div class="float-char">❝</div><div class="float-char">★</div><div class="float-char">✦</div></div>`;
  }
  return '';
}

const CONSEQUENCES_DATA = {
  '1-0': "The soldier will seek your opinion before speaking in future tense situations — your quiet observation earned a subtle advisory role. The tiefling will make eye contact with you first when danger looms.",
  '1-1': "Commander Brynn remembers you as the one who opened the door. When the party faces a faction negotiation, she defers to you first. The tiefling never forgets that someone created space for her.",
  '1-2': "The DM notes that your party is now collectively curious about the smudged poster. It becomes a minor thread that resurfaces two sessions later — started by your single observation.",
  '1-3': "The party dynamic is established as mission-oriented. They expect you to have a plan. When you don't, there will be visible friction — but they also trust you to lead when it matters.",
  '1-4': "Every player at the table adjusts their energy upward to meet yours. The session tone is set as serious, immersive roleplay. The DM gives you a private note with a character-specific hook.",
  '2-0': "The Verdant Seal marks you as cautious but not hostile. In three sessions, another agent will approach you with a better offer — they've been watching.",
  '2-1': "You've confirmed you know something about the prophecy mark. The Seal now considers you a high-value target for recruitment — or neutralization. Their attention is focused.",
  '2-2': "Your party now has an unspoken language. The DM introduces another situation requiring covert coordination, and your party is ahead of it.",
  '2-3': "The Seal's file on your party now has a note: 'Confrontational. Handle with precision.' They will not approach you in crowded spaces again. Private approaches only.",
  '2-4': "The Seal's envoy spends a week analyzing your body language. She advises her superiors that your party is 'aware but reactive — approach through the emotionally vulnerable one.'",
  '3-0': "Both scholars cite your neutral account in their subsequent reports. You're considered a credible witness — which means other factions will want your testimony next.",
  '3-1': "Ildra privately tells you something she's never shared with Vasyn. Your question earned her complete trust. She is now a direct information source outside of Archive channels.",
  '3-2': "Vasyn and Ildra begin collaborating for the first time in a year. Their combined research produces a new lead that gets delivered to your party within a week.",
  '3-3': "Vasyn withdraws from all Archive dealings with your party. Three sessions later, you'll need his specialized knowledge and he won't answer your messages.",
  '3-4': "The DM creates a custom handout — a page of the manuscript with your character's question written in the margins. It becomes a physical campaign artifact.",
  '4-0': "The other party the Omen Seeker found was less discerning. Whatever information they received has set off a chain of events your party will encounter next session — unknowingly.",
  '4-1': "The Omen Seeker's network now knows your party has confirmed knowledge of the mark. Three factions receive this intelligence within 24 hours.",
  '4-2': "Your party now has a safehouse location. It becomes a major asset two sessions later when you need to hide a key NPC quickly.",
  '4-3': "The Omen Seeker delivers your challenge to their council. You're now on a list of 'obstacles to manage' — distinct from 'enemies,' but watched closely.",
  '4-4': "The DM adjusts the faction's approach to your party permanently — they read your character type and will try to manipulate through your specific vulnerabilities.",
  '5-0': "The trap you identified gets used by a party member later to their advantage — they remembered your warning. The sound from the right passage returns next session.",
  '5-1': "Scholar Ildra, when told about the freshly-cleaned bowl in a sealed ruin, goes pale. She gives you a key with no explanation and tells you to keep it safe.",
  '5-2': "Your class ability reveals a magical signature that no one else could have found. The DM creates a sub-plot thread specific to your character's abilities.",
  '5-3': "The luminescent gold residue on your fingers glows under moonlight for the next three sessions — drawing attention at critical moments you did not choose.",
  '5-4': "The DM creates a future scene specifically for your character — a vision triggered by the chamber's energy that only you experience, containing a key piece of campaign lore.",
  '6-0': "The Reclamation reports back that your party is 'cooperative under pressure.' They will attempt this interrogation approach again. Next time with more leverage.",
  '6-1': "Your defensive positioning is noted by Commander Brynn as textbook. She begins treating you as the tactical mind of the group.",
  '6-2': "The Reclamation's hesitation creates a 12-hour diplomatic window. Another faction observes the standoff and reaches out — they want to know how you neutralized a Reclamation team without violence.",
  '6-3': "The Reclamation marks your party as armed and hostile. Their next approach will be overwhelming force, not interrogation. No more warnings.",
  '6-4': "The DM privately notes your character's relationship with authority and builds a future encounter that directly challenges your character's most deeply held belief about it.",
  '7-0': "The party develops a habit of focus-firing based on your lead. By session three, your combat coordination is noticeably better than the average table.",
  '7-1': "Your ally crits on their advantage attack. They begin looking to you before their turn in every subsequent combat — you've become the tactical coordinator.",
  '7-2': "The enemies' morale check breaks early because of the area denial. The DM notes this and uses crowd-control-responsive enemy AI more often — making your skill relevant across the campaign.",
  '7-3': "The flanked enemy is defeated in one hit. The DM starts designing encounters with flanking opportunities, knowing your party will use them.",
  '7-4': "Another player asks after the session, 'How did you know to do that?' Your class feature becomes the most-discussed mechanic at the table for two weeks.",
  '8-0': "The Fragment stays silent in your possession. Two sessions later, it activates during a moment of high stress — at the worst possible time.",
  '8-1': "The scholar's network learns you've asked the exact right question. You get a visit from a senior Archive member who never meets with beginners.",
  '8-2': "The Fragment responds differently to your specific touch. The DM notes this privately and plans a session around it.",
  '8-3': "Destroying the Fragment eliminates one threat but awakens another that was suppressed by its presence. Something that was sleeping wakes up.",
  '8-4': "Your character's personal connection to the Fragment is revealed to one NPC — the one you least expected to understand it. They become your most surprising ally.",
  '9-0': "Both factions record your neutrality. Each one will attempt to win your exclusive loyalty before the campaign's midpoint — with increasingly valuable offers.",
  '9-1': "Your mediating question becomes the basis of a temporary truce. You're now named in official Faction correspondence as a 'reliable neutral' — which other factions notice.",
  '9-2': "Your bluff buys 48 hours. In that window, the DM drops a major revelation that changes the entire value of the standoff.",
  '9-3': "Siding firmly creates one powerful ally and one dedicated adversary. The adversary faction adds your face to their intelligence board.",
  '9-4': "Your character's authentic response earns something no diplomatic maneuver could: genuine respect from an NPC who despises politics.",
  '10-0': "The cautious path delays the catastrophe — but does not prevent it. Your party has more time to prepare, but the cost was letting someone else pay the price tonight.",
  '10-1': "Your analysis proves correct. The party survives intact, but the DM notes that the smart play left an emotional scar on one party member who wanted action.",
  '10-2': "The unexpected third option catches every faction off-guard. None of them have a contingency for it. You have 24 hours of genuine freedom before they adapt.",
  '10-3': "The bold path costs one resource that seemed expendable. It becomes crucial three sessions later. The story remembers everything.",
  '10-4': "Your character does the thing only they would do. The DM says: 'That's the moment. That's why this campaign exists.' It goes in the session notes forever."
};

function getConsequence(scenarioId, choiceIndex) {
  const key = `${scenarioId}-${choiceIndex}`;
  return CONSEQUENCES_DATA[key] || "Your choice ripples outward — the factions, the party, and the world will all remember this moment in ways you can't yet predict.";
}

let _currentScenarioId = null;
let _currentChoiceIndex = null;

function makeChoiceEnhanced(scenarioId, choiceIndex) {
  const sc = window.SCENARIOS ? SCENARIOS.find(s => s.id === scenarioId) : null;
  if (!sc) return;
  const choice = sc.choices[choiceIndex];
  if (!choice) return;

  _currentScenarioId = scenarioId;
  _currentChoiceIndex = choiceIndex;

  const type = choice.type;
  const consequences = getConsequence(scenarioId, choiceIndex);

  const html = `
    <div class="choice-outcome enhanced">
      <div class="scene-anim-box anim-${type}">
        <div class="anim-bg"></div>
        ${buildSceneParticles(type)}
        ${SCENE_ICONS[type] || ''}
      </div>
      <div class="scene-ai-image hidden" id="scene-ai-image">
        <div class="image-loading">Illustrating your scene...</div>
        <img src="" alt="AI scene illustration" style="display:none"/>
      </div>
      <button class="btn-illustrate" onclick="illustrateScene()">✨ Illustrate this scene with AI</button>
      <div class="outcome-section immediate">
        <div class="outcome-label">⚡ What Happens</div>
        <p>${choice.outcome}</p>
      </div>
      <div class="outcome-section consequences">
        <div class="outcome-label">🔮 Consequences</div>
        <p>${consequences}</p>
      </div>
      <div class="outcome-section lesson">
        <div class="outcome-label">📖 The Lesson</div>
        <p>${choice.lesson}</p>
      </div>
      <div class="outcome-cards">
        <div class="outcome-card">
          <div class="card-label">Game Principle</div>
          <p>${choice.principle}</p>
        </div>
        <div class="outcome-card">
          <div class="card-label">In Character</div>
          <p>${choice.icLine}</p>
        </div>
        <div class="outcome-card">
          <div class="card-label">Out of Character</div>
          <p>${choice.oocLine}</p>
        </div>
      </div>
      <div class="result-reset">
        <button class="sc-back-btn" onclick="resetScenario()">← Try Another Scenario</button>
      </div>
    </div>`;

  const resultPanel = document.getElementById('choice-result-panel');
  if (resultPanel) {
    resultPanel.innerHTML = html;
    resultPanel.classList.add('visible');
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.querySelectorAll('.choice-btn').forEach((btn, i) => {
    btn.style.opacity = i === choiceIndex ? '1' : '0.5';
  });
}

async function illustrateScene() {
  const btn = document.querySelector('.btn-illustrate');
  const imgDiv = document.getElementById('scene-ai-image');
  if (!btn || !imgDiv) return;

  imgDiv.classList.remove('hidden');
  const loading = imgDiv.querySelector('.image-loading');
  if (loading) loading.style.display = 'none';

  const sc = window.SCENARIOS ? SCENARIOS.find(s => s.id === _currentScenarioId) : null;
  const choice = sc ? sc.choices[_currentChoiceIndex] : null;
  const sceneTitle = sc ? sc.title : 'A D&D Scene';
  const outcomeText = choice ? choice.outcome : 'The story unfolds...';

  imgDiv.innerHTML = `
    <div style="background:linear-gradient(135deg,var(--color-surface-2),var(--color-surface));border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:2rem;text-align:center;position:relative;overflow:hidden;">
      <div style="position:absolute;inset:0;opacity:0.05;font-size:6rem;display:flex;align-items:center;justify-content:center;pointer-events:none;">🎭</div>
      <div style="font-family:var(--font-display);font-size:1.1rem;color:var(--color-gold);margin-bottom:0.5rem;font-weight:600;">${sceneTitle}</div>
      <div style="font-family:var(--font-lore);font-size:1rem;color:var(--color-text-muted);line-height:1.6;max-width:360px;margin:0 auto;">${outcomeText}</div>
      <div style="margin-top:1rem;font-size:0.75rem;color:var(--color-text-faint);font-family:var(--font-body);">Scene illustration available with AI server mode</div>
    </div>`;
  btn.textContent = '🎭 Scene Visualized';
  btn.disabled = true;
}

// ============================================================
// UPGRADE 3: AI COACH CHAT
// ============================================================

let chatHistory = [];

function buildChatSection() {
  return `
  <section class="app-section" id="section-coach-chat" aria-label="AI Coach Chat">
    <div class="section-header">
      <div class="section-eyebrow">Your Personal Coach</div>
      <h2>Chat with The Oracle</h2>
      <p>Ask anything about D&amp;D rules, how to play your character, what to do in any situation. The Oracle knows all.</p>
    </div>
    <div class="chat-container">
      <div class="chat-starters" id="chat-starters">
        <div class="starters-label">Quick questions to get started:</div>
        <div class="starters-grid">
          <button class="starter-btn" onclick="askStarter('How do I heal my allies?')">How do I heal my allies?</button>
          <button class="starter-btn" onclick="askStarter('What can I do on my first turn?')">What can I do on my first turn?</button>
          <button class="starter-btn" onclick="askStarter('What is concentration in D&D?')">What is concentration in D&amp;D?</button>
          <button class="starter-btn" onclick="askStarter('How do I talk to suspicious NPCs?')">How do I talk to suspicious NPCs?</button>
          <button class="starter-btn" onclick="askStarter('What is the difference between actions and bonus actions?')">Actions vs bonus actions?</button>
          <button class="starter-btn" onclick="askStarter('How do I use spell slots?')">How do I use spell slots?</button>
          <button class="starter-btn" onclick="askStarter(&quot;I\\'m nervous — what should I do at my first session?&quot;)">I'm nervous — what do I do first session?</button>
          <button class="starter-btn" onclick="askStarter('What does my Life Cleric do best in combat and roleplay?')">What does my Life Cleric do best?</button>
        </div>
      </div>
      <div class="chat-messages" id="chat-messages">
        <div class="chat-msg oracle">
          <div class="msg-avatar">🔮</div>
          <div class="msg-bubble">
            <strong>The Oracle</strong>
            Welcome, seeker. I am The Oracle — your guide through the mysteries of D&amp;D. Ask me anything: rules, tactics, roleplay advice, how to build your character, what to say when you freeze, or what any spell does. The answers you seek are within reach.
          </div>
        </div>
      </div>
      <div class="chat-input-area">
        <textarea id="chat-input" placeholder="Ask The Oracle anything… (e.g. 'How does concentration work?' or 'What should a Life Cleric do in their first combat turn?')" rows="2" onkeydown="handleChatKey(event)"></textarea>
        <button class="btn-send" onclick="sendChatMessage()" id="chat-send-btn">Send ▶</button>
      </div>
    </div>
  </section>`;
}

function appendUserMessage(text) {
  const el = document.createElement('div');
  el.className = 'chat-msg user';
  el.innerHTML = `<div class="msg-bubble user">${escapeHtmlChat(text)}</div>`;
  const msgs = document.getElementById('chat-messages');
  if (msgs) msgs.appendChild(el);
  scrollChatToBottom();
}

function appendOracleMessage(text, id) {
  const el = document.createElement('div');
  el.className = 'chat-msg oracle';
  el.id = id;
  el.innerHTML = `
    <div class="msg-avatar">🔮</div>
    <div class="msg-bubble">
      <strong>The Oracle</strong>
      <span class="msg-text">${text || '<span class="typing-indicator"><span></span><span></span><span></span></span>'}</span>
    </div>`;
  const msgs = document.getElementById('chat-messages');
  if (msgs) msgs.appendChild(el);
  scrollChatToBottom();
}

function updateOracleMessage(id, text) {
  const el = document.getElementById(id);
  if (el) {
    const span = el.querySelector('.msg-text');
    if (span) span.textContent = text;
  }
}

function scrollChatToBottom() {
  const msgs = document.getElementById('chat-messages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChatMessage();
  }
}

function askStarter(text) {
  const input = document.getElementById('chat-input');
  if (input) input.value = text;
  sendChatMessage();
}

function escapeHtmlChat(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const ORACLE_KB = [
  { keys: ['heal','healing','cure','restore','hit points','hp'], answer: "Healing in D&D comes in many forms. Healing Word (bonus action, ranged) and Cure Wounds (action, touch) are the most common spells. Clerics, Druids, Bards, and Paladins can all heal. You can also use a Healing Potion (action to drink, or bonus action if your DM is generous). Short rests let you spend Hit Dice to recover HP, and a long rest restores all HP. Pro tip: Healing Word is one of the best spells in the game because you can cast it as a bonus action — you can still attack or do something else with your main action." },
  { keys: ['first turn','what can i do','my turn','actions in combat','turn order'], answer: "On your turn in combat, you get three things: one Action, one Bonus Action, and Movement (up to your speed, usually 30 feet). Your Action is the big one — Attack, Cast a Spell, Dash (double movement), Dodge (enemies have disadvantage on attacks against you), Help (give an ally advantage), or Hide. You can also interact with one object for free (draw your weapon, open a door). You can split your movement however you like — move, attack, then move again is totally fine. Don't forget your Reaction, which you can use once before your next turn (like an Opportunity Attack if an enemy runs away from you)." },
  { keys: ['concentration','concentrating','maintain spell'], answer: "Concentration means you need to actively focus on a spell to keep it going. You can only concentrate on ONE spell at a time — casting a new concentration spell automatically ends the previous one. If you take damage while concentrating, you must make a Constitution saving throw (DC = 10, or half the damage taken, whichever is higher). If you fail, the spell ends. Spells that require concentration are marked with a 'C' or say 'Concentration' in their duration. Examples: Bless, Hold Person, Spirit Guardians. War Caster is a great feat for anyone who concentrates a lot — it gives you advantage on those concentration checks." },
  { keys: ['npc','talk','persuasion','charisma','social','roleplay','conversation','suspicious'], answer: "When talking to NPCs, you can approach them in character or describe what you want to say. Common social ability checks: Persuasion (convincing someone truthfully), Deception (convincing with lies), Intimidation (scaring them into cooperating), and Insight (reading their intentions). You don't need to be a great actor — saying 'I try to convince the guard to let us through by telling him about the threat' works perfectly. Your DM will ask for a roll. A few tips: gather information before confronting, offer something they want, and remember that not everything needs to be solved through combat." },
  { keys: ['action','bonus action','difference','action economy'], answer: "An Action is your main thing each turn — Attack, Cast a Spell, Dash, Dodge, Help, or Hide. A Bonus Action is an extra, quicker thing you can do IF you have a feature or spell that uses one. Not everyone has a bonus action every turn! Examples of bonus action uses: Healing Word, Two-Weapon Fighting (second attack with off-hand), some class features like Cunning Action (Rogue). You cannot substitute a bonus action for an action or vice versa. A Reaction happens on someone else's turn — like Opportunity Attacks or the Shield spell. You get one reaction per round." },
  { keys: ['spell slot','spell slots','how to cast','spellcasting','cantrip'], answer: "Spell slots are your magical fuel. You spend one slot to cast a spell at that slot's level or higher. A 1st-level spell needs at least a 1st-level slot, but you can cast it with a higher slot for extra power (this is called 'upcasting'). You regain all spell slots after a long rest (8 hours). Cantrips are special — they cost no spell slots and can be cast unlimited times. They're your bread-and-butter magic. Think of spell slots like bullets and cantrips like an infinite-ammo sidearm. Warlocks are different — they get fewer slots but recover them on short rests." },
  { keys: ['nervous','first session','first time','beginner','new player','scared','anxious'], answer: "Being nervous is totally normal and honestly a good sign — it means you care about having fun. Here's what to know: nobody expects you to know the rules. Seriously. Even veteran players forget rules. Your job is to describe what your character does, and your DM and fellow players will help with the mechanics. You don't need a voice or accent. You don't need to stay in character the whole time. Just say what your character does: 'I look around the room for traps' or 'I swing my sword at the goblin.' Ask questions freely. Bring snacks (always appreciated). The secret is: everyone at the table wants you to succeed. That's literally the game." },
  { keys: ['cleric','life cleric','what does cleric do'], answer: "Life Clerics are the ultimate support characters — your party's lifeline. In combat, you excel at healing (your heals get bonus HP from Disciple of Life), keeping allies alive with Healing Word (bonus action, so you can still do other things), and using Spirit Guardians to deal automatic damage to nearby enemies. You also wear heavy armor and carry a shield, making you surprisingly tough. In roleplay, you're the moral compass, the spiritual guide, the one NPCs trust. Don't forget your Channel Divinity: Preserve Life — it's an AoE heal that can save a dire situation. You're not a healbot though — use your spells and Sacred Flame offensively too." },
  { keys: ['ability check','skill check','roll','dice','d20','advantage','disadvantage'], answer: "When you try something with an uncertain outcome, your DM asks for an ability check. You roll a d20, add the relevant modifier (like Strength for athletics, Wisdom for perception), and compare to a Difficulty Class (DC) set by the DM. Meet or beat the DC = success. Advantage means you roll TWO d20s and take the HIGHER result — you get this from helpful situations. Disadvantage means you roll two and take the LOWER — from bad situations. They cancel each other out. Proficiency bonus gets added when you're trained in a skill — it starts at +2 and grows as you level up. Natural 20 on an attack roll is always a critical hit (double damage dice)!" },
  { keys: ['attack','combat','fight','damage','hit','miss','armor class','ac'], answer: "To attack, roll a d20 + your attack modifier. If the total meets or beats the target's Armor Class (AC), you hit. Then roll damage dice (depends on your weapon or spell). Melee attacks use Strength modifier, ranged use Dexterity, and spell attacks use your spellcasting ability modifier. A natural 20 is a critical hit — you roll all damage dice twice. A natural 1 is always a miss. Higher AC = harder to hit. Full plate armor gives AC 18, but it's heavy and expensive. Shield adds +2 AC. Cover gives bonuses too: half cover (+2), three-quarters cover (+5)." },
  { keys: ['saving throw','save','constitution save','dexterity save'], answer: "A saving throw is a reaction roll to resist something bad. When a spell or trap targets you, you roll a d20 + the relevant ability modifier (and proficiency if you're proficient in that save). Your class determines which saves you're proficient in. The most common saves: Dexterity (dodge effects like Fireball), Constitution (resist poison, maintain concentration), Wisdom (resist charm, fear, mind control). Strength, Intelligence, and Charisma saves are less common but still important. You don't choose to make a saving throw — the DM tells you when it's needed based on what's happening." },
  { keys: ['race','species','choose race','which race'], answer: "Your race (or species in newer books) gives you starting traits: ability score bonuses, special abilities, size, speed, and sometimes darkvision. Popular picks: Humans get a feat at level 1 (very versatile), Elves get darkvision and advantage against charm, Dwarves are tough with extra HP and poison resistance, Halflings are lucky (reroll natural 1s), Tieflings get fire resistance and free spells. The 'best' race depends on your class and what sounds fun to you. With newer rules, you can put ability bonuses wherever you want regardless of race, so pick whatever appeals to you thematically." },
  { keys: ['class','choose class','which class','best class','classes'], answer: "Each class has a unique identity: Fighter (versatile warrior, easy to learn, great for beginners), Rogue (sneaky, big damage, skill expert), Wizard (powerful spells, fragile body, complex), Cleric (healer and support, tough with armor), Ranger (nature warrior, tracking, archery), Paladin (holy knight, healer + fighter), Barbarian (rage-powered tank, simple to play), Bard (jack of all trades, great at social situations), Druid (shapeshifter, nature spells), Warlock (pact magic, customizable), Sorcerer (innate magic, metamagic), Monk (martial artist, fast). For first-timers: Fighter, Barbarian, or Rogue are easiest to learn." },
  { keys: ['initiative','turn order','surprise','who goes first'], answer: "When combat starts, everyone rolls Initiative — that's a Dexterity check (d20 + Dex modifier). Higher rolls go first. The DM tracks the order and everyone takes turns in that order, round after round, until combat ends. If you ambush enemies and they don't notice you, the DM may grant a Surprise round — surprised creatures can't move or take actions on their first turn, and they can't take reactions until that turn ends. Dexterity is valuable because going first lets you act before enemies. Some features let you add bonuses to initiative (like the Alert feat, which gives +5)." },
  { keys: ['rest','short rest','long rest','recover','heal between'], answer: "Short rests take 1 hour. You can spend Hit Dice to heal (roll them + Con modifier, recover HP). Some class features recharge on short rests (like Warlock spell slots and Fighter's Action Surge). Long rests take 8 hours (at least 6 sleeping, 2 light activity). You regain ALL hit points, half your max Hit Dice (rounded down), and all spell slots and class features. You can only benefit from one long rest per 24 hours. Tip: don't skip short rests — they keep your party healthy without burning spell slots." },
  { keys: ['death','dying','death save','unconscious','death saving throw','down','knocked out'], answer: "When you hit 0 HP, you fall unconscious and start making Death Saving Throws at the start of each of your turns. Roll a d20: 10+ is a success, 9 or lower is a failure. Three successes = you stabilize (alive at 0 HP). Three failures = your character dies. A natural 20 = you regain 1 HP and wake up! A natural 1 counts as TWO failures. If someone heals you while you're down, you wake up immediately and your death saves reset. Taking damage while at 0 HP counts as a failed death save (a critical hit counts as two). Healing Word is amazing here because a cleric can bring you back from across the room as a bonus action." }
];

function findOracleAnswer(question) {
  const q = question.toLowerCase();
  let bestMatch = null, bestScore = 0;
  for (const entry of ORACLE_KB) {
    let score = 0;
    for (const key of entry.keys) {
      if (q.includes(key.toLowerCase())) score += key.length;
    }
    if (score > bestScore) { bestScore = score; bestMatch = entry; }
  }
  if (bestMatch && bestScore > 0) return bestMatch.answer;
  const fallbacks = [
    "That's a great question! While The Oracle's full knowledge requires a connection to the astral plane (AI server), here's a general tip: the D&D Player's Handbook (PHB) is your best friend. Chapters 7-10 cover combat, spellcasting, and adventuring rules. You can also search 'D&D 5e [your question]' online — the community is incredibly helpful. Don't be afraid to ask your DM during the game too — that's what they're there for.",
    "The Oracle senses this question touches on something specific. For the deepest answers, the AI-powered version of The Oracle can help (requires the server to be running). In the meantime: talk to your DM, check the Player's Handbook, or visit D&D Beyond (dndbeyond.com) for free basic rules. The D&D community on Reddit (r/DnD and r/dndnext) is also great for getting answers.",
    "Hmm, that's a nuanced question. The Oracle's static knowledge covers the most common topics, but for specialized questions, the AI-powered mode (server required) provides personalized answers. For now: the core rules are available free at dndbeyond.com, and your DM is always the final authority on how things work at your table. Remember — if you're unsure, just describe what you want to do, and your DM will guide you through the mechanics."
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  if (sendBtn) sendBtn.disabled = true;
  appendUserMessage(text);
  chatHistory.push({ role: 'user', content: text });
  const starters = document.getElementById('chat-starters');
  if (starters) starters.classList.add('hidden');
  const msgId = 'msg-' + Date.now();
  appendOracleMessage('', msgId);
  const answer = findOracleAnswer(text);
  let displayed = '';
  const words = answer.split(' ');
  for (let i = 0; i < words.length; i++) {
    displayed += (i > 0 ? ' ' : '') + words[i];
    updateOracleMessage(msgId, displayed);
    scrollChatToBottom();
    await new Promise(r => setTimeout(r, 18 + Math.random() * 22));
  }
  chatHistory.push({ role: 'assistant', content: answer });
  if (sendBtn) sendBtn.disabled = false;
  scrollChatToBottom();
}

// ============================================================
// UPGRADE 4: CHARACTER LIBRARY
// ============================================================

const CATCHPHRASE_TEMPLATES = {
  witch: [
    "I didn't hex you. I merely... suggested your fate.",
    "My broom is faster than your horse and twice as judgemental.",
    "I turned someone into a toad once. They seemed happier honestly.",
    "Cackle now, apologize later.",
    "The cauldron doesn't lie. Unfortunately."
  ],
  plate: [
    "I once used my helmet as a soup bowl. No regrets.",
    "My armor has more dents than my enemies have excuses.",
    "Charging in is a valid strategy. I have data.",
    "I'm not reckless. I'm aggressively optimistic.",
    "My battle cry is mostly just the sound of clanking."
  ],
  robe: [
    "I read the prophecy. I have notes.",
    "The scroll said danger. I brought snacks anyway.",
    "Technically I'm helping. The spell just has... side effects.",
    "I didn't start the fire. Probably.",
    "Magic is just physics that hasn't been peer reviewed yet."
  ],
  ranger: [
    "I've tracked things that didn't want to be found. They were found.",
    "The forest whispers secrets. Most of them are about you.",
    "My arrows don't miss. My aim just has strong opinions.",
    "I've eaten worse. I think.",
    "Nature is peaceful once you stop making it angry."
  ],
  mail: [
    "I have exactly one plan. It's currently on fire.",
    "Chainmail chafes but so does losing.",
    "I've survived worse. Technically.",
    "The best armor is getting hit slightly less than everyone else.",
    "They said I was reckless. I prefer 'aerodynamically brave'."
  ],
  noble: [
    "I have standards. They're just... flexible in a dungeon.",
    "My tailor has never forgiven me. Rightfully.",
    "I negotiated my way out of three ambushes. The fourth one I just looked expensive at.",
    "Etiquette matters even when someone is pointing a crossbow at you. Especially then.",
    "The puffed sleeves are functional. Don't ask how."
  ],
  tiefling: [
    "Yes, these are real horns. No, they're not available for touching.",
    "My tail has better instincts than most party members.",
    "Infernal heritage is just spicy ancestry.",
    "I'm not cursed. I'm... uniquely enchanted.",
    "Every prophecy eventually gets around to blaming someone like me."
  ],
  elf: [
    "I've watched kingdoms rise and fall. This tavern brawl is somehow worse.",
    "I'm not condescending. I'm historically informed.",
    "I remember when this forest was actually a forest.",
    "Sleep is for people with shorter lifespans.",
    "Thousands of years of experience and I still walked into that trap."
  ],
  dwarf: [
    "The mountain remembers. So do I. Mostly grudges.",
    "This axe has a name. So does the grudge it was made for.",
    "Short in stature, tall in complaints.",
    "I didn't lose. I strategically retreated into a wall.",
    "Ale is just liquid courage with better marketing."
  ],
  default: [
    "I'm not lost. I'm on an unscheduled adventure.",
    "The plan was better in my head.",
    "I rolled a 3 on my perception check for life choices.",
    "In my defense, the dice agreed with me.",
    "Technically nothing has exploded. Yet."
  ]
};

function generateCatchphrases(state) {
  const armor = state.armor || 'robe';
  const race  = state.race  || 'human';
  const pool  = CATCHPHRASE_TEMPLATES[armor]
    || CATCHPHRASE_TEMPLATES[race]
    || CATCHPHRASE_TEMPLATES.default;
  // Pick 3 unique phrases shuffled
  const shuffled = pool.slice().sort(() => Math.random() - 0.5);
  const result = [];
  for (let i = 0; i < 3; i++) {
    result.push(shuffled[i % shuffled.length]);
  }
  return result;
}

function buildLibrarySection() {
  return `
  <section class="app-section library-section" id="section-char-library" aria-label="Character Library">
    <div class="section-header">
      <div class="section-eyebrow">Your Collection</div>
      <h2>Character Library</h2>
      <p>Save and revisit your characters. Each one gets a catchphrase worthy of a legend.</p>
    </div>
    <div class="library-cards" id="library-cards">
      <div class="library-empty" id="library-empty">
        <p>No characters saved yet. Build one above and hit <strong>💾 Save to Library</strong>.</p>
      </div>
    </div>
  </section>`;
}

function getLibrary() {
  try {
    return JSON.parse(localStorage.getItem('dnd_char_library') || '[]');
  } catch (e) {
    return [];
  }
}

function saveLibrary(chars) {
  try {
    localStorage.setItem('dnd_char_library', JSON.stringify(chars));
  } catch (e) {}
}

function saveCharacter() {
  // Ensure archetype is populated from DOM if not yet set
  if (!avatarState.archetype) {
    const topCard2 = document.querySelector('.archetype-card.top-pick') || document.querySelector('.archetype-card');
    if (topCard2) {
      const n2 = topCard2.querySelector('.archetype-class-name')?.textContent?.trim() || topCard2.querySelector('h3')?.textContent?.trim();
      const i2 = topCard2.querySelector('.archetype-class-icon')?.textContent?.trim();
      if (n2) { avatarState.archetype = n2; avatarState.archetypeIcon = i2 || ''; }
    }
  }
  const nameInput    = document.getElementById('avatar-name-input');
  const creatorInput = document.getElementById('avatar-creator-input');
  const charName     = (nameInput    ? nameInput.value.trim()    : '') || 'Unnamed Hero';
  const creatorName  = (creatorInput ? creatorInput.value.trim() : '') || 'Unknown Player';

  const catchphrases = generateCatchphrases(avatarState);

  const char = {
    id: Date.now(),
    name: charName,
    creatorName: creatorName,
    avatarState: JSON.parse(JSON.stringify(avatarState)),
    catchphrases: catchphrases,
    catchphraseIdx: 0,
    savedAt: new Date().toISOString()
  };

  const lib = getLibrary();
  lib.unshift(char);
  saveLibrary(lib);
  renderLibrary();

  // Flash confirmation
  const flash = document.getElementById('save-flash');
  const btn   = document.getElementById('avatar-save-btn');
  if (flash) { flash.style.display = 'inline'; setTimeout(() => { flash.style.display = 'none'; }, 2200); }
  if (btn)   { btn.textContent = '✓ Saved!'; setTimeout(() => { btn.textContent = '💾 Save to Library'; }, 2200); }
}

function shuffleCatchphrase(charId) {
  const lib = getLibrary();
  const idx = lib.findIndex(c => c.id === charId);
  if (idx === -1) return;
  lib[idx].catchphraseIdx = ((lib[idx].catchphraseIdx || 0) + 1) % lib[idx].catchphrases.length;
  saveLibrary(lib);
  const el = document.getElementById(`cp-${charId}`);
  if (el) el.textContent = lib[idx].catchphrases[lib[idx].catchphraseIdx];
}

function removeCharacter(charId) {
  const lib = getLibrary().filter(c => c.id !== charId);
  saveLibrary(lib);
  renderLibrary();
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch(e) { return ''; }
}

function renderLibrary() {
  const container = document.getElementById('library-cards');
  const empty     = document.getElementById('library-empty');
  if (!container) return;

  const lib = getLibrary();

  if (lib.length === 0) {
    if (empty) empty.style.display = 'block';
    Array.from(container.children).forEach(c => { if (c !== empty) c.remove(); });
    return;
  }
  if (empty) empty.style.display = 'none';

  container.innerHTML = '';
  lib.forEach(char => {
    // Build avatar with unique IDs so multiple cards don't clash
    let svgHtml = buildAvatarSVG(char.avatarState);
    svgHtml = svgHtml.replace(/id="avatar-svg"/g, `id="avatar-svg-${char.id}"`)
                     .replace(/id="avatar-shadow"/g, `id="avatar-shadow-${char.id}"`)
                     .replace(/url\(#avatar-shadow\)/g, `url(#avatar-shadow-${char.id})`);
    const phrase  = char.catchphrases[char.catchphraseIdx || 0];
    const card    = document.createElement('div');
    card.className = 'library-card';
    card.id = `lib-card-${char.id}`;
    const archetypeHtml = char.avatarState.archetype
      ? `<div class="library-archetype-badge">${char.avatarState.archetypeIcon ? escapeHtmlChat(char.avatarState.archetypeIcon) + ' ' : ''}${escapeHtmlChat(char.avatarState.archetype)}</div>`
      : '';
    card.innerHTML = `
      <div class="library-card-avatar">${svgHtml}</div>
      <div class="library-char-name">${escapeHtmlChat(char.name)}</div>
      ${archetypeHtml}
      <div class="library-creator">Created by: ${escapeHtmlChat(char.creatorName)}</div>
      <div class="library-catchphrase" id="cp-${char.id}">${escapeHtmlChat(phrase)}</div>
      <div class="library-card-actions">
        <button class="btn-shuffle" onclick="shuffleCatchphrase(${char.id})">Shuffle ↻</button>
        <button class="btn-edit-char" onclick="openEditModal(${char.id})">✏️ Edit</button>
        <button class="btn-remove-char" onclick="removeCharacter(${char.id})">🗑 Remove</button>
      </div>
      <div class="library-save-date">${formatDate(char.savedAt)}</div>`;
    container.appendChild(card);
  });
}

// ============================================================
// CHARACTER EDIT MODAL
// ============================================================

const ARCHETYPE_LIST = [
  { key: 'wizard',   icon: '🧙', label: 'Wizard',          sub: 'School of Evocation',    desc: 'Master of arcane arts and explosive spells' },
  { key: 'fighter',  icon: '⚔️',  label: 'Fighter',         sub: 'Battle Master',           desc: 'Disciplined warrior with tactical prowess' },
  { key: 'rogue',    icon: '🗡️',  label: 'Rogue',           sub: 'Arcane Trickster',        desc: 'Cunning infiltrator with a touch of magic' },
  { key: 'cleric',   icon: '✨',  label: 'Life Cleric',     sub: 'Life Domain',             desc: 'Divine healer who protects allies' },
  { key: 'paladin',  icon: '🛡️',  label: 'Paladin',         sub: 'Oath of Devotion',        desc: 'Holy warrior bound by sacred oaths' },
  { key: 'ranger',   icon: '🌿',  label: 'Ranger',          sub: 'Beast Master',            desc: 'Skilled tracker with a loyal companion' },
  { key: 'monk',     icon: '🥊',  label: 'Monk',            sub: 'Way of the Open Hand',    desc: 'Swift martial artist channeling inner ki' },
  { key: 'witch',    icon: '🧙‍♀️',  label: 'Witch',           sub: 'Circle of Hexcraft',      desc: 'Dark spellcaster weaving curses and hexes' },
  { key: 'bard',     icon: '🎵',  label: 'Bard',            sub: 'College of Lore',         desc: 'Charismatic performer with inspiring magic' },
  { key: 'druid',    icon: '🌲',  label: 'Druid',           sub: 'Circle of the Moon',      desc: 'Nature mystic who shapeshifts into beasts' },
  { key: 'barbarian',icon: '💥',  label: 'Barbarian',       sub: 'Path of the Berserker',   desc: 'Fearless warrior who fights in a rage' },
  { key: 'warlock',  icon: '👀',  label: 'Warlock',         sub: 'The Great Old One',       desc: 'Pact-wielder drawing power from dark patrons' },
];

let _editCharId = null;
let _editAvatarState = null;

function openEditModal(charId) {
  const lib = getLibrary();
  const char = lib.find(c => c.id === charId);
  if (!char) return;

  _editCharId = charId;
  _editAvatarState = JSON.parse(JSON.stringify(char.avatarState));

  // Build or re-use modal
  let modal = document.getElementById('char-edit-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'char-edit-modal';
    modal.innerHTML = `
      <div class="cem-backdrop" onclick="closeEditModal()"></div>
      <div class="cem-panel">
        <div class="cem-header">
          <div class="cem-title">✏️ Edit Character</div>
          <button class="cem-close" onclick="closeEditModal()">×</button>
        </div>
        <div class="cem-body">
          <!-- Avatar preview -->
          <div class="cem-avatar-col">
            <div class="cem-avatar-wrap" id="cem-avatar-preview"></div>
            <div class="cem-avatar-archetype" id="cem-archetype-badge"></div>
          </div>
          <!-- Fields -->
          <div class="cem-fields-col">
            <label class="cem-label">Character Name</label>
            <input class="cem-input" id="cem-name" type="text" maxlength="40" placeholder="Enter name"/>
            <label class="cem-label">Created By</label>
            <input class="cem-input" id="cem-creator" type="text" maxlength="40" placeholder="Your name"/>
            <label class="cem-label" style="margin-top:18px">Archetype / Class</label>
            <div class="cem-archetype-grid" id="cem-archetype-grid"></div>
          </div>
        </div>
        <div class="cem-footer">
          <button class="cem-btn-cancel" onclick="closeEditModal()">Cancel</button>
          <button class="cem-btn-save" onclick="saveEditModal()">Save Changes</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  // Populate fields
  document.getElementById('cem-name').value = char.name;
  document.getElementById('cem-creator').value = char.creatorName;

  // Render archetype grid
  renderEditArchetypes(char.avatarState.archetype);

  // Render avatar preview
  renderEditAvatarPreview();

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderEditArchetypes(currentArchetype) {
  const grid = document.getElementById('cem-archetype-grid');
  if (!grid) return;
  grid.innerHTML = ARCHETYPE_LIST.map(a => {
    const isSelected = (currentArchetype || '').toLowerCase().includes(a.key)
                    || (currentArchetype || '').toLowerCase() === a.label.toLowerCase();
    return `<div class="cem-arch-chip ${isSelected ? 'selected' : ''}" 
                 onclick="selectEditArchetype('${a.key}', '${a.icon}', '${a.label}', '${a.sub}')" 
                 title="${a.desc}">
              <span class="cem-arch-icon">${a.icon}</span>
              <span class="cem-arch-name">${a.label}</span>
            </div>`;
  }).join('');
}

function selectEditArchetype(key, icon, label, sub) {
  // Update working avatar state
  _editAvatarState.archetype     = `${label} (${sub})`;
  _editAvatarState.archetypeIcon = icon;

  // Apply visual gear changes
  const archetypeMap = {
    'cleric':    { armor: 'robe',   weapon: 'staff', cloak: 'none',  extra: 'none'  },
    'fighter':   { armor: 'plate',  weapon: 'sword', cloak: 'short', extra: 'none'  },
    'monk':      { armor: 'robe',   weapon: 'staff', cloak: 'none',  extra: 'none'  },
    'rogue':     { armor: 'mail',   weapon: 'sword', cloak: 'short', extra: 'hood'  },
    'ranger':    { armor: 'ranger', weapon: 'bow',   cloak: 'short', extra: 'none'  },
    'wizard':    { armor: 'robe',   weapon: 'staff', cloak: 'long',  extra: 'hat'   },
    'paladin':   { armor: 'plate',  weapon: 'sword', cloak: 'long',  extra: 'crown' },
    'witch':     { armor: 'witch',  weapon: 'broom', cloak: 'tattered', extra: 'hat' },
    'bard':      { armor: 'robe',   weapon: 'staff', cloak: 'short', extra: 'none'  },
    'druid':     { armor: 'ranger', weapon: 'staff', cloak: 'long',  extra: 'none'  },
    'barbarian': { armor: 'plate',  weapon: 'sword', cloak: 'none',  extra: 'none'  },
    'warlock':   { armor: 'robe',   weapon: 'staff', cloak: 'long',  extra: 'none'  },
  };
  const preset = archetypeMap[key];
  if (preset) {
    _editAvatarState.armor  = preset.armor;
    _editAvatarState.weapon = preset.weapon;
    _editAvatarState.cloak  = preset.cloak;
    _editAvatarState.extra  = preset.extra;
  }

  // Highlight selected chip
  document.querySelectorAll('.cem-arch-chip').forEach(el => el.classList.remove('selected'));
  // Find clicked chip by key match
  document.querySelectorAll('.cem-arch-chip').forEach(el => {
    if (el.textContent.trim().includes(label)) el.classList.add('selected');
  });

  // Update badge
  const badge = document.getElementById('cem-archetype-badge');
  if (badge) badge.textContent = `${icon} ${label} \u2022 ${sub}`;

  // Re-render preview
  renderEditAvatarPreview();
}

function renderEditAvatarPreview() {
  const wrap = document.getElementById('cem-avatar-preview');
  if (!wrap || !_editAvatarState) return;
  let svgHtml = buildAvatarSVG(_editAvatarState);
  svgHtml = svgHtml.replace(/id="avatar-svg"/g, 'id="cem-avatar-svg"')
                   .replace(/id="avatar-shadow"/g, 'id="cem-avatar-shadow"')
                   .replace(/url\(#avatar-shadow\)/g, 'url(#cem-avatar-shadow)');
  wrap.innerHTML = svgHtml;

  // Show archetype badge if set
  const badge = document.getElementById('cem-archetype-badge');
  if (badge && _editAvatarState.archetype) {
    badge.textContent = `${_editAvatarState.archetypeIcon || ''} ${_editAvatarState.archetype}`;
  }
}

function saveEditModal() {
  const nameVal    = (document.getElementById('cem-name')?.value    || '').trim() || 'Unnamed Hero';
  const creatorVal = (document.getElementById('cem-creator')?.value || '').trim() || 'Unknown Player';

  const lib = getLibrary();
  const idx = lib.findIndex(c => c.id === _editCharId);
  if (idx === -1) { closeEditModal(); return; }

  lib[idx].name        = nameVal;
  lib[idx].creatorName = creatorVal;
  lib[idx].avatarState = JSON.parse(JSON.stringify(_editAvatarState));
  // Regenerate catchphrases to match new archetype
  lib[idx].catchphrases   = generateCatchphrases(_editAvatarState);
  lib[idx].catchphraseIdx = 0;

  saveLibrary(lib);
  renderLibrary();
  closeEditModal();
}

function closeEditModal() {
  const modal = document.getElementById('char-edit-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  _editCharId = null;
  _editAvatarState = null;
}

// ============================================================
// ACTIVE CHARACTER SYSTEM
// ============================================================

const ACTIVE_CHAR_KEY = 'dnd_active_char_id';

function getActiveCharId() {
  try { return parseInt(localStorage.getItem(ACTIVE_CHAR_KEY)) || null; } catch(e) { return null; }
}
function setActiveCharId(id) {
  try {
    if (id == null) localStorage.removeItem(ACTIVE_CHAR_KEY);
    else localStorage.setItem(ACTIVE_CHAR_KEY, String(id));
  } catch(e) {}
}
function getActiveChar() {
  const id = getActiveCharId();
  if (!id) return null;
  return getLibrary().find(c => c.id === id) || null;
}

// ── Archetype-flavored feedback lines ──────────────────────
const ARCHETYPE_FLAVOR = {
  wizard:    [
    'name analyzes the situation with scholarly precision — exactly what a Wizard does.',
    'name\'s arcane training makes this the natural call. Knowledge is power.',
    'A classic Wizard move from name: think first, act decisively.'
  ],
  fighter:   [
    'name steps up without hesitation. Fighters lead from the front.',
    'name\'s battle instincts kick in — direct, disciplined, effective.',
    'That\'s the Fighter in name — never backs down from a clear challenge.'
  ],
  rogue:     [
    'name reads the angles others miss. Rogues always have an exit plan.',
    'Cunning move from name — Rogues know information is the real weapon.',
    'name plays it smart. That\'s the Rogue way: work smarter, not harder.'
  ],
  cleric:    [
    'name leads with empathy and divine purpose — true to the Cleric path.',
    'The party needed guidance and name answered. That\'s a Cleric\'s calling.',
    'name\'s faith guides this decision. Clerics know healing means more than hit points.'
  ],
  paladin:   [
    'name stands by their oath. Paladins don\'t waver when it matters most.',
    'name chooses honor — even when it\'s hard. That\'s the Paladin code.',
    'A Paladin\'s strength isn\'t just in the sword. name proves that here.'
  ],
  ranger:    [
    'name scouts the terrain and acts. Rangers read situations like maps.',
    'Patient and precise — that\'s name\'s Ranger instinct showing.',
    'name trusts their survival instincts. Rangers have seen worse odds.'
  ],
  monk:      [
    'name finds balance even in chaos. Monks center themselves before striking.',
    'Discipline shapes name\'s choice — the Monk way is clarity under pressure.',
    'name doesn\'t act from fear or rage. That\'s what Monk training builds.'
  ],
  witch:     [
    'name weaves mystery into every move. Witches see angles others never consider.',
    'Unpredictable and sharp — name plays this like the Witch they are.',
    'name knows when to hex and when to wait. Patience is a Witch\'s power.'
  ],
  bard:      [
    'name knows that words can change minds faster than swords. Classic Bard.',
    'name reads the room perfectly. Bards always know what the moment needs.',
    'That\'s the Bard in name — turn any situation into a story worth telling.'
  ],
  druid:     [
    'name feels the natural flow of this situation and acts with it.',
    'Druids like name know: force rarely beats understanding.',
    'name listens before acting. That\'s the Druid patience in practice.'
  ],
  barbarian: [
    'name channels pure conviction into this choice. Barbarians commit fully.',
    'No hesitation, no half-measures — name brings Barbarian intensity to everything.',
    'name\'s rage isn\'t just anger — it\'s focus. Barbarians know the difference.'
  ],
  warlock:   [
    'name plays the long game. Warlocks understand that power has a price.',
    'Calculated and bold — name\'s patron would approve of this choice.',
    'name sees the deal beneath the surface. Warlocks always do.'
  ],
};

function getArchetypeFlavor(char, choiceType) {
  if (!char || !char.avatarState.archetype) return null;
  const arch = char.avatarState.archetype.toLowerCase();
  let pool = null;
  for (const [key, lines] of Object.entries(ARCHETYPE_FLAVOR)) {
    if (arch.includes(key)) { pool = lines; break; }
  }
  if (!pool) return null;
  const line = pool[Math.floor(Math.random() * pool.length)];
  return line.replace(/name/g, `<strong>${escapeHtmlChat(char.name)}</strong>`);
}

// renderLibrary is patched inside initUpgrades after all functions are defined

function refreshLibraryActiveStates() {
  const activeId = getActiveCharId();
  document.querySelectorAll('.library-card').forEach(card => {
    const idMatch = card.id.match(/lib-card-(\d+)/);
    if (!idMatch) return;
    const id = parseInt(idMatch[1]);
    const isActive = id === activeId;
    card.classList.toggle('char-active', isActive);

    // Inject or update Play As button
    let playBtn = card.querySelector('.btn-play-as');
    if (!playBtn) {
      const actions = card.querySelector('.library-card-actions');
      if (actions) {
        playBtn = document.createElement('button');
        playBtn.className = 'btn-play-as';
        playBtn.onclick = () => activateCharacter(id);
        actions.prepend(playBtn);
      }
    }
    if (playBtn) {
      playBtn.textContent = isActive ? '✦ Playing' : '▶ Play As';
      playBtn.classList.toggle('active-play-btn', isActive);
      playBtn.onclick = () => activateCharacter(id);
    }

    // Show/remove active banner inside card
    let banner = card.querySelector('.char-active-banner');
    if (isActive) {
      if (!banner) {
        banner = document.createElement('div');
        banner.className = 'char-active-banner';
        banner.textContent = '✦ Active Character';
        card.prepend(banner);
      }
    } else {
      if (banner) banner.remove();
    }
  });
}

function activateCharacter(id) {
  const currentId = getActiveCharId();
  // Toggle: clicking active char deactivates it
  if (currentId === id) {
    setActiveCharId(null);
  } else {
    setActiveCharId(id);
  }
  refreshLibraryActiveStates();
  // If simulator is open, refresh its header
  if (document.getElementById('section-simulator')?.classList.contains('active')) {
    renderSimulatorCharBanner();
  }
}

// ── Simulator character banner ─────────────────────────────
function renderSimulatorCharBanner() {
  const sim = document.getElementById('section-simulator');
  if (!sim) return;

  // Remove old banner
  const old = document.getElementById('sim-char-banner');
  if (old) old.remove();

  const lib = getLibrary();
  const char = getActiveChar();

  const banner = document.createElement('div');
  banner.id = 'sim-char-banner';

  if (lib.length === 0) {
    // No characters at all — gate: build prompt
    banner.className = 'sim-char-gate';
    banner.innerHTML = `
      <div class="sim-gate-icon">🧙</div>
      <div class="sim-gate-text">
        <div class="sim-gate-title">Create Your Character First</div>
        <div class="sim-gate-sub">The simulator gives you personalized feedback based on who you are. Build your character to unlock it.</div>
      </div>
      <button class="sim-gate-btn" onclick="navigateTo('builder')">Build My Character →</button>`;
    // Hide scenario grid and show gate instead
    _setSimGateVisible(banner, true);
    return;
  }

  if (!char) {
    // Library exists but no active char — select prompt
    banner.className = 'sim-char-gate';
    // Build mini selector: first 4 chars as clickable chips
    const chips = lib.slice(0, 6).map(c => {
      let svgMini = buildAvatarSVG(c.avatarState)
        .replace(/id="avatar-svg"/g, `id="sc-mini-svg-${c.id}"`)
        .replace(/id="avatar-shadow"/g, `id="sc-mini-shadow-${c.id}"`)
        .replace(/url\(#avatar-shadow\)/g, `url(#sc-mini-shadow-${c.id})`);
      return `<div class="sim-char-chip" onclick="activateCharacterFromSim(${c.id})">
                <div class="sim-chip-avatar">${svgMini}</div>
                <div class="sim-chip-name">${escapeHtmlChat(c.name)}</div>
                ${c.avatarState.archetype ? `<div class="sim-chip-arch">${c.avatarState.archetypeIcon || ''} ${escapeHtmlChat(c.avatarState.archetype.split('(')[0].trim())}</div>` : ''}
              </div>`;
    }).join('');
    banner.innerHTML = `
      <div class="sim-gate-icon">⚔️</div>
      <div class="sim-gate-text">
        <div class="sim-gate-title">Who's Playing?</div>
        <div class="sim-gate-sub">Choose a character — the simulator will tailor feedback to your archetype and playstyle.</div>
      </div>
      <div class="sim-char-chips">${chips}</div>
      <button class="sim-gate-btn-ghost" onclick="_skipCharGate()">Play without a character</button>`;
    _setSimGateVisible(banner, true);
    return;
  }

  // Active character — show banner
  banner.className = 'sim-char-active-bar';
  let svgBanner = buildAvatarSVG(char.avatarState)
    .replace(/id="avatar-svg"/g, 'id="sc-bar-svg"')
    .replace(/id="avatar-shadow"/g, 'id="sc-bar-shadow"')
    .replace(/url\(#avatar-shadow\)/g, 'url(#sc-bar-shadow)');
  const archText = char.avatarState.archetype
    ? `${char.avatarState.archetypeIcon || ''} ${char.avatarState.archetype}`
    : 'No class set';
  banner.innerHTML = `
    <div class="sim-bar-avatar">${svgBanner}</div>
    <div class="sim-bar-info">
      <div class="sim-bar-name">${escapeHtmlChat(char.name)}</div>
      <div class="sim-bar-arch">${escapeHtmlChat(archText)}</div>
      <div class="sim-bar-label">Playing as this character</div>
    </div>
    <button class="sim-bar-change" onclick="_openCharSwitcher()">Switch Character</button>`;
  _setSimGateVisible(banner, false);
}

function _setSimGateVisible(banner, isGate) {
  const sim = document.getElementById('section-simulator');
  if (!sim) return;
  const header = sim.querySelector('.section-header');
  if (header) sim.insertBefore(banner, header.nextSibling);
  else sim.prepend(banner);

  const grid = document.getElementById('scenario-grid');
  const active = document.getElementById('active-scenario');
  if (isGate) {
    if (grid) grid.style.display = 'none';
    if (active) active.classList.remove('visible');
  } else {
    if (grid) grid.style.display = 'grid';
  }
}

function activateCharacterFromSim(id) {
  setActiveCharId(id);
  refreshLibraryActiveStates();
  renderSimulatorCharBanner();
  // Now show the grid
  const grid = document.getElementById('scenario-grid');
  if (grid) grid.style.display = 'grid';
}

function _skipCharGate() {
  // Allow playing without selecting — just remove gate
  const gate = document.getElementById('sim-char-banner');
  if (gate) gate.remove();
  const grid = document.getElementById('scenario-grid');
  if (grid) grid.style.display = 'grid';
}

function _openCharSwitcher() {
  // Temporarily clear active char to show selector
  setActiveCharId(null);
  refreshLibraryActiveStates();
  renderSimulatorCharBanner();
}

// ── Standalone character feedback injector (called after makeChoiceEnhanced)
function injectCharFeedback(scenarioId, choiceIndex) {
  const char = getActiveChar();
  if (!char) return;

  const resultPanel = document.getElementById('choice-result-panel');
  if (!resultPanel) return;

  const sc = window.SCENARIOS ? SCENARIOS.find(s => s.id === scenarioId) : null;
  const choice = sc ? sc.choices[choiceIndex] : null;
  const choiceType = choice ? choice.type : 'neutral';

  const flavorLine = getArchetypeFlavor(char, choiceType);
  const arch = char.avatarState.archetype || 'Adventurer';
  const icon = char.avatarState.archetypeIcon || '⚔️';
  const archShort = arch.split('(')[0].trim();

  let feedback = resultPanel.querySelector('.sim-char-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'sim-char-feedback';
    const outcomeCards = resultPanel.querySelector('.outcome-cards');
    const resetBtn = resultPanel.querySelector('.result-reset');
    if (outcomeCards) outcomeCards.after(feedback);
    else if (resetBtn) resetBtn.before(feedback);
    else resultPanel.appendChild(feedback);
  }

  let svgMini = buildAvatarSVG(char.avatarState)
    .replace(/id="avatar-svg"/g, 'id="scf-svg"')
    .replace(/id="avatar-shadow"/g, 'id="scf-shadow"')
    .replace(/url\(#avatar-shadow\)/g, 'url(#scf-shadow)');

  feedback.innerHTML = `
    <div class="scf-header">
      <div class="scf-avatar">${svgMini}</div>
      <div class="scf-identity">
        <div class="scf-name">${escapeHtmlChat(char.name)}</div>
        <div class="scf-arch">${escapeHtmlChat(icon)} ${escapeHtmlChat(archShort)}</div>
      </div>
      <div class="scf-label">Character Feedback</div>
    </div>
    ${flavorLine ? `<p class="scf-flavor">${flavorLine}</p>` : ''}
    <p class="scf-coaching">As <strong>${escapeHtmlChat(archShort)}</strong>, this choice aligns with your playstyle. Use moments like this to define how <strong>${escapeHtmlChat(char.name)}</strong> sees the world.</p>`;
}

// All simulator/library patches wired inside initUpgrades() below

// ============================================================
// UPGRADE 5: QUIZ EXPANSION (Q5 + Q6, 6 total)
// ============================================================

function injectQuizExtensions() {
  const quiz = document.getElementById('builder-quiz');
  if (!quiz) return;

  // Add 2 extra progress dots (currently 4 exist: qstep-0 to qstep-3)
  const dotRow = quiz.querySelector('.quiz-progress-row');
  if (dotRow) {
    const dot4 = document.createElement('div');
    dot4.className = 'quiz-step-dot';
    dot4.id = 'qstep-4';
    dotRow.appendChild(dot4);
    const dot5 = document.createElement('div');
    dot5.className = 'quiz-step-dot';
    dot5.id = 'qstep-5';
    dotRow.appendChild(dot5);
  }

  // Update "Question X of 4" text to "of 6" in existing blocks
  quiz.querySelectorAll('.quiz-title').forEach(el => {
    el.textContent = el.textContent.replace('of 4', 'of 6');
  });

  // Nav buttons container
  const navRow = quiz.querySelector('div[style*="display:flex"]') || quiz.querySelector('div[style*="gap:10px"]');

  // Build Q5 and Q6 blocks
  const q5Html = `
    <div class="quiz-question-block hidden" id="q-block-4">
      <div class="quiz-title">Question 5 of 6</div>
      <div class="quiz-question">What's your character's origin story?</div>
      <div class="quiz-options">
        <label class="quiz-opt" data-q="4" data-v="0" onclick="handleQuizOption(4,0)">
          <div class="opt-label">Grew Up in a Temple</div>
          <div class="opt-desc">Faith, ritual, and devotion shaped every year of your life</div>
        </label>
        <label class="quiz-opt" data-q="4" data-v="1" onclick="handleQuizOption(4,1)">
          <div class="opt-label">Trained by a Master Warrior</div>
          <div class="opt-desc">Discipline, combat, and the weight of a sworn blade</div>
        </label>
        <label class="quiz-opt" data-q="4" data-v="2" onclick="handleQuizOption(4,2)">
          <div class="opt-label">Lived on the Streets</div>
          <div class="opt-desc">Survival, cunning, and learning to trust no one — then everyone</div>
        </label>
        <label class="quiz-opt" data-q="4" data-v="3" onclick="handleQuizOption(4,3)">
          <div class="opt-label">Cursed or Chosen</div>
          <div class="opt-desc">Something ancient touched you. You didn't ask for it. You can't undo it.</div>
        </label>
      </div>
    </div>`;

  const q6Html = `
    <div class="quiz-question-block hidden" id="q-block-5">
      <div class="quiz-title">Question 6 of 6</div>
      <div class="quiz-question">Pick your vibe</div>
      <div class="quiz-options">
        <label class="quiz-opt" data-q="5" data-v="0" onclick="handleQuizOption(5,0)">
          <div class="opt-label">Ancient, Wise, Mysterious</div>
          <div class="opt-desc">Your knowledge predates kingdoms. Your silence speaks volumes.</div>
        </label>
        <label class="quiz-opt" data-q="5" data-v="1" onclick="handleQuizOption(5,1)">
          <div class="opt-label">Bold, Fierce, Unstoppable</div>
          <div class="opt-desc">You don't walk into rooms. You arrive. Everything responds.</div>
        </label>
        <label class="quiz-opt" data-q="5" data-v="2" onclick="handleQuizOption(5,2)">
          <div class="opt-label">Witchy and Chaotic</div>
          <div class="opt-desc">The rules were written before you arrived. They haven't caught up.</div>
        </label>
        <label class="quiz-opt" data-q="5" data-v="3" onclick="handleQuizOption(5,3)">
          <div class="opt-label">Swift, Clever, Sneaky</div>
          <div class="opt-desc">They'll wonder what happened. You'll already be gone.</div>
        </label>
      </div>
    </div>`;

  if (navRow) {
    navRow.insertAdjacentHTML('beforebegin', q5Html);
    navRow.insertAdjacentHTML('beforebegin', q6Html);
  } else {
    quiz.insertAdjacentHTML('beforeend', q5Html);
    quiz.insertAdjacentHTML('beforeend', q6Html);
  }

  // Install patched quizNext for 6 steps (picked up by index.html's quizNext dispatcher)
  window._patchedQuizNext = function() {
    const cur = window.quizCurrentStep;
    if (window.quizAnswers[cur] === undefined) return;
    if (cur < 5) {
      showQuizStep6(cur + 1);
    } else {
      window.runBuilderQuiz();
    }
  };

  // Also replace quizPrev to use showQuizStep6
  window.quizPrev = function() {
    if (window.quizCurrentStep > 0) showQuizStep6(window.quizCurrentStep - 1);
  };
}

function showQuizStep6(step) {
  // Show/hide all 6 blocks
  for (let i = 0; i < 6; i++) {
    const block = document.getElementById(`q-block-${i}`);
    if (block) block.classList.toggle('hidden', i !== step);
  }
  // Update all 6 dots
  for (let i = 0; i < 6; i++) {
    const dot = document.getElementById(`qstep-${i}`);
    if (dot) {
      dot.classList.remove('done', 'current');
      if (i < step)      dot.classList.add('done');
      else if (i === step) dot.classList.add('current');
    }
  }
  const prevBtn = document.getElementById('quiz-prev-btn');
  if (prevBtn) prevBtn.classList.toggle('hidden', step === 0);
  const nextBtn = document.getElementById('quiz-next-btn');
  if (nextBtn) {
    nextBtn.textContent = step === 5 ? 'See My Results →' : 'Next →';
    // Strict undefined check so selecting value=0 doesn't falsely disable Next
    nextBtn.disabled = (window.quizAnswers[step] === undefined || window.quizAnswers[step] === null);
  }
  window.quizCurrentStep = step;
}

// ============================================================
// QUIZ ANSWER → AVATAR VISUAL UPDATES (Q5 / Q6)
// ============================================================

function applyQ5ToAvatar(v) {
  if (v === 0) { avatarState.armor = 'robe';  }
  if (v === 1) { avatarState.armor = 'plate'; }
  if (v === 2) { avatarState.armor = 'mail';  }
  if (v === 3) { avatarState.race  = 'tiefling'; }
  updateAvatar();
}

function applyQ6ToAvatar(v) {
  if (v === 0) { avatarState.hairColor = '#c0c0c0'; avatarState.extra = 'hat'; }
  if (v === 1) { avatarState.armor = 'plate'; avatarState.weapon = 'sword'; }
  if (v === 2) { avatarState.armor = 'witch'; avatarState.weapon = 'broom'; avatarState.extra = 'hat'; }
  if (v === 3) { avatarState.armor = 'ranger'; avatarState.weapon = 'sword'; avatarState.cloak = 'short'; }
  updateAvatar();
}

// Patch handleQuizOption to also trigger avatar updates for Q5/Q6
function patchHandleQuizOption() {
  if (typeof window.handleQuizOption === 'function') {
    const _orig = window.handleQuizOption;
    window.handleQuizOption = function(q, v) {
      _orig.call(this, q, v);
      // Ensure window.quizAnswers is always updated (in case _orig uses local var)
      window.quizAnswers[q] = v;
      if (q === 4) applyQ5ToAvatar(v);
      if (q === 5) applyQ6ToAvatar(v);
    };
  }
}

// ============================================================
// QUIZ SCORING — PATCH runBuilderQuiz TO HANDLE Q5 + Q6
// ============================================================

function patchRunBuilderQuiz() {
  if (typeof window.runBuilderQuiz === 'function') {
    const _origRun = window.runBuilderQuiz;
    window.runBuilderQuiz = function() {
      // Call original (handles q0-q3)
      _origRun.apply(this, arguments);

      // Add scores from Q5 (index 4) and Q6 (index 5)
      // We need to patch the score object — but since it's local to the original,
      // we re-run a lightweight extended scoring and re-sort the displayed cards.
      setTimeout(() => {
        // Extended scoring based on Q5 + Q6
        const q4 = window.quizAnswers[4];
        const q5 = window.quizAnswers[5];
        const extraScores = { cleric: 0, fighter: 0, monk: 0 };

        // Q5 scoring
        if (q4 === 0) { extraScores.cleric += 2; }
        if (q4 === 1) { extraScores.fighter += 2; }
        if (q4 === 2) { extraScores.monk += 2; }
        if (q4 === 3) { extraScores.cleric += 1; extraScores.monk += 1; }

        // Q6 scoring
        if (q5 === 0) { extraScores.cleric += 1; extraScores.monk += 1; }
        if (q5 === 1) { extraScores.fighter += 3; }
        if (q5 === 2) { extraScores.monk += 2; }
        if (q5 === 3) { extraScores.monk += 3; }

        // Update card ordering based on extra scores
        // The cards are already rendered; find top card title and apply avatar
        const topCard = document.querySelector('.archetype-card.top-pick') || document.querySelector('.archetype-card');
        if (topCard) {
          const titleEl    = topCard.querySelector('.archetype-class-name') || topCard.querySelector('.arch-title') || topCard.querySelector('h3');
          const subclassEl = topCard.querySelector('.archetype-subclass');
          const iconEl     = topCard.querySelector('.archetype-class-icon');
          if (titleEl) {
            const fullClass = (subclassEl ? subclassEl.textContent.trim() + ' ' : '') + titleEl.textContent.trim();
            applyArchetypeToAvatar(titleEl.textContent);
            // Store archetype in avatarState for library card display
            avatarState.archetype     = fullClass.trim();
            avatarState.archetypeIcon = iconEl ? iconEl.textContent.trim() : '';
            // Also push to avatar panel display if visible
            const archetypeDisplay = document.getElementById('avatar-archetype-display');
            if (archetypeDisplay) {
              archetypeDisplay.textContent = (avatarState.archetypeIcon ? avatarState.archetypeIcon + ' ' : '') + fullClass.trim();
              archetypeDisplay.style.display = 'block';
            }
          }
        }
        // Add a "Save to Library" prompt on the results panel if not already there
        const resultsPanel = document.getElementById('archetype-results');
        if (resultsPanel && !resultsPanel.querySelector('.results-save-prompt')) {
          const savePrompt = document.createElement('div');
          savePrompt.className = 'results-save-prompt';
          savePrompt.innerHTML = `
            <div style="margin-top:20px;padding:16px;background:var(--color-surface-2);border:1px solid var(--color-gold-dim);border-radius:var(--radius-lg);display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
              <span style="font-size:1.2rem">💾</span>
              <span style="font-family:var(--font-display);font-size:0.8rem;color:var(--color-gold);">Happy with your results?</span>
              <span style="font-size:0.82rem;color:var(--color-text-muted);flex:1;">Scroll up and save your character to the Library so you can come back to it.</span>
              <button onclick="navigateTo('char-library')" style="padding:6px 16px;background:var(--color-gold);color:#1a1208;border:none;border-radius:99px;font-family:var(--font-display);font-size:0.72rem;font-weight:700;cursor:pointer;letter-spacing:0.06em;">View Library →</button>
            </div>`;
          resultsPanel.appendChild(savePrompt);
        }
      }, 120);
    };
  }
}

// ============================================================
// ARCHETYPE → AVATAR MAPPING
// ============================================================

function applyArchetypeToAvatar(archetypeKey) {
  const archetypeMap = {
    'cleric':  { armor: 'robe',   weapon: 'staff', cloak: 'none',  extra: 'none'  },
    'fighter': { armor: 'plate',  weapon: 'sword', cloak: 'short', extra: 'none'  },
    'monk':    { armor: 'robe',   weapon: 'staff', cloak: 'none',  extra: 'none'  },
    'rogue':   { armor: 'mail',   weapon: 'sword', cloak: 'short', extra: 'hood'  },
    'ranger':  { armor: 'ranger', weapon: 'bow',   cloak: 'short', extra: 'none'  },
    'wizard':  { armor: 'robe',   weapon: 'staff', cloak: 'long',  extra: 'hat'   },
    'paladin': { armor: 'plate',  weapon: 'sword', cloak: 'long',  extra: 'crown' },
    'witch':   { armor: 'witch',  weapon: 'broom', cloak: 'tattered', extra: 'hat' }
  };

  let matched = null;
  const lk = (archetypeKey || '').toLowerCase();
  for (const [k, v] of Object.entries(archetypeMap)) {
    if (lk.includes(k)) { matched = v; break; }
  }

  if (matched) {
    avatarState.armor  = matched.armor;
    avatarState.weapon = matched.weapon;
    avatarState.cloak  = matched.cloak;
    avatarState.extra  = matched.extra;
    updateAvatar();
  }
}

// ============================================================
// FLOATING ORACLE BAR
// ============================================================

let oracleFloatOpen = false;
let oracleFloatHistory = []; // compact history for the float panel

function buildOracleFloat() {
  const el = document.createElement('div');
  el.id = 'oracle-float';
  el.innerHTML = `
    <div id="oracle-float-panel">
      <div class="oracle-float-header">
        <div class="oracle-float-header-icon">🔮</div>
        <div class="oracle-float-header-text">
          <strong>The Oracle</strong>
          <span>Ask anything about D&amp;D</span>
        </div>
        <div class="oracle-float-header-actions">
          <button class="oracle-float-hbtn" onclick="oracleOpenFullChat()" data-tooltip="Open full chat">&#8599;</button>
          <button class="oracle-float-hbtn" onclick="toggleOracleFloat()" data-tooltip="Close">&#10005;</button>
        </div>
      </div>
      <div class="oracle-float-messages" id="oracle-float-messages"></div>
      <div class="oracle-float-input-area">
        <textarea id="oracle-float-input" rows="1" placeholder="Ask the Oracle…" onkeydown="handleOracleFloatKey(event)"></textarea>
        <button id="oracle-float-send" onclick="sendOracleFloat()" title="Send">&#9654;</button>
      </div>
    </div>
    <button id="oracle-float-btn" onclick="toggleOracleFloat()" aria-label="Ask The Oracle">
      🔮
      <span class="oracle-btn-label">Ask The Oracle</span>
      <span id="oracle-unread-badge"></span>
    </button>
  `;
  document.body.appendChild(el);
}

function toggleOracleFloat() {
  oracleFloatOpen = !oracleFloatOpen;
  const panel = document.getElementById('oracle-float-panel');
  if (panel) panel.classList.toggle('open', oracleFloatOpen);
  // Clear unread badge
  const badge = document.getElementById('oracle-unread-badge');
  if (badge) badge.classList.remove('visible');
  if (oracleFloatOpen) {
    scrollOracleFloat();
    setTimeout(() => {
      const inp = document.getElementById('oracle-float-input');
      if (inp) inp.focus();
    }, 120);
  }
}

function scrollOracleFloat() {
  const msgs = document.getElementById('oracle-float-messages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function appendOracleFloatMsg(role, text, msgId) {
  const msgs = document.getElementById('oracle-float-messages');
  if (!msgs) return;
  const el = document.createElement('div');
  el.className = 'oracle-float-msg ' + (role === 'user' ? 'user' : 'oracle');
  if (msgId) el.id = msgId;
  if (role === 'user') {
    el.innerHTML = `<div class="oracle-float-msg-bubble">${escapeHtmlChat(text)}</div><div class="oracle-float-msg-avatar">🧙</div>`;
  } else {
    el.innerHTML = `<div class="oracle-float-msg-avatar">🔮</div><div class="oracle-float-msg-bubble">${text || '<span class="typing-indicator"><span></span><span></span><span></span></span>'}</div>`;
  }
  msgs.appendChild(el);
  scrollOracleFloat();
}

function updateOracleFloatMsg(msgId, text) {
  const el = document.getElementById(msgId);
  if (el) {
    const bubble = el.querySelector('.oracle-float-msg-bubble');
    if (bubble) bubble.textContent = text;
  }
}

function handleOracleFloatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendOracleFloat();
  }
}

async function sendOracleFloat() {
  const input = document.getElementById('oracle-float-input');
  const sendBtn = document.getElementById('oracle-float-send');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  input.style.height = '';
  if (sendBtn) sendBtn.disabled = true;

  // Make panel visible if it was closed
  if (!oracleFloatOpen) {
    oracleFloatOpen = true;
    const panel = document.getElementById('oracle-float-panel');
    if (panel) panel.classList.add('open');
  }

  appendOracleFloatMsg('user', text);
  oracleFloatHistory.push({ role: 'user', content: text });

  const msgId = 'ofmsg-' + Date.now();
  appendOracleFloatMsg('oracle', '', msgId);

  const answer = findOracleAnswer(text);
  let displayed = '';
  const words = answer.split(' ');
  for (let i = 0; i < words.length; i++) {
    displayed += (i > 0 ? ' ' : '') + words[i];
    updateOracleFloatMsg(msgId, displayed);
    scrollOracleFloat();
    await new Promise(r => setTimeout(r, 18 + Math.random() * 22));
  }

  oracleFloatHistory.push({ role: 'assistant', content: answer });

  // Also mirror into the main chat so history is consistent
  if (typeof appendUserMessage === 'function') appendUserMessage(text);
  const mainMsgId = 'sync-' + Date.now();
  if (typeof appendOracleMessage === 'function') appendOracleMessage(answer, mainMsgId);
  chatHistory.push({ role: 'user', content: text });
  chatHistory.push({ role: 'assistant', content: answer });
  const starters = document.getElementById('chat-starters');
  if (starters) starters.classList.add('hidden');

  if (sendBtn) sendBtn.disabled = false;

  // Show unread badge if panel is closed
  if (!oracleFloatOpen) {
    const badge = document.getElementById('oracle-unread-badge');
    if (badge) badge.classList.add('visible');
  }
}

function oracleOpenFullChat() {
  // Close float panel, navigate to full chat
  oracleFloatOpen = false;
  const panel = document.getElementById('oracle-float-panel');
  if (panel) panel.classList.remove('open');
  if (typeof navigateTo === 'function') navigateTo('coach-chat');
}

// ============================================================
// INIT UPGRADES
// ============================================================

function initUpgrades() {
  // ── UPGRADE 1: Builder split layout ──────────────────────
  const builderSection = document.getElementById('section-builder');
  if (builderSection) {
    const header  = builderSection.querySelector('.section-header');
    const quiz    = builderSection.querySelector('#builder-quiz');
    const results = builderSection.querySelector('#archetype-results');

    if (header && quiz && results) {
      const split = document.createElement('div');
      split.className = 'builder-split';

      const left  = document.createElement('div');
      left.className = 'builder-left';

      const right = document.createElement('div');
      right.className = 'builder-right';

      left.appendChild(quiz);
      left.appendChild(results);

      right.innerHTML = buildAvatarPanel();

      split.appendChild(left);
      split.appendChild(right);

      header.after(split);

      updateAvatar();
    }
  }

  // ── UPGRADE 5: Inject Q5 + Q6 into quiz ──────────────────
  injectQuizExtensions();
  patchHandleQuizOption();

  // ── Intercept archetype quiz completion ───────────────────
  patchRunBuilderQuiz();

  // ── UPGRADE 2: Patch makeChoice ───────────────────────────
  // Wrap makeChoiceEnhanced to also inject character feedback
  const _baseMakeChoice = makeChoiceEnhanced;
  window.makeChoice = function(scenarioId, choiceIndex) {
    _baseMakeChoice(scenarioId, choiceIndex);
    injectCharFeedback(scenarioId, choiceIndex);
  };

  // ── UPGRADE 3: Inject chat section ───────────────────────
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.insertAdjacentHTML('beforeend', buildChatSection());
    mainContent.insertAdjacentHTML('beforeend', buildLibrarySection());
  } else {
    const lastSection = document.querySelector('.app-section:last-of-type');
    if (lastSection) {
      lastSection.insertAdjacentHTML('afterend', buildChatSection());
      lastSection.insertAdjacentHTML('afterend', buildLibrarySection());
    }
  }

  // ── Nav items ─────────────────────────────────────────────
  function addNavItem(sectionId, icon, label) {
    const navList = document.querySelector('.nav-list')
      || document.querySelector('#sidebar nav')
      || document.querySelector('#sidebar ul');
    const navItem = document.createElement('div');
    navItem.className = 'nav-item';
    navItem.dataset.section = sectionId;
    navItem.setAttribute('onclick', `navigateTo('${sectionId}')`);
    navItem.innerHTML = `<span class="nav-icon">${icon}</span><span class="nav-label">${label}</span>`;
    if (navList) {
      navList.appendChild(navItem);
    } else {
      const navItems = document.querySelectorAll('.nav-item');
      if (navItems.length > 0) navItems[navItems.length - 1].after(navItem);
    }
  }

  addNavItem('coach-chat',   '💬', 'AI Coach');
  addNavItem('char-library', '📚', 'Library');

  // ── Patch navigateTo ──────────────────────────────────────
  if (typeof window.navigateTo === 'function') {
    const _origNavigateTo = window.navigateTo;
    window.navigateTo = function(section) {
      if (window.COACH_DATA && !window.COACH_DATA['coach-chat']) {
        window.COACH_DATA['coach-chat'] = {
          focus: "The Oracle answers any D&D question in plain language. No judgement, no jargon. Ask whatever you're too embarrassed to ask at the table.",
          options: [
            "Use the starter questions if you don't know where to begin — they cover the most common first-session confusions.",
            "Ask follow-up questions. The Oracle remembers the whole conversation.",
            "Come back between sessions with new questions as they arise."
          ],
          overthink: "There are no stupid questions here. The Oracle exists specifically for the questions you think are too basic.",
          freeze: "\"The Oracle — what does my character do when they're completely stuck?\"",
          contribute: "Every question you ask here is one less moment of confusion at the table. This is preparation that makes you a better player."
        };
      }
      _origNavigateTo.apply(this, arguments);
      // Toggle body class to hide float bar on coach-chat page
      document.body.classList.toggle('on-coach-chat', section === 'coach-chat');
      // Toggle body class for hub page (hides story sidebar chrome via CSS)
      document.body.classList.toggle('on-hub', section === 'hub');
    };
  }

  // ── Patch resetBuilder to clear q4/q5 ────────────────────
  if (typeof window.resetBuilder === 'function') {
    const _origReset = window.resetBuilder;
    window.resetBuilder = function() {
      _origReset.apply(this, arguments);
      // Clear all 6 answers
      for (let i = 0; i < 6; i++) delete window.quizAnswers[i];
      // Reset extra dots (Q5+Q6)
      for (let i = 4; i <= 5; i++) {
        const d = document.getElementById(`qstep-${i}`);
        if (d) { d.classList.remove('done','current'); }
        const b = document.getElementById(`q-block-${i}`);
        if (b) { b.classList.add('hidden'); b.querySelectorAll('.quiz-opt').forEach(o => o.classList.remove('selected')); }
      }
      // Reset archetype state
      avatarState.archetype = '';
      avatarState.archetypeIcon = '';
      const archetypeDisplay = document.getElementById('avatar-archetype-display');
      if (archetypeDisplay) { archetypeDisplay.textContent = ''; archetypeDisplay.style.display = 'none'; }
      // Remove save prompt if it exists
      const savePrompt = document.querySelector('.results-save-prompt');
      if (savePrompt) savePrompt.remove();
    };
  }

  // ── Build floating Oracle bar ────────────────────────────
  buildOracleFloat();

  // ── Render library on init ────────────────────────────────
  renderLibrary();


  // ── Active character system ────────────────────────────────────────────
  // Expose globals for HTML onclick attributes
  window.activateCharacter         = activateCharacter;
  window.activateCharacterFromSim  = activateCharacterFromSim;
  window._skipCharGate             = _skipCharGate;
  window._openCharSwitcher         = _openCharSwitcher;
  window.openEditModal             = openEditModal;
  window.closeEditModal            = closeEditModal;
  window.saveEditModal             = saveEditModal;
  window.selectEditArchetype       = selectEditArchetype;

  // Wrap renderScenarioGrid to prepend char banner each time
  if (typeof window.renderScenarioGrid === 'function') {
    const _rsgOrig = window.renderScenarioGrid;
    window.renderScenarioGrid = function() {
      _rsgOrig.apply(this, arguments);
      renderSimulatorCharBanner();
    };
  }

  // Extend navigateTo to refresh sim banner and library states
  const _navCurrent2 = window.navigateTo;
  if (typeof _navCurrent2 === 'function') {
    window.navigateTo = function(section) {
      _navCurrent2.apply(this, arguments);
      if (section === 'simulator') setTimeout(renderSimulatorCharBanner, 60);
      if (section === 'char-library') setTimeout(refreshLibraryActiveStates, 60);
    };
  }

  // Wrap global renderLibrary to always refresh active states
  const _rlBase = window.renderLibrary || renderLibrary;
  window.renderLibrary = function() {
    _rlBase.apply(this, arguments);
    refreshLibraryActiveStates();
  };

  // Initial active state refresh
  refreshLibraryActiveStates();

  console.log('[D&D Upgrades v2] Initialized: Avatar Customizer (chibi), New Armors/Weapons, Expression Picker, 6-Question Quiz, Character Library, Scene Animations, AI Coach Chat');
}

// ============================================================
// UPGRADE 6: CSS ADDITIONS (injected via <style>)
// ============================================================

(function injectLibraryStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* ── Library Section ─────────────────────────────────── */
    .library-section .library-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
      margin-top: 24px;
    }
    .library-empty {
      grid-column: 1/-1;
      color: var(--color-text-muted, #888);
      font-style: italic;
      text-align: center;
      padding: 2rem;
    }
    .library-card {
      background: var(--color-surface-2, #1a1a2e);
      border: 1px solid var(--color-border, #2a2a4a);
      border-radius: 14px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: border-color 0.2s, transform 0.2s;
    }
    .library-card:hover {
      border-color: var(--color-gold, #c9a84c);
      transform: translateY(-2px);
    }
    .library-card-avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 120px;
    }
    .library-card-avatar svg {
      max-height: 140px;
      width: auto;
    }
    .library-char-name {
      font-family: var(--font-display, 'Cinzel', serif);
      color: var(--color-gold, #c9a84c);
      font-size: 1.05rem;
      font-weight: 700;
      text-align: center;
      line-height: 1.2;
    }
    .library-creator {
      font-size: 0.72rem;
      color: var(--color-text-muted, #888);
      text-align: center;
    }
    .library-catchphrase {
      font-style: italic;
      color: #c9a84c;
      font-size: 0.82rem;
      text-align: center;
      line-height: 1.5;
      min-height: 2.8em;
    }
    .library-card-actions {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .btn-shuffle {
      background: rgba(201,168,76,0.15);
      border: 1px solid rgba(201,168,76,0.4);
      color: #c9a84c;
      border-radius: 20px;
      padding: 4px 12px;
      font-size: 0.78rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-shuffle:hover { background: rgba(201,168,76,0.28); }
    .btn-remove-char {
      background: transparent;
      border: 1px solid rgba(200,80,80,0.35);
      color: #c86060;
      border-radius: 20px;
      padding: 4px 12px;
      font-size: 0.78rem;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .btn-remove-char:hover { background: rgba(200,80,80,0.2); color: #e88080; }
    .library-save-date {
      font-size: 0.68rem;
      color: var(--color-text-faint, #555);
      text-align: center;
    }
    .library-archetype-badge {
      text-align: center;
      font-family: var(--font-display, 'Cinzel', serif);
      font-size: 0.72rem;
      letter-spacing: 0.06em;
      color: var(--color-gold, #c9a84c);
      background: rgba(201,168,76,0.1);
      border: 1px solid var(--color-gold-dim, #6b531e);
      border-radius: 99px;
      padding: 3px 10px;
      margin: -4px auto 2px;
      display: inline-block;
    }
    /* Archetype badge in avatar panel */
    .avatar-archetype-badge {
      font-family: var(--font-display, 'Cinzel', serif);
      font-size: 0.75rem;
      letter-spacing: 0.06em;
      color: var(--color-gold, #c9a84c);
      background: rgba(201,168,76,0.1);
      border: 1px solid var(--color-gold-dim, #6b531e);
      border-radius: 99px;
      padding: 4px 12px;
      text-align: center;
      margin-bottom: 2px;
    }
    /* ── Save Row ─────────────────────────────────────────── */
    .avatar-save-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 10px;
    }
    .avatar-creator-input {
      background: var(--color-surface-2, #1a1a2e);
      border: 1px solid var(--color-border, #2a2a4a);
      border-radius: 8px;
      color: var(--color-text, #e0ddd8);
      padding: 8px 12px;
      font-size: 0.85rem;
      width: 100%;
      box-sizing: border-box;
    }
    .avatar-creator-input::placeholder { color: var(--color-text-faint, #666); }
    .avatar-creator-input:focus { outline: none; border-color: var(--color-gold, #c9a84c); }
    .avatar-save-btn {
      background: linear-gradient(135deg, rgba(201,168,76,0.25), rgba(201,168,76,0.12));
      border: 1px solid rgba(201,168,76,0.5);
      color: #c9a84c;
      border-radius: 10px;
      padding: 10px 16px;
      font-size: 0.88rem;
      cursor: pointer;
      font-family: var(--font-display, 'Cinzel', serif);
      transition: background 0.2s, border-color 0.2s;
      width: 100%;
    }
    .avatar-save-btn:hover {
      background: linear-gradient(135deg, rgba(201,168,76,0.38), rgba(201,168,76,0.22));
      border-color: rgba(201,168,76,0.8);
    }
    .save-flash {
      color: #4ade80;
      font-size: 0.82rem;
      font-weight: 600;
      text-align: center;
    }
    /* ── Expression Buttons ───────────────────────────────── */
    .expr-btn {
      background: var(--color-surface-2, #1a1a2e);
      border: 1px solid var(--color-border, #2a2a4a);
      border-radius: 8px;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 4px 8px;
      line-height: 1;
      transition: border-color 0.2s, transform 0.15s;
    }
    .expr-btn:hover { border-color: var(--color-gold, #c9a84c); transform: scale(1.15); }
    .expr-btn.active { border-color: var(--color-gold, #c9a84c); background: rgba(201,168,76,0.18); }
    /* ── Extra quiz dot styles ────────────────────────────── */
    #qstep-4, #qstep-5 { transition: background 0.2s; }
    /* ── Witch armor tweak (hat force) ───────────────────── */
    [data-type="armor"][data-value="witch"].active ~ [data-type="extra"][data-value="hat"] {
      border-color: var(--color-gold, #c9a84c);
    }
  `;
  document.head.appendChild(style);
})();

// ============================================================
// BOOT
// ============================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUpgrades);
} else {
  setTimeout(initUpgrades, 0);
}
