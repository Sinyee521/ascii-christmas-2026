(function(root){
  'use strict';
  const W=720,H=1280,TAU=Math.PI*2;
  const CONFIG={greeting:'MERRY CHRISTMAS',message:'愿这个冬天，有雪，有光，也有你。',speed:1,snow:true};
  let seed=521; function rnd(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
  const points=[], snow=[], ground=[];
  const add=(x,y,z,c,ch,size=9,glow=false,kind='tree')=>points.push({x,y,z,c,ch,size,glow,kind,phase:rnd()*TAU});
  // Layered branches: each tier has its own drooping rim and asymmetric needles.
  for(let tier=0;tier<7;tier++){
    const top=2.66-tier*.56, bottom=top-1.03, maxR=.42+tier*.23;
    for(let y=top;y>bottom;y-=.052){
      const u=(top-y)/1.03,rad=maxR*Math.pow(u,.8);
      const n=Math.max(9,Math.floor(rad*TAU/.055));
      for(let j=0;j<n;j++){
        const a=j/n*TAU+tier*.34,rr=rad*(1+.035*Math.sin(a*9+tier));
        const cc=rnd(); const color=cc<.22?'#4de3ba':cc<.47?'#39ac81':cc<.78?'#238660':'#80c87b';
        add(Math.cos(a)*rr,y+.02*Math.sin(a*13),Math.sin(a)*rr,color,'xvY*+:;'[Math.floor(rnd()*7)],8.2,false);
      }
    }
  }
  // A continuous golden helix sits just outside the foliage.
  for(let i=0;i<560;i++){
    const u=i/559,y=2.52-u*4.23,r=.10+u*1.80,a=u*TAU*4.2;
    add(Math.cos(a)*r,y,Math.sin(a)*r,'#ffd46b',i%4===0?'*':'+',9.4,true,'lights');
  }
  for(let i=0;i<85;i++){
    const u=.12+rnd()*.85,y=2.52-u*4.25,r=.12+u*1.80,a=rnd()*TAU;
    add(Math.cos(a)*r,y,Math.sin(a)*r,['#ff6b8c','#90baff','#ffe5a0'][i%3],'o@*'[i%3],10,true,'ornament');
  }
  // Cylindrical bark and five spreading roots, all made of ASCII marks.
  for(let y=-2.34;y<-1.56;y+=.055)for(let a=0;a<TAU;a+=.29)add(Math.cos(a)*.17,y,Math.sin(a)*.17,'#c58b56','|#:'[Math.floor(rnd()*3)],9,false,'trunk');
  for(let k=0;k<6;k++)for(let u=0;u<1;u+=.025)for(let j=0;j<3;j++){
    const a=k*TAU/6+.18*Math.sin(u*3),r=.12+u*.72;
    add(Math.cos(a)*r,-2.29-u*.13+j*.028,Math.sin(a)*r,'#ba824e',u>.7?'-':'#',9,false,'root');
  }
  // Extruded five-point star: sampled face, reverse face and side edges.
  const verts=Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,r=i%2?.19:.43;return [Math.cos(a)*r,Math.sin(a)*r];});
  function inside(x,y){let hit=false;for(let i=0,j=9;i<10;j=i++){const a=verts[i],b=verts[j];if((a[1]>y)!=(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
  for(let x=-.43;x<.44;x+=.041)for(let y=-.43;y<.44;y+=.049)if(inside(x,y))for(const z of [-.095,.095])add(x,3.12-y,z,'#ffe49a','*+x'[Math.floor(rnd()*3)],9.4,true,'star');
  for(let i=0;i<10;i++){let a=verts[i],b=verts[(i+1)%10];for(let u=0;u<1;u+=.08)for(let z=-.095;z<.1;z+=.047)add(a[0]+(b[0]-a[0])*u,3.12-a[1]-(b[1]-a[1])*u,z,'#f1ad39','+',9,true,'star');}
  function gift(cx,cz,w,h,color){
    const cy=-2.40+h/2;
    for(let face=0;face<3;face++)for(let a=-.5;a<=.51;a+=.095)for(let b=-.5;b<=.51;b+=.12){
      let x,y,z;
      if(face===0){x=a*w;y=b*h;z=w/2;}else if(face===1){x=w/2;y=b*h;z=a*w;}else{x=a*w;y=h/2;z=b*w;}
      const ribbon=Math.abs(a)<.075|| (face<2&&Math.abs(b)<.065);
      add(cx+x,cy+y,cz+z,ribbon?'#ffe3a0':color,ribbon?'+':'#',9,ribbon,'gift');
      // The opposite faces make the parcel retain depth all the way round.
      if(face<2)add(cx+(face===1?-w/2:x),cy+y,cz+(face===0?-w/2:z),ribbon?'#ffe3a0':color,ribbon?'+':'#',9,ribbon,'gift');
    }
    for(let i=0;i<64;i++){const a=i/64*TAU;add(cx+Math.sin(a)*.21,cy+h/2+.09+Math.sin(a*2)*.07,cz+Math.cos(a)*.10,'#ffe3a0','+',9,true,'gift');}
  }
  gift(-1.74,.55,.48,.58,'#e76882');gift(-.82,1.30,.45,.40,'#86a7e9');gift(.68,1.37,.57,.52,'#f2b85d');gift(1.75,.30,.52,.65,'#e4788f');gift(.9,-1.35,.43,.44,'#77c8bb');
  for(let i=0;i<260;i++)snow.push({x:rnd()*W,y:rnd()*H,s:.45+rnd()*1.25,v:15+rnd()*35,p:rnd()*TAU,ch:i%6?'·':'+'});
  for(let i=0;i<1100;i++){const a=rnd()*TAU,r=Math.sqrt(rnd())*3.2;ground.push({x:Math.cos(a)*r,z:Math.sin(a)*r,alpha:rnd()*.4});}
  const cache=new Map();let factory;
  function sprite(ch,c,size,glow,level){
    const key=[ch,c,size,glow,level].join('|');if(cache.has(key))return cache.get(key);
    const extent=glow?40:16,center=extent/2,s=factory(extent,extent),q=s.getContext('2d');q.font=`${size}px Consolas, "Courier New", monospace`;q.textAlign='center';q.textBaseline='middle';
    q.globalAlpha=level/5;
    if(glow){q.shadowColor=c;q.shadowBlur=9;q.fillStyle=c;q.fillText(ch,center,center);q.shadowBlur=3;}
    q.fillStyle=c;q.fillText(ch,center,center);cache.set(key,s);return s;
  }
  function smooth(a,b,x){let u=Math.max(0,Math.min(1,(x-a)/(b-a)));return u*u*(3-2*u);}
  function render(ctx,time,options={}){
    const cfg={...CONFIG,...options};factory=options.canvasFactory||factory||((w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;});
    const t=((time%20)+20)%20,rot=(t*TAU/20)*cfg.speed+.32;
    const cs=Math.cos(rot),sn=Math.sin(rot),bob=Math.sin(t*TAU/20)*.025;
    ctx.save();ctx.setTransform(ctx.canvas.width/W,0,0,ctx.canvas.height/H,0,0);
    ctx.fillStyle='#030914';ctx.fillRect(0,0,W,H);
    const halo=ctx.createRadialGradient(360,650,10,360,650,490);halo.addColorStop(0,'#0b1c25');halo.addColorStop(.6,'#07121e');halo.addColorStop(1,'#030914');ctx.fillStyle=halo;ctx.fillRect(0,0,W,H);
    if(cfg.snow){ctx.textAlign='center';ctx.font='10px Consolas, monospace';for(const s of snow){ctx.globalAlpha=.18+s.s*.23;ctx.fillStyle='#c6dcf2';const yy=(s.y+t*s.v)%H,xx=(s.x+Math.sin(t*.6+s.p)*16+W)%W;ctx.fillText(s.ch,xx,yy);}}
    ctx.globalAlpha=1;
    function project(x,y,z){let xx=x*cs+z*sn,zz=-x*sn+z*cs;const scale=1+zz*.035;return {x:360+xx*132*scale,y:690-y*142+zz*31,z:zz,s:scale};}
    ctx.font='8px Consolas, monospace';ctx.fillStyle='#60848c';
    for(const p of ground){const v=project(p.x,-2.46,p.z);ctx.globalAlpha=p.alpha*.6;ctx.fillText('.',v.x,v.y);}
    ctx.globalAlpha=1;
    const reveal=smooth(0,3,t),lightIn=smooth(2,4.5,t),starIn=smooth(3.1,4.6,t),giftIn=smooth(3.4,5.3,t);
    const projected=[];
    for(const p of points){
      let alpha=1;
      if(p.kind==='tree')alpha=smooth(p.y/5+.2,p.y/5+.68,reveal+ .22);
      if(p.kind==='lights'||p.kind==='ornament')alpha=lightIn;
      if(p.kind==='star')alpha=starIn;
      if(p.kind==='gift')alpha=giftIn;
      if(alpha<.015)continue;
      const v=project(p.x,p.y+bob,p.z);
      const depth=.36+.64*(v.z+2.3)/4.6;
      const twinkle=p.glow?.78+.22*Math.sin(t*3+p.phase):1;
      const level=Math.max(1,Math.min(5,Math.round(depth*twinkle*alpha*5)));
      projected.push({p,v,level,alpha});
    }
    projected.sort((a,b)=>a.v.z-b.v.z);
    for(const {p,v,level,alpha} of projected){ctx.globalAlpha=Math.min(1,alpha*2);const glyph=sprite(p.ch,p.c,p.size,p.glow,level);ctx.drawImage(glyph,v.x-glyph.width/2,v.y-glyph.height/2);}
    ctx.globalAlpha=1;
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle='#e9ce91';ctx.font='16px Consolas, "Courier New", monospace';ctx.fillText('A LITTLE LIGHT FOR YOU',360,78);
    ctx.fillStyle='#fff0ca';ctx.font='29px Consolas, "Courier New", monospace';ctx.fillText(cfg.greeting,360,121);
    ctx.fillStyle='#b5c6ce';ctx.font='18px "Microsoft YaHei", sans-serif';ctx.fillText('把冬天的星光，送给你',360,165);
    const msgAlpha=.4+.6*smooth(5,8,t);ctx.globalAlpha=msgAlpha;
    ctx.fillStyle='#f6dcaa';ctx.font='21px "Microsoft YaHei", sans-serif';ctx.fillText(cfg.message,360,1140);
    ctx.fillStyle='#8eacbc';ctx.font='13px Consolas, "Courier New", monospace';ctx.fillText('*  M A Y  Y O U R  D A Y S  B E  B R I G H T  *',360,1184);
    ctx.globalAlpha=1;
    ctx.restore();
    return {time:t,points:projected.length};
  }
  const api={render,duration:20,width:W,height:H,defaults:CONFIG};root.AsciiChristmas=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
