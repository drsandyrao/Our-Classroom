(() => {
  "use strict";
  const DATA = window.MANIFESTO_DATA;
  const KEY = "living-manifesto-draft-v1";
  const today = new Date().toISOString().slice(0,10);
  const emptyState = () => ({schemaVersion:1,current:0,visited:[0],decisions:{},additions:{},meta:{title:DATA.title,version:"1.0",date:today,context:""},updated:new Date().toISOString()});
  let state = load();
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const key = (c,s) => `${c}:${s}`;

  function load(){try{const raw=localStorage.getItem(KEY);if(!raw)return emptyState();const parsed=JSON.parse(raw);if(parsed.meta&&["How We Will Be Together","Our Living Learning Manifesto"].includes(parsed.meta.title))parsed.meta.title=DATA.title;return parsed.schemaVersion===1?{...emptyState(),...parsed,meta:{...emptyState().meta,...parsed.meta}}:emptyState()}catch{return emptyState()}}
  function save(){state.updated=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(state));const el=$("#save-state");el.textContent="Saved on this device";renderProgress();renderFinal()}
  function decision(c,s){return state.decisions[key(c,s)]||{status:"undecided",text:DATA.categories[c].statements[s]}}
  function setDecision(c,s,status,text){state.decisions[key(c,s)]={status,text:text||DATA.categories[c].statements[s]};save();renderBuilder()}

  function renderNav(){const nav=$("#category-nav");nav.innerHTML=DATA.categories.map((_,i)=>`<button type="button" data-jump="${i}" class="${i===state.current?'current ':''}${state.visited.includes(i)?'visited':''}" aria-label="Category ${i+1}" ${i===state.current?'aria-current="step"':''}>${i+1}</button>`).join("")}
  function renderProgress(){const total=DATA.categories.reduce((n,c)=>n+c.statements.length,0);const decided=Object.values(state.decisions).filter(d=>["keep","edit","delete"].includes(d.status)).length;$("#progress-text").textContent=`${state.visited.length} of ${DATA.categories.length} categories visited`;$("#decision-count").textContent=`${decided} of ${total} seeds decided`;$("#progress-bar").style.width=`${(state.visited.length/DATA.categories.length)*100}%`;renderNav()}
  function renderBuilder(){const c=state.current,cat=DATA.categories[c];$("#builder").innerHTML=`<div class="category-head"><span class="category-count">${String(c+1).padStart(2,"0")} / ${DATA.categories.length}</span><h3>${esc(cat.title)}</h3><p>${esc(cat.prompt)}</p><details class="why"><summary>Why this is here</summary><p>${esc(cat.sources)}</p></details></div>${cat.statements.map((text,s)=>card(c,s,text)).join("")}<div class="add-box"><label for="new-addition">Add a commitment this category is missing</label><textarea id="new-addition" placeholder="We…"></textarea><button class="button secondary" type="button" data-add="${c}">Add commitment</button><div>${(state.additions[c]||[]).map((a,i)=>`<div class="addition"><textarea aria-label="Added commitment ${i+1}" data-addition="${i}">${esc(a)}</textarea><button class="icon-button" data-remove-addition="${i}" type="button">Remove</button></div>`).join("")}</div></div>`;$("#prev-category").disabled=c===0;$("#next-category").textContent=c===DATA.categories.length-1?"See manifesto":"Next category";renderProgress()}
  function card(c,s,text){const d=decision(c,s);return `<article class="seed-card" data-card="${s}"><p class="seed-text">${esc(text)}</p><div class="choice-row" role="group" aria-label="Decision for statement ${s+1}">${["keep","edit","delete"].map(x=>`<button type="button" class="choice ${x}" data-choice="${x}" data-seed="${s}" aria-pressed="${d.status===x}">${x.toUpperCase()}</button>`).join("")}</div>${d.status==="edit"?`<div class="edit-area"><label for="edit-${s}">Write the commitment in your own words</label><textarea id="edit-${s}" data-edit="${s}">${esc(d.text)}</textarea><button type="button" class="button secondary" data-save-edit="${s}">Save my edit</button></div>`:""}</article>`}
  function go(i){state.current=Math.max(0,Math.min(DATA.categories.length-1,i));if(!state.visited.includes(state.current))state.visited.push(state.current);save();renderBuilder();$("#builder").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})}

  function renderRepair(){$("#repair-path").innerHTML=DATA.repair.map(r=>`<li><h3>${esc(r.title)}</h3><p>${esc(r.text)}</p></li>`).join("")}
  function includedFor(c){const cat=DATA.categories[c];const items=[];cat.statements.forEach((t,s)=>{const d=decision(c,s);if(d.status==="keep")items.push(t);if(d.status==="edit"&&d.text.trim())items.push(d.text.trim())});(state.additions[c]||[]).filter(x=>x.trim()).forEach(x=>items.push(x.trim()));return items}
  function renderFinal(){const m=state.meta;const categories=DATA.categories.map((cat,c)=>{const items=includedFor(c);return `<section class="final-category"><p class="final-meta">${String(c+1).padStart(2,"0")} / ${DATA.categories.length}</p><h2>${esc(cat.title)}</h2>${items.length?`<ol>${items.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>`:`<p class="empty-note">No commitments retained in this category yet.</p>`}</section>`}).join("");$("#final-document").innerHTML=`<header class="final-cover"><p class="final-meta">${esc(m.context||"Our learning community")}</p><h1>${esc(m.title||DATA.title)}</h1><p>${esc(DATA.subtitle)}</p><p class="final-meta">Version ${esc(m.version||"1.0")} · ${esc(m.date||"Date not set")}</p></header>${categories}<section class="final-repair"><p class="final-meta">Our pathway when commitments are missed</p><h2>Accountability and repair</h2><ol>${DATA.repair.map(r=>`<li><h3>${esc(r.title)}</h3><p>${esc(r.text)}</p></li>`).join("")}</ol></section>`}
  function syncMeta(){state.meta={title:$("#doc-title").value,version:$("#version").value,date:$("#version-date").value,context:$("#context-name").value};save()}
  function hydrateMeta(){$("#doc-title").value=state.meta.title;$("#version").value=state.meta.version;$("#version-date").value=state.meta.date;$("#context-name").value=state.meta.context}
  async function downloadPdf(){
    const status=$("#pdf-status"),buttons=[$("#download-pdf"),$("#download-pdf-bottom")];
    if(!window.jspdf||!window.jspdf.jsPDF){status.textContent="PDF creation is unavailable. Open the live site in Chrome or Safari and try again.";return}
    buttons.forEach(b=>{b.disabled=true;b.textContent="Creating PDF…"});status.textContent="Creating your PDF. This can take a few moments.";
    const base=(state.meta.context||state.meta.title||"OUR-classroom").trim().replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"")||"OUR-classroom";
    try{
      const {jsPDF}=window.jspdf,doc=new jsPDF({unit:"pt",format:"letter",orientation:"portrait"});
      const pageW=612,pageH=792,left=54,right=54,bottom=54,textW=pageW-left-right;
      const fillPage=()=>{doc.setFillColor(255,253,248);doc.rect(0,0,pageW,pageH,"F")};
      const newPage=()=>{doc.addPage();fillPage();return 58};
      const clean=text=>String(text||"").replace(/[\u2018\u2019]/g,"'").replace(/[\u201C\u201D]/g,'"').replace(/\u00b7/g,"|");
      const lines=(text,width)=>doc.splitTextToSize(clean(text),width);
      const need=(y,height)=>y+height>pageH-bottom?newPage():y;
      fillPage();
      doc.setTextColor(24,35,31);doc.setFont("helvetica","bold");doc.setFontSize(11);doc.text(clean(state.meta.context||"Our learning community").toUpperCase(),left,116);
      doc.setFontSize(44);const titleLines=lines(state.meta.title||DATA.title,textW);doc.text(titleLines,left,190,{lineHeightFactor:1.05});
      doc.setFont("times","italic");doc.setFontSize(19);doc.setTextColor(56,84,216);doc.text(clean(DATA.subtitle),left,190+titleLines.length*48+14);
      doc.setFont("helvetica","normal");doc.setFontSize(10);doc.setTextColor(24,35,31);doc.text(`VERSION ${clean(state.meta.version||"1.0")}  |  ${clean(state.meta.date||"Date not set")}`,left,690);
      let y=newPage(),includedCategoryCount=0;
      DATA.categories.forEach((cat,c)=>{
        const items=includedFor(c);if(!items.length)return;includedCategoryCount++;
        const heading=lines(cat.title,textW),headingH=heading.length*25,bodyH=items.reduce((sum,item)=>sum+lines(item,textW-28).length*15+12,0);
        y=need(y,Math.min(headingH+bodyH+50,250));
        doc.setFont("helvetica","bold");doc.setFontSize(9);doc.setTextColor(56,84,216);doc.text(`${String(c+1).padStart(2,"0")} / ${DATA.categories.length}`,left,y);y+=22;
        doc.setFontSize(20);doc.setTextColor(24,35,31);doc.text(heading,left,y,{lineHeightFactor:1.12});y+=headingH+10;
        items.forEach((item,i)=>{const wrapped=lines(item,textW-28),h=wrapped.length*15+14;y=need(y,h);doc.setFont("helvetica","bold");doc.setFontSize(9);doc.setTextColor(56,84,216);doc.text(`${i+1}.`,left,y);doc.setFont("times","normal");doc.setFontSize(11);doc.setTextColor(24,35,31);doc.text(wrapped,left+28,y,{lineHeightFactor:1.35});y+=h});
        doc.setDrawColor(199,199,187);doc.line(left,y,left+textW,y);y+=30;
      });
      if(!includedCategoryCount){doc.setFont("times","italic");doc.setFontSize(14);doc.setTextColor(102,113,107);doc.text("No commitments have been retained yet.",left,y)}
      y=newPage();doc.setFont("helvetica","bold");doc.setFontSize(9);doc.setTextColor(56,84,216);doc.text("WHEN COMMITMENTS ARE MISSED",left,y);y+=28;doc.setFontSize(26);doc.setTextColor(24,35,31);doc.text("Accountability and repair",left,y);y+=35;
      DATA.repair.forEach((stage,i)=>{const body=lines(stage.text,textW-28),h=body.length*13+31;y=need(y,h);doc.setFont("helvetica","bold");doc.setFontSize(10);doc.setTextColor(56,84,216);doc.text(`${String(i+1).padStart(2,"0")}  ${clean(stage.title).toUpperCase()}`,left,y);y+=17;doc.setFont("times","normal");doc.setFontSize(10);doc.setTextColor(24,35,31);doc.text(body,left+28,y,{lineHeightFactor:1.3});y+=body.length*13+14});
      const total=doc.getNumberOfPages();for(let p=1;p<=total;p++){doc.setPage(p);doc.setFont("helvetica","normal");doc.setFontSize(8);doc.setTextColor(102,113,107);doc.text(`OUR classroom  |  ${p} / ${total}`,left,pageH-25)}
      doc.setProperties({title:clean(state.meta.title||DATA.title),subject:"Living Learning Manifesto",creator:"OUR classroom"});
      doc.save(`${base}-manifesto-v${state.meta.version||"1.0"}.pdf`);status.textContent="PDF downloaded. Check your Downloads folder."
    }catch(error){console.error(error);status.textContent="The PDF could not be created here. Try the live site in Chrome or Safari, or use Browser print."}finally{buttons.forEach(b=>{b.disabled=false;b.textContent="Download PDF"})}
  }
  document.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.jump!==undefined)return go(+b.dataset.jump);if(b.dataset.choice){const s=+b.dataset.seed,d=decision(state.current,s);return setDecision(state.current,s,b.dataset.choice,b.dataset.choice==="edit"?d.text:DATA.categories[state.current].statements[s])}if(b.dataset.saveEdit!==undefined){const s=+b.dataset.saveEdit,t=$(`[data-edit="${s}"]`).value.trim();if(!t)return alert("Write your revised commitment before saving.");return setDecision(state.current,s,"edit",t)}if(b.dataset.add!==undefined){const t=$("#new-addition").value.trim();if(!t)return alert("Write the commitment you want to add.");(state.additions[state.current]??=[]).push(t);save();renderBuilder()}if(b.dataset.removeAddition!==undefined){state.additions[state.current].splice(+b.dataset.removeAddition,1);save();renderBuilder()}});
  document.addEventListener("change",e=>{if(e.target.matches("[data-addition]")){state.additions[state.current][+e.target.dataset.addition]=e.target.value;save()}if(e.target.matches("#doc-title,#version,#version-date,#context-name"))syncMeta()});
  $("#prev-category").addEventListener("click",()=>go(state.current-1));$("#next-category").addEventListener("click",()=>state.current===DATA.categories.length-1?$("#manifesto").scrollIntoView({behavior:"smooth"}):go(state.current+1));$("#download-pdf").addEventListener("click",downloadPdf);$("#download-pdf-bottom").addEventListener("click",downloadPdf);$("#reset-button").addEventListener("click",()=>{if(confirm("Start a new classroom? This clears the private draft stored in this browser. Save or print the current manifesto first if you need it.")){state=emptyState();save();hydrateMeta();renderBuilder()}});$(".menu-button").addEventListener("click",e=>{const nav=$("#site-nav"),open=nav.classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",open)});$("#site-nav").addEventListener("click",()=>{$("#site-nav").classList.remove("open");$(".menu-button").setAttribute("aria-expanded","false")});
  hydrateMeta();renderRepair();renderBuilder();renderFinal();
})();
