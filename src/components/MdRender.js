import React from 'react';
import {renderMd} from "../../pages/specialPage/[id]";

const MdRender = ({content}) => {
    return (<div
        dangerouslySetInnerHTML={{__html: renderMd(content)}}
    />)
}

export default MdRender