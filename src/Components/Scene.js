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

    //Earth
    const earthGeometry = new THREE.SphereGeometry( 15, 32, 32 );
    const earthMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00} );
    const earth = new THREE.Mesh( earthGeometry, earthMaterial );
    scene.add( earth );

    //ISS
    const issGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    const issMaterial = new THREE.MeshPhongMaterial( {color: 0xff0000} );
    const iss = new THREE.Mesh( issGeometry, issMaterial );
    iss.position.z = 20
    scene.add( iss );

    //Controles
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target = new THREE.Vector3(iss.position.x,iss.position.y,iss.position.z)
    controls.enableDamping = true

    //Renderizar la escena
    const animate = () => {
        controls.update()
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
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
