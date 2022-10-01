import { useRef, useEffect } from "react";
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const Scene = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    const currentMount = mountRef.current

    //Scena
    const scene = new THREE.Scene()

    //Camara
    const camera = new THREE.PerspectiveCamera(
      25,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 200
    scene.add(camera)

    //Renderizador
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
    currentMount.appendChild(renderer.domElement)

    //Textures
    const textureLoader = new THREE.TextureLoader()
    textureLoader.crossOrigin = ""
    const texture = textureLoader.load('https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg')
    const specular = textureLoader.load('src/imgs/2k_earth_specular_map.png')
    const normalMap = textureLoader.load('src/imgs/2k_earth_normal_map.png')
    console.log(normalMap);
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        normalMap: normalMap,
        specularMap: specular,
    })
    //Earth
    const earth = new THREE.Mesh(
        new THREE.SphereGeometry( 15, 50, 50),
        material
    )
    scene.add( earth );

    //ISS
    const issGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    const issMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    const iss = new THREE.Mesh( issGeometry, issMaterial );
    iss.position.z = 20
    scene.add( iss );

    //Controles
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    
    //Lights
    const AO = new THREE.AmbientLight(0xffffff,1)
    scene.add(AO)

    //Renderizar la escena
    const animate = () => {
        requestAnimationFrame(animate)
        controls.target = new THREE.Vector3(iss.position.x,iss.position.y,iss.position.z)
        controls.update()
        renderer.render(scene, camera)
    }
    animate()

    //Clean up scene
    return () =>{
        currentMount.removeChild(renderer.domElement)
    }
  }, []);

  return (
    <div className="Contenedor3D" ref={mountRef} style={{ width: "100%", height: "100vh" }}>
    </div>
  );
};

export default Scene;
