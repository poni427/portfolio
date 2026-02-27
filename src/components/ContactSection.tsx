interface ContactSectionProps {
  content: Record<string, string>;
}

export default function ContactSection({ content }: ContactSectionProps) {
  const c = (k: string, fallback: string) => content[k] || fallback;
  const TELEGRAM = c('telegram_url', 'https://t.me/VitIgVit');
  const LINKEDIN = c('linkedin_url', 'https://www.linkedin.com/in/vitigvit/');

  return (
    <section
      id="contact"
      className="relative w-full grain-overlay"
      style={{ minHeight: '100vh', overflow: 'hidden' }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${c('contact_footer_image_url', 'https://i.postimg.cc/JnD704KD/footer.png')}')` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,22,40,0.52) 0%, rgba(10,22,40,0.65) 55%, rgba(8,16,28,0.97) 100%)',
        }}
      />

      <div
        className="relative z-10 flex flex-col justify-between"
        style={{ minHeight: '100vh', padding: '5.5rem clamp(1rem, 3vw, 1.5rem) 0' }}
      >
        <div>
          <div data-reveal data-delay="0">
            <h2
              className="font-display font-black text-white mb-12"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', lineHeight: 0.95 }}
            >
              <span>GET IN </span>
              <span className="text-stroke">TOUCH</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 mb-10">
            <div data-reveal data-delay="60" className="flex flex-col justify-between gap-5">
              <p className="text-white" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.1rem)', lineHeight: 1.75, opacity: 0.78 }}>
                {c('contact_text1', "Have an idea that needs to come to life? Whether it's a gameplay concept, an interactive application, or a real-time visualization, I turn ideas into functional, interactive systems in Unreal Engine.")}
              </p>
              <div>
                <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  LET&apos;S COLLABORATE
                </a>
              </div>
            </div>

            <div data-reveal data-delay="100" className="flex flex-col justify-between gap-5">
              <p className="text-white" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.1rem)', lineHeight: 1.75, opacity: 0.78 }}>
                {c('contact_text2', "If you're a studio, company, or team looking for a Technical Designer or Unreal Engine Developer, I'm open to collaborating on gameplay systems, interactive applications, and real-time environments.")}
              </p>
              <div>
                <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="btn-filled">
                  HIRE ME
                </a>
              </div>
            </div>

            <div data-reveal data-delay="130" className="flex flex-col justify-between gap-5">
              <p className="text-white" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.1rem)', lineHeight: 1.75, opacity: 0.78 }}>
                {c('contact_text3', "Interested in a specific feature or system from my projects? I offer a free initial consultation to discuss how it was built, what it takes to implement, and how similar functionality could be integrated into your product or workflow.")}
              </p>
              <div>
                <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  GET EXPERT ADVICE
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 mb-10 mt-0">
            <div />
            <div data-reveal data-delay="180" className="flex flex-col justify-between gap-5">
              <div className="flex flex-col gap-4">
                <p className="text-white" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.1rem)', lineHeight: 1.7, opacity: 0.82 }}>
                  Feel free to reach out through any of my socials below or send me a message directly. I&apos;m always happy to discuss systems, interaction, and new real-time ideas.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="btn-outline">LINKEDIN</a>
                <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="btn-outline">TELEGRAM</a>
                <a href="mailto:vitigvit@gmail.com" className="btn-outline">EMAIL</a>
              </div>
            </div>
            <div />
          </div>
        </div>

        <div>
          <div data-reveal="scale" data-delay="50">
            <h3
              className="font-display font-black text-white text-center"
              style={{
                fontSize: 'clamp(1.2rem, 5.5vw, 7.5rem)',
                letterSpacing: '-0.02em',
                lineHeight: 0.88,
              }}
            >
              Unreal Engine • Blueprints • C++ • Digital Twin
            </h3>
          </div>

          <div
            className="mt-4 pt-4 flex items-center justify-center"
            style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>
      </div>
    </section>
  );
}
