const blogs = [
  {
    title: "The Importance of Regular Health Checkups",
    description:
      "Regular health checkups can help you catch potential health issues early and ensure you're staying on top of your well-being. Learn how routine visits to your doctor can save your life by preventing, diagnosing, and managing conditions before they become serious.",
    image: "/images/blog1.png",
  },
  {
    title: "How to Book Doctor Appointments Online with MEDIQ",
    description:
      "Booking your doctor's appointment online has never been easier with MEDIQ. This guide walks you through how to find the right doctor, schedule appointments, and manage your health needs, all from the comfort of your home.",
    image: "/images/blog2.jpeg",
  },
  {
    title: "Top 5 Questions to Ask During Your Doctor Appointment",
    description:
      "Maximize the value of your doctor's visit by asking the right questions. Here are the top 5 questions you should ask during your appointment to ensure you understand your diagnosis, treatment plan, and next steps.",
    image: "/images/blog3.jpeg",
  },
  {
    title: "Telemedicine: Healthcare from Home",
    description:
      "With Telemedicine, you no longer need to leave your home to consult with your doctor. Learn about the benefits of virtual visits, how they work, and when telemedicine can be a suitable alternative to in-person consultations.",
    image: "/images/blog4.jpeg",
  },
  {
    title: "10 Signs You Should See a Doctor Immediately",
    description:
      "While some symptoms can be managed at home, others may require immediate medical attention. Learn the warning signs that should never be ignored and how MEDIQ can help you quickly find the right specialist for urgent care.",
    image: "/images/blog5.jpeg",
  },
  {
    title: "How to Choose the Right Doctor for Your Health Needs",
    description:
      "Choosing the right doctor is crucial for your health journey. This article provides tips on how to select a healthcare provider that fits your needs, including factors such as specialization, location, and patient reviews on MEDIQ.",
    image: "/images/blog6.jpeg",
  },
  {
    title: "Understanding Preventive Care",
    description:
      "Preventive care can be the key to living a healthier and longer life. Learn how regular screenings, vaccinations, and early detection tests can help you prevent diseases and stay on top of your health with MEDIQ.",
    image: "/images/blog7.jpeg",
  },
  {
    title: "Managing Chronic Conditions Effectively",
    description:
      "Living with a chronic condition can be challenging, but regular doctor visits can help you manage symptoms and improve your quality of life. Discover how MEDIQ can help you stay on top of your health and find specialists who understand your needs.",
    image: "/images/blog8.jpeg",
  },
  {
    title: "Preparing for Your First Doctor Appointment",
    description:
      "Is it your first time booking a doctor’s appointment through MEDIQ? Learn how to prepare for your visit, what to bring, and how to make the most of your time with the doctor for an efficient and stress-free experience.",
    image: "/images/blog9.jpeg",
  },
];

const Blogs = () => {
  return (
    <section className="w-full min-h-screen pt-[12vh] pb-12 bg-[#F7FBFC]">
      <div className="text-center mb-12 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
          OUR <span className="text-[#0097a7]">BLOGS</span>
        </h1>
        <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
          Expert medical insights, health tips, and guides to help you stay
          informed and healthy.
        </p>
      </div>

      <div className="px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-5 flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-[#0097a7] leading-snug">
                  {blog.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                  {blog.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
