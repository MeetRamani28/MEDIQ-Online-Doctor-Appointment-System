import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, pingBackendHealth } from "./features/auth/authThunks";
import Routing from "./routes/Routing";
import LoadingScreen from "./components/atoms/LoadingScreen";

function App() {
  const dispatch = useDispatch();
  const { loading, isAuthenticated, authChecking } = useSelector((state) => state.auth);

  useEffect(() => {
    // Ping backend health to ensure instance is awake
    pingBackendHealth();

    if (!isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (authChecking) {
    return <LoadingScreen />;
  }

  return (
    <div className="font-[gilroy]">
      <Routing />
    </div>
  );
}

export default App;
