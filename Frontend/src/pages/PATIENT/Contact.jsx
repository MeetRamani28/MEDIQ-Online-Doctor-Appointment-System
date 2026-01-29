import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "../../components/atoms/Image";
import Button from "../../components/atoms/Button";
import { useForm } from "react-hook-form";
import { submitContact } from "../../features/contact/contactThunks";
import { toast } from "react-toastify";
import { clearContactState } from "../../features/contact/contactSlice";

const Contact = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.contact);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    dispatch(submitContact(data));
  };

  useEffect(() => {
    if (success) {
      toast.success("Message sent successfully!");
      reset();
      dispatch(clearContactState());
    }

    if (error) {
      toast.error(error);
      dispatch(clearContactState());
    }
  }, [success, error, dispatch, reset]);

  return (
    <section className="w-full min-h-screen pt-[12vh] pb-12 bg-[#F7FBFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-3xl overflow-hidden shadow-md">
            <Image image="/images/contact1.jpg" />
          </div>

          <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Contact <span className="text-[#0097a7]">Us</span>
            </h1>

            <p className="mt-3 text-gray-600">
              Have questions or feedback? Fill out the form and we’ll get back
              to you shortly.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <input
                {...register("name", { required: true })}
                placeholder="Your Name"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0097a7]"
              />

              <input
                {...register("email", { required: true })}
                type="email"
                placeholder="Your Email"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0097a7]"
              />

              <textarea
                {...register("message", { required: true })}
                placeholder="Your Message"
                rows="4"
                className="w-full border rounded-xl px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-[#0097a7]"
              />

              <Button loading={loading}>
                {loading ? "Sending..." : "Submit Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
