import Scene from '../components/Scene';
import Frame from '../components/frame';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/css/bootstrap.min.css';

export async function getServerSideProps() {
 // const res = await fetch("http://celestrak.org/NORAD/elements/gp.php?CATNR=25544")
 // const data = await res.text()
  const data = `ISS (ZARYA)
  1 25544U 98067A   17206.18396726  .00001961  00000-0  36771-4 0  9993
  2 25544  51.6400 208.9163 0006317  69.9862  25.2906 15.54225995 67660`
  console.log(data);
  return { props: { data } }
}

function App({data}) {
  return (
    <div className="App">
      <Frame tle={data}/>
    </div>
  );
}

export default App;
