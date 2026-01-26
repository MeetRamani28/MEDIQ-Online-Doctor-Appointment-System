import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../features/auth/authThunks";
import { fetchSpecializations } from "../../features/specialization/specializationThunks";
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
  const { list: specializations, loading: specLoading } = useSelector(
    (state) => state.specialization
  );

  useEffect(() => {
    dispatch(fetchSpecializations());
  }, [dispatch]);

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
      <div className="hidden lg:flex lg:fix w-1/2 items-center justify-center bg-[#F4F8FB]">
        <div className="bg-[#EAF3FF] rounded-3xl p-10 w-[90%] max-w-lg shadow-sm">
          {/* Image Card */}
          <div className="bg-white rounded-2xl p-4 shadow-md flex justify-center">
            <img
              src={LoginPageImage}
              alt="Medical Team"
              className="rounded-xl object-cover w-full max-h-80"
            />
          </div>

          {/* Content */}
          <div className="text-center mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-[#1E3A8A]">
              Your Health, Our Priority
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed px-4">
              Connecting patients with top-tier medical professionals through a
              seamless online appointment system.
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center mt-8 text-center">
            <div className="flex-1">
              <p className="text-lg font-bold text-blue-600">10k+</p>
              <p className="text-xs text-gray-500 uppercase">Patients</p>
            </div>

            <div className="w-px h-8 bg-gray-300" />

            <div className="flex-1">
              <p className="text-lg font-bold text-blue-600">500+</p>
              <p className="text-xs text-gray-500 uppercase">Doctors</p>
            </div>

            <div className="w-px h-8 bg-gray-300" />

            <div className="flex-1">
              <p className="text-lg font-bold text-blue-600">4.9/5</p>
              <p className="text-xs text-gray-500 uppercase">Rating</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-lg h-full bg-white rounded-3xl shadow-md px-10 py-8">
          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome to <span className="text-blue-600">MEDIQ</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Join our medical community today
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b mb-6">
            {["login", "register"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`pb-2 text-sm font-medium transition ${
                  mode === m
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {m === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-4"
          >
            {/* Role Selector (Register only) */}
            {mode === "register" && (
              <>
                <p className="text-xs font-medium text-gray-500">Register as</p>

                <div className="flex gap-3">
                  {["PATIENT", "DOCTOR"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 border rounded-xl py-2 text-sm font-medium transition ${
                        role === r
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {r === "PATIENT" ? "Patient / User" : "Doctor"}
                    </button>
                  ))}
                </div>

                <Input name="fullName" placeholder="Full Name" required />

                <div className="grid grid-cols-2 gap-3">
                  <Select name="gender">
                    <option value="">Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </Select>
                  <Input name="age" type="number" placeholder="Age" />
                </div>

                <Input name="dob" type="date" />
              </>
            )}

            {/* Common Fields */}
            <Input name="email" placeholder="Email Address" required />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
            />

            {/* Doctor Extra Fields */}
            {mode === "register" && role === "DOCTOR" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Input name="degree" placeholder="Degree" />
                  <Input
                    name="experience"
                    type="number"
                    placeholder="Experience (yrs)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    name="consultationFee"
                    type="number"
                    placeholder="Consultation Fee"
                  />
                  <Select name="specialization" required>
                    <option value="">Specialization</option>
                    {specLoading ? (
                      <option disabled>Loading...</option>
                    ) : (
                      specializations.map((s) => (
                        <option key={s._id} value={s.name}>
                          {s.name}
                        </option>
                      ))
                    )}
                  </Select>
                </div>

                <Input name="hospitalAddress" placeholder="Hospital Address" />
                <Input name="description" placeholder="Profile Description" />

                {/* Image Upload */}
                <Input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {preview && (
                  <img
                    src={preview}
                    className="w-20 h-20 rounded-full object-cover mx-auto"
                    alt="Preview"
                  />
                )}
              </>
            )}

            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Login →"
                : "Create Account →"}
            </button>

            {/* Footer text */}
            {mode === "register" && (
              <p className="text-[11px] text-gray-400 text-center mt-3">
                By registering, you agree to MEDIQ’s Terms of Service & Privacy
                Policy
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
