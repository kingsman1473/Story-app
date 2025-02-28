import { useNavigate } from "react-router-dom";
import LOGO from "../assets/story_logo.png";
import ProfileInfo from "./Cards/ProfileInfo";
import PropTypes from "prop-types";

const Navbar = ({ userInfo }) => {
  const isToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <img src={LOGO} alt="story" className="h-9" />

      {isToken && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
    </div>
  );
};
Navbar.propTypes = {
  userInfo: PropTypes.object.isRequired,
};

export default Navbar;
