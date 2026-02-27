interface AboutSectionProps {
  content: Record<string, string>;
}

export default function AboutSection({ content }: AboutSectionProps) {
  const c = (k: string, fallback: string) => content[k] || fallback;

  return (
    <section
      id="about"
      className="relative w-full grain-overlay"
      style={{ minHeight: '100vh' }}
    >
      <div
        className="absolute inset-0 parallax-bg"
        style={{
          backgroundImage: `url('${c('hero_image_url', 'https://i.postimg.cc/CxDPxFzt/Podlozka-1-i-2-stranica.webp')}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,22,40,0.55) 0%, rgba(10,22,40,0.78) 50%, rgba(10,22,40,0.95) 100%)',
        }}
      />

      <div className="relative z-10 w-full" style={{ padding: '6rem 1.5rem 5rem' }}>
        <div data-reveal data-delay="0">
          <h2
            className="font-display font-black text-white mb-10"
            style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', lineHeight: 0.92 }}
          >
            <span>ABOUT </span>
            <span className="text-stroke">ME</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div
            data-reveal="left"
            data-delay="100"
            className="relative overflow-hidden"
            style={{ borderRadius: '2px' }}
          >
            <img
              src={c('about_image_url', 'https://i.postimg.cc/CxDPxFzt/Podlozka-1-i-2-stranica.webp')}
              alt="Vitaliy Vitkovskiy"
              className="w-full object-cover"
              style={{ maxHeight: '640px', objectPosition: 'center top' }}
            />
          </div>

          <div data-reveal="right" data-delay="160" className="flex flex-col gap-5 pt-2">
            <p className="text-white" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', lineHeight: 1.75, opacity: 0.86 }}>
              {c('about_text1', "I'm a Technical Game Designer specializing in Unreal Engine-based gameplay and interactive systems.")}
            </p>
            <p className="text-white" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', lineHeight: 1.75, opacity: 0.86 }}>
              {c('about_text2', 'I enjoy working at the intersection of design and code, translating abstract ideas into concrete systems using Blueprints and C++.')}
            </p>
            <p className="text-white" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', lineHeight: 1.75, opacity: 0.86 }}>
              {c('about_text3', 'I believe strong interactive experiences come from well-structured systems.')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
