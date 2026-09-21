import * as THREE from 'three';
export {THREE};
export function createWorld(canvas,light=false){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.setClearColor(light?0xd9e7e5:0x07151b);renderer.outputColorSpace=THREE.SRGBColorSpace;
 const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(light?0xffffff:0xc6fff3,light?0x8c917e:0x15262e,2.2));
 const key=new THREE.DirectionalLight(0xfff1db,3);key.position.set(4,12,8);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-14;key.shadow.camera.right=14;key.shadow.camera.top=14;key.shadow.camera.bottom=-14;scene.add(key);
 const camera=new THREE.PerspectiveCamera(48,1,.1,100);camera.position.set(11,10,14);camera.lookAt(0,1,0);
 const resize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};addEventListener('resize',resize);resize();
 return {scene,camera,renderer};
}
export function box(parent,x,y,z,w,h,d,color){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.65}));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
export function ball(parent,x,y,z,r,color){const m=new THREE.Mesh(new THREE.SphereGeometry(r,16,12),new THREE.MeshStandardMaterial({color,roughness:.35}));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
export function tube(parent,x,y,z,rt,rb,h,color,glass=false){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,24),new THREE.MeshStandardMaterial({color,transparent:glass,opacity:glass?.36:1,roughness:.25,side:THREE.DoubleSide}));m.position.set(x,y,z);m.castShadow=!glass;parent.add(m);return m;}
export function label(parent,text,x,y,z,scale=2,color='#d6fff2'){
 const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#0c232bdd';ctx.fillRect(0,0,512,128);ctx.fillStyle=color;ctx.font='600 32px sans-serif';ctx.textAlign='center';ctx.fillText(text,256,76);
 const m=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));m.position.set(x,y,z);m.scale.set(scale,scale/4,1);parent.add(m);return m;
}
export function person(parent,x,z,color=0x426aaf){
 const g=new THREE.Group();g.position.set(x,0,z);box(g,0,.95,0,.55,.72,.32,color);ball(g,0,1.58,0,.25,0x855134);ball(g,0,1.75,-.035,.225,0x2c2020);
 const limbs=[box(g,-.18,.37,0,.16,.7,.2,0x27374c),box(g,.18,.37,0,.16,.7,.2,0x27374c),box(g,-.4,1,0,.16,.64,.18,0x855134),box(g,.4,1,0,.16,.64,.18,0x855134)];parent.add(g);return {group:g,limbs};
}
export function safeStorage(key,value){try{if(value!==undefined)localStorage.setItem(key,JSON.stringify(value));return JSON.parse(localStorage.getItem(key)||'null');}catch{return null;}}
export function saveReport(name,report){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
