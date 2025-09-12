import "../../styles/layout/Topbar.css";
import { useUser } from "../../contexts/UserContext";

const Topbar = () => {
  const { userProfileData } = useUser();
  const avatarText =
    userProfileData?.first_name && userProfileData?.last_name
      ? `${userProfileData.first_name[0]}${userProfileData.last_name[0]}`.toUpperCase()
      : "";
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="logo">💼 WalletIQ</div>
        <div className="topbar-title">
          Track, Budget, and Optimize Your Finances with Ease
        </div>
      </div>
      <div className="topbar-right">
        <div className="topbar-user">{avatarText}</div>
      </div>
    </div>
  );
};

export default Topbar;
