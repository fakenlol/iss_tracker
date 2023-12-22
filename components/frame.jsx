import Scene from "./Scene"
import Header from "./Header"

export default function Frame({tle}){

    return(
        <div className="frameContainer">
            <Header/>
            <div className="viewerContainer">
                <Scene tle={tle} />
            </div>
        </div>
    )
}