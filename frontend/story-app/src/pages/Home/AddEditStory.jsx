import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import uploadImage from "../../utils/uploadImage";
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance";

const AddEditStory = ({ storyInfo, type, onClose, getAllStories }) => {
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [storyn, setStoryn] = useState(storyInfo?.storyn || "");
  const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
  const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null);
  const [error, setError] = useState("");

  const addNewStory = async () => {
    try {
      let imageUrl = "";

      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post("/add-story", {
        title,
        storyn,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });

      if (response.data && response.data.story) {
        toast.success("Story Added Successfully");
        getAllStories();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("an unexpected error occurred. please try again later");
       }
    }
  };

  // const updateStory = async () => {

  //   const storyId = storyInfo._id;
  //   try {
       
  //     let imageUrl = "";
      
  //     const postData = {
  //       title,
  //       storyn,
  //       imageUrl: storyInfo.imageUrl || "",
  //       visitedLocation,
  //       visitedDate: visitedDate
  //         ? moment(visitedDate).valueOf()
  //         : moment().valueOf(),
  //     };

  //     if (typeof storyImg === "object") { 
  //       const imgUploadRes = await uploadImage(storyImg);
  //       imageUrl = imgUploadRes.imageUrl || "";

  //       postData = {
  //         ...postData,
  //         imageUrl: imageUrl,
  //       };
  //     }

  //      const response = await axiosInstance.put("/edit-story/" + storyId, postData);

  //      if (response.data && response.data.story) {
  //        toast.success("Story Updated Successfully");
  //        getAllStories();
  //        onClose();
  //      }
  //    } catch (error) {
  //      if (
  //        error.response &&
  //        error.response.data &&
  //        error.response.data.message
  //      ) {
  //        setError(error.response.data.message);
  //      } else {
  //        setError("an unexpected error occurred. please try again later");
  //      }
  //    }
  // };
  
  const updateStory = async () => {
    const storyId = storyInfo?._id;
    if (!storyId) {
      setError("Story ID is missing. Cannot update.");
      return;
    }

    try {
      let imageUrl = storyInfo.imageUrl || "";

      let postData = {
        title,
        storyn, // Ensure 'storyn' is the correct variable
        imageUrl,
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      };

      if (typeof storyImg === "object") {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
        postData.imageUrl = imageUrl;
      }

      const response = await axiosInstance.put(
        `/edit-story/${storyId}`,
        postData
      );
      console.log("API Response:", response.data);

      if (response.data?.story || response.data?.message) {
        toast.success(response.data.message || "Story Updated Successfully");
        getAllStories();
        onClose();
      } else {
        console.warn("Unexpected API response:", response.data);
        setError("Failed to update story. Please try again.");
      }
    } catch (error) {
      console.error(
        "Error updating story:",
        error.response ? error.response.data : error
      );
      setError(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again later."
      );
    }
  };



  const handleAddOrUpdateClick = () => {
    console.log("Input Data:", {
      title,
      storyImg,
      storyn,
      visitedLocation,
      visitedDate,
    });

    if (!title) {
      setError("Please enter th title");
      return;
    }

    if (!storyn) {
      setError("Please enter the story");
      return;
    }

    setError("");

    if (type === "edit") {
      updateStory();
    } else {
      addNewStory();
    }
  };

  const handleDeleteStoryImg = async () => {

    const deleteImgRes = await axiosInstance.delete("/delete-image", {
      params: {
        imageUrl: storyInfo.imageUrl,
      },
    });

    if (deleteImgRes.data) {
      const storyId = storyInfo._id;
      const postData = {
        title,
        storyn,
        visitedLocation,
        visitedDate: moment().valueOf(),
        imageUrl: "",
      };

      const response = await axiosInstance.put("/edit-story/" + storyId, postData);
      setStoryImg(null);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-medium text-state-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>

        <div>
          <div className="flex items-center justify-between">
            {type === "add" ? (
              <button
                className="btn-small flex items-center gap-1 text-xs font-medium bg-cyan-50 text-blue-300 shadow-cyan-100/0 border border-cyan-100 hover:bg-blue-300 hover:text-white rounded px-3 py-[3px]"
                onClick={handleAddOrUpdateClick}
              >
                <MdAdd className="text-lg" /> Add Story
              </button>
            ) : (
              <>
                <button
                  className="btn-small flex items-center gap-1 text-xs font-medium bg-cyan-50 text-blue-300 shadow-cyan-100/0 border border-cyan-100 hover:bg-blue-300 hover:text-white rounded px-3 py-[3px]"
                  onClick={handleAddOrUpdateClick}
                >
                  <MdUpdate className="text-lg" /> Update Story
                </button>

                {/* <button
                  className="btn-small flex items-center gap-1 text-xs font-medium bg-cyan-50 text-blue-300 shadow-cyan-100/0 border border-cyan-100 hover:bg-blue-300 hover:text-white rounded px-3 py-[3px] btn-delete bg-rose-50 text-rose-500 shadow-rose-100/0 border border-rose-100 hover:bg-rose-500 hover:text-white"
                  onClick={onClose}
                >
                  <MdDeleteOutline className="text-lg" /> Delete Story
                </button> */}
              </>
            )}

            <button className="" onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex-l flex flex-col gap-2 pt-4">
          <label className="input-label text-xs text-slate-400">Title</label>
          <input
            type="text"
            placeholder="A day at the great wall"
            className="text-2xl text-slate-950 outline-none"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />

          <div className="my-3">
            <DateSelector date={visitedDate} setDate={setVisitedDate} />
          </div>

          <ImageSelector
            image={storyImg}
            setImage={setStoryImg}
            handleDeleteImag={handleDeleteStoryImg}
          />

          <div className="flex flex-col gap-2 mt-4">
            <label className="input-label">STORY</label>
            <textarea
              type="text"
              className="text-sm text-slate-950 outline-none bg-slate-50 P-2 rounded"
              placeholder="Your Story"
              rows={10}
              value={storyn}
              onChange={({ target }) => setStoryn(target.value)}
            />
          </div>

          <div className="pt-3">
            <label className="input-label">Visited Location</label>
            <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
          </div>
        </div>
      </div>
    </div>
  );
};
AddEditStory.propTypes = {
  storyInfo: PropTypes.shape({
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    storyn: PropTypes.string,
    visitedLocation: PropTypes.arrayOf(PropTypes.string),
    visitedDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    _id: PropTypes.string,
  }),
  type: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  getAllStories: PropTypes.func.isRequired,
};

export default AddEditStory;

