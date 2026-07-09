import AnimatedPage from '../components/motion/AnimatedPage.jsx';
import Reveal from '../components/motion/Reveal.jsx';

function Contact() {
  return (
    <AnimatedPage className="bg-allavanchy-ivory pb-20 pt-28">
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
            <form className="grid gap-5 border border-allavanchy-stone bg-allavanchy-pearl p-6 md:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="av-caption" htmlFor="first-name">First Name</label>
                  <input className="av-input mt-2 bg-allavanchy-ivory" id="first-name" type="text" />
                </div>
                <div>
                  <label className="av-caption" htmlFor="last-name">Last Name</label>
                  <input className="av-input mt-2 bg-allavanchy-ivory" id="last-name" type="text" />
                </div>
              </div>
              <div>
                <label className="av-caption" htmlFor="email">Email</label>
                <input className="av-input mt-2 bg-allavanchy-ivory" id="email" type="email" />
              </div>
              <div>
                <label className="av-caption" htmlFor="subject">Subject</label>
                <input className="av-input mt-2 bg-allavanchy-ivory" id="subject" type="text" />
              </div>
              <div>
                <label className="av-caption" htmlFor="message">Message</label>
                <textarea className="av-input mt-2 min-h-40 bg-allavanchy-ivory" id="message" />
              </div>
              <button className="av-button-primary justify-self-start" type="submit">Send Message</button>
            </form>
          </Reveal>

          <Reveal className="space-y-6" delay={0.1}>
            <div className="border border-allavanchy-stone bg-allavanchy-pearl p-6">
              <h2 className="av-heading-md">Contact Details</h2>
              <div className="mt-5 space-y-3 text-sm text-allavanchy-graphite">
                <p>Email: clientservices@allavanchy.com</p>
                <p>Phone: +1 212 555 0184</p>
                <p>Instagram: @allavanchy</p>
                <p>TikTok: @allavanchy</p>
              </div>
            </div>

            <div className="border border-allavanchy-stone bg-allavanchy-pearl p-6">
              <h2 className="av-heading-md">Business Hours</h2>
              <div className="mt-5 space-y-3 text-sm text-allavanchy-graphite">
                <p>Monday to Friday: 10:00 AM - 6:00 PM</p>
                <p>Saturday: 11:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            <div className="flex min-h-64 items-center justify-center border border-allavanchy-stone bg-allavanchy-mist p-6 text-center">
              <div>
                <p className="av-eyebrow">Google Maps</p>
                <p className="av-body mt-3 max-w-sm">Map embed will appear here when the showroom location is connected.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default Contact;
