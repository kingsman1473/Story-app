import { data, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import StoryCard from "../../components/Cards/StoryCard";
import axiosInstance from "../../utils/axiosInstance";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditStory from "./AddEditStory";
import ViewStory from "./ViewStory";
import EmptyCard from "../../components/Cards/EmptyCard";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import { ToastContainer, toast } from "react-toastify";

import EmptyImg from "../../assets/images/empty.png";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import { getEmptyCardMessage, getEmptyCardImg } from "../../utils/helper";

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");

  const [dateRange, setDateRange] = useState({ form: null, to: null });

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error.response);
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllStories = async () => {
    try {
      const respose = await axiosInstance.get("/get-all-stories");
      if (respose.data && respose.data.stories) {
        setAllStories(respose.data.stories);
      }
    } catch (error) {
      console.log("Error fetching stories:", error);
    }
  };

  const handleEdit = (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: data });
  };

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;

    try {
      const response = await axiosInstance.put("/update-favourite/" + storyId, {
        isFavourite: !storyData.isFavourite,
      });
      if (response.data && response.data.story) {
        toast.success("Favourite updated successfully");
        getAllStories();
      }
    } catch (error) {
      console.log("Error updating favourite :", error);
    }
  };

  const deleteStory = async (storyData) => {
    const storyId = storyData._id;

    try {
      const response = await axiosInstance.delete("/delete-story/" + storyId);

      if (response.data && !response.data.error) {
        toast.error("Story deleted successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllStories();
      }
    } catch (error) {
      console.log("Error deleting story:", error);
    }
  };

  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search/", {
        params: { query },
      });

      if (response.data && response.data.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("Error fetching stories:", error);
    }
  };

  const handleClearSearch = () => {
    // setSearchQuery("");
    setFilterType("");
    getAllStories();
  };

  const filterStoriesByDate = async (day) => {
   try{
     const startDate = day.from ? moment(day.from).valueOf() : null;
     const endDate = day.to ? moment(day.to).valueOf() : null;

     if(startDate && endDate){
       const response = await axiosInstance.get("/story/filter", {
         params: { startDate, endDate },
       });

       if(response.data && response.data.stories){
         setFilterType("date");
         setAllStories(response.data.stories);
       }
     }
   }catch(error){
     console.log("Error filtering stories by date:", error);
   }
  };

  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  };

  const resetFilter = () => { 
    setDateRange({ from: null, to: null });
    setFilterType("");
    getAllStories();
  };

  useEffect(() => {
    getAllStories();
    getUserInfo();

    return () => {};
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />
      {/* {JSON.stringify(userInfo )} */}
      {/* {userInfo && <div>Welcome, {userInfo.name}</div>} */}
      <div className="container mx-auto py-10">
        <FilterInfoTitle
          filterType={filterType}
          filterDates={dateRange}
          onClear={() => {
            resetFilter();
          }}
        />

        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => {
                  return (
                    <StoryCard
                      key={item.id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      storyn={item.storyn}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      //onEdit={() => handleEdit(item)}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyCard
                imgSrc={getEmptyCardImg(filterType)}
                message={getEmptyCardMessage(filterType)}
                //   message={`start creating your first Story! click the 'Add' button to jot
                // down your thoughts, ideas, and memories, Let's get started!`}
              />
            )}
          </div>

          <div className="w-[350px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-lg mx-auto mt-14 p-5 overflow-y-scroll scrollbar z-50"
      >
        <AddEditStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllStories={getAllStories}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            zIndex: 1000,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-lg mx-auto mt-14 p-5 overflow-y-scroll scrollbar z-50"
      >
        <ViewStory
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
          }}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => {
            deleteStory(openViewModal.data || null);
          }}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-300 hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <ToastContainer />
    </>
  );
};

export default Home;
