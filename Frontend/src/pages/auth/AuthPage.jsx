import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../features/auth/authThunks";
import Input from "../../components/atoms/Input";
import Select from "../../components/atoms/Select";
import LoginPageImage from "../../../public/images/login.avif";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("PATIENT");
  const [preview, setPreview] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    switch (user.role) {
      case "ADMIN":
        navigate("/admin/dashboard", { replace: true });
        break;
      case "DOCTOR":
        navigate("/doctor/dashboard", { replace: true });
        break;
      case "PATIENT":
        navigate("/patient/home", { replace: true });
        break;
      default:
        navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    setPreview(null);
  }, [mode, role]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (mode === "login") {
      dispatch(loginUser(Object.fromEntries(formData)));
    } else {
      formData.append("role", role);
      dispatch(registerUser(formData));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen flex bg-[#F4F8FB]">
      <div className="hidden lg:flex w-1/2 bg-linear-to-br from-[#2C7BE5] to-[#00B894] text-white p-12">
        <div className="m-auto space-y-6 animate-fadeIn">
          <h1 className="text-4xl font-bold">MEDIQ</h1>
          <p className="text-lg">
            Smart Doctor Appointment & Medical Record System
          </p>
          <img src={LoginPageImage} className="w-96" alt="Medical" />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-xl space-y-4"
        >
          <div className="flex mb-4">
            {["login", "register"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 py-2 font-medium ${
                  mode === m && "border-b-2 border-blue-500"
                }`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          {mode === "register" && (
            <>
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Doctor</option>
              </Select>

              <Input name="fullName" placeholder="Full Name" required />
              <Select name="gender">
                <option value="">Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </Select>
              <Input name="dob" type="date" />
              <Input name="age" type="number" placeholder="Age" />
            </>
          )}

          <Input name="email" placeholder="Email" required />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            required
          />

          {mode === "register" && role === "DOCTOR" && (
            <>
              <Input name="degree" placeholder="Degree" />
              <Input
                name="experience"
                type="number"
                placeholder="Experience (years)"
              />
              <Input
                name="consultationFee"
                type="number"
                placeholder="Consultation Fee"
              />
              <Input name="hospitalAddress" placeholder="Hospital Address" />
              <Input name="description" placeholder="Profile Description" />
              <Input name="specialization" placeholder="Specialization Name" />

              <Input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleImageChange}
              />

              {preview && (
                <img
                  src={preview}
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                  alt="Preview"
                />
              )}
            </>
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
