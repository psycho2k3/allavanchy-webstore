import { useState } from 'react';
import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import Reveal from '../components/motion/Reveal.jsx';
import { getApiErrorMessage } from '../services/apiClient.js';
import { sendContactMessage } from '../services/contactApi.js';

function Contact() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.id]: event.target.value,
    }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await sendContactMessage(form);
      setStatus({ type: 'success', message: 'Your message has been sent. We will be in touch soon.' });
      setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: getApiErrorMessage(error, 'Unable to send your message right now.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedPage className="bg-allavanchy-ivory pb-20 pt-28">
      <title>Contact | ALLAVANCHY</title>
      <div className="av-container">
        <Reveal className="border-b border-allavanchy-stone pb-8">
          <p className="av-eyebrow">Contact</p>
          <h1 className="av-heading-xl mt-3">Client Services</h1>
          <p className="av-body mt-5 max-w-2xl">
            For order support, styling guidance, and collection enquiries, contact the ALLAVANCHY client services team.
          </p>
        </Reveal>

        <div className="grid gap-10 py-10 lg:grid-cols-[1fr_0.8fr]">
          <Reveal>
            <form className="grid gap-5 border border-allavanchy-stone bg-allavanchy-pearl p-6 md:p-8" onSubmit={submitForm}>
              {status.message && (
                <p
                  className={`border px-4 py-3 text-sm ${
                    status.type === 'success'
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : 'border-red-300 bg-red-50 text-red-700'
                  }`}
                >
                  {status.message}
                </p>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="av-caption" htmlFor="firstName">First Name</label>
                  <input
                    className="av-input mt-2 bg-allavanchy-ivory"
                    id="firstName"
                    onChange={updateField}
                    required
                    type="text"
                    value={form.firstName}
                  />
                </div>
                <div>
                  <label className="av-caption" htmlFor="lastName">Last Name</label>
                  <input
                    className="av-input mt-2 bg-allavanchy-ivory"
                    id="lastName"
                    onChange={updateField}
                    required
                    type="text"
                    value={form.lastName}
                  />
                </div>
              </div>
              <div>
                <label className="av-caption" htmlFor="email">Email</label>
                <input
                  className="av-input mt-2 bg-allavanchy-ivory"
                  id="email"
                  onChange={updateField}
                  required
                  type="email"
                  value={form.email}
                />
              </div>
              <div>
                <label className="av-caption" htmlFor="subject">Subject</label>
                <input
                  className="av-input mt-2 bg-allavanchy-ivory"
                  id="subject"
                  onChange={updateField}
                  type="text"
                  value={form.subject}
                />
              </div>
              <div>
                <label className="av-caption" htmlFor="message">Message</label>
                <textarea
                  className="av-input mt-2 min-h-40 bg-allavanchy-ivory"
                  id="message"
                  onChange={updateField}
                  required
                  value={form.message}
                />
              </div>
              <button className="av-button-primary justify-self-start" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </Reveal>

          <Reveal className="space-y-6" delay={0.1}>
            <div className="border border-allavanchy-stone bg-allavanchy-pearl p-6">
              <h2 className="av-heading-md">Contact Details</h2>
              <div className="mt-5 space-y-3 text-sm text-allavanchy-graphite">
                <p>
                  Email:{' '}
                  <a className="av-link" href="mailto:allavanchycustomersupport@gmail.com">
                    allavanchycustomersupport@gmail.com
                  </a>
                </p>
                <p>
                  Instagram:{' '}
                  <a
                    className="av-link"
                    href="https://www.instagram.com/allavanchy"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    @allavanchy
                  </a>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default Contact;