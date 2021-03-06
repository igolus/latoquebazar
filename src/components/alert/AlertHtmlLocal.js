import React from 'react';
import {Alert, AlertTitle} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

function AlertHtmlLocal({severity, title, content, children, marginBottom}) {
    return (
        <>
        <Alert severity={severity} style={{marginBottom: marginBottom || 2}} variant="outlined" >
            {title &&
                <AlertTitle style={{fontWeight: 600, fontSize: "16px"}} textAlign="left">{title}</AlertTitle>
            }

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

