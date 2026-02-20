// Shared JS for gallery, lightbox and building rendering
(function(){
  document.addEventListener('click', function(e){
    // Card navigation (supports <a> links already)
  });

  // Simple lightbox for gallery items (images only)
  const gallery = document.getElementById('gallery');
  if(gallery){
    gallery.addEventListener('click', e=>{
      const img = e.target.closest('img');
      if(!img) return;
      openLightbox(img.src, img.alt||'');
    });
  }

  function openLightbox(src, alt){
    const overlay = document.createElement('div');
    overlay.style.position='fixed';overlay.style.inset=0;overlay.style.background='rgba(0,0,0,0.7)';overlay.style.display='flex';overlay.style.alignItems='center';overlay.style.justifyContent='center';overlay.style.zIndex=9999;
    const img = document.createElement('img');img.src=src;img.alt=alt;img.style.maxWidth='92%';img.style.maxHeight='92%';img.style.borderRadius='8px';
    overlay.appendChild(img);
    overlay.addEventListener('click', ()=>overlay.remove());
    document.body.appendChild(overlay);
  }

  // helper to parse query params
  function params(){return Object.fromEntries(new URLSearchParams(location.search));}

  // Building page rendering: if a global `buildingData` is present, render it
  if(window.buildingData && document.body){
    const container = document.querySelector('.container');
    if(!container) return;
    container.innerHTML = '';

    const header = document.createElement('div');header.className='header';
    const img = document.createElement('img');img.className='logo';img.src='images/LOGO.jpg';header.appendChild(img);
    const titleWrap = document.createElement('div');
    const h = document.createElement('div');h.className='title';h.textContent = buildingData.name;
    const sub = document.createElement('div');sub.style.color='#3b4656';sub.textContent = buildingData.subtitle||'';
    titleWrap.appendChild(h);titleWrap.appendChild(sub);header.appendChild(titleWrap);
    container.appendChild(header);

    const roomList = document.createElement('div');roomList.className='room-list';

    buildingData.floors.forEach(floor=>{
      const f = document.createElement('div');f.className='floor';
      const fh = document.createElement('h4');fh.textContent = floor.name;f.appendChild(fh);
      const grid = document.createElement('div');grid.className='room-grid';
      floor.rooms.forEach(r=>{
        const a = document.createElement('a');
        a.className='room';
        // link to room.html in same folder with query param
        a.href = `room.html?room=${encodeURIComponent(r)}&b=${encodeURIComponent(buildingData.id)}`;
        a.innerHTML = `<div class="badge">${floor.label}</div><strong>${r}</strong><small>${buildingData.name}</small>`;
        grid.appendChild(a);
      });
      f.appendChild(grid);
      roomList.appendChild(f);
    });

    container.appendChild(roomList);
  }

  // Room page rendering: if there's a .room-detail container expect variables via query
  if(document.body && document.body.querySelector('.room-detail')!==null){
    const p = params();
    const room = p.room || p.r || 'Room';
    const b = p.b || '';
    // title
    const title = document.querySelector('.title');
    if(title) title.textContent = `${b} — ${room}`;
    // try image/video sources (user will add files manually into the folder)
    const mediaImg = document.getElementById('media-img');
    const mediaVid = document.getElementById('media-vid');
    const tryNames = [`${room}.jpg`,`${room}.png`,`${room}.jpeg`,`${room}.webp`,`${room}.mp4`];
    // attempt to load image first
    let found=false;
    tryNames.forEach(name=>{
      if(found) return;
      const lower = name.toLowerCase();
      if(lower.endsWith('.mp4')){
        if(mediaVid){mediaVid.src = name; mediaVid.style.display='block'; mediaVid.onerror=function(){mediaVid.style.display='none'}; mediaVid.oncanplay=function(){found=true}};
      } else {
        if(mediaImg){mediaImg.src = name; mediaImg.style.display='block'; mediaImg.onerror=function(){mediaImg.style.display='none'}; mediaImg.onload=function(){found=true}};
      }
    });
  }
})();
