(function(){
  var d=document, root=d.documentElement;
  root.classList.add('js');
  // Menú móvil
  var toggle=d.querySelector('[data-nav-toggle]'), menu=d.getElementById('menu-principal');
  if(toggle&&menu){
    var setOpen=function(o){menu.classList.toggle('is-open',o);toggle.setAttribute('aria-expanded',String(o));d.body.style.overflow=o?'hidden':'';};
    toggle.addEventListener('click',function(){setOpen(!menu.classList.contains('is-open'));});
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setOpen(false);});});
    d.addEventListener('keydown',function(e){if(e.key==='Escape')setOpen(false);});
  }
  // Cabecera al hacer scroll
  var header=d.querySelector('.site-header');
  var onScroll=function(){if(header)header.classList.toggle('is-scrolled',window.scrollY>40);};
  onScroll(); window.addEventListener('scroll',onScroll,{passive:true});
  // Animaciones de entrada
  var els=d.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('is-in');io.unobserve(en.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.08});
    els.forEach(function(el){io.observe(el);});
  } else { els.forEach(function(el){el.classList.add('is-in');}); }
  // Día de hoy en el horario
  var today=new Date().getDay();
  d.querySelectorAll('.hours tr[data-day]').forEach(function(tr){
    if(tr.getAttribute('data-day').split(',').indexOf(String(today))>-1) tr.classList.add('is-today');
  });
  // FAQ: solo una abierta a la vez
  d.querySelectorAll('.faq-block').forEach(function(block){
    var items=block.querySelectorAll('details');
    items.forEach(function(it){it.addEventListener('toggle',function(){if(it.open)items.forEach(function(o){if(o!==it)o.open=false;});});});
  });
  d.querySelectorAll('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear();});
})();
/* Carrusel de reseñas */
(function(){
  document.querySelectorAll('[data-carousel]').forEach(function(c){
    var track=c.querySelector('[data-track]'), cards=[].slice.call(track.children), dotsWrap=c.querySelector('[data-dots]');
    // "Leer más" solo si el texto está recortado
    cards.forEach(function(card){
      var t=card.querySelector('.g-text'), b=card.querySelector('.g-more');
      if(t&&b&&t.scrollHeight>t.clientHeight+4){b.hidden=false;b.addEventListener('click',function(){var o=card.classList.toggle('is-open');b.textContent=o?'Leer menos':'Leer más';});}
    });
    var perView=function(){var w=cards[0].getBoundingClientRect().width;return Math.max(1,Math.round(track.clientWidth/(w+22)));};
    var pages=function(){return Math.max(1,cards.length-perView()+1);};
    var idx=0, timer=null, paused=false;
    var renderDots=function(){
      dotsWrap.innerHTML='';
      for(var i=0;i<pages();i++){(function(i){var d=document.createElement('button');d.type='button';d.setAttribute('aria-label','Ir a la reseña '+(i+1));d.addEventListener('click',function(){go(i);restart();});dotsWrap.appendChild(d);})(i);}
      mark();
    };
    var mark=function(){[].forEach.call(dotsWrap.children,function(d,i){d.classList.toggle('is-active',i===idx);});};
    var go=function(i){var n=pages();idx=(i+n)%n;track.scrollTo({left:cards[idx].offsetLeft-track.offsetLeft,behavior:'smooth'});mark();};
    var restart=function(){clearInterval(timer);if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;timer=setInterval(function(){if(!paused&&!document.hidden)go(idx+1);},5500);};
    c.querySelector('[data-next]').addEventListener('click',function(){go(idx+1);restart();});
    c.querySelector('[data-prev]').addEventListener('click',function(){go(idx-1);restart();});
    c.addEventListener('mouseenter',function(){paused=true;});
    c.addEventListener('mouseleave',function(){paused=false;});
    c.addEventListener('focusin',function(){paused=true;});
    c.addEventListener('focusout',function(){paused=false;});
    var st;track.addEventListener('scroll',function(){clearTimeout(st);st=setTimeout(function(){
      var x=track.scrollLeft,best=0,bd=1e9;cards.forEach(function(cd,i){var dd=Math.abs(cd.offsetLeft-track.offsetLeft-x);if(dd<bd){bd=dd;best=i;}});
      idx=Math.min(best,pages()-1);mark();},120);},{passive:true});
    track.addEventListener('touchstart',function(){paused=true;restart();},{passive:true});
    track.addEventListener('touchend',function(){setTimeout(function(){paused=false;},4000);},{passive:true});
    window.addEventListener('resize',renderDots);
    renderDots();restart();
  });
})();
