/* Procedural Three.js diorama: forest and companions are rendered from 3D meshes. */
(() => {
  const canvas = document.getElementById('forestCanvas');
  if (!canvas || !window.THREE) return;
  const T = window.THREE;
  const scene = new T.Scene();
  scene.background = new T.Color('#a9c49b');
  scene.fog = new T.Fog('#a9c49b', 18, 48);
  const camera = new T.PerspectiveCamera(42, 1, .1, 100);
  camera.position.set(0, 7.6, 14);
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  scene.add(new T.HemisphereLight('#efffdd', '#405a3c', 2.1));
  const sun = new T.DirectionalLight('#fff0c7', 3.1);
  sun.position.set(-7, 12, 8); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18 });
  sun.shadow.bias = -.0005; scene.add(sun);
  const material = (color, roughness = .9) => new T.MeshStandardMaterial({ color, roughness, flatShading: true });
  const ground = new T.Mesh(new T.PlaneGeometry(120, 120), material('#648651'));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -.12; ground.receiveShadow = true; scene.add(ground);
  const trailShape = new T.Shape();
  trailShape.moveTo(-2.2, 10); trailShape.quadraticCurveTo(-3.2, 1, -.9, -5);
  trailShape.quadraticCurveTo(-.1, -13, -1.9, -25); trailShape.lineTo(1.9, -25);
  trailShape.quadraticCurveTo(.8, -12, 1.15, -5); trailShape.quadraticCurveTo(3.2, 2, 2.2, 10); trailShape.closePath();
  const trail = new T.Mesh(new T.ShapeGeometry(trailShape, 14), material('#b8a477'));
  trail.rotation.x = -Math.PI / 2; trail.position.y = -.09; trail.receiveShadow = true; scene.add(trail);
  const bark = material('#654a35');
  const crowns = ['#31583d', '#3d6945', '#527b49', '#668950'].map(c => material(c));
  function tree(x, z, scale, n) {
    const group = new T.Group(); group.position.set(x, 0, z); group.scale.setScalar(scale); scene.add(group);
    const trunk = new T.Mesh(new T.CylinderGeometry(.16, .29, 2.45, 7), bark);
    trunk.position.y = 1.15; trunk.castShadow = true; group.add(trunk);
    if (n % 3 === 0) {
      for (let i = 0; i < 3; i++) {
        const crown = new T.Mesh(new T.ConeGeometry(1.05 - i * .12, 1.65, 7), crowns[(n + i) % 4]);
        crown.position.y = 2.2 + i * .76; crown.castShadow = true; crown.receiveShadow = true; group.add(crown);
      }
    } else {
      for (let i = 0; i < 3; i++) {
        const crown = new T.Mesh(new T.IcosahedronGeometry(1.05 - i * .13, 1), crowns[(n + i) % 4]);
        crown.position.set((i - 1) * .45, 2.75 + (i % 2) * .48, 0); crown.scale.y = 1.2;
        crown.castShadow = true; crown.receiveShadow = true; group.add(crown);
      }
    }
  }
  for (let i = 0; i < 38; i++) {
    const side = i % 2 ? 1 : -1;
    tree(side * (4.4 + Math.random() * 9), 10 - Math.random() * 39, .75 + Math.random() * 1.15, i);
  }
  const shrubMats = ['#4b7544', '#71934f', '#3e6842'].map(c => material(c));
  for (let i = 0; i < 42; i++) {
    const side = i % 2 ? 1 : -1;
    const bush = new T.Mesh(new T.IcosahedronGeometry(.4 + Math.random() * .45, 1), shrubMats[i % 3]);
    bush.position.set(side * (2.7 + Math.random() * 3.8), .25, 9 - Math.random() * 34);
    bush.scale.y = .65; bush.castShadow = true; bush.receiveShadow = true; scene.add(bush);
  }
  for (let i = 0; i < 36; i++) {
    const stone = new T.Mesh(new T.DodecahedronGeometry(.12 + Math.random() * .18, 0), material(i % 2 ? '#7d8065' : '#969174'));
    stone.position.set((Math.random() < .5 ? -1 : 1) * (2 + Math.random() * 1.1), .015, 8 - Math.random() * 28);
    stone.scale.set(1.5, .48, .9); stone.rotation.y = Math.random() * 3; stone.castShadow = true; scene.add(stone);
  }
  for (let i = 0; i < 17; i++) {
    const fern = new T.Group();
    fern.position.set((Math.random() < .5 ? -1 : 1) * (2.5 + Math.random() * 3.8), 0, 7 - Math.random() * 25); scene.add(fern);
    for (let j = 0; j < 5; j++) {
      const leaf = new T.Mesh(new T.ConeGeometry(.12, .8 + Math.random() * .5, 5), crowns[(i + j) % 4]);
      leaf.position.set((j - 2) * .15, .38, 0); leaf.rotation.z = (j - 2) * .27; leaf.castShadow = true; fern.add(leaf);
    }
  }
  const fireflies = [];
  for (let i = 0; i < 14; i++) {
    const glow = new T.Mesh(new T.SphereGeometry(.045 + Math.random() * .035, 8, 6), new T.MeshBasicMaterial({ color: '#fff0a1', transparent: true }));
    glow.position.set((Math.random() - .5) * 9, 1.2 + Math.random() * 3.5, -2 - Math.random() * 20);
    scene.add(glow); fireflies.push({ mesh: glow, phase: Math.random() * 6.28, base: glow.position.y });
  }
  const sunDisc = new T.Mesh(new T.SphereGeometry(1, 20, 12), new T.MeshBasicMaterial({ color: '#ffe6a1' }));
  sunDisc.position.set(-7, 9, -24); scene.add(sunDisc);
  const colors = {
    bulbasaur:['#64aa7d','#75bd8d','#438553','#559c63'], charmander:['#ed8b48','#f39b55','#d66c39','#ffb52e'],
    squirtle:['#67b8d0','#77c9df','#c88c58','#94694e'], pikachu:['#f1cb4e','#f5d65f','#bd5548','#e7bd37'],
    oddish:['#5276bd','#688bd1','#60a858','#60a858'], bellsprout:['#d2bd62','#dfcf77','#57934c','#57934c'],
    pidgey:['#ad8157','#c09465','#e8d0a1','#9d704d'], rattata:['#9c6a9c','#ae7dad','#e6b1a6','#895987'],
    eevee:['#b77b4e','#c68b59','#f1d5a5','#99603c'], caterpie:['#65ad67','#78c979','#db5e56','#65ad67'],
    weedle:['#bdac65','#d3c47c','#df7657','#a9934f']
  };
  const sphere = new T.SphereGeometry(1, 18, 12);
  let hero = null, heroKey = null, explorePulse = 0, targetYaw = 0;
  const part = (parent, geometry, mat, pos, size, rotation) => {
    const mesh = new T.Mesh(geometry, mat); mesh.position.set(...pos); mesh.scale.set(...size);
    if (rotation) mesh.rotation.set(...rotation); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  };
  function makeHero(key = 'bulbasaur') {
    if (hero) { scene.remove(hero); hero.traverse(o => { if (o.isMesh) o.material.dispose(); }); }
    heroKey = key;
    const palette = colors[key] || ['#d3a66d','#e2bd82','#886447','#886447'];
    const body = material(palette[0]), head = material(palette[1]), accent = material(palette[2]);
    const cream = material('#fff4dc'), ink = material('#26342c'), belly = material(key === 'squirtle' ? '#e5c7a2' : palette[2]);
    hero = new T.Group(); hero.position.set(-1.05, 0, 2.2); scene.add(hero);
    part(hero, sphere, body, [0,.62,0], [.65,.55,.78]);
    part(hero, sphere, head, [0,1.18,.34], [.61,.57,.53]);
    part(hero, sphere, belly, [0,.59,.65], [.39,.3,.16]);
    for (const x of [-.4,.4]) for (const z of [-.4,.45]) {
      part(hero, sphere, body, [x,.25,z], [.22,.29,.23]);
      for (let t=-1;t<=1;t++) part(hero,sphere,head,[x+t*.1,.08,z+.08],[.05,.045,.06]);
    }
    for (const x of [-.23,.23]) {
      part(hero,sphere,cream,[x,1.26,.78],[.12,.15,.055]);
      part(hero,sphere,ink,[x+.015,1.25,.83],[.055,.084,.026]);
      part(hero,sphere,cream,[x+.03,1.29,.85],[.022,.03,.012]);
    }
    part(hero, new T.SphereGeometry(.045,8,6), accent, [0,1.04,.85], [.9,.65,.5]);
    if (key === 'bulbasaur' || key === 'oddish') {
      part(hero,new T.IcosahedronGeometry(.52,1),material(palette[3]),[0,1.88,.08],[.83,.88,.8]);
      for (const [x,y,z] of [[-.31,2.08,.48],[.3,1.8,.47],[.04,2.25,.39],[-.4,1.75,.28]]) part(hero,sphere,material('#a6c76a'),[x,y,z],[.09,.12,.04]);
      if (key === 'bulbasaur') for (const x of [-.36,.36]) part(hero,new T.ConeGeometry(.15,.4,5),accent,[x,1.65,.12],[.8,1,.8],[0,0,x<0?-.38:.38]);
    } else if (key === 'charmander') {
      for (const x of [-.38,.38]) part(hero,new T.ConeGeometry(.13,.4,5),head,[x,1.68,.17],[.8,1,.8],[0,0,x<0?-.34:.34]);
      const curve = new T.CatmullRomCurve3([new T.Vector3(0,.52,-.58),new T.Vector3(.26,.34,-.98),new T.Vector3(.52,.48,-1.23)]);
      part(hero,new T.TubeGeometry(curve,18,.09,8,false),accent,[0,0,0],[1,1,1]);
      part(hero,new T.ConeGeometry(.17,.43,7),material(palette[3]),[.54,.72,-1.23],[1,1.3,1],[0,0,-.2]);
      part(hero,new T.SphereGeometry(.1,10,8),material('#fff0a0'),[.54,.65,-1.2],[1,1.4,1]);
    } else if (key === 'squirtle') {
      part(hero,new T.SphereGeometry(.62,16,10),material(palette[3]),[0,.7,-.34],[1.04,1,.46]);
      part(hero,new T.SphereGeometry(.48,16,10),material('#e0b879'),[0,.73,.02],[1,.82,.16]);
      for (const x of [-.35,.35]) part(hero,new T.ConeGeometry(.13,.35,5),head,[x,1.64,.18],[.8,1,.8],[0,0,x<0?-.3:.3]);
    } else {
      for (const x of [-.4,.4]) part(hero,new T.ConeGeometry(.15,.4,5),head,[x,1.67,.17],[.8,1,.8],[0,0,x<0?-.4:.4]);
      if (key === 'pikachu') for (const x of [-.48,.48]) part(hero,sphere,material('#e65f4f'),[x,1.08,.66],[.12,.09,.04]);
      if (key === 'eevee') part(hero,new T.ConeGeometry(.24,.43,6),material('#ead7b3'),[0,1.6,.15],[.85,1,.8]);
      if (key === 'bellsprout') part(hero,new T.SphereGeometry(.33,12,8),head,[0,1.75,.2],[1,.75,.9]);
      if (key === 'pidgey') for (const x of [-.53,.53]) part(hero,sphere,accent,[x,.73,-.05],[.3,.14,.48],[0,0,x<0?-.3:.3]);
      if (['rattata','eevee'].includes(key)) part(hero,new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(.4,.42,-.35),new T.Vector3(.72,.3,-.67),new T.Vector3(.8,.52,-.92)]),12,.055,7,false),accent);
    }
    hero.userData.baseY = 0;
  }
  let drag = null, zone = 0, lastTime = 0, cameraDistance = 14;
  const cameraTarget = new T.Vector3(0, .4, 0);
  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize, { passive: true });
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  canvas.addEventListener('pointerdown', event => {
    if (event.button !== undefined && event.button !== 0) return;
    drag = { x: event.clientX, yaw: targetYaw };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (!drag) return;
    targetYaw = Math.max(-.8, Math.min(.8, drag.yaw + (event.clientX - drag.x) * .007));
  });
  const endDrag = () => { drag = null; };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('wheel', event => {
    event.preventDefault();
    cameraDistance = Math.max(11, Math.min(19, cameraDistance + event.deltaY * .008));
  }, { passive: false });

  function animate(now) {
    requestAnimationFrame(animate);
    const dt = lastTime ? Math.min((now - lastTime) / 1000, .05) : 0;
    lastTime = now;
    elapsed = now * .001;
    if (hero) {
      const walking = explorePulse > 0;
      if (walking) explorePulse = Math.max(0, explorePulse - dt);
      const bob = Math.sin(elapsed * (walking ? 15 : 2.4)) * (walking ? .12 : .035);
      hero.position.y = bob + (walking ? Math.sin((1.45 - explorePulse) * 9) * .08 : 0);
      hero.position.z = 2.2 + (walking ? Math.sin((1.45 - explorePulse) * 4) * .23 : 0);
      hero.rotation.y += (targetYaw - hero.rotation.y) * Math.min(1, dt * 5);
      if (walking) hero.rotation.z = Math.sin(elapsed * 15) * .035;
      else hero.rotation.z += (0 - hero.rotation.z) * Math.min(1, dt * 4);
    }
    fireflies.forEach(f => {
      f.mesh.position.y = f.base + Math.sin(elapsed * 1.8 + f.phase) * .28;
      f.mesh.material.opacity = .55 + (Math.sin(elapsed * 2.5 + f.phase) + 1) * .2;
    });
    const orbitX = Math.sin(targetYaw) * cameraDistance;
    const orbitZ = Math.cos(targetYaw) * cameraDistance;
    camera.position.x += (orbitX - camera.position.x) * Math.min(1, dt * 4);
    camera.position.z += (orbitZ - camera.position.z) * Math.min(1, dt * 4);
    camera.lookAt(cameraTarget);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);

  window.forest3d = {
    setPokemon(key) {
      if (!key || key === heroKey) return;
      makeHero(key);
    },
    setZone(nextZone) {
      const next = Number(nextZone) || 0;
      if (next === zone) return;
      zone = next;
      const colors = zone > 0
        ? { sky: '#9ab58f', fog: '#9ab58f', ground: '#587b4a', trail: '#b7a176' }
        : { sky: '#a9c49b', fog: '#a9c49b', ground: '#648651', trail: '#b8a477' };
      scene.background.set(colors.sky);
      scene.fog.color.set(colors.fog);
      ground.material.color.set(colors.ground);
      trail.material.color.set(colors.trail);
    },
    explore() {
      explorePulse = 1.45;
    }
  };
})();
