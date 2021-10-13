import {Text} from "react-native";
import React from "react";


export default  function TextInputError(props) {


    if(props.show){
        return (
            <Text style={{color: 'red', fontSize: 10}}>{props.text ?? "Füllen Sie bitte dieses Feld"}</Text>
        )
    }

    return (<></>)



}