import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Faq.css";

const FAQSection = () => {
  const faqs = [
    {
      question: "What is this platform about?",
      answer:
        "It's a vibrant digital space for artists and creators to showcase their work, connect, and grow their talent.",
    },
    {
      question: "How do I join and upload my art?",
      answer:
        "Sign up with your email, create a profile, and you can start uploading artworks in images format.",
    },
    {
      question: "Is there a fee to use the platform?",
      answer: "Currently all the features are free for all.",
    },
    {
      question: "Can I sell my art here?",
      answer:
        "Surely in future You would also be able to sell your artwork here; for now you can only upload and engage in artworks.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section">
      <div className="faq-header">
        <h2>
          Frequently Asked <span>Questions</span>
        </h2>
        <p>Everything you need to know about getting started</p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div
            className={`faq-item ${openIndex === index ? "open" : ""}`}
            key={index}
          >
            <button className="faq-question" onClick={() => toggleFAQ(index)}>
              {faq.question}
            </button>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="faq-footer">
        <p>Still have questions?</p>
        <button onClick={() => navigate("/support")}>
          Contact Our Support Team →
        </button>
      </div>
    </section>
  );
};

export default FAQSection;