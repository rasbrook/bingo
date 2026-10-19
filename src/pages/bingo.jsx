import React from "react";
import { backgroundColor, maincolor } from "../constant/colors";
import Balldisplay from '../components/balldisplayed.jsx';


const Bingo = (props) => {

    return (
        <div style={{ backgroundColor: backgroundColor }}>



            <div>
                <Balldisplay />


            </div>




        </div>
    );
};

export default Bingo;