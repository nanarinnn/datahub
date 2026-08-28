import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const CONFIG = {
  wallColor: '#ede9f5',       // 연한 라벤더 파스텔
  floorColor: '#ddd4ef',     // 연한 연보라 파스텔 (조금 더 채도)
  counterColor: '#8a65b0',   // 중간 보라
  counterTopColor: '#5c3f88',// 진한 보라
  tableColor: '#f3ecff',     // 크림-연보라 (바닥과 구분)
  chairColor: '#c99acc',     // 채도 있는 보라-핑크 (잘 보이도록)
  cupHolderColor: '#a855f7',
  
  bannerUrl: './birthday/banner.png', 
  frameUrl: './birthday/birthday_2.png',
  horizontalFrameUrl: './birthday/birthday_1.png', 
  cupUrl: './birthday/cupholder.png',
  standingBannerUrl: './birthday/banner_stand.png',
  
  counterBannerUrl: './birthday/plancard.png', 
  tablePropUrl: './birthday/acr.png',         
  signboardUrl: './birthday/front.png',          
  
  photo1Url: './birthday/vertial.jpg', 
  photo2Url: './birthday/study.jpg',
  photo3Url: './birthday/hazu.jpg',
  photo4Url: './birthday/kirakira.jpg',
  photo5Url: './birthday/nai.jpg',
  photo6Url: './birthday/lavu.jpg'
};

export default function MiniRoom() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0d3a'); 

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 15, 17);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio); 
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Reinhard 톤 맵핑: 이미지 노출과다 화이트아웃 현상 없이 원색 보존
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1.0;
    // sRGB 콜러스페이스: 이미지 원색 보증
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; 
    controls.minDistance = 2;
    controls.maxDistance = 80;
    controls.target.set(0, 1.5, 0);

    const textureLoader = new THREE.TextureLoader();

    function loadTex(url, material) {
      textureLoader.load(url, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace; // 원색 보존
        material.map = texture;
        material.needsUpdate = true;
      });
    }

    let floorMaterial = new THREE.MeshStandardMaterial({ roughness: 0.8, color: CONFIG.floorColor });
    let wallMaterial = new THREE.MeshStandardMaterial({ roughness: 0.9, color: CONFIG.wallColor });
    let counterMaterial = new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0.1, color: CONFIG.counterColor });
    let counterTopMat = new THREE.MeshStandardMaterial({ color: CONFIG.counterTopColor, roughness: 0.4 });
    let tableMaterial = new THREE.MeshStandardMaterial({ roughness: 0.4, color: CONFIG.tableColor });
    let chairMaterial = new THREE.MeshStandardMaterial({ roughness: 0.5, color: CONFIG.chairColor });
    let metalMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.1 });
    
    let cupBodyMaterial = new THREE.MeshStandardMaterial({ roughness: 0.4 });
    let cupCapMaterial = new THREE.MeshStandardMaterial({ color: CONFIG.cupHolderColor, roughness: 0.4 });

    let bannerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    let frameMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    let horizontalFrameMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    let standingBannerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    let counterBannerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    let tablePropMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    let signboardMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    loadTex(CONFIG.bannerUrl, bannerMaterial);
    loadTex(CONFIG.frameUrl, frameMaterial);
    loadTex(CONFIG.horizontalFrameUrl, horizontalFrameMaterial);
    loadTex(CONFIG.standingBannerUrl, standingBannerMaterial);
    loadTex(CONFIG.counterBannerUrl, counterBannerMat);
    loadTex(CONFIG.tablePropUrl, tablePropMat);
    loadTex(CONFIG.signboardUrl, signboardMat);

    textureLoader.load(CONFIG.cupUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.center.set(0.5, 0.5);
      texture.repeat.set(1, 1);
      texture.offset.x = 0.5;
      cupBodyMaterial.map = texture;
      cupBodyMaterial.needsUpdate = true;
    });

    // 갤러리 그룹
    const photoGroup = new THREE.Group();
    photoGroup.position.set(-6.85, 3.5, 4); 
    photoGroup.rotation.y = Math.PI / 2;
    scene.add(photoGroup);

    const photoUrls = [
      CONFIG.photo1Url, CONFIG.photo2Url, 
      CONFIG.photo3Url, CONFIG.photo4Url,
      CONFIG.photo5Url, CONFIG.photo6Url
    ];

    Promise.all(photoUrls.map(url => {
      return new Promise((resolve) => {
        textureLoader.load(url, (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace; // 원색 보존
          resolve(texture);
        }, undefined, () => resolve(null));
      });
    })).then(textures => {
      const targetHeight = 1.0; 
      const gap = 0.2;          

      function createRow(rowTextures, yPos) {
        let meshes = [];
        let totalWidth = 0;

        rowTextures.forEach(tex => {
          let width = targetHeight; 
          let mat = new THREE.MeshBasicMaterial({ color: 0x4a3b65 }); 

          if (tex) {
            const aspect = tex.image.width / tex.image.height;
            width = targetHeight * aspect; 
            mat = new THREE.MeshBasicMaterial({ map: tex });
          }

          const geo = new THREE.PlaneGeometry(width, targetHeight);
          const mesh = new THREE.Mesh(geo, mat);
          meshes.push({ mesh, width });
          totalWidth += width; 
        });

        totalWidth += gap * (meshes.length - 1);
        let startX = -totalWidth / 2; 

        meshes.forEach(item => {
          item.mesh.position.set(startX + item.width / 2, yPos, 0.01);
          photoGroup.add(item.mesh);
          startX += item.width + gap; 
        });
      }

      createRow(textures.slice(0, 2), 1.1);   
      createRow(textures.slice(2, 4), 0.0);   
      createRow(textures.slice(4, 6), -1.1);  
    });

    // ─── 조명 설정 ───────────────────────────────────────────────
    // MeshBasicMaterial(이미지/배너)은 빛 영향 없음 → 조명을 바꿔도 사진 색상 불변
    // MeshStandardMaterial(벽/바닥/가구)만 조명에 반응

    // 전체 방을 고르게 밝히는 앰비언트 (과하지 않게)
    const ambientLight = new THREE.AmbientLight('#ffffff', 1.6);
    scene.add(ambientLight);

    // 반구 조명: 위→아래 화이트/연보라 → 부드럽고 고른 실내 분위기
    const hemiLight = new THREE.HemisphereLight('#ffffff', '#d8c8f0', 0.9);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    // 분위기용 연보라 포인트 라이트 (낮게 유지)
    const pointLight = new THREE.PointLight('#c084fc', 0.4, 16);
    pointLight.position.set(-3.5, 3.5, -2);
    scene.add(pointLight);

    // 전면 보조 화이트 포인트 라이트
    const fillLight = new THREE.PointLight('#ffffff', 0.5, 25);
    fillLight.position.set(4, 6, 6);
    scene.add(fillLight);

    // 방 구조물 (바닥 및 벽면)
    const floorGeo = new THREE.BoxGeometry(14, 0.2, 14);
    const floor = new THREE.Mesh(floorGeo, floorMaterial);
    floor.position.y = -0.1;
    floor.receiveShadow = true;
    scene.add(floor);

    const wallBackGeo = new THREE.BoxGeometry(14, 7, 0.2);
    const wallBack = new THREE.Mesh(wallBackGeo, wallMaterial);
    wallBack.position.set(0, 3.5, -7);
    wallBack.receiveShadow = true;
    scene.add(wallBack);

    const wallLeftGeo = new THREE.BoxGeometry(0.2, 7, 14);
    const wallLeft = new THREE.Mesh(wallLeftGeo, wallMaterial);
    wallLeft.position.set(-7, 3.5, 0);
    wallLeft.receiveShadow = true;
    scene.add(wallLeft);

    // 메인 배너
    const bannerFrameMat = new THREE.MeshStandardMaterial({ color: 0x2a1b3d, roughness: 0.8 });
    const bannerGeo = new THREE.PlaneGeometry(7.0, 2.8);
    const banner = new THREE.Mesh(bannerGeo, bannerMaterial);
    banner.position.set(0.0, 4.2, -6.85); 
    scene.add(banner);

    const bannerFrameGeo = new THREE.BoxGeometry(7.2, 3.0, 0.05);
    const bannerFrame = new THREE.Mesh(bannerFrameGeo, bannerFrameMat);
    bannerFrame.position.set(0, 4.2, -6.89);
    scene.add(bannerFrame);

    // 세로 액자
    const frameGeo = new THREE.PlaneGeometry(2.4, 3.4);
    const frame = new THREE.Mesh(frameGeo, frameMaterial);
    frame.rotation.y = Math.PI / 2;
    frame.position.set(-6.85, 3.5, -4.2); 
    scene.add(frame);
    
    const frameBorderGeo = new THREE.BoxGeometry(0.05, 3.6, 2.6);
    const frameBorder = new THREE.Mesh(frameBorderGeo, bannerFrameMat);
    frameBorder.position.set(-6.89, 3.5, -4.2);
    scene.add(frameBorder);

    // 가로 액자
    const horizontalFrameGeo = new THREE.PlaneGeometry(4.2, 3.0);
    const horizontalFrame = new THREE.Mesh(horizontalFrameGeo, horizontalFrameMaterial);
    horizontalFrame.rotation.y = Math.PI / 2;
    horizontalFrame.position.set(-6.85, 3.5, -0.3); 
    scene.add(horizontalFrame);

    const horizontalBorderGeo = new THREE.BoxGeometry(0.05, 3.2, 4.4);
    const horizontalBorder = new THREE.Mesh(horizontalBorderGeo, bannerFrameMat);
    horizontalBorder.position.set(-6.89, 3.5, -0.3);
    scene.add(horizontalBorder);

    // 커피 머신
    const coffeeMachineGroup = new THREE.Group();
    coffeeMachineGroup.position.set(3.0, 2.275, -4.2); 
    const bodyGeo = new THREE.BoxGeometry(1.2, 1.4, 1.0);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, metalness: 0.8, roughness: 0.3 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.7;
    body.castShadow = true;
    coffeeMachineGroup.add(body);
    const hopperGeo = new THREE.BoxGeometry(0.8, 0.4, 0.7);
    const hopperMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
    const hopper = new THREE.Mesh(hopperGeo, hopperMat);
    hopper.position.set(0, 1.6, 0);
    hopper.castShadow = true;
    coffeeMachineGroup.add(hopper);
    const groupHeadGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16);
    const groupHead = new THREE.Mesh(groupHeadGeo, metalMat);
    groupHead.position.set(0, 0.6, 0.35);
    coffeeMachineGroup.add(groupHead);
    const trayGeo = new THREE.BoxGeometry(1.2, 0.1, 1.1);
    const tray = new THREE.Mesh(trayGeo, metalMat);
    tray.position.set(0, 0.05, 0.05);
    coffeeMachineGroup.add(tray);
    scene.add(coffeeMachineGroup);

    // 카운터 
    const counterGroup = new THREE.Group();
    const counterMainGeo = new THREE.BoxGeometry(6.0, 2.2, 2.2); 
    const counterMain = new THREE.Mesh(counterMainGeo, counterMaterial);
    counterMain.position.set(-1.2, 1.1, -1.5);
    counterMain.castShadow = true;
    counterMain.receiveShadow = true;
    counterGroup.add(counterMain);
    const counterMainTopGeo = new THREE.BoxGeometry(6.1, 0.15, 2.3);
    const counterMainTop = new THREE.Mesh(counterMainTopGeo, counterTopMat);
    counterMainTop.position.set(-1.2, 2.2, -1.5);
    counterMainTop.castShadow = true;
    counterGroup.add(counterMainTop);
    const counterSideGeo = new THREE.BoxGeometry(2.4, 2.2, 5.0); 
    const counterSide = new THREE.Mesh(counterSideGeo, counterMaterial);
    counterSide.position.set(3.0, 1.1, -2.9);
    counterSide.castShadow = true;
    counterSide.receiveShadow = true;
    counterGroup.add(counterSide);
    const counterSideTopGeo = new THREE.BoxGeometry(2.5, 0.15, 5.1);
    const counterSideTop = new THREE.Mesh(counterSideTopGeo, counterTopMat);
    counterSideTop.position.set(3.0, 2.2, -2.9);
    counterSideTop.castShadow = true;
    counterGroup.add(counterSideTop);
    scene.add(counterGroup);

    // 카운터 플랜카드
    const counterBannerGeo = new THREE.PlaneGeometry(8.4, 2.0);
    const counterBanner = new THREE.Mesh(counterBannerGeo, counterBannerMat);
    counterBanner.position.set(0, 1.1, -0.39); 
    scene.add(counterBanner);

    // 입간판
    const signboardGroup = new THREE.Group();
    signboardGroup.position.set(2.5, 0, 1.5);
    signboardGroup.rotation.y = -Math.PI / 6;
    const signGeo = new THREE.PlaneGeometry(1.2, 1.8);
    const signFront = new THREE.Mesh(signGeo, signboardMat);
    signFront.position.set(0, 0.9, 0.2);
    signFront.rotation.x = -0.15; 
    signboardGroup.add(signFront);
    const signBack = new THREE.Mesh(signGeo, wallMaterial); 
    signBack.position.set(0, 0.9, -0.2);
    signBack.rotation.x = 0.15;
    signBack.rotation.y = Math.PI;
    signboardGroup.add(signBack);
    scene.add(signboardGroup);

    // 컵홀더 피라미드 
    const cupHolderGeo = new THREE.CylinderGeometry(0.25, 0.18, 0.5, 16);
    const cupMaterials = [cupBodyMaterial, cupCapMaterial, cupCapMaterial];
    const pyramidPositions = [
      { x: -2.8, y: 2.525, z: -1.8 }, { x: -2.3, y: 2.525, z: -1.8 }, { x: -1.8, y: 2.525, z: -1.8 },
      { x: -2.8, y: 2.525, z: -1.5 }, { x: -2.3, y: 2.525, z: -1.5 }, { x: -1.8, y: 2.525, z: -1.8 },
      { x: -2.8, y: 2.525, z: -1.2 }, { x: -2.3, y: 2.525, z: -1.2 }, { x: -1.8, y: 2.525, z: -1.2 },
      { x: -2.55, y: 3.025, z: -1.65 }, { x: -2.05, y: 3.025, z: -1.65 },
      { x: -2.55, y: 3.025, z: -1.35 }, { x: -2.05, y: 3.025, z: -1.35 },
      { x: -2.3, y: 3.525, z: -1.5 }
    ];
    pyramidPositions.forEach((pos) => {
      const cup = new THREE.Mesh(cupHolderGeo, cupMaterials);
      cup.position.set(pos.x, pos.y, pos.z);
      cup.castShadow = true;
      scene.add(cup);
    });

    // 미니 탁상용 배너 
    const standingBannerGroup = new THREE.Group();
    standingBannerGroup.position.set(2.7, 2.275, -1.8); 
    standingBannerGroup.rotation.y = -Math.PI / 8; 
    standingBannerGroup.scale.set(0.7, 0.7, 0.7); 
    const sbGeo = new THREE.PlaneGeometry(1.4, 3.2);
    const sbMesh = new THREE.Mesh(sbGeo, standingBannerMaterial);
    sbMesh.position.set(0, 1.6, 0.05); 
    standingBannerGroup.add(sbMesh);
    const sbBackGeo = new THREE.PlaneGeometry(1.4, 3.2);
    const sbBackMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const sbBack = new THREE.Mesh(sbBackGeo, sbBackMat);
    sbBack.rotation.y = Math.PI;
    sbBack.position.set(0, 1.6, 0.04);
    standingBannerGroup.add(sbBack);
    const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 3.6);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.6, roughness: 0.2 });
    const pole1 = new THREE.Mesh(poleGeo, poleMat);
    pole1.position.set(0, 1.6, -0.05);
    pole1.rotation.z = Math.PI / 8;
    standingBannerGroup.add(pole1);
    const pole2 = new THREE.Mesh(poleGeo, poleMat);
    pole2.position.set(0, 1.6, -0.05);
    pole2.rotation.z = -Math.PI / 8;
    standingBannerGroup.add(pole2);
    scene.add(standingBannerGroup);

    // 원형 책상
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0, 0, 4.5); 

    const tableTopGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.1, 32);
    const tableTop = new THREE.Mesh(tableTopGeo, tableMaterial);
    tableTop.position.y = 1.6;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    const tableLegGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.6, 16);
    const tableLeg = new THREE.Mesh(tableLegGeo, metalMat);
    tableLeg.position.y = 0.8;
    tableLeg.castShadow = true;
    tableGroup.add(tableLeg);

    const tableBaseGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.05, 32);
    const tableBase = new THREE.Mesh(tableBaseGeo, metalMat);
    tableBase.position.y = 0.025;
    tableBase.receiveShadow = true;
    tableGroup.add(tableBase);

    // 의자
    function createChair(x, z, rotationY) {
      const chair = new THREE.Group();
      chair.position.set(x, 0, z);
      chair.rotation.y = rotationY;
      const seatGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.08, 32);
      const seat = new THREE.Mesh(seatGeo, chairMaterial);
      seat.position.y = 0.9;
      seat.castShadow = true;
      chair.add(seat);
      const cLegGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 16);
      const cLeg1 = new THREE.Mesh(cLegGeo, metalMat);
      cLeg1.position.set(-0.35, 0.45, -0.35);
      chair.add(cLeg1);
      const cLeg2 = new THREE.Mesh(cLegGeo, metalMat);
      cLeg2.position.set(0.35, 0.45, -0.35);
      chair.add(cLeg2);
      const cLeg3 = new THREE.Mesh(cLegGeo, metalMat);
      cLeg3.position.set(-0.35, 0.45, 0.35);
      chair.add(cLeg3);
      const cLeg4 = new THREE.Mesh(cLegGeo, metalMat);
      cLeg4.position.set(0.35, 0.45, 0.35);
      chair.add(cLeg4);
      const backrestGeo = new THREE.BoxGeometry(1.0, 0.5, 0.06);
      const backrest = new THREE.Mesh(backrestGeo, chairMaterial);
      backrest.position.set(0, 1.5, -0.5);
      backrest.castShadow = true;
      chair.add(backrest);
      return chair;
    }

    tableGroup.add(createChair(-2.7, 0, Math.PI / 2));
    tableGroup.add(createChair(2.7, 0, -Math.PI / 2));

    // 아크릴 소품
    const tablePropGeo = new THREE.PlaneGeometry(0.8, 1.2);
    const tableProp = new THREE.Mesh(tablePropGeo, tablePropMat);
    tableProp.position.set(0, 2.25, 0); 
    tableGroup.add(tableProp);

    scene.add(tableGroup);

    let animationFrameId;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full space-y-6 flex flex-col items-center animate-fade-in font-['Plus_Jakarta_Sans','Paperlogy',sans-serif]">
      {/* 페이지 헤더 (중앙 정렬) */}
      <div className="border-b border-[#ec48bd]/30 pb-4 flex flex-col items-center justify-center text-center gap-2.5 w-full">
        <div className="flex items-center justify-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#ec48bd] animate-pulse shrink-0" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">미니룸 3D</h2>
        </div>
        <p className="text-xs sm:text-sm text-[#ec48bd] font-bold">입체적이고 아기자기한 3D 카페 공간</p>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ec48bd]/20 border border-[#ec48bd]/40 text-[#ec48bd] uppercase flex items-center gap-1.5 shadow-sm">
          3D INTERACTIVE ROOM
        </span>
      </div>

      <div 
        ref={containerRef} 
        className="w-full max-w-4xl h-[450px] sm:h-[520px] bg-[#181124] rounded-2xl border-2 border-purple-800/50 shadow-2xl overflow-hidden touch-none"
      />
    </div>
  );
}
