import React, {useState, useEffect} from "react";
import { ethers } from "ethers";

//import abi and contract address

export const AppContext = React.createContext();

const { ethereum } = window;

export const ContextProvider = ({ children }) => {


    return(
        <AppContext.Provider>
            {children}
        </AppContext.Provider>
    )

}

