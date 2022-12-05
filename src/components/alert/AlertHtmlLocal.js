import React from 'react';
import {Alert, AlertTitle} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

function AlertHtmlLocal({severity, title, content, children, marginBottom}) {
    return (
        <>
            <Alert severity={severity} style={{marginBottom: marginBottom || 2}} variant="outlined" title={title}>
                {title &&
                    <AlertTitle style={{fontWeight: 600, fontSize: "16px"}} textAlign="left">{title}</AlertTitle>
                }
                {content &&
                    <Typography>
                        {content}
                    </Typography>
                }
                {children}
            </Alert>
        </>
    )
}

export default AlertHtmlLocal;

