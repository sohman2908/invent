// Stories, word lists and picture-book art for Smart Reader Kids.

window.STORIES = [
  {
    id: 'pip', title: 'Pip the Pup', level: 'A', ages: '4–5',
    pages: ['I see Pip.', 'Pip can run.', 'Pip can dig.', 'Pip can nap.', 'I love Pip.'],
    ask: 'What can Pip do? What can you do?'
  },
  {
    id: 'hat', title: 'The Red Hat', level: 'B', ages: '4–5',
    pages: ['Sam has a red hat.', 'The wind took the hat.', 'The hat went up, up, up!', 'A bird sat in the hat.', 'Now the bird has a red hat.'],
    ask: 'How do you think Sam felt when the wind took the hat?'
  },
  {
    id: 'moon', title: 'Moon and Me', level: 'C', ages: '5–6',
    pages: ['The moon came up over the hill.', 'It looked in my window.', 'I waved to the moon.', 'The moon did not wave back.', 'But it stayed with me all night.'],
    ask: 'What do you see from your window at night?'
  },
  {
    id: 'fish', title: 'Fish Wish', level: 'D', ages: '5–6',
    pages: ['Little Fish wanted to see the sky.', 'She swam up, up, up to the top of the pond.', 'A frog sat on a lily pad.', '“The sky is big and blue,” said Frog.', 'Little Fish jumped. For one splashy second, she saw it too!'],
    ask: 'Little Fish wanted to see the sky. What is something you wish you could see?'
  },
  {
    id: 'garden', title: 'Grandma’s Garden', level: 'E', ages: '6–7',
    pages: ['Grandma and I plant seeds in the spring.', 'We water them every morning before school.', 'One day, tiny green leaves pop up out of the dirt.', 'By summer, we have tomatoes, beans, and one giant pumpkin.', 'Grandma says the best part of a garden is sharing it.'],
    ask: 'What happened first, next and last in the garden?'
  },
  {
    id: 'sock', title: 'The Lost Sock', level: 'F', ages: '6–7',
    pages: ['Max had one blue sock with yellow stars. Where was the other one?', 'He looked under the bed. He found dust and a crayon.', 'He looked in the toy box. He found blocks and a yo-yo.', 'The cat was asleep in the laundry basket, curled around something blue.', '“Found it!” Max laughed. But the cat did not want to give it back.'],
    ask: 'Where would you look for a lost sock? Why did the cat want to keep it?'
  }
];

// Dolch sight word lists.
window.WORD_LISTS = {
  preprimer: {
    label: 'Pre-primer',
    words: ['a', 'and', 'away', 'big', 'blue', 'can', 'come', 'down', 'find', 'for', 'funny', 'go', 'help', 'here', 'I', 'in', 'is', 'it', 'jump', 'little', 'look', 'make', 'me', 'my', 'not', 'one', 'play', 'red', 'run', 'said', 'see', 'the', 'three', 'to', 'two', 'up', 'we', 'where', 'yellow', 'you']
  },
  primer: {
    label: 'Primer',
    words: ['all', 'am', 'are', 'at', 'ate', 'be', 'black', 'brown', 'but', 'came', 'did', 'do', 'eat', 'four', 'get', 'good', 'have', 'he', 'into', 'like', 'must', 'new', 'no', 'now', 'on', 'our', 'out', 'please', 'pretty', 'ran', 'ride', 'saw', 'say', 'she', 'so', 'soon', 'that', 'there', 'they', 'this', 'too', 'under', 'want', 'was', 'well', 'went', 'what', 'white', 'who', 'will', 'with', 'yes']
  },
  first: {
    label: 'First grade',
    words: ['after', 'again', 'an', 'any', 'as', 'ask', 'by', 'could', 'every', 'fly', 'from', 'give', 'going', 'had', 'has', 'her', 'him', 'his', 'how', 'just', 'know', 'let', 'live', 'may', 'of', 'old', 'once', 'open', 'over', 'put', 'round', 'some', 'stop', 'take', 'thank', 'them', 'then', 'think', 'walk', 'were', 'when']
  }
};

// Picture-book art. Each story has one scene that changes a little from page to page.
window.storyArt = function (id, p) {
  var INK = '#1C2A44';
  function svg(bg, body) {
    return '<svg viewBox="0 0 240 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      '<rect width="240" height="180" fill="' + bg + '"/>' + body + '</svg>';
  }

  if (id === 'pip') {
    var eye = p === 3
      ? '<path d="M148 95 q4 3 8 0" stroke="' + INK + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
      : '<circle cx="152" cy="94" r="2.8" fill="' + INK + '"/>';
    var extra = '';
    if (p === 1) extra = '<path d="M20 104 h30 M14 118 h30 M24 132 h24" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>';
    if (p === 2) extra = '<ellipse cx="196" cy="140" rx="26" ry="10" fill="#8B5E3C"/><circle cx="182" cy="126" r="3" fill="#8B5E3C"/><circle cx="210" cy="120" r="2.5" fill="#8B5E3C"/><circle cx="196" cy="116" r="2" fill="#8B5E3C"/>';
    if (p === 3) extra = '<text x="168" y="72" font-family="Grandstander, sans-serif" font-weight="800" font-size="20" fill="' + INK + '">z</text><text x="182" y="56" font-family="Grandstander, sans-serif" font-weight="800" font-size="15" fill="' + INK + '">z</text>';
    if (p === 4) extra = '<path d="M120 44 c-7-11 -25-4 -17 10 l17 15 l17-15 c8-14 -10-21 -17-10z" fill="#E2506B"/>';
    var shift = p === 1 ? 14 : 0;
    var dy = p === 3 ? 8 : 0;
    return svg('#CFE7F7',
      '<circle cx="204" cy="36" r="18" fill="#FFD45C"/>' +
      '<path d="M0 132 Q60 118 120 130 T240 126 V180 H0Z" fill="#86C77F"/>' +
      extra +
      '<g transform="translate(' + shift + ' ' + dy + ')">' +
        '<path d="M66 112 q-16 -10 -10 -26" stroke="#B9783F" stroke-width="7" fill="none" stroke-linecap="round"/>' +
        '<rect x="76" y="124" width="11" height="' + (p === 3 ? 10 : 22) + '" rx="5" fill="#B9783F"/>' +
        '<rect x="120" y="124" width="11" height="' + (p === 3 ? 10 : 22) + '" rx="5" fill="#B9783F"/>' +
        '<ellipse cx="104" cy="118" rx="40" ry="20" fill="#C98B4F"/>' +
        '<ellipse cx="96" cy="111" rx="12" ry="8" fill="#8A5A2E"/>' +
        '<circle cx="146" cy="98" r="20" fill="#C98B4F"/>' +
        '<ellipse cx="160" cy="105" rx="11" ry="8" fill="#DDA56E"/>' +
        '<ellipse cx="138" cy="93" rx="7" ry="14" fill="#8A5A2E" transform="rotate(22 138 93)"/>' +
        eye +
        '<ellipse cx="169" cy="101" rx="4.5" ry="3.5" fill="' + INK + '"/>' +
      '</g>');
  }

  if (id === 'hat') {
    var spots = [[62, 70], [118, 54], [176, 40], [176, 40], [176, 40]];
    var h = spots[p] || spots[0];
    var hat = '<g transform="translate(' + h[0] + ' ' + h[1] + ')' + (p === 1 ? ' rotate(-14)' : '') + '">' +
      '<ellipse cx="0" cy="0" rx="27" ry="6" fill="#D94141"/>' +
      '<path d="M-16 0 V-17 Q-16 -26 0 -26 Q16 -26 16 -17 V0Z" fill="#D94141"/>' +
      '<rect x="-16" y="-8" width="32" height="5" fill="#F2C14E"/></g>';
    var bird = p >= 3
      ? '<g transform="translate(' + h[0] + ' ' + (h[1] - 32) + ')"><circle r="10" fill="#3C7DD9"/><path d="M-8 2 q-10 -2 -12 -10 q8 0 12 4z" fill="#2C5FAE"/><circle cx="4" cy="-3" r="1.8" fill="#FFFFFF"/><path d="M9 -1 l8 2 l-8 3z" fill="#F2A33C"/></g>'
      : '';
    var wind = p >= 1 && p <= 2
      ? '<path d="M14 40 q30 -12 60 0 t50 0 M24 72 q34 -10 70 0" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/>'
      : '';
    var mouth = p === 1 || p === 2
      ? '<circle cx="62" cy="92" r="3.2" fill="' + INK + '"/>'
      : '<path d="M56 90 q6 6 12 0" stroke="' + INK + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    var hair = p === 0 ? '' : '<path d="M47 78 q15 -20 30 0 q-15 -8 -30 0z" fill="#5B3A22"/>';
    return svg('#DCEEFB',
      '<circle cx="34" cy="30" r="14" fill="#FFE07A"/>' +
      wind +
      '<path d="M0 146 Q90 132 240 148 V180 H0Z" fill="#9BD08A"/>' +
      '<rect x="44" y="98" width="36" height="46" rx="14" fill="#3C7DD9"/>' +
      '<circle cx="62" cy="83" r="16" fill="#F2C29B"/>' + hair +
      '<circle cx="56" cy="82" r="2.2" fill="' + INK + '"/><circle cx="68" cy="82" r="2.2" fill="' + INK + '"/>' +
      mouth + hat + bird);
  }

  if (id === 'moon') {
    var my = 132 - p * 18;
    var face = p === 3
      ? '<path d="M161 ' + (my - 3) + ' h5 M171 ' + (my - 3) + ' h5" stroke="#B59A3E" stroke-width="2.2" stroke-linecap="round"/>'
      : '<circle cx="163" cy="' + (my - 3) + '" r="2" fill="#B59A3E"/><circle cx="174" cy="' + (my - 3) + '" r="2" fill="#B59A3E"/>';
    var kid = p >= 2
      ? '<circle cx="56" cy="104" r="13" fill="#F2C29B"/><path d="M43 130 q13 -16 26 0z" fill="#E2506B"/>' +
        (p === 2 ? '<path d="M68 118 l14 -16" stroke="#F2C29B" stroke-width="6" stroke-linecap="round"/>' : '') +
        (p === 4 ? '<path d="M48 103 q3 2 6 0 M58 103 q3 2 6 0" stroke="' + INK + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>' : '<circle cx="51" cy="103" r="1.8" fill="' + INK + '"/><circle cx="61" cy="103" r="1.8" fill="' + INK + '"/>')
      : '';
    var stars = '';
    var pts = [[120, 24], [200, 18], [140, 60], [226, 64], [104, 48], [180, 84], [214, 108]];
    for (var i = 0; i < pts.length; i++) stars += '<circle cx="' + pts[i][0] + '" cy="' + pts[i][1] + '" r="' + (i % 2 ? 1.6 : 2.4) + '" fill="#FFFFFF"/>';
    return svg('#1E2A55',
      stars +
      '<circle cx="168" cy="' + my + '" r="22" fill="#F7E9A8"/>' + face +
      '<path d="M0 156 Q90 112 240 142 V180 H0Z" fill="#2E4A7A"/>' +
      '<rect x="22" y="38" width="70" height="104" fill="#26396A" stroke="#C9A86A" stroke-width="7"/>' +
      '<path d="M57 38 V142 M22 90 H92" stroke="#C9A86A" stroke-width="4"/>' +
      kid);
  }

  if (id === 'fish') {
    var fy = [146, 112, 84, 84, 30][p];
    var fx = [70, 96, 112, 120, 132][p];
    var frog = p >= 2
      ? '<ellipse cx="190" cy="54" rx="15" ry="10" fill="#6CC24A"/><circle cx="183" cy="44" r="5" fill="#FFFFFF"/><circle cx="197" cy="44" r="5" fill="#FFFFFF"/><circle cx="184" cy="44" r="2.2" fill="' + INK + '"/><circle cx="198" cy="44" r="2.2" fill="' + INK + '"/>' +
        (p === 3 ? '<path d="M184 58 q6 5 12 0" stroke="' + INK + '" stroke-width="2" fill="none" stroke-linecap="round"/>' : '')
      : '';
    var splash = p === 4 ? '<path d="M110 62 l-8 -12 M124 58 v-14 M138 62 l8 -12" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/>' : '';
    var bubbles = p <= 1 ? '<circle cx="' + (fx + 30) + '" cy="' + (fy - 14) + '" r="4" fill="none" stroke="#FFFFFF" stroke-width="2"/><circle cx="' + (fx + 38) + '" cy="' + (fy - 28) + '" r="2.5" fill="none" stroke="#FFFFFF" stroke-width="2"/>' : '';
    return svg('#BFE3F5',
      '<circle cx="40" cy="22" r="13" fill="#FFE07A"/>' +
      '<path d="M0 62 Q30 56 60 62 T120 62 T180 62 T240 62 V180 H0Z" fill="#3A8FC7"/>' +
      '<path d="M10 150 q8 -20 0 -40 M226 160 q-8 -24 2 -46" stroke="#2E7A4E" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="190" cy="64" rx="32" ry="7" fill="#4FAF6A"/>' + frog + splash + bubbles +
      '<g transform="translate(' + fx + ' ' + fy + ') rotate(' + (p === 4 ? -20 : p === 1 || p === 2 ? -12 : 0) + ')">' +
        '<path d="M-20 0 l-14 -11 v22z" fill="#F07F2A"/>' +
        '<ellipse cx="0" cy="0" rx="23" ry="13" fill="#FF9F43"/>' +
        '<path d="M-4 -12 q6 -8 12 -2" fill="#F07F2A"/>' +
        '<circle cx="11" cy="-3" r="2.8" fill="' + INK + '"/></g>');
  }

  if (id === 'garden') {
    var heights = [0, 0, 16, 46, 46][p];
    var plants = '';
    if (p === 0) {
      for (var s = 0; s < 4; s++) plants += '<ellipse cx="' + (44 + s * 46) + '" cy="132" rx="3" ry="2" fill="#F6E3B4"/>';
    }
    if (p === 1) {
      plants += '<path d="M150 70 h40 l12 -10 v8 l-12 10 v20 h-40z" fill="#6FA8DC"/>';
      for (var d = 0; d < 4; d++) plants += '<circle cx="' + (128 + d * 8) + '" cy="' + (100 + d * 7) + '" r="2.5" fill="#6FA8DC"/>';
    }
    if (heights) {
      for (var k = 0; k < 3; k++) {
        var x = 44 + k * 46;
        plants += '<rect x="' + (x - 2) + '" y="' + (130 - heights) + '" width="4" height="' + heights + '" fill="#3E8E41"/>' +
          '<ellipse cx="' + (x - 7) + '" cy="' + (130 - heights * .6) + '" rx="8" ry="4" fill="#4CAF50" transform="rotate(-25 ' + (x - 7) + ' ' + (130 - heights * .6) + ')"/>' +
          '<ellipse cx="' + (x + 7) + '" cy="' + (130 - heights * .85) + '" rx="8" ry="4" fill="#4CAF50" transform="rotate(25 ' + (x + 7) + ' ' + (130 - heights * .85) + ')"/>';
      }
    }
    if (p >= 3) {
      plants += '<circle cx="38" cy="98" r="6" fill="#E04B3A"/><circle cx="50" cy="108" r="5" fill="#E04B3A"/>' +
        '<path d="M88 92 q3 10 0 18 M96 96 q3 10 0 18" stroke="#2E7D32" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="190" cy="118" rx="30" ry="20" fill="#F28C28"/><path d="M180 100 q10 -6 20 0 M175 104 q15 28 0 30 M205 104 q-15 28 0 30" stroke="#D9731A" stroke-width="2.5" fill="none"/>' +
        '<rect x="187" y="92" width="6" height="10" rx="2" fill="#5D7A2E"/>';
    }
    if (p === 4) {
      plants += '<path d="M120 40 c-7-11 -25-4 -17 10 l17 15 l17-15 c8-14 -10-21 -17-10z" fill="#E2506B"/>';
    }
    return svg('#E3F3FF',
      '<circle cx="206" cy="34" r="17" fill="#FFD45C"/>' +
      '<rect y="128" width="240" height="52" fill="#8B5E3C"/>' +
      '<path d="M0 128 h240" stroke="#6E4A2E" stroke-width="3"/>' + plants);
  }

  if (id === 'sock') {
    var sock = function (x, y, sc, rot) {
      return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ') rotate(' + rot + ')">' +
        '<path d="M0 0 h22 v46 q0 12 12 12 h10 q12 0 12 13 q0 13 -13 13 h-27 q-16 0 -16 -18z" fill="#3D6FD6"/>' +
        '<rect x="-1" y="-4" width="24" height="10" rx="3" fill="#2C56AE"/>' +
        '<circle cx="11" cy="20" r="3" fill="#FFD45C"/><circle cx="8" cy="40" r="2.6" fill="#FFD45C"/><circle cx="26" cy="70" r="3" fill="#FFD45C"/><circle cx="42" cy="68" r="2.4" fill="#FFD45C"/></g>';
    };
    var scene = '';
    if (p === 0) scene = sock(96, 40, 1, 0) + '<text x="164" y="96" font-family="Grandstander, sans-serif" font-weight="800" font-size="52" fill="#2C56AE">?</text>';
    if (p === 1) scene = '<rect x="20" y="90" width="200" height="34" rx="6" fill="#8A6BC4"/><rect x="20" y="70" width="44" height="26" rx="8" fill="#FFFFFF"/><rect x="28" y="124" width="10" height="20" fill="#6B4FA3"/><rect x="202" y="124" width="10" height="20" fill="#6B4FA3"/>' +
      '<ellipse cx="110" cy="140" rx="20" ry="4" fill="#B8A898"/><rect x="146" y="134" width="30" height="7" rx="3" fill="#E04B3A"/>';
    if (p === 2) scene = '<rect x="50" y="86" width="140" height="58" rx="6" fill="#E07A3F"/><rect x="44" y="78" width="152" height="14" rx="5" fill="#C25E26"/>' +
      '<rect x="70" y="60" width="22" height="22" fill="#3C7DD9"/><rect x="96" y="66" width="20" height="20" fill="#FFD45C"/><rect x="120" y="58" width="22" height="22" fill="#4CAF50"/><circle cx="162" cy="68" r="11" fill="#E2506B"/><path d="M162 79 v14" stroke="' + INK + '" stroke-width="2"/>';
    if (p >= 3) {
      scene = '<path d="M50 96 h140 l-10 52 h-120z" fill="#C99A5B"/><path d="M58 112 h124 M62 128 h116" stroke="#A97B42" stroke-width="3"/>' +
        '<ellipse cx="120" cy="94" rx="54" ry="20" fill="#8D96A8"/>' +
        '<circle cx="' + (p === 4 ? 158 : 80) + '" cy="84" r="16" fill="#8D96A8"/>' +
        '<path d="M' + (p === 4 ? 146 : 68) + ' 74 l4 -14 l8 10z M' + (p === 4 ? 162 : 84) + ' 72 l8 -12 l4 14z" fill="#8D96A8"/>' +
        (p === 4
          ? '<circle cx="153" cy="82" r="2.4" fill="' + INK + '"/><circle cx="164" cy="82" r="2.4" fill="' + INK + '"/>' + sock(166, 86, .45, -20)
          : '<path d="M73 84 q4 3 8 0 M84 84 q4 3 8 0" stroke="' + INK + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
            '<path d="M140 88 q16 -6 26 4 q-10 10 -26 6z" fill="#3D6FD6"/><circle cx="152" cy="92" r="2" fill="#FFD45C"/>');
    }
    return svg('#F3E6D6',
      '<rect x="0" y="144" width="240" height="36" fill="#C9A27A"/>' +
      '<rect x="176" y="20" width="44" height="36" rx="4" fill="#BFE3F5" stroke="#FFFFFF" stroke-width="4"/>' + scene);
  }

  return svg('#E6EEF8', '');
};
