import React, {useEffect, useState} from 'react';
import {Alert, AlertTitle} from "@material-ui/core";
import localStrings from "../../localStrings";
import Parser from "html-react-parser";

function AlertHtmlLocal({severity, title, content}) {
    return (
        <Alert severity={severity} style={{marginBottom: 2}} variant="outlined" >
            <AlertTitle style={{fontWeight:600, fontSize:"16px"}}>{title}</AlertTitle>
            {Parser(content)}
        </Alert>
    )
}

export default AlertHtmlLocal;

