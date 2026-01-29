import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSpecializations,
  createSpecialization,
  updateSpecialization,
  toggleSpecializationStatus,
} from "../../features/specialization/specializationThunks";
import ToggleSwitch from "../../components/atoms/ToggleSwitch";
import {
  clearSpecializationError,
  clearSpecializationSuccess,
} from "../../features/specialization/specializationSlice";

import { toast } from "react-toastify";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";

const AdminSpecialization = () => {
  const dispatch = useDispatch();
  const { list, loading, error, successMessage } = useSelector(
    (state) => state.specialization
  );

  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    dispatch(fetchSpecializations());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearSpecializationError());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSpecializationSuccess());
      closeModal();
    }
  }, [error, successMessage, dispatch]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", description: "" });
    setOpenModal(true);
  };

  const openEdit = (item) => {
    setEditingId(item._id);
    setForm({ name: item.name, description: item.description || "" });
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingId(null);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.warning("Specialization name is required");
      return;
    }

    editingId
      ? dispatch(updateSpecialization({ id: editingId, data: form }))
      : dispatch(createSpecialization(form));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Specializations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage doctor specializations
          </p>
        </div>

        <button
          onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl shadow-lg transition active:scale-95"
        >
          + Add Specialization
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-24">
          <Ripples size="70" speed="2" color="#4f46e5" />
        </div>
      )}

      {!loading && (
        <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100/70 text-gray-600">
              <tr>
                <th className="px-6 py-4 text-left">Specialization</th>
                <th className="px-6 py-4 text-left hidden sm:table-cell">
                  Description
                </th>
                <th className="px-6 py-4 text-center">Active</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {list.map((item) => (
                <tr
                  key={item._id}
                  className="border-b last:border-none hover:bg-indigo-50/40 transition"
                >
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {item.name}
                  </td>

                  <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">
                    {item.description || "—"}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <ToggleSwitch
                      checked={item.isActive}
                      onChange={() =>
                        dispatch(toggleSpecializationStatus(item._id))
                      }
                    />
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => openEdit(item)}
                      className="text-indigo-600 font-medium hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}

              {list.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-14 text-center text-gray-400">
                    No specializations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {openModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[94%] sm:w-105 rounded-3xl p-6 shadow-2xl animate-fadeIn">
            <h2 className="text-xl font-bold mb-6">
              {editingId ? "Edit Specialization" : "Add Specialization"}
            </h2>

            <form onSubmit={submitHandler} className="space-y-5">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Cardiology"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full mt-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Heart related treatments"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSpecialization;
