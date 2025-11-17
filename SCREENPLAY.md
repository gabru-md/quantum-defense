# The Quantum Realm Saga: Expanded Screenplay (15 Levels)

---

## Story_Tutorial (LevelNames.Tutorial)
**Title:** Tutorial
**Next Scene:** Gameplay_Tutorial

**Steps:**
*   **Text:** 'Welcome, Guardian, to the Quantum Realm!'
    *   **Visual:** Player character (GameObject) appears at the bottom of the screen, animated in with a visual pulse.
*   **Text:** 'Your mission is to defend the Nexus from incoming Glitches.'
    *   **Visual:** Nexus sprite appears at the top, pulsing gently. An enemy (e.g., enemy1) appears near the bottom.
*   **Text:** 'Deploy towers strategically to eliminate threats.'
    *   **Visual:** A generic tower (e.g., tower1) appears in the middle of the screen.
*   **Text:** 'Good luck, Guardian! The fate of the Quantum Realm rests on you.'
    *   **Visual:** All previous visuals remain.

---

## Story_TheGlitchAnnihilation (LevelNames.Story_TheGlitchAnnihilation)
**Title:** The Glitch Annihilation
**Next Scene:** Gameplay_TheGlitchAnnihilation

**Steps:**
*   **Text:** 'The Quantum Realm is under attack! Glitches are everywhere!'
    *   **Visual:** `backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);` Three different enemy sprites (enemy1, enemy2, enemy3) appear in the middle of the screen.
*   **Text:** 'But the Guardian fought valiantly, pushing back the chaotic tide.'
    *   **Visual:** Player character (GameObject) appears at the bottom of the screen, animated in with a visual pulse.
*   **Text:** 'A scar remains, a permanent rift, a testament to the Guardian\'s victory.'
    *   **Visual:** A player-colored rift appears in the center of the screen. `drawRift(scene, WIDTH / 2, HEIGHT / 2, PlayerConfig.resonanceWave.pulseColor);`

---

## Story_HelloGenie (LevelNames.Story_HelloGenie)
**Title:** Hello, Genie!
**Next Scene:** Gameplay_HelloGenie

**Steps:**
*   **Text:** 'Hi! I am Genie.\nEven a Guardian needs a guide!'
    *   **Visual:** Player character (GameObject) appears. Nexus sprite appears at the bottom, pulsing.
*   **Text:** "Static's operations are rising rapidly,\nHe is sending out fleet of Glitches."
    *   **Visual:** `backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);` Static sprite appears at the top, pulsing. Three different enemy sprites appear below Static.
*   **Text:** 'These "scars" are residual energy from past battles. Currently dormant, but unstable.'
    *   **Visual:** A player-colored rift appears on the left, and a dormant (UI_DISABLED) rift appears on the right. `drawRift(scene, WIDTH / 2 - 100, HEIGHT / 2, PlayerConfig.resonanceWave.pulseColor);` and `drawRift(scene, WIDTH / 2 + 100, HEIGHT / 2, phaserColor(AppColors.UI_DISABLED));`
*   **Text:** 'We need your help Guardian!'

---

## Story_TheDormantScars (LevelNames.Story_TheDormantScars)
**Title:** The Dormant Scars
**Next Scene:** Gameplay_TheDormantScars

**Steps:**
*   **Text:** "The Glitches have identified more paths to the nexus\nIt's not looking good."
    *   **Visual:** `backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);` Nexus sprite at the top, pulsing. Multiple enemy sprites (enemy1, enemy2, enemy3) appear below.
*   **Text:** "These dormant rifts block tower deployment. Too unstable for construction."
    *   **Visual:** Three dormant (UI_DISABLED) rifts appear across the middle of the screen. `drawRift(scene, WIDTH / 2 - 150, HEIGHT / 2, phaserColor(AppColors.UI_DISABLED));` (repeated for 3 rifts).
*   **Text:** "But I can still count on you, right?"
    *   **Visual:** Player character (GameObject) appears in the middle, animated in with a visual pulse.

---

## Story_ThePhantomArrival (LevelNames.Story_ThePhantomArrival)
**Title:** The Phantom's Arrival
**Next Scene:** Gameplay_ThePhantomArrival

**Steps:**
*   **Text:** 'Guardian, I have some grave news.'
    *   **Visual:** `backgroundEffectsManager.enableGhostlyClashEffect(scene);` Player character (GameObject) appears on the left.
*   **Text:** 'The Phantom is on the move! Its presence activates a new, dangerous rift!'
    *   **Visual:** `backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);` Phantom (SpecialEnemyConfig.texture) appears on the right, pulsing. A Phantom-colored rift appears below. `drawRift(scene, WIDTH / 2, HEIGHT / 2 + 100, SpecialEnemyConfig.pulseColor);`
*   **Text:** 'This active rift is highly volatile and dangerous to approach.'

---

## Story_VolatileInterference (LevelNames.Story_VolatileInterference)
**Title:** Volatile Interference
**Next Scene:** Gameplay_VolatileInterference

**Steps:**
*   **Text:** "Genie: Guardian, I've made a disturbing discovery!"
    *   **Visual:** `backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);` A Phantom-colored rift appears in the middle.
*   **Text:** 'The chaotic energy from active rifts interferes with tower functions!'
    *   **Visual:** Three tower sprites (tower1, tower2, tower3) appear below the rift. They visually malfunction (e.g., alpha tweening).
*   **Text:** 'Towers placed too close malfunction, losing effectiveness. Adapt your strategy!'
*   **Text:** 'These rifts also emit Quantum Echoes. Collect them, but beware the risk!'
    *   **Visual:** A 'quantum_echo_texture' sprite appears, pulsing.

---

## Story_SamplingTheEchoes (LevelNames.Story_SamplingTheEchoes)
**Title:** Sampling the Echoes
**Next Scene:** Gameplay_SamplingTheEchoes

**Steps:**
*   **Text:** "Genie: We need to understand Static's power. Collect Phantom remains and Quantum Echoes."
    *   **Visual:** `backgroundEffectsManager.enableGhostlyClashEffect(scene);` Phantom sprite appears on the left. A 'quantum_echo_texture' sprite appears on the right.
*   **Text:** 'Guardian, you must actively seek out echoes from dangerous rift zones.'
    *   **Visual:** A Phantom-colored rift appears in the middle. Player character (GameObject) appears below it.
*   **Text:** 'Carefully navigate around the malfunctioning fields of active rifts.'

---

## Story_InitialBreakthrough (LevelNames.Story_InitialBreakthrough)
**Title:** Initial Breakthrough
**Next Scene:** Gameplay_InitialBreakthrough

**Steps:**
*   **Text:** 'Genie: Amazing work, Guardian! Your collected samples are yielding results!'
    *   **Visual:** Player character (GameObject) appears on the left.
*   **Text:** 'The Quantum Echoes hold the key to enhancing tower capabilities!'
    *   **Visual:** A tower sprite (tower1) appears in the middle, animating with a scale and alpha tween to show enhancement.
*   **Text:** 'This unlocks the first tier of tower upgrades! Keep collecting those echoes!'
    *   **Visual:** A 'quantum_echo_texture' sprite appears on the right.

---

## Story_VolatileFrontierPart1 (LevelNames.Story_VolatileFrontierPart1)
**Title:** The Volatile Frontier (Part 1)
**Next Scene:** Gameplay_VolatileFrontierPart1

**Steps:**
*   **Text:** 'Genie: My research confirms, rifts are battle scars. Their colors tell tales.'
    *   **Visual:** A player-colored rift, a phantom-colored rift, and a gradient rift (using PlayerConfig.resonanceWave.pulseColor and SpecialEnemyConfig.pulseColor) appear across the screen.
*   **Text:** 'New maps feature complex, dangerous active rift layouts. Plan your placements!'
    *   **Visual:** `backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);` A tower (tower1) appears at the bottom. A Phantom-colored rift appears above it.
*   **Text:** 'Rift malfunctions are a primary tactical challenge. Avoid severe stat penalties.'
    *   **Visual:** The tower from the previous step now visually malfunctions (alpha and scale tweening) near the Phantom-colored rift.

---

## Story_VolatileFrontierPart2 (LevelNames.Story_VolatileFrontierPart2)
**Title:** The Volatile Frontier (Part 2)
**Next Scene:** Gameplay_VolatileFrontierPart2

**Steps:**
*   **Text:** 'Genie: Guardian, you must master navigating these volatile zones.'
    *   **Visual:** Player character (GameObject) appears at the bottom. A Phantom-colored rift appears above it.
*   **Text:** 'Collect increasing amounts of Quantum Echoes for higher-tier upgrades.'
    *   **Visual:** Two 'quantum_echo_texture' sprites appear.
*   **Text:** 'Second tier of tower upgrades available, including early "rift-resistant" modules!'
    *   **Visual:** A tower sprite (tower2) appears, animating with a scale and alpha tween to show enhancement.

---

## Story_StaticNewGlitches (LevelNames.Story_StaticNewGlitches)
**Title:** Static's New Glitches
**Next Scene:** Gameplay_StaticNewGlitches

**Steps:**
*   **Text:** 'Genie: Static senses your growing strength, Guardian. It unleashes new Glitches!'
    *   **Visual:** `backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);` Static sprite appears at the top. A new glitch type (enemy3) appears at the bottom.
*   **Text:** 'Some Glitches are immune to certain towers, others try to corrupt rifts!'
    *   **Visual:** An immune glitch (enemy1) and a corrupting glitch (enemy2) appear.
*   **Text:** 'Even worse, some can temporarily activate dormant rifts, intensifying malfunctions!'
    *   **Visual:** A dormant (UI_DISABLED) rift appears on the left. A glitch (enemy3) appears on the right. The dormant rift then visually transitions to an active Phantom-colored rift.

---

## Story_AdvancedCountermeasures (LevelNames.Story_AdvancedCountermeasures)
**Title:** Advanced Countermeasures
**Next Scene:** Gameplay_AdvancedCountermeasures

**Steps:**
*   **Text:** 'Genie: I\'m working tirelessly on countermeasures, Guardian. But I need more Echoes!'
    *   **Visual:** A 'quantum_echo_texture' sprite appears, pulsing.
*   **Text:** 'We need specialized tower upgrades, including stronger rift-resistance modules.'
    *   **Visual:** A tower (tower3) appears on the left. An 'upgrade_icon_texture' appears on the right.
*   **Text:** 'Third tier of tower upgrades available, including specialized counter-Glitches!'
    *   **Visual:** A tower (tower3) appears, animating with a scale and alpha tween to show enhancement.

---

## Story_EchoesOfAncientLore (LevelNames.Story_EchoesOfAncientLore)
**Title:** Echoes of Ancient Lore
**Next Scene:** Gameplay_EchoesOfAncientLore

**Steps:**
*   **Text:** 'Genie: Through extensive analysis of Echoes from ancient Guardian-colored rifts...'
    *   **Visual:** A player-colored rift appears. A 'quantum_echo_texture' appears over it.
*   **Text:** 'I\'ve uncovered fragments of forgotten lore. Phantoms are not just Glitches!'
    *   **Visual:** A Phantom (SpecialEnemyConfig.texture) appears.
*   **Text:** 'They are direct manifestations of Static\'s core essence – "mini-Statics"!'
    *   **Visual:** Static sprite appears on the left. Phantom appears on the right.
*   **Text:** 'This explains their immunity, disruptive power, and why they amplify rift chaos.'
    *   **Visual:** A Phantom-colored rift appears. Phantom appears over it.

---

## Story_DesigningTheBane (LevelNames.Story_DesigningTheBane)
**Title:** Designing the Bane
**Next Scene:** Gameplay_DesigningTheBane

**Steps:**
*   **Text:** 'Genie: Armed with this knowledge, Guardian, I\'ve designed the ultimate weapon!'
    *   **Visual:** A 'genie_texture' sprite appears.
*   **Text:** 'The Phantom Killer tower! It disrupts their connection to Static, rendering them vulnerable.'
    *   **Visual:** A 'phantom_killer_tower_texture' appears. A Phantom appears next to it and visually becomes vulnerable (e.g., alpha tweening).
*   **Text:** 'But building the prototype requires a massive amount of Quantum Echoes!'
    *   **Visual:** Three 'quantum_echo_texture' sprites appear.
*   **Text:** 'Obtainable only from the most dangerous, Phantom-dominated rifts. A perilous mission awaits!'
    *   **Visual:** A highly active Phantom-colored rift appears. Player character (GameObject) appears below it.

---

## Story_TheFinalAssault (LevelNames.Story_TheFinalAssault)
**Title:** The Final Assault
**Next Scene:** Gameplay_TheFinalAssault

**Steps:**
*   **Text:** 'Genie: Static is enraged! It launches an all-out, desperate assault!'
    *   **Visual:** `backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);` Static sprite appears at the top. Three different enemy sprites appear at the bottom.
*   **Text:** 'A colossal wave of every Glitch type, including unprecedented numbers of Phantoms!'
    *   **Visual:** Two Phantom (SpecialEnemyConfig.texture) sprites appear.
*   **Text:** 'Strategically deploy Phantom Killer towers to neutralize the Phantom threat.'
    *   **Visual:** Two 'phantom_killer_tower_texture' sprites appear.
*   **Text:** 'Carefully manage tower placement around the still-malfunctioning rifts.'
    *   **Visual:** Two Phantom-colored rifts appear. A tower (tower1) appears between them and visually malfunctions.

---

## Story_TheResonanceWave (LevelNames.Story_TheResonanceWave)
**Title:** The Resonance Wave
**Next Scene:** MainMenu

**Steps:**
*   **Text:** 'Genie: The last Phantom falls! Static\'s core is exposed – a raw, pulsating mass!'
    *   **Visual:** `backgroundEffectsManager.enableGlitchAnnihilationEffect(scene);` A large, pulsing Static core sprite appears in the center.
*   **Text:** 'It\'s invulnerable to Phantom Killer towers. They were for its extensions, not the source!'
    *   **Visual:** A 'phantom_killer_tower_texture' appears on the left, visually ineffective (e.g., fading). The Static core remains on the right.
*   **Text:** 'Only your pure Resonance Wave, amplified by a final surge of Quantum Echoes, can destroy it!'
    *   **Visual:** Player character (GameObject) appears on the left. A 'quantum_echo_texture' appears on the right.
*   **Text:** 'Collect any remaining Echoes from the now-exposed, highly volatile rifts!'
    *   **Visual:** Three highly volatile Phantom-colored rifts appear. A 'quantum_echo_texture' appears in the middle.
*   **Text:** 'Unleash the most powerful Resonance Wave of your life, Guardian!'
    *   **Visual:** Player character (GameObject) appears, emitting a large, fast, and thick visual pulse. The Static core remains at the top.
*   **Text:** 'The Static is annihilated! The Quantum Realm is restored, forever changed, but free!'
    *   **Visual:** `backgroundEffectsManager.enableDataStreamEffect(scene);` Player character (GameObject) appears in the center, pulsing calmly.

---