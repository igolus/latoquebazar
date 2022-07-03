import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import {overrideCss} from "../util/overrideCss";

function ClipLoaderComponent({size}) {
  return (
    <div style={{width: "100%"}}>
      <ClipLoader
        css={overrideCss}
        size={size || 300}
        loading={true}
      />
    </div>
  );
}

export default ClipLoaderComponent;
