"use client";
import { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      console.log("Success:", data);

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-16 px-4 overflow-hidden"
      aria-labelledby="contact-heading"
    >
      <div className="bg-muted-orange mx-auto max-w-350 rounded-2xl p-10 flex justify-center">
        <div className="w-100.75">
          <h2 className="text-stroke-black text-[24px] md:text[33px] text-center mb-10">
            Contact us
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                  placeholder="Your name *"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                  placeholder="Ph No *"
                />
              </div>
            </div>

            <div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                placeholder="Email address *"
              />
            </div>

            <div>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-transparent"
                placeholder="How can we help you? *"
              />
            </div>

            <div>
              <textarea
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-transparent resize-none"
                placeholder="Type your message here..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-tangerine hover:bg-tangerine/90 font-lato text-white py-4 rounded-xl font-heading text-lg transition-colors"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
