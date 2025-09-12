import Topbar from "../components/Layout/Topbar";
import Sidebar from "../components/Layout/Sidebar";
import MainContent from "../components/Layout/MainContent";
import "../styles/layout/HomePage.css";

const HomePage = () => {
  return (
    <div className="home-wrapper">
      <Topbar />
      <div className="home-container">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
};

export default HomePage;
