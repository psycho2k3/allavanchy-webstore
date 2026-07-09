function NewsletterSection() {
  return (
    <section className="av-section bg-allavanchy-mist">
      <div className="av-container-narrow text-center">
        <p className="av-eyebrow">Private List</p>
        <h2 className="av-heading-xl mt-3">Receive Early Access</h2>
        <p className="av-body mx-auto mt-5 max-w-2xl">
          Join the ALLAVANCHY list for collection previews, limited release notices, and private styling notes.
        </p>
        <form className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="home-newsletter-email">
            Email address
          </label>
          <input
            className="av-input bg-allavanchy-ivory"
            id="home-newsletter-email"
            placeholder="Email address"
            type="email"
          />
          <button className="av-button-primary shrink-0" type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
}

export default NewsletterSection;
