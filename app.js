const $ = id => document.getElementById(id);
const qs = (s, p = document) => [...p.querySelectorAll(s)];

/* =========================================================
   NAVIGATION
========================================================= */

function showPage(id) {
    qs('.page').forEach(page => {
        page.classList.toggle('active-page', page.id === id);
    });

    qs('.nav-item').forEach(button => {
        button.classList.toggle('active', button.dataset.page === id);
    });

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

qs('[data-page]').forEach(button => {
    button.addEventListener('click', () => {
        showPage(button.dataset.page);
    });
});


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {
    $('clock').textContent = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

updateClock();
setInterval(updateClock, 1000);


/* =========================================================
   SURVIVAL
========================================================= */

$('assessButton').addEventListener('click', () => {
    const health = +$('health').value;
    const armor = +$('armor').value;
    const food = +$('food').value;
    const mobs = +$('mobs').value;
    const distance = +$('distance').value;
    const diamonds = +$('diamonds').value;
    const slots = +$('slots').value;

    let danger = 0;

    danger += (20 - health) * 3.2;
    danger += (20 - armor) * 1.8;
    danger += (20 - food) * 1.7;
    danger += Math.min(mobs * 8, 40);
    danger += Math.max(0, 20 - distance) * 1.2;
    danger += diamonds >= 10 ? 8 : diamonds > 0 ? 3 : 0;
    danger += Math.max(0, slots - 30) * 1.5;

    danger = Math.max(0, Math.min(100, Math.round(danger)));

    const levels =
        danger < 15
            ? ['SAFE', 'threat-safe', 'You are suspiciously competent.']
            : danger < 35
                ? ['CAUTION', 'threat-caution', 'Something could go wrong.']
                : danger < 60
                    ? ['DANGER', 'threat-danger', 'You should probably stop doing whatever this is.']
                    : danger < 80
                        ? ['SEVERE', 'threat-severe', 'Your respawn screen is getting closer.']
                        : ['ABSURD', 'threat-absurd', 'The game has filed a formal complaint against you.'];

    const result = $('survivalResult');

    result.className =
        'result-panel ' +
        (danger >= 60 ? 'danger-panel' : '') +
        (danger >= 80 ? ' absurd-panel' : '');

    result.innerHTML = `
        <div class="eyebrow">THREAT ASSESSMENT</div>

        <div class="threat-title ${levels[1]}">
            ${levels[0]}
        </div>

        <div class="threat-bar">
            <div
                class="threat-fill"
                style="width:${danger}%"
            ></div>
        </div>

        <p>${levels[2]}</p>

        <div class="analysis-meta">
            THREAT INDEX: ${danger}/100<br>
            HEALTH ${health}/20 · ARMOR ${armor}/20 · FOOD ${food}/20<br>
            MOBS ${mobs} · DANGER DISTANCE ${distance}m ·
            DIAMONDS ${diamonds} · SLOTS ${slots}/36
        </div>
    `;
});


/* =========================================================
   MINECRAFT COURT
========================================================= */

$('courtButton').addEventListener('click', () => {
    const defendant =
        $('defendant').value.trim() || 'Unknown Steve';

    const crime =
        $('crime').value.trim() || 'being suspicious';

    const evidence =
        $('evidence').value.trim() || 'absolutely no evidence';

    const serious =
        /murder|kill|grief|steal|stole|theft|lava|destroy/i.test(crime);

    const guilty =
        serious || evidence.length > 18;

    const verdict =
        guilty ? 'GUILTY' : 'NOT GUILTY';

    const sentence = guilty
        ? [
            'Pay 12 diamonds to the court.',
            'Three hours of community mining.',
            'Confiscation of the suspicious item.'
        ][Math.floor(Math.random() * 3)]
        : 'Released due to catastrophic lack of evidence.';

    $('courtResult').innerHTML = `
        <div class="eyebrow">VERDICT</div>

        <div class="threat-title ${guilty ? 'threat-severe' : 'threat-safe'}">
            ${verdict}
        </div>

        <h2>${defendant}</h2>

        <p>
            <strong>Charge:</strong> ${escapeHTML(crime)}<br>
            <strong>Evidence:</strong> ${escapeHTML(evidence)}
        </p>

        <div class="anvil-step">
            SENTENCE: ${sentence}
        </div>

        <div class="analysis-meta">
            CASE STATUS: CLOSED · JURISDICTION: OVERWORLD
        </div>
    `;
});

function escapeHTML(s) {
    return s.replace(
        /[&<>'"]/g,
        c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        })[c]
    );
}


/* =========================================================
   REDSTONE
========================================================= */

const redstoneData = [
    [
        'Redstone Dust',
        'Carries a redstone signal. Signal strength decreases with distance.',
        'Connect components, transmit power, and make machines behave in ways that alarm villagers.'
    ],
    [
        'Repeater',
        'Refreshes a signal, adds delay, and prevents it from travelling backward.',
        'Useful for timing circuits, extending signals, and building clocks.'
    ],
    [
        'Comparator',
        'Reads container fullness and compares or subtracts signal strength.',
        'Essential for item sorters, storage systems, and clever contraptions.'
    ],
    [
        'Observer',
        'Detects block updates and emits a short pulse.',
        'Perfect for automatic farms, doors, flying machines, and general redstone nonsense.'
    ],
    [
        'Piston',
        'Pushes blocks when powered. Sticky pistons can pull one block back.',
        'Use for doors, elevators, farms, hidden entrances, and machines.'
    ],
    [
        'Redstone Torch',
        'A power source that can also invert signals.',
        'The classic NOT gate and one of the foundational redstone components.'
    ]
];

redstoneData.forEach((data, index) => {
    const button = document.createElement('button');

    button.className =
        'component-button' +
        (index === 0 ? ' active' : '');

    button.textContent = data[0];

    button.onclick = () => {
        qs('.component-button').forEach(item => {
            item.classList.remove('active');
        });

        button.classList.add('active');

        renderRedstone(data);
    };

    $('redstoneList').appendChild(button);
});

function renderRedstone(data) {
    $('redstoneInfo').innerHTML = `
        <div class="eyebrow">COMPONENT</div>

        <h2>${data[0]}</h2>

        <p>${data[1]}</p>

        <div class="redstone-demo">
            ${data[2]}
        </div>
    `;
}

renderRedstone(redstoneData[0]);


/* =========================================================
   POTIONS
========================================================= */
// ---------- potions ----------

let potionData = null;

const potionInput = $('potionEffect');
const potionModifier = $('potionModifier');
const brewButton = $('brewButton');
const brewResult = $('brewResult');


// Load potion database
async function loadPotions() {
    try {
        const response = await fetch('data/potions.json');

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        potionData = await response.json();

        console.log(
            `Loaded ${Object.keys(potionData.effect_potions).length} potion recipes.`
        );

    } catch (error) {
        console.error('Failed to load data/potions.json:', error);

        brewResult.innerHTML = `
            <div class="eyebrow">BREWING ERROR</div>
            <h2>Could not load potion database.</h2>
            <p>
                Make sure <strong>data/potions.json</strong> is in the same
                directory as your website files.
            </p>
        `;
    }
}


// Convert names like "night_vision" → "Night Vision"
function formatPotionName(name) {
    return name
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}


// Convert names like "golden_carrot" → "Golden Carrot"
function formatIngredientName(name) {
    return name
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}


// Find potion regardless of capitalization
function findPotion(search) {

    if (!potionData || !search) {
        return null;
    }

    const normalized = search
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_');

    const potions = potionData.effect_potions;

    // Exact match
    if (potions[normalized]) {
        return {
            key: normalized,
            data: potions[normalized]
        };
    }

    // Match without underscores
    const compactSearch = normalized.replace(/_/g, '');

    for (const key of Object.keys(potions)) {

        if (key.replace(/_/g, '') === compactSearch) {
            return {
                key,
                data: potions[key]
            };
        }
    }

    // Partial match
    for (const key of Object.keys(potions)) {

        if (
            key.includes(normalized) ||
            formatPotionName(key)
                .toLowerCase()
                .includes(search.trim().toLowerCase())
        ) {
            return {
                key,
                data: potions[key]
            };
        }
    }

    return null;
}


// Build the brewing chain
function getBrewingSteps(potionKey) {

    const steps = [];
    let currentKey = potionKey;
    let safety = 0;

    while (currentKey && safety < 10) {

        safety++;

        // Special case: water bottle
        if (currentKey === 'water_bottle') {

            steps.unshift({
                type: 'base',
                name: 'Water Bottle',
                ingredient: null
            });

            break;
        }

        // Base potion
        const basePotion =
            potionData.base_potions[currentKey];

        if (basePotion) {

            steps.unshift({
                type: 'base',
                name: formatPotionName(currentKey),
                ingredient: basePotion.ingredients
            });

            break;
        }

        // Effect potion
        const potion =
            potionData.effect_potions[currentKey];

        if (!potion) {
            break;
        }

        steps.unshift({
            type: 'brew',
            name: formatPotionName(currentKey),
            ingredient: potion.ingredient
        });

        currentKey = potion.base;
    }

    return steps;
}


// Create the HTML for the recipe
function renderPotionRecipe(potionKey, potion) {

    const steps = getBrewingSteps(potionKey);

    const modifier =
        potionModifier.value;

    let html = `
        <div class="eyebrow">BREWING GUIDE</div>

        <h2>${formatPotionName(potionKey)} Potion</h2>

        <p>
            Follow these steps in order using a brewing stand.
        </p>

        <div class="potion-steps">
    `;


    // Base potion chain
    steps.forEach((step, index) => {

        if (step.type === 'base') {

            html += `
                <div class="potion-step">

                    <div class="potion-step-number">
                        ${index + 1}
                    </div>

                    <div class="potion-step-content">

                        <div class="potion-step-title">
                            Prepare ${step.name}
                        </div>

                        <div class="potion-step-description">
                            Place
                            <strong>
                                ${formatIngredientName(
                                    Object.keys(step.ingredient)[0]
                                )}
                            </strong>
                            in the brewing stand with a
                            <strong>Water Bottle</strong>.
                        </div>

                    </div>

                </div>
            `;

            return;
        }


        html += `
            <div class="potion-step">

                <div class="potion-step-number">
                    ${index + 1}
                </div>

                <div class="potion-step-content">

                    <div class="potion-step-title">
                        Brew ${step.name}
                    </div>

                    <div class="potion-step-description">
                        Add
                        <strong>
                            ${formatIngredientName(step.ingredient)}
                        </strong>
                        to the previous potion.
                    </div>

                </div>

            </div>
        `;
    });


    // Modifier
    if (modifier !== 'normal') {

        const modifierData =
            potionData.modifiers[modifier];

        if (modifierData) {

            let requiresText = '';

            if (modifierData.requires) {
                requiresText = `
                    <br>
                    <small>
                        Requires ${formatIngredientName(
                            modifierData.requires
                        )}
                    </small>
                `;
            }

            html += `
                <div class="potion-step modifier-step">

                    <div class="potion-step-number">
                        ${steps.length + 1}
                    </div>

                    <div class="potion-step-content">

                        <div class="potion-step-title">
                            Apply ${formatPotionName(modifier)}
                        </div>

                        <div class="potion-step-description">
                            Add
                            <strong>
                                ${formatIngredientName(
                                    modifierData.ingredient
                                )}
                            </strong>
                            to the potion.

                            ${requiresText}
                        </div>

                    </div>

                </div>
            `;
        }
    }


    html += `
        </div>

        <div class="analysis-meta">
            BREWING STATUS: READY<br>
            POTION: ${formatPotionName(potionKey).toUpperCase()}<br>
            MODIFIER: ${modifier.toUpperCase()}
        </div>
    `;

    brewResult.innerHTML = html;
}


// Brew button
brewButton.addEventListener('click', () => {

    if (!potionData) {
        brewResult.innerHTML = `
            <div class="eyebrow">BREWING DATABASE</div>
            <h2>Still loading...</h2>
            <p>The potion database hasn't finished loading yet.</p>
        `;

        return;
    }


    const search = potionInput.value;

    if (!search.trim()) {

        brewResult.innerHTML = `
            <div class="eyebrow">BREWING GUIDE</div>
            <h2>No potion selected.</h2>
            <p>Enter a potion name first.</p>
        `;

        return;
    }


    const result = findPotion(search);

    if (!result) {

        brewResult.innerHTML = `
            <div class="eyebrow">BREWING GUIDE</div>
            <h2>Potion not found.</h2>
            <p>
                Try something like
                <strong>Night Vision</strong>,
                <strong>Strength</strong>,
                <strong>Swiftness</strong>,
                or
                <strong>Fire Resistance</strong>.
            </p>
        `;

        return;
    }


    renderPotionRecipe(
        result.key,
        result.data
    );
});


// Load database when the app starts
loadPotions();


/* =========================================================
   BLOCK DETECTIVE
========================================================= */

$('imageInput').addEventListener('change', event => {
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    const url = URL.createObjectURL(file);

    $('imagePreview').src = url;
    $('imagePreview').style.display = 'block';

    $('detectResult').textContent =
        'Screenshot loaded. Press ANALYZE SCREENSHOT.';
});

$('detectButton').addEventListener('click', () => {
    if (!$('imageInput').files[0]) {
        $('detectResult').innerHTML =
            '<p>No screenshot selected.</p>';

        return;
    }

    $('detectResult').innerHTML = `
        <div class="anvil-step">
            LOCAL ANALYSIS COMPLETE
        </div>

        <p>
            Image loaded successfully.
            A real block detector would need a vision model.
            This demo keeps the analysis honest instead of
            pretending a div is AI.
        </p>
    `;
});


/* =========================================================
   ENCHANTMENTS
========================================================= */

const enchantments = [
    'Sharpness',
    'Looting',
    'Unbreaking',
    'Mending',
    'Efficiency',
    'Fortune',
    'Silk Touch',
    'Protection',
    'Feather Falling',
    'Power',
    'Infinity',
    'Flame'
];

const enchantmentBox = $('enchantmentChecks');

enchantments.forEach(enchantment => {
    const label = document.createElement('label');

    label.className = 'enchantment-option';

    label.innerHTML = `
        <input
            type="checkbox"
            value="${enchantment}"
        >
        ${enchantment}
    `;

    enchantmentBox.appendChild(label);
});

$('enchantmentButton').addEventListener('click', () => {
    const selected = qs('#enchantmentChecks input:checked')
        .map(input => input.value);

    const item = $('enchantmentItem').value;

    if (!selected.length) {
        $('enchantmentResult').innerHTML = `
            <div class="eyebrow">ANVIL PLAN</div>
            <h2>Nothing selected.</h2>
            <p>Choose at least one enchantment.</p>
        `;

        return;
    }

    $('enchantmentResult').innerHTML = `
        <div class="eyebrow">ANVIL PLAN</div>

        <h2>${item}</h2>

        ${selected
            .map(
                (enchantment, index) => `
                    <div class="anvil-step">
                        STEP ${index + 1} · Apply ${enchantment}
                    </div>
                `
            )
            .join('')}

        <p>
            Recommended order generated from your selected
            enchantments. Minecraft remains free to charge you
            an absurd number of levels.
        </p>
    `;
});


/* =========================================================
   CRAFTING
========================================================= */

const recipes = {
    Torch: {
        Coal: 1,
        Stick: 1
    },

    Chest: {
        'Oak Planks': 8
    },

    Furnace: {
        Cobblestone: 8
    },

    Crafting_Table: {
        'Oak Planks': 4
    },

    Bucket: {
        Iron: 3
    },

    Shield: {
        Iron: 1,
        'Oak Planks': 6
    },

    Lantern: {
        Iron: 8,
        Torch: 1
    },

    Boat: {
        'Oak Planks': 5
    }
};

Object.keys(recipes).forEach(item => {
    const option = document.createElement('option');

    option.value = item;
    option.textContent = item.replace('_', ' ');

    $('craftingItem').appendChild(option);
});

$('craftingButton').addEventListener('click', () => {
    const item = $('craftingItem').value;

    const quantity = Math.max(
        1,
        +$('craftingQuantity').value || 1
    );

    const recipe = recipes[item];

    $('craftingResult').innerHTML =
        Object.entries(recipe)
            .map(
                ([material, amount]) => `
                    <div class="material-card">
                        <strong>${amount * quantity}</strong>
                        <span>${material}</span>
                    </div>
                `
            )
            .join('');
});


/* =========================================================
   BUILD PLANNER
========================================================= */

$('buildButton').addEventListener('click', () => {
    const width = Math.min(
        25,
        Math.max(3, +$('buildWidth').value || 3)
    );

    const length = Math.min(
        25,
        Math.max(3, +$('buildLength').value || 3)
    );

    const height = Math.min(
        15,
        Math.max(1, +$('buildHeight').value || 1)
    );

    let output = '';

    for (let y = 1; y <= height; y++) {
        output += `
            <div class="layer">
                <div class="layer-title">
                    LAYER ${y} · ${$('buildBlock').value.toUpperCase()}
                </div>

                <div
                    class="block-grid"
                    style="grid-template-columns:repeat(${width},23px)"
                >
                    ${'<div class="block"></div>'.repeat(width * length)}
                </div>
            </div>
        `;
    }

    $('blueprint').innerHTML = output;
});


/* =========================================================
   ADVANCEMENTS
========================================================= */

const advancements = [
    [
        'Stone Age',
        'Mine stone with your new pickaxe.'
    ],
    [
        'Getting an Upgrade',
        'Construct a better pickaxe.'
    ],
    [
        'Acquire Hardware',
        'Smelt an iron ingot.'
    ],
    [
        'Suit Up',
        'Protect yourself with a piece of iron armor.'
    ],
    [
        'Hot Stuff',
        'Fill a bucket with lava.'
    ],
    [
        'Is It a Bird?',
        'Look at the End through a spyglass.'
    ],
    [
        'We Need to Go Deeper',
        'Build, light and enter a Nether portal.'
    ],
    [
        'Diamonds!',
        'Acquire diamonds.'
    ],
    [
        'A Terrible Fortress',
        'Break your way into a Nether fortress.'
    ],
    [
        'Eye Spy',
        'Throw an Eye of Ender.'
    ],
    [
        'The End?',
        'Enter the End dimension.'
    ],
    [
        'Free the End',
        'Defeat the Ender Dragon.'
    ]
];

const advancementKey = 'minecraftStuffAdvancements';

let done = JSON.parse(
    localStorage.getItem(advancementKey) || '[]'
);

advancements.forEach((advancement, index) => {
    const item = document.createElement('label');

    item.className = 'advancement';

    item.innerHTML = `
        <input
            type="checkbox"
            ${done.includes(index) ? 'checked' : ''}
        >

        <div>
            <div class="advancement-name">
                ${advancement[0]}
            </div>

            <div class="advancement-description">
                ${advancement[1]}
            </div>
        </div>
    `;

    const checkbox = item.querySelector('input');

    checkbox.addEventListener('change', () => {
        done = advancements
            .map((_, index) => index)
            .filter(index => qs('.advancement input')[index]?.checked);

        localStorage.setItem(
            advancementKey,
            JSON.stringify(done)
        );

        updateAdvancements();
    });

    $('advancementList').appendChild(item);
});

function updateAdvancements() {
    qs('.advancement').forEach((item, index) => {
        item.classList.toggle(
            'completed',
            qs('.advancement input')[index].checked
        );
    });

    const total = advancements.length;
    const count = done.length;
    const percentage = Math.round((count / total) * 100);

    $('advancementPercent').textContent =
        percentage + '%';

    $('advancementCount').textContent =
        `${count} / ${total}`;

    $('advancementBar').style.width =
        percentage + '%';

    $('dashboardProgress').textContent =
        percentage + '%';
}

updateAdvancements();


/* =========================================================
   MUSIC
========================================================= */

// Put your own audio files in /assets/music/
// using these names, or change the src values below.

const tracks = [
    {
        name: 'Sweden',
        artist: 'C418',
        src: 'assets/music/sweden.mp3'
    },

    {
        name: 'Subwoofer Lullaby',
        artist: 'C418',
        src: 'assets/music/subwoofer-lullaby.mp3'
    },

    {
        name: 'Moog City',
        artist: 'C418',
        src: 'assets/music/moog-city.mp3'
    },

    {
        name: 'Wet Hands',
        artist: 'C418',
        src: 'assets/music/wet-hands.mp3'
    },

    {
        name: 'Aria Math',
        artist: 'C418',
        src: 'assets/music/aria-math.mp3'
    },

    {
        name: 'Haggstrom',
        artist: 'C418',
        src: 'assets/music/haggstrom.mp3'
    },

    {
        name: 'Mice on Venus',
        artist: 'C418',
        src: 'assets/music/mice-on-venus.mp3'
    },

    {
        name: 'Moog City 2',
        artist: 'C418',
        src: 'assets/music/moog-city-2.mp3'
    }
];

let selectedTrack = 0;

const player = $('musicPlayer');

tracks.forEach((track, index) => {
    const button = document.createElement('button');

    button.className =
        'music-choice' +
        (index === 0 ? ' selected' : '');

    button.innerHTML = `
        <span class="track-icon">♫</span>

        <span>
            <strong>${track.name}</strong>
            <small>${track.artist}</small>
        </span>
    `;

    button.onclick = () => {
        selectTrack(index);
    };

    $('musicChoices').appendChild(button);
});

function selectTrack(index) {
    selectedTrack = index;

    qs('.music-choice').forEach((button, i) => {
        button.classList.toggle(
            'selected',
            index === i
        );
    });

    $('nowPlaying').textContent =
        tracks[index].name;

    $('musicStatus').textContent =
        'Selected. Press play when you are ready.';

    player.src = tracks[index].src;
}

async function playSelected() {
    if (!player.src) {
        selectTrack(selectedTrack);
    }

    try {
        await player.play();

        $('musicStatus').textContent =
            'Playing selected track.';

        $('musicPlayButton').textContent =
            'PAUSE MUSIC';

        $('musicToggle').classList.add('playing');

    } catch (error) {
        $('musicStatus').textContent =
            'Audio file not found or browser blocked playback. ' +
            'Add the MP3 to the music folder and press play again.';
    }
}

$('musicPlayButton').addEventListener('click', () => {
    player.paused
        ? playSelected()
        : player.pause();
});

$('musicToggle').addEventListener('click', () => {
    player.paused
        ? playSelected()
        : player.pause();
});

player.addEventListener('play', () => {
    $('musicPlayButton').textContent =
        'PAUSE MUSIC';

    $('musicToggle').classList.add('playing');
});

player.addEventListener('pause', () => {
    $('musicPlayButton').textContent =
        'PLAY SELECTED TRACK';

    $('musicToggle').classList.remove('playing');
});

player.addEventListener('ended', () => {
    selectedTrack =
        (selectedTrack + 1) % tracks.length;

    selectTrack(selectedTrack);
    playSelected();
});

$('musicVolume').addEventListener('input', event => {
    player.volume = event.target.value;

    $('volumeValue').textContent =
        Math.round(event.target.value * 100) + '%';
});

player.volume = 0.5;

selectTrack(0);
