import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContacts } from "../../features/contact/contactThunks";
import { clearContactState } from "../../features/contact/contactSlice";
import { toast } from "react-toastify";
import { Ripples } from "ldrs/react";
import "ldrs/react/Ripples.css";

const AdminContacts = () => {
  const dispatch = useDispatch();
  const { contacts, loading, error } = useSelector((state) => state.contact);

  useEffect(() => {
    dispatch(getAllContacts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearContactState());
    }
  }, [error, dispatch]);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Contact Messages
      </h1>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
          <Ripples size={64} speed={2} color="#4f46e5" />
          <p className="text-gray-500 font-medium">Loading messages...</p>
        </div>
      ) : contacts.length === 0 ? (
        <div className="flex justify-center items-center h-[60vh] text-gray-500 font-medium">
          No contact messages found.
        </div>
      ) : (
        <>
          <div className="hidden lg:block overflow-x-auto rounded-2xl shadow border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {["Name", "Email", "Message", "Date"].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {contact.name || contact.fullName}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {contact.email}
                    </td>
                    <td className="px-5 py-4 text-gray-600 max-w-md wrap-break-words">
                      {contact.message}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(contact.createdAt).toLocaleDateString()}{" "}
                      {new Date(contact.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 lg:hidden">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col gap-3"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {contact.name || contact.fullName}
                  </p>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700">Message</p>
                  <p className="text-gray-600 wrap-break-words">
                    {contact.message}
                  </p>
                </div>

                <div className="text-sm text-gray-500">
                  {new Date(contact.createdAt).toLocaleDateString()}{" "}
                  {new Date(contact.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminContacts;
