/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  deleteUserByAdmin,
  addUserByAdmin,
  updateUserByAdmin,
} from "../../features/admin/adminThunks";
import { clearAdminError } from "../../features/admin/adminSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  User,
  Mail,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const ITEMS_PER_PAGE = 6; // Balanced down to 6 for grid layout symmetry

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector((state) => state.admin);

  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAdminError());
    }
  }, [error, dispatch]);

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages || 1);
  }, [users, totalPages, currentPage]);

  const handleDelete = (id) => {
    toast.info("Removing user entry...");
    dispatch(deleteUserByAdmin(id))
      .unwrap()
      .then(() => toast.success("User account successfully removed"))
      .catch((err) => toast.error(err));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 selection:bg-blue-50 animate-fade-in">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        shadow-sm
      />

      {/* Control Header Strip */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            User Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage authenticated accounts, audit patient indices, and control
            routing profiles.
          </p>
        </div>
        <button
          onClick={() => {
            setEditUser(null);
            setShowModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-semibold text-sm rounded-xl shadow-xs hover:bg-blue-600 active:scale-95 transition-all duration-200"
        >
          <Plus size={16} strokeWidth={2.5} /> Register New User
        </button>
      </header>

      {/* Loading State Wrapper */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-[45vh] bg-white border border-slate-100 rounded-3xl shadow-xs">
          <Ripples size={55} speed={2} color="#2563eb" />
          <p className="mt-5 text-slate-500 text-xs font-semibold tracking-widest uppercase animate-pulse">
            Sourcing accounts registry...
          </p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-100 rounded-3xl shadow-xs">
          <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
            <User className="text-slate-300" size={26} />
          </div>
          <h3 className="text-slate-800 font-bold text-sm">Directory Empty</h3>
          <p className="text-slate-400 text-xs max-w-xs mx-auto mt-1 leading-relaxed">
            No verified user records or demographic account profiles match the
            current system stream.
          </p>
        </div>
      ) : (
        <UsersGrid
          users={paginatedUsers}
          handleDelete={handleDelete}
          setEditUser={setEditUser}
          setShowModal={setShowModal}
        />
      )}

      {/* Pagination Command Section */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* Glassmorphic Sheet Modal */}
      {showModal && (
        <UserModal user={editUser} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default AdminUsers;

/* --- 🌟 Premium Interactive Grid View Replacement --- */
const UsersGrid = ({ users, handleDelete, setEditUser, setShowModal }) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => {
        const isConfirming = confirmDeleteId === user._id;

        return (
          <div
            key={user._id}
            className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all duration-300 hover:shadow-md group relative overflow-hidden ${
              isConfirming
                ? "border-rose-200 bg-rose-50/20"
                : "border-slate-100 hover:border-slate-200"
            }`}
          >
            <div className="space-y-4">
              {/* Profile Card Header */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100/60 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 tracking-wider group-hover:scale-102 transition-transform shadow-xs uppercase">
                  {getInitials(user.fullName)}
                </div>
                <div className="truncate flex-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {user.fullName || "Anonymous Account"}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 block tracking-tight mt-0.5">
                    REF ID: #
                    {user._id?.substring(user._id.length - 8).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Data Properties Block */}
              <div className="bg-slate-50/50 border border-slate-50 rounded-xl p-3 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2 truncate">
                  <Mail size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate font-medium">{user.email}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100/80">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">
                      Gender
                    </span>
                    <span className="font-semibold text-slate-700 capitalize">
                      {user.gender?.toLowerCase() || "—"}
                    </span>
                  </div>
                  <div className="space-y-0.5 border-l border-slate-100 pl-3">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">
                      Age Index
                    </span>
                    <span className="font-semibold text-slate-700">
                      {user.age ? `${user.age} Yrs` : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro-State Delete Guardrail Overlay */}
            {isConfirming ? (
              <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-rose-100 bg-rose-50/60 -mx-5 -mb-5 p-4 animate-fade-in">
                <p className="text-xs font-semibold text-rose-800 inline-flex items-center gap-1.5">
                  <AlertCircle size={13} /> Confirm purge?
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(user._id);
                      setConfirmDeleteId(null);
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-md bg-rose-600 text-white hover:bg-rose-700"
                  >
                    Purge
                  </button>
                </div>
              </div>
            ) : (
              /* Core Form Utility Action Bar */
              <div className="flex items-center justify-end gap-1.5 mt-5 pt-3 border-t border-slate-50">
                <button
                  onClick={() => {
                    setEditUser(user);
                    setShowModal(true);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg transition-colors shadow-2xs active:scale-95"
                  title="Modify Profile Parameters"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setConfirmDeleteId(user._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 rounded-lg transition-colors shadow-2xs active:scale-95"
                  title="De-register Account Profile"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* --- 🌟 High Contrast Control Pagination --- */
const Pagination = ({ currentPage, totalPages, setCurrentPage }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-slate-100 bg-slate-50/50 rounded-2xl">
    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
      Page <strong className="text-slate-800 font-bold">{currentPage}</strong>{" "}
      of <strong className="text-slate-800 font-bold">{totalPages}</strong>
    </span>

    <div className="flex items-center gap-1">
      <button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 bg-white hover:bg-slate-50 transition-colors"
      >
        <ChevronLeft size={15} strokeWidth={2.5} />
      </button>

      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
              page === currentPage
                ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 bg-white hover:bg-slate-50 transition-colors"
      >
        <ChevronRight size={15} strokeWidth={2.5} />
      </button>
    </div>
  </div>
);

/* --- 🌟 Functional Layout Dashboard Form Modal --- */
const UserModal = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const isEdit = Boolean(user);

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    password: "",
    gender: user?.gender || "",
    age: user?.age || "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email)
      return toast.error("Identity metrics (name and email) are mandatory");

    if (isEdit) {
      toast.info("Committing profile updates...");
      dispatch(updateUserByAdmin({ userId: user._id, data: form }))
        .unwrap()
        .then(() => {
          toast.success("User configuration updated");
          onClose();
        })
        .catch((err) => toast.error(err));
    } else {
      if (!form.password)
        return toast.error("Routing password assignment required");
      toast.info("Registering record block...");
      dispatch(addUserByAdmin(form))
        .unwrap()
        .then(() => {
          toast.success("User setup workflow complete");
          onClose();
        })
        .catch((err) => toast.error(err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 overflow-y-auto max-h-[90vh] border border-slate-100 shadow-xl">
        {/* Modal Heading Header */}
        <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEdit ? "Modify Identity Specs" : "Register Database User"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fill parameters smoothly to build file maps
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 rounded-lg transition-all active:scale-95"
          >
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Account Full Name
            </label>
            <input
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="e.g. Meet Ramani"
              className="w-full border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2 outline-none shadow-inner transition-all font-medium text-slate-800"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Secure Email Link
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="user@mediq.com"
              className="w-full border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2 outline-none shadow-inner transition-all font-medium text-slate-800"
              required
            />
          </div>

          {!isEdit && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Credentials Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Assign secure profile access key"
                className="w-full border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2 outline-none shadow-inner transition-all font-medium text-slate-800"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-2 outline-none bg-white font-medium text-slate-700"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Age Index
              </label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="Years"
                className="w-full border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2 outline-none shadow-inner font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Action Module Blocks */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-blue-600 active:scale-95 transition-all shadow-xs"
            >
              {isEdit ? "Save Parameters" : "Register Token Instance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
