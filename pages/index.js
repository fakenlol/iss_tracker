import Scene from '../components/Scene';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/css/bootstrap.min.css';

export async function getServerSideProps() {
    const res = await fetch("http://celestrak.org/NORAD/elements/gp.php?CATNR=25544")
    const data = await res.text()

    return { props: { data } }
}

function App({ data }) {
  return (
    <div className="App">
      <Scene tle={data}/>
    </div>
  );
}

export default App;
