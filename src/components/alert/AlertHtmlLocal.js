import React, {useEffect, useState} from 'react';
import {Alert, AlertTitle} from "@material-ui/core";
import localStrings from "../../localStrings";
import Parser from "html-react-parser";
import Typography from "@material-ui/core/Typography";

function AlertHtmlLocal({severity, title, content, children}) {
    return (
        <>
        <Alert severity={severity} style={{marginBottom: 2}} variant="outlined" >
            <AlertTitle style={{fontWeight:600, fontSize:"16px"}} textAlign="left">{title}</AlertTitle>

            {/*{content}*/}
            {content &&

            <Typography>
                {content}
            </Typography>
            // <div style={{textAlign: "left", overflow: "auto"}}>
            //     {Parser(content)}
            // </div>
            }
            {children}
        </Alert>

        </>
    )
}

export default AlertHtmlLocal;

