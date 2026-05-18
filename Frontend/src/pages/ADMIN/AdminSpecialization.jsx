/* eslint-disable no-unused-vars */
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

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";
import {
  Plus,
  Pencil,
  X,
  Layers,
  Activity,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

const AdminSpecialization = () => {
  const dispatch = useDispatch();
  const {
    list = [],
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.specialization);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 selection:bg-indigo-50 animate-fade-in">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        shadow-sm
      />

      {/* Main Command Header Strip */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Specialization Registry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure, manage, and toggle status channels for domain clinical
            specializations.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-semibold text-sm rounded-xl shadow-xs hover:bg-indigo-600 active:scale-95 transition-all duration-200"
        >
          <Plus size={16} strokeWidth={2.5} /> Add Specialization
        </button>
      </header>

      {/* Loading Canvas State */}
      {loading && (
        <div className="flex flex-col justify-center items-center h-[40vh] bg-white border border-slate-100 rounded-3xl shadow-xs">
          <Ripples size={55} speed={2} color="#4f46e5" />
          <p className="mt-5 text-slate-500 text-xs font-semibold tracking-widest uppercase animate-pulse">
            Sourcing dynamic domains map...
          </p>
        </div>
      )}

      {/* Grid Layout Core */}
      {!loading && (
        <>
          {list.length === 0 ? (
            <div className="text-center py-24 bg-white border border-slate-100 rounded-3xl shadow-xs">
              <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                <Layers className="text-slate-300" size={26} />
              </div>
              <h3 className="text-slate-800 font-bold text-sm">
                No Domains Configured
              </h3>
              <p className="text-slate-400 text-xs max-w-xs mx-auto mt-1 leading-relaxed">
                No verified medical domain structures or practitioner
                specialization maps are currently registered.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-slate-200 group"
                >
                  <div className="space-y-3.5">
                    {/* Card Title Header Layout */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100/60 text-indigo-700 flex items-center justify-center shrink-0 shadow-xs">
                          <Activity size={15} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                          {item.name}
                        </h3>
                      </div>

                      {/* Translucent Active Label Flag */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase border ${
                          item.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-slate-50 text-slate-400 border-slate-100"
                        }`}
                      >
                        {item.isActive ? "Active Routing" : "Suspended"}
                      </span>
                    </div>

                    {/* Block Content Segment Description */}
                    <div className="bg-slate-50/50 border border-slate-50 rounded-xl p-3.5 h-20 overflow-hidden">
                      <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-3">
                        {item.description ||
                          "No public route parameters or biography configured for this specialty group node."}
                      </p>
                    </div>
                  </div>

                  {/* Operational Settings Bar Layout */}
                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-50">
                    {/* Toggle Control Area */}
                    <div className="flex items-center gap-2">
                      <ToggleSwitch
                        checked={item.isActive}
                        onChange={() =>
                          dispatch(toggleSpecializationStatus(item._id))
                        }
                      />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Registry Flow
                      </span>
                    </div>

                    {/* Modification Trigger Utility Button */}
                    <button
                      onClick={() => openEdit(item)}
                      className="p-2 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg transition-colors shadow-2xs active:scale-95"
                      title="Modify Specialty Spec"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Glassmorphic Layer Form Modal Container */}
      {openModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 overflow-y-auto max-h-[85vh] border border-slate-100 shadow-xl">
            {/* Modal Control Header Block */}
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-md font-bold text-slate-900">
                  {editingId
                    ? "Modify Domain Parameters"
                    : "Create Specialization Node"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Setup technical classifications cleanly
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 rounded-lg transition-all active:scale-95"
              >
                <X size={15} strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={submitHandler} className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Domain Classification Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  type="text"
                  className="w-full border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-2 outline-none shadow-inner transition-all font-medium text-slate-800"
                  placeholder="e.g. Ophthalmology, Neurology"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Biography Description
                </label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-2 outline-none shadow-inner font-medium text-slate-800 resize-none"
                  placeholder="Describe treatment metrics and field focus parameters..."
                />
              </div>

              {/* Action Button Strip */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-indigo-600 active:scale-95 transition-all shadow-xs"
                >
                  {editingId ? "Commit Domain Changes" : "Confirm Entry Setup"}
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
