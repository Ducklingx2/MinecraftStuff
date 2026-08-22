const $=id=>document.getElementById(id);
const qs=(s,p=document)=>[...p.querySelectorAll(s)];

// ---------- navigation ----------
function showPage(id){
  qs('.page').forEach(p=>p.classList.toggle('active-page',p.id===id));
  qs('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===id));
  window.scrollTo({top:0,behavior:'smooth'});
}
qs('[data-page]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));

// ---------- clock ----------
function updateClock(){ $('clock').textContent=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'}); }
updateClock(); setInterval(updateClock,1000);

// ---------- survival ----------
$('assessButton').addEventListener('click',()=>{
  const health=+$('health').value, armor=+$('armor').value, food=+$('food').value, mobs=+$('mobs').value, distance=+$('distance').value, diamonds=+$('diamonds').value, slots=+$('slots').value;
  let danger=0;
  danger+=(20-health)*3.2; danger+=(20-armor)*1.8; danger+=(20-food)*1.7; danger+=Math.min(mobs*8,40); danger+=Math.max(0,20-distance)*1.2; danger+=diamonds>=10?8:diamonds>0?3:0; danger+=Math.max(0,slots-30)*1.5; danger=Math.max(0,Math.min(100,Math.round(danger)));
  const levels=danger<15?['SAFE','threat-safe','You are suspiciously competent.']:danger<35?['CAUTION','threat-caution','Something could go wrong.']:danger<60?['DANGER','threat-danger','You should probably stop doing whatever this is.']:danger<80?['SEVERE','threat-severe','Your respawn screen is getting closer.']:['ABSURD','threat-absurd','The game has filed a formal complaint against you.'];
  const r=$('survivalResult'); r.className='result-panel '+(danger>=60?'danger-panel':'')+(danger>=80?' absurd-panel':''); r.innerHTML=`<div class="eyebrow">THREAT ASSESSMENT</div><div class="threat-title ${levels[1]}">${levels[0]}</div><div class="threat-bar"><div class="threat-fill" style="width:${danger}%"></div></div><p>${levels[2]}</p><div class="analysis-meta">THREAT INDEX: ${danger}/100<br>HEALTH ${health}/20 · ARMOR ${armor}/20 · FOOD ${food}/20<br>MOBS ${mobs} · DANGER DISTANCE ${distance}m · DIAMONDS ${diamonds} · SLOTS ${slots}/36</div>`;
});

// ---------- court ----------
$('courtButton').addEventListener('click',()=>{
  const defendant=$('defendant').value.trim()||'Unknown Steve', crime=$('crime').value.trim()||'being suspicious', evidence=$('evidence').value.trim()||'absolutely no evidence';
  const serious=/murder|kill|grief|steal|stole|theft|lava|destroy/i.test(crime); const guilty=serious||evidence.length>18;
  const verdict=guilty?'GUILTY':'NOT GUILTY'; const sentence=guilty?['Pay 12 diamonds to the court.','Three hours of community mining.','Confiscation of the suspicious item.'][Math.floor(Math.random()*3)]:'Released due to catastrophic lack of evidence.';
  $('courtResult').innerHTML=`<div class="eyebrow">VERDICT</div><div class="threat-title ${guilty?'threat-severe':'threat-safe'}">${verdict}</div><h2>${defendant}</h2><p><strong>Charge:</strong> ${escapeHTML(crime)}<br><strong>Evidence:</strong> ${escapeHTML(evidence)}</p><div class="anvil-step">SENTENCE: ${sentence}</div><div class="analysis-meta">CASE STATUS: CLOSED · JURISDICTION: OVERWORLD</div>`;
});
function escapeHTML(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

// ---------- redstone ----------
const redstoneData=[['Redstone Dust','Carries a redstone signal. Signal strength decreases with distance.','Connect components, transmit power, and make machines behave in ways that alarm villagers.'],['Repeater','Refreshes a signal, adds delay, and prevents it from travelling backward.','Useful for timing circuits, extending signals, and building clocks.'],['Comparator','Reads container fullness and compares or subtracts signal strength.','Essential for item sorters, storage systems, and clever contraptions.'],['Observer','Detects block updates and emits a short pulse.','Perfect for automatic farms, doors, flying machines, and general redstone nonsense.'],['Piston','Pushes blocks when powered. Sticky pistons can pull one block back.','Use for doors, elevators, farms, hidden entrances, and machines.'],['Redstone Torch','A power source that can also invert signals.','The classic NOT gate and one of the foundational redstone components.']];
redstoneData.forEach((d,i)=>{const b=document.createElement('button');b.className='component-button'+(i===0?' active':'');b.textContent=d[0];b.onclick=()=>{qs('.component-button').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderRedstone(d)};$('redstoneList').appendChild(b);});
function renderRedstone(d){$('redstoneInfo').innerHTML=`<div class="eyebrow">COMPONENT</div><h2>${d[0]}</h2><p>${d[1]}</p><div class="redstone-demo">${d[2]}</div>`} renderRedstone(redstoneData[0]);

// ---------- potions ----------
const potions={Speed:['Sugar','Makes you faster.'],Strength:['Blaze Powder','Increases melee damage.'],Night Vision:['Golden Carrot','Lets you see clearly in darkness.'],Fire Resistance:['Magma Cream','Protects against fire and lava.'],Water Breathing:['Pufferfish','Lets you breathe underwater.'],Swiftness:['Sugar','Speed effect, because apparently walking was too difficult.']};
Object.keys(potions).forEach(x=>{const o=document.createElement('option');o.value=x;o.textContent=x;$('potionEffect').appendChild(o)});
$('brewButton').addEventListener('click',()=>{const e=$('potionEffect').value,m=$('potionModifier').value,base=potions[e][0];const mod=m==='extended'?'Redstone Dust':m==='strong'?'Glowstone Dust':'No modifier';$('brewResult').innerHTML=`<h2>${e} Potion</h2><p>Base ingredient: <strong>${base}</strong><br>Modifier: <strong>${mod}</strong></p><div class="analysis-meta">BREWING STATUS: READY · EFFECT: ${m.toUpperCase()}</div>`});

// ---------- detective ----------
$('imageInput').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const url=URL.createObjectURL(f);$('imagePreview').src=url;$('imagePreview').style.display='block';$('detectResult').textContent='Screenshot loaded. Press ANALYZE SCREENSHOT.'});
$('detectButton').addEventListener('click',()=>{if(!$('imageInput').files[0]){$('detectResult').innerHTML='<p>No screenshot selected.</p>';return}$('detectResult').innerHTML='<div class="anvil-step">LOCAL ANALYSIS COMPLETE</div><p>Image loaded successfully. A real block detector would need a vision model. This demo keeps the analysis honest instead of pretending a div is AI.</p>'});

// ---------- enchantments ----------
const ench=['Sharpness','Looting','Unbreaking','Mending','Efficiency','Fortune','Silk Touch','Protection','Feather Falling','Power','Infinity','Flame'];
const enchBox=$('enchantmentChecks'); ench.forEach(x=>{const l=document.createElement('label');l.className='enchantment-option';l.innerHTML=`<input type="checkbox" value="${x}"> ${x}`;enchBox.appendChild(l)});
$('enchantmentButton').addEventListener('click',()=>{const selected=qs('#enchantmentChecks input:checked').map(x=>x.value);const item=$('enchantmentItem').value;if(!selected.length){$('enchantmentResult').innerHTML='<div class="eyebrow">ANVIL PLAN</div><h2>Nothing selected.</h2><p>Choose at least one enchantment.</p>';return}$('enchantmentResult').innerHTML=`<div class="eyebrow">ANVIL PLAN</div><h2>${item}</h2>${selected.map((x,i)=>`<div class="anvil-step">STEP ${i+1} · Apply ${x}</div>`).join('')}<p>Recommended order generated from your selected enchantments. Minecraft remains free to charge you an absurd number of levels.</p>`});

// ---------- crafting ----------
const recipes={Torch:{Coal:1,'Stick':1},Chest:{'Oak Planks':8},Furnace:{Cobblestone:8},Crafting_Table:{'Oak Planks':4},Bucket:{Iron:3},Shield:{Iron:1,'Oak Planks':6},Lantern:{Iron:8,Torch:1},Boat:{'Oak Planks':5}};
Object.keys(recipes).forEach(x=>{const o=document.createElement('option');o.value=x;o.textContent=x.replace('_',' ');$('craftingItem').appendChild(o)});
$('craftingButton').addEventListener('click',()=>{const item=$('craftingItem').value,q=Math.max(1,+$('craftingQuantity').value||1),r=recipes[item];$('craftingResult').innerHTML=Object.entries(r).map(([m,n])=>`<div class="material-card"><strong>${n*q}</strong><span>${m}</span></div>`).join('')});

// ---------- build planner ----------
$('buildButton').addEventListener('click',()=>{const w=Math.min(25,Math.max(3,+$('buildWidth').value||3)),l=Math.min(25,Math.max(3,+$('buildLength').value||3)),h=Math.min(15,Math.max(1,+$('buildHeight').value||1));let out='';for(let y=1;y<=h;y++){out+=`<div class="layer"><div class="layer-title">LAYER ${y} · ${$('buildBlock').value.toUpperCase()}</div><div class="block-grid" style="grid-template-columns:repeat(${w},23px)">${'<div class="block"></div>'.repeat(w*l)}</div></div>`}$('blueprint').innerHTML=out});

// ---------- advancements ----------
const advs=[['Stone Age','Mine stone with your new pickaxe.'],['Getting an Upgrade','Construct a better pickaxe.'],['Acquire Hardware','Smelt an iron ingot.'],['Suit Up','Protect yourself with a piece of iron armor.'],['Hot Stuff','Fill a bucket with lava.'],['Is It a Bird?','Look at the End through a spyglass.'],['We Need to Go Deeper','Build, light and enter a Nether portal.'],['Diamonds!','Acquire diamonds.'],['A Terrible Fortress','Break your way into a Nether fortress.'],['Eye Spy','Throw an Eye of Ender.'],['The End?','Enter the End dimension.'],['Free the End','Defeat the Ender Dragon.']];
const advKey='minecraftStuffAdvancements';let done=JSON.parse(localStorage.getItem(advKey)||'[]');
advs.forEach((a,i)=>{const d=document.createElement('label');d.className='advancement';d.innerHTML=`<input type="checkbox" ${done.includes(i)?'checked':''}><div><div class="advancement-name">${a[0]}</div><div class="advancement-description">${a[1]}</div></div>`;const cb=d.querySelector('input');cb.addEventListener('change',()=>{done=advs.map((_,j)=>j).filter(j=>qs('.advancement input')[j]?.checked);localStorage.setItem(advKey,JSON.stringify(done));updateAdv()});$('advancementList').appendChild(d)});
function updateAdv(){qs('.advancement').forEach((x,i)=>x.classList.toggle('completed',qs('.advancement input')[i].checked));const total=advs.length,count=done.length,p=Math.round(count/total*100);$('advancementPercent').textContent=p+'%';$('advancementCount').textContent=`${count} / ${total}`;$('advancementBar').style.width=p+'%';$('dashboardProgress').textContent=p+'%'} updateAdv();

// ---------- music ----------
// Put your own audio files in /music/ using these names, or change the src values below.
const tracks=[
  {name:'Overworld',artist:'Minecraft Stuff',src:'music/overworld.mp3'},
  {name:'Night Mining',artist:'Minecraft Stuff',src:'music/night-mining.mp3'},
  {name:'Deep Cave',artist:'Minecraft Stuff',src:'music/deep-cave.mp3'},
  {name:'Building Mode',artist:'Minecraft Stuff',src:'music/building.mp3'}
];
let selectedTrack=0;const player=$('musicPlayer');
tracks.forEach((t,i)=>{const b=document.createElement('button');b.className='music-choice'+(i===0?' selected':'');b.innerHTML=`<span class="track-icon">♫</span><span><strong>${t.name}</strong><small>${t.artist}</small></span>`;b.onclick=()=>selectTrack(i);$('musicChoices').appendChild(b)});
function selectTrack(i){selectedTrack=i;qs('.music-choice').forEach((b,j)=>b.classList.toggle('selected',i===j));$('nowPlaying').textContent=tracks[i].name;$('musicStatus').textContent='Selected. Press play when you are ready.';player.src=tracks[i].src;}
async function playSelected(){if(!player.src)selectTrack(selectedTrack);try{await player.play();$('musicStatus').textContent='Playing selected track.';$('musicPlayButton').textContent='PAUSE MUSIC';$('musicToggle').classList.add('playing')}catch(e){$('musicStatus').textContent='Audio file not found or browser blocked playback. Add the MP3 to the music folder and press play again.'}}
$('musicPlayButton').addEventListener('click',()=>player.paused?playSelected():player.pause());$('musicToggle').addEventListener('click',()=>player.paused?playSelected():player.pause());player.addEventListener('play',()=>{$('musicPlayButton').textContent='PAUSE MUSIC';$('musicToggle').classList.add('playing')});player.addEventListener('pause',()=>{$('musicPlayButton').textContent='PLAY SELECTED TRACK';$('musicToggle').classList.remove('playing')});player.addEventListener('ended',()=>{selectedTrack=(selectedTrack+1)%tracks.length;selectTrack(selectedTrack);playSelected()});$('musicVolume').addEventListener('input',e=>{player.volume=e.target.value;$('volumeValue').textContent=Math.round(e.target.value*100)+'%'});player.volume=.5;selectTrack(0);
