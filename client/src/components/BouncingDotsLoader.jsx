import React from "react";

const BouncingDotsLoader = ({ text, className }) => {
  return (
    <>
      <div className={ `BouncingLoader ${className}` }>
        {text && <span className='BouncingLoaderText'>{text}</span>}
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default BouncingDotsLoader;