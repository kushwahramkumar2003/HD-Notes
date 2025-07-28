import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState } from "../state/userAtom";
import { getStoredUser } from "../utils/auth";

const useAuthGuard = () => {
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = getStoredUser();
    if (!token || !user) {
      setUser(null);
      navigate("/signin");
    } else {
      setUser(user);
    }
  }, [navigate, setUser]);
};

export default useAuthGuard;
