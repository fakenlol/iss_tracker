import Scene from '../components/Scene';
import Frame from '../components/frame';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/css/bootstrap.min.css';

export async function getServerSideProps() {
  const res = await fetch("http://celestrak.org/NORAD/elements/gp.php?CATNR=25544")
  const data = await res.text()
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
