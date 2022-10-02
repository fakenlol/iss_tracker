import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as TLE from "tle.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import LockCamera from './LockCamera.jsx';
import Header from './Header.jsx';

const Scene = ({ tle }) => {
  const mountRef = useRef(null)
  
  const lock = true;
    function changeCamera(){
      lock = !lock;
    } 
  useEffect(() => {
    const currentMount = mountRef.current
    
    //Scena
    const scene = new THREE.Scene()
    
        //Camara
    const camera = new THREE.PerspectiveCamera(
      5,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    )
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
    const earth_radius = 63.78 // 1/100 scale
    const earth = new THREE.Mesh(
        new THREE.SphereGeometry( earth_radius, 50, 50),
        material
    )
    scene.add( earth );
    
    //Clouds
    const cloudsTexture = textureLoader.load('imgs/8k_earth_clouds.jpg')
    
    const cloudsGeometry = new THREE.SphereGeometry(63.81, 50, 50)
    const cloudsMaterial = new THREE.MeshPhongMaterial({
        map: cloudsTexture,
        transparent: true,
        opacity: 0.6
    })
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial)
    scene.add(clouds)
    
    /*
    // alineador_malvinas
    const geometriax = new THREE.BoxGeometry(0.1,0.1,0.1);
    const material2x = new THREE.MeshPhongMaterial({color: 0xffff00});
    const alineadorx = new THREE.Mesh(geometriax, material2x);

      var auxlat = (90- (-51.69245)) * (Math.PI / 180), auxlong = (-58.65645+180) * (Math.PI / 180);
    alineadorx.position.x = -((earth_radius) * Math.sin(auxlat) * Math.cos(auxlong));
    alineadorx.position.y = (earth_radius) * Math.cos(auxlat)
    alineadorx.position.z = (earth_radius) * Math.sin(auxlat) * Math.sin(auxlong)

    scene.add(alineadorx);
    */
    
    //ISS
    const tmpGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    const tmpMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    var iss = new THREE.Mesh( tmpGeometry, tmpMaterial );

    // Instantiate a loader
    const loaderISS = new GLTFLoader();
    // Load a glTF resource
    loaderISS.load(
	    // resource URL
	    'models/ISS_stationary.glb',
	    // called when the resource is loaded
	    function (glb) {
            scene.remove(iss) // remove old placeholder
            iss = glb.scene
            iss.scale.set(0.01,0.01,0.01) // 1/100 scale
	    },
	    // called while loading is progressing
	    function ( xhr ) {
            // This wasn't working anyways...
		    // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	    },
	    // called when loading has error
	    function ( error ) {

		    console.log( 'An error happened' );

	    }
    );
    
    /*
    var tle = `ISS (ZARYA)
    1 25544U 98067A   17206.18396726  .00001961  00000-0  36771-4 0  9993
    2 25544  51.6400 208.9163 0006317  69.9862  25.2906 15.54225995 67660`;
    */
    var x, y , z
    var cameraLock = true
    function updatePos(){
        var latLon = TLE.getLatLngObj(tle.trim());

        // https://www.space.com/16748-international-space-station.html (average altitude of 400km)
        var R = earth_radius + 4;

        // https://stackoverflow.com/questions/28365948/javascript-latitude-longitude-to-xyz-position-on-earth-threejs/28367325#28367325
        const pi = Math.PI
        var lat = (90-latLon.lat) * (pi/180)
        var lon = (latLon.lng+180) * (pi/180)
        
        x = -(R * Math.sin(lat) * Math.cos(lon))
        y = R * Math.cos(lat)
        z = R * Math.sin(lat) * Math.sin(lon)
        
        iss.position.set(x, y, z)
        scene.add( iss );
    }

    //Controles
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    //Renderizar la escena
    
    //Lights
    const AO = new THREE.AmbientLight(0xffffff,1)
    scene.add(AO)

    const animate = () => {
        if(lock){
          camera.position.set(x*2, y*2, z*2)
        }
        requestAnimationFrame(animate)
        updatePos()
        controls.target = iss.position
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
    < >
        <Header>
          <LockCamera changeCamera={changeCamera} />
        </Header>
        <div className="Contenedor3D" ref={mountRef} style={{ width: "100%", height: "100vh" }}>
        </div>
    </>
  );
};

export default Scene;
