import { useRef, useEffect } from "react";
import * as THREE from "three";
const { getLatLngObj } = require("tle.js/dist/tlejs.cjs");
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
    // https://www.solarsystemscope.com/textures/
    
    const textureLoader = new THREE.TextureLoader()
    textureLoader.crossOrigin = ""
    const texture = textureLoader.load('imgs/8k_earth_daymap.jpg')
    const specular = textureLoader.load('imgs/8k_earth_specular_map.tif')
    const normalMap = textureLoader.load('imgs/8k_earth_normal_map.tif')
    console.log(normalMap);
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        normalMap: normalMap,
        specularMap: specular,
    })
    //Earth
    const earth_radius = 15
    const earth = new THREE.Mesh(
        new THREE.SphereGeometry( earth_radius, 50, 50),
        material
    )
    scene.add( earth );

    //ISS
    const issGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    const issMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    const iss = new THREE.Mesh( issGeometry, issMaterial );
    
    fetch("http://celestrak.org/NORAD/elements/gp.php?CATNR=25544")
    .then(response => {
        
        if (!response.ok) {
            throw new Error(`Request failed`);
        }

        return response;
    })
    .then(tle => {
        const latLon = getLatLngObj(tle);
        iss.position.x = earth_radius * Math.cos(latLon.lat) * Math.cos(latLon.lng)
        iss.position.y = earth_radius * Math.cos(latLon.lat) * Math.sin(latLon.lng)
        iss.z = earth_radius * Math.sin(latLon.lat)
        scene.add( iss );
    })

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
