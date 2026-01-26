import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "./features/auth/authThunks";
import { useSelector } from "react-redux";
import Routing from "./routes/Routing";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="font-[gilroy]">
      <Routing />
    </div>
  );
}

export default App;
