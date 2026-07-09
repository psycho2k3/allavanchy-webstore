import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import Reveal from '../components/motion/Reveal.jsx';
import faqs from '../data/faqs.js';

function FAQ() {
  const [activeQuestion, setActiveQuestion] = useState(faqs[0].question);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return faqs;

    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query),
    );
  }, [searchTerm]);

  return (
    <AnimatedPage className="bg-allavanchy-ivory pb-20 pt-28">
      <div className="av-container-narrow">
        <Reveal className="text-center">
          <p className="av-eyebrow">FAQ</p>
          <h1 className="av-heading-xl mt-3">Questions, Answered</h1>
          <p className="av-body mx-auto mt-5 max-w-2xl">
            Find details about orders, sizing, shipping, returns, and caring for your ALLAVANCHY pieces.
          </p>
        </Reveal>

        <Reveal className="mt-10" delay={0.1}>
          <label className="sr-only" htmlFor="faq-search">Search FAQs</label>
          <input
            className="av-input bg-allavanchy-pearl"
            id="faq-search"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search FAQs"
            type="search"
            value={searchTerm}
          />
        </Reveal>

        <Reveal className="mt-8 divide-y divide-allavanchy-stone border-y border-allavanchy-stone" delay={0.15}>
          {filteredFaqs.map((faq) => {
            const isOpen = activeQuestion === faq.question;

            return (
              <div key={faq.question}>
                <button
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  onClick={() => setActiveQuestion(isOpen ? '' : faq.question)}
                  type="button"
                >
                  <span className="text-sm font-medium uppercase tracking-luxury text-allavanchy-ink">
                    {faq.question}
                  </span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown aria-hidden="true" size={18} strokeWidth={1.5} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      initial={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="av-body pb-6">{faq.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </div>
    </AnimatedPage>
  );
}

export default FAQ;
