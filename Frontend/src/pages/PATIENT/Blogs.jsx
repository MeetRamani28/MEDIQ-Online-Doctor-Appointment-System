import React, { useState } from "react";
import { ArrowRight, Clock, Calendar, BookOpen } from "lucide-react";

const blogs = [
  {
    id: 1,
    title: "The Importance of Regular Health Checkups",
    description:
      "Regular health checkups can help you catch potential health issues early and ensure you're staying on top of your well-being. Learn how routine visits can save your life.",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800", // UPDATED
    category: "Preventive Care",
    date: "May 12, 2026",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "How to Book Doctor Appointments Online with MEDIQ",
    description:
      "Booking your doctor's appointment online has never been easier with MEDIQ. This guide walks you through how to find the right doctor and schedule appointments.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
    category: "Guide",
    date: "May 10, 2026",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "Top 5 Questions to Ask During Your Doctor Appointment",
    description:
      "Maximize the value of your doctor's visit by asking the right questions. Ensure you understand your diagnosis, treatment plan, and next steps perfectly.",
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
    category: "Consultation",
    date: "May 08, 2026",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Telemedicine: Healthcare from the Comfort of Your Home",
    description:
      "With Telemedicine, you no longer need to leave your home to consult with your doctor. Learn about the benefits of virtual visits and how they work effectively.",
    image:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80&w=800",
    category: "Tech",
    date: "May 05, 2026",
    readTime: "5 min read",
  },
  {
    id: 5,
    title: "10 Signs You Should See a Doctor Immediately",
    description:
      "While some symptoms can be managed at home, others may require immediate medical attention. Learn the warning signs that should never be ignored.",
    image:
      "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&q=80&w=800", // Emergency/Urgent Care focus
    category: "Urgent Care",
    date: "May 01, 2026",
    readTime: "7 min read",
  },
  {
    id: 6,
    title: "How to Choose the Right Doctor for Your Needs",
    description:
      "Choosing the right doctor is crucial for your health journey. This article provides tips on how to select a provider that fits your specific needs on MEDIQ.",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
    category: "Insights",
    date: "April 28, 2026",
    readTime: "5 min read",
  },
  {
    id: 7,
    title: "The Future of AI in Modern Medical Diagnosis",
    description:
      "AI is revolutionizing how we detect diseases. Explore how machine learning models are assisting doctors in providing more accurate diagnoses than ever before.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800", // UPDATED
    category: "Tech",
    date: "April 25, 2026",
    readTime: "8 min read",
  },
  {
    id: 8,
    title: "Mental Health: Breaking the Stigma in 2026",
    description:
      "Prioritizing your mind is as important as your body. We discuss effective ways to manage stress and why seeking help is a sign of ultimate strength.",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    category: "Wellness",
    date: "April 22, 2026",
    readTime: "6 min read",
  },
  {
    id: 9,
    title: "Nutritional Habits for a Stronger Immune System",
    description:
      "What you eat directly impacts your ability to fight infections. Discover the superfoods that can give your immune system the boost it needs this season.",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
    category: "Nutrition",
    date: "April 20, 2026",
    readTime: "5 min read",
  },
  {
    id: 10,
    title: "The Role of Wearable Tech in Heart Health",
    description:
      "From smartwatches to rings, wearable tech is tracking our vitals 24/7. Learn how to interpret your heart rate variability and sleep data for better health.",
    image:
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&q=80&w=800", // UPDATED
    category: "Tech",
    date: "April 18, 2026",
    readTime: "6 min read",
  },
  {
    id: 11,
    title: "Understanding Childhood Vaccinations: A Parent's Guide",
    description:
      "Vaccinations are the first line of defense for your child. We answer common questions parents have about schedules, safety, and long-term benefits.",
    image:
      "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800",
    category: "Pediatrics",
    date: "April 15, 2026",
    readTime: "9 min read",
  },
  {
    id: 12,
    title: "Sleep Hygiene: 7 Tips for a Restful Night",
    description:
      "Poor sleep affects everything from productivity to heart health. Try these scientifically proven methods to fall asleep faster and stay asleep longer.",
    image:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800", // Restful/Sleep focus
    category: "Wellness",
    date: "April 12, 2026",
    readTime: "4 min read",
  },
  {
    id: 13,
    title: "Managing Chronic Back Pain without Surgery",
    description:
      "Back pain is the leading cause of disability worldwide. Explore non-invasive treatments, physiotherapy, and lifestyle changes to reclaim your mobility.",
    image:
      "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?auto=format&fit=crop&q=80&w=800", // Physiotherapy/Back focus
    category: "Physiotherapy",
    date: "April 10, 2026",
    readTime: "7 min read",
  },
  {
    id: 14,
    title: "The Impact of Blue Light on Your Vision",
    description:
      "In a digital-first world, our eyes are constantly strained. Discover how to protect your vision from screen fatigue and the benefits of the 20-20-20 rule.",
    image:
      "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=800", // Ophthalmology/Eye focus
    category: "Ophthalmology",
    date: "April 08, 2026",
    readTime: "5 min read",
  },
  {
    id: 15,
    title: "Yoga for Stress Management: A Beginner's Flow",
    description:
      "You don't need to be flexible to start yoga. Learn five simple poses that can lower your cortisol levels and help you find peace in a busy day.",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    category: "Wellness",
    date: "April 05, 2026",
    readTime: "6 min read",
  },
  {
    id: 16,
    title: "Diabetes Management in the Modern Era",
    description:
      "New glucose monitors and insulin pumps are changing lives. Stay updated on the latest technology and dietary plans for effective diabetes control.",
    image:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
    category: "Internal Medicine",
    date: "April 02, 2026",
    readTime: "8 min read",
  },
  {
    id: 17,
    title: "The Science of Hydration: More Than Just Water",
    description:
      "Are you drinking enough? We dive into the science of electrolytes and why proper hydration is essential for brain function and joint health.",
    image:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=800", // UPDATED
    category: "Nutrition",
    date: "March 30, 2026",
    readTime: "4 min read",
  },
  {
    id: 18,
    title: "Preparing for Surgery: What You Need to Know",
    description:
      "Anxiety before surgery is normal. This checklist helps you prepare physically and mentally for your procedure and the recovery phase that follows.",
    image:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
    category: "Surgery",
    date: "March 28, 2026",
    readTime: "10 min read",
  },
];
const Blogs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  // Pagination Logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="w-full min-h-screen pt-[16vh] pb-24 bg-[#F8FAFB] font-sans selection:bg-[#0097a7] selection:text-white">
      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-[#0097a7] pl-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-4">
              HEALTH <span className="text-[#0097a7]">INSIGHTS.</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              Expert medical knowledge, simplified for your everyday wellness.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm text-xs font-bold text-slate-400 uppercase tracking-widest">
              <BookOpen size={14} className="text-[#0097a7]" /> {blogs.length}{" "}
              Articles Published
            </div>
          </div>
        </div>
      </div>

      {/* --- BLOG GRID --- */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {currentBlogs.map((blog) => (
            <article
              key={blog.id}
              className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,151,167,0.1)] hover:-translate-y-2 flex flex-col h-full"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-[#0097a7] shadow-sm">
                    {blog.category}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-[#0097a7]" />{" "}
                    {blog.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-[#0097a7]" />{" "}
                    {blog.readTime}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-4 tracking-tight group-hover:text-[#0097a7] transition-colors">
                  {blog.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-8 font-medium">
                  {blog.description}
                </p>

                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <button className="flex items-center gap-2 text-[#0097a7] font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                    Read Article <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* --- PAGINATION --- */}
      <div className="mt-20 flex justify-center gap-3">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`w-12 h-12 rounded-2xl font-bold transition-all shadow-sm ${
              currentPage === i + 1
                ? "bg-[#0097a7] text-white shadow-[#0097a7]/40"
                : "bg-white border border-slate-100 text-slate-400 hover:bg-[#0097a7]/10"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Blogs;
