import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import StoryCard from "../../components/Cards/StoryCard";
import axiosInstance from "../../utils/axiosInstance";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditStory from "./AddEditStory";

import { ToastContainer, toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
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

  }

  const handleViewStory = (data) => {

  }

  const updateIsFavourite = async (storyData) => {

    const storyId = storyData._id;

    try {
      const response = await axiosInstance.put(
        "/update-favourite/" + storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );
      if (response.data && response.data.story) {
        toast.success("Favourite updated successfully");
        getAllStories();
      }
    } catch (error) {
      console.log("Error updating favourite :", error);
    }
  };
    
   

  useEffect(() => {
    getAllStories();
    getUserInfo();

    return () => {};
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />
      {/* {JSON.stringify(userInfo )} */}
      {/* {userInfo && <div>Welcome, {userInfo.name}</div>} */}
      <div className="container mx-auto py-10">
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
                      onEdit={() => handleEdit(item)}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
                <>Empty Card here</>
            )}
            <div className="w-[320px]"></div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            zIndex: 1000,
          },
        }}
        appElement={document.getElementById('root')}
        className="model-box w-[80vw] h-[80vh] bg-white rounded-lg mx-auto mt-14 p-5 overflow-y-scroll scrollbar z-50"
      > 
        <AddEditStory
        type={openAddEditModal.type}
        storyInfo={openAddEditModal.data}
          onClose={() => {setOpenAddEditModal({ isShown: false, type: "add", data: null });
      }}
        
        getAllStories={getAllStories}
        
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
        <MdAdd className="text-[32px] text-white"/>
      </button>

      <ToastContainer />
      
    </>
  );
};

export default Home;
