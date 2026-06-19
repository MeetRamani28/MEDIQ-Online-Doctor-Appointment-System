import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "./features/auth/authThunks";
import { useSelector } from "react-redux";
import Routing from "./routes/Routing";
import LoadingScreen from "./components/atoms/LoadingScreen";

function App() {
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="font-[gilroy]">
      <Routing />
    </div>
  );
}

export default App;
