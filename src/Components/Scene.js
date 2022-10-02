import { useRef, useEffect } from "react";
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as TLE from "tle.js";

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
    camera.position.z = 250
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
    const earth_radius = 63.78
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

      var auxlat = -51.69245 * (Math.PI / 180), auxlong = 28.65645 * (Math.PI / 180);
    alineadorx.position.x = (earth_radius) * Math.cos(auxlat) * Math.sin(auxlong)
    alineadorx.position.y = (earth_radius) * Math.sin(auxlat)
    alineadorx.position.z = (earth_radius) * Math.cos(auxlat) * Math.cos(auxlong)

    scene.add(alineadorx);
    */
    
    //ISS
    const issGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    const issMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    const iss = new THREE.Mesh( issGeometry, issMaterial );
    var tle = `ISS (ZARYA)
    1 25544U 98067A   17206.18396726  .00001961  00000-0  36771-4 0  9993
    2 25544  51.6400 208.9163 0006317  69.9862  25.2906 15.54225995 67660`;

    var lastTimestamp = -1;
    function updatePos(){
        if (Date.now() - lastTimestamp > 240000) { // refresh rate 4h for TLE
            lastTimestamp = Date.now();

            fetch("http://celestrak.org/NORAD/elements/gp.php?CATNR=25544")
            .then(response => {
                
                if (!response.ok) {
                    throw new Error(`Request failed`);
                }

                return response.text();
            })
            .then(resultTle => {
                tle = resultTle;
            })
        }

        var latLon = TLE.getLatLngObj(tle.trim());
        latLon.lng += 80; // 80° offset
        if (latLon.lng > 180) latLon.lng -= 360

        var R = earth_radius + 3.3;
        const pi = Math.PI
        var lat = latLon.lat * (pi/180)
        var lon = latLon.lng * (pi/180)
        
        iss.position.x = R * Math.cos(lat) * Math.sin(lon)
        iss.position.y = R * Math.sin(lat)
        iss.position.z = R * Math.cos(lat) * Math.cos(lon)
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
        requestAnimationFrame(animate)
        controls.target = new THREE.Vector3(iss.position.x,iss.position.y,iss.position.z)
        controls.update()
        updatePos()
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
