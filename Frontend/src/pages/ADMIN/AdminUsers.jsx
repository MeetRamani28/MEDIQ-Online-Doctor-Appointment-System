import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  deleteUserByAdmin,
  addUserByAdmin,
  updateUserByAdmin,
} from "../../features/admin/adminThunks";
import { clearAdminError } from "../../features/admin/adminSlice";
import { toast } from "react-toastify";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";

const ITEMS_PER_PAGE = 8;

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);

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
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [users, totalPages, currentPage]);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this user permanently?")) return;

    dispatch(deleteUserByAdmin(id))
      .unwrap()
      .then(() => {
        toast.success("User deleted successfully");
        setCurrentPage(1);
      })
      .catch((err) => toast.error(err));
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Users Management
        </h1>
        <button
          onClick={() => {
            setEditUser(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
        >
          + Add User
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Ripples size={60} speed={2} color="#2563eb" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-medium">
          No users found.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Gender
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Age
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {paginatedUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {user.fullName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {user.gender || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.age || "—"}</td>
                  <td className="px-4 py-3 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditUser(user);
                        setShowModal(true);
                      }}
                      className="px-3 py-1 rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-3 py-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t bg-gray-50">
              <span className="text-sm text-gray-600">
                Page <strong>{currentPage}</strong> of{" "}
                <strong>{totalPages}</strong>
              </span>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border text-sm disabled:opacity-50 hover:bg-gray-100"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-md text-sm border transition ${
                        page === currentPage
                          ? "bg-blue-600 text-white border-blue-600"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md border text-sm disabled:opacity-50 hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <UserModal user={editUser} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default AdminUsers;

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

    if (!form.fullName || !form.email) {
      toast.error("Name and email are required");
      return;
    }

    if (isEdit) {
      dispatch(
        updateUserByAdmin({
          userId: user._id,
          data: form,
        })
      )
        .unwrap()
        .then(() => {
          toast.success("User updated successfully");
          onClose();
        })
        .catch((err) => toast.error(err));
    } else {
      if (!form.password) {
        toast.error("Password is required");
        return;
      }

      dispatch(addUserByAdmin(form))
        .unwrap()
        .then(() => {
          toast.success("User added successfully");
          onClose();
        })
        .catch((err) => toast.error(err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4 shadow-xl"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          {isEdit ? "Edit User" : "Add User"}
        </h2>

        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />

        {!isEdit && (
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        )}

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>

        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Age"
          className="w-full border rounded-lg px-3 py-2"
        />

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {isEdit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};
