//import React from 'react'
import { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import { FaRegFileImage } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const ImageSelector = ({ image, setImage, handleDeleteImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const handleImageChange = () => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
    handleDeleteImage();
  };

  useEffect(() => {
    if (typeof image === "string") {
      setPreviewUrl(image);
    } else if (image) {
      setPreviewUrl(URL.createObjectURL(image));
    } else {
      setPreviewUrl(null);
    }

    return () => {
      if (previewUrl && typeof previewUrl === "string" && !image) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [image]);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <button
          className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50"
          onClick={() => onChooseFile()}
        >
          <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100">
            <FaRegFileImage className="text-xl text-cyan-500" />
          </div>

          <p className="text-sm slate-500">Brows image files to upload</p>
        </button>
      ) : (
        <div className="w-full relative">
          <img
            src={previewUrl}
            alt="Selected"
            className="w-full h-[300px] object-cover rounded-lg"
          />

          <button
            className="btn-small flex items-center gap-1 text-xs font-medium bg-cyan-50 text-blue-300 shadow-cyan-100/0 border border-cyan-100 hover:bg-blue-300 hover:text-white rounded px-3 py-[3px] btn-delete bg-rose-50 text-rose-500 shadow-rose-100/0 border border-rose-100 hover:bg-rose-500 hover:text-white absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <MdDeleteOutline className="text-lg" />
          </button>
        </div>
      )}
    </div>
  );
};
ImageSelector.propTypes = {
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  setImage: PropTypes.func.isRequired,
  handleDeleteImage: PropTypes.func.isRequired,
};

export default ImageSelector;
// export default ImageSelector;
