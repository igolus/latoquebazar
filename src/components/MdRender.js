import React from 'react';
import {renderMd} from "../../pages/specialPage/[id]";

const MdRender = ({content}) => {
    if (typeof content === "string") {
        return (<div
            dangerouslySetInnerHTML={{__html: renderMd(content)}}
        />)
    }
    else {
        return (<p>
                {content}
            </p>)
    }

}

export default MdRender;