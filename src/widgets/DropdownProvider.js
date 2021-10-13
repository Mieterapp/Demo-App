import React, { useRef } from "react";
import DropdownAlert from "react-native-dropdownalert";

const DropDownContext = React.createContext();

export const DropdownProvider = ({ children }) => {
    let ref = useRef();
    return (
        <DropDownContext.Provider
            value={{
                ref,
            }}
        >
            {children}
            <DropdownAlert ref={ref} closeInterval={0}/>
        </DropDownContext.Provider>
    );
};

export const useDropDown = () => React.useContext(DropDownContext);