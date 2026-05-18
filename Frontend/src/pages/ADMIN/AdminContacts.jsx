/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContacts } from "../../features/contact/contactThunks";
import { clearContactState } from "../../features/contact/contactSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";
import { Mail, Calendar, MessageSquare, Copy, MailCheck } from "lucide-react";

const AdminContacts = () => {
  const dispatch = useDispatch();
  const {
    contacts = [],
    loading,
    error,
  } = useSelector((state) => state.contact);

  useEffect(() => {
    dispatch(getAllContacts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearContactState());
    }
  }, [error, dispatch]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Email copied to clipboard!");
  };

  const getInitials = (name) => {
    if (!name) return "CM";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 selection:bg-indigo-50">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        shadow-sm
      />

      {/* Main Structural Header Command Bar */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Contact Communications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Audit public incoming inquiries, user messages, and platform
            feedback lines.
          </p>
        </div>
        {!loading && contacts.length > 0 && (
          <span className="inline-flex self-start sm:self-auto items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-cyan-600 to-teal-500 text-white rounded-xl shadow-xs">
            {contacts.length} Open Tickets
          </span>
        )}
      </header>

      {/* Loading Canvas Matrix */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-[45vh] bg-white border border-slate-100 rounded-3xl shadow-xs">
          <Ripples size={55} speed={2} color="#4f46e5" />
          <p className="mt-5 text-slate-500 text-xs font-semibold tracking-widest uppercase animate-pulse">
            Sourcing dynamic feed log...
          </p>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-100 rounded-3xl shadow-xs">
          <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
            <Mail className="text-slate-300" size={26} />
          </div>
          <h3 className="text-slate-800 font-bold text-sm">
            Inbox Queue Clear
          </h3>
          <p className="text-slate-400 text-xs max-w-xs mx-auto mt-1 leading-relaxed">
            No dynamic client feedback tokens or communications records exist in
            the database.
          </p>
        </div>
      ) : (
        /* Asymmetric Layout Feed Grid */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {contacts.map((contact) => {
            const senderName =
              contact.name || contact.fullName || "Anonymous Sender";

            return (
              <div
                key={contact._id}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-slate-200 group"
              >
                <div className="space-y-4">
                  {/* Top Block: Demographics & Time Header */}
                  <div className="flex items-start justify-between gap-4 border-b border-slate-50 pb-3">
                    <div className="flex items-center gap-3.5">
                      {/* Name Initials Icon Token */}
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100/60 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 tracking-wider">
                        {getInitials(senderName)}
                      </div>
                      <div className="truncate">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                          {senderName}
                        </h3>
                        {/* Interactive Email Tag */}
                        <div className="flex items-center gap-1.5 mt-0.5 group/email">
                          <p className="text-xs text-slate-400 font-medium truncate max-w-[180px] sm:max-w-none">
                            {contact.email}
                          </p>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(contact.email)}
                            className="text-slate-300 hover:text-slate-600 p-0.5 rounded transition-colors hidden group-hover/email:block"
                            title="Copy Email Address"
                          >
                            <Copy size={11} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Timestamp Node */}
                    <div className="flex items-center gap-1.5 text-right text-[11px] font-medium text-slate-400 shrink-0 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100/60">
                      <Calendar size={12} className="text-slate-400" />
                      <span>
                        {new Date(contact.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}{" "}
                        {new Date(contact.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Message Block Segment */}
                  <div className="flex gap-3 items-start bg-slate-50/50 border border-slate-50/40 rounded-xl p-4">
                    <MessageSquare
                      size={16}
                      className="text-slate-300 shrink-0 mt-0.5"
                    />
                    <p className="text-xs font-medium text-slate-600 leading-relaxed break-words whitespace-pre-wrap">
                      {contact.message}
                    </p>
                  </div>
                </div>

                {/* Bottom Quick-Action Module Strip */}
                <div className="flex items-center justify-end mt-4 pt-3 border-t border-slate-50/60">
                  <a
                    href={`mailto:${contact.email}?subject=RE: Contact Message - MEDIQ`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-indigo-600 text-slate-600 hover:text-white border border-slate-100 hover:border-indigo-600 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all duration-150 shadow-2xs active:scale-95"
                  >
                    <MailCheck size={12} strokeWidth={2.5} /> Direct Reply
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
