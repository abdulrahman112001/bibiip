/**
 * فيديو خلفية "استريمنج" مباشر (autoplay + loop) بدل آلية السكرول اليدوي
 * اللي كانت في ScrollTransportScene.tsx — أبسط وأنعم بكتير: الفيديو بيتشغل
 * ويلف لوحده زي أي فيديو خلفية عادي، من غير ما نتحكم يدويًا في currentTime.
 */
export default function HeroReel() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-brand-yellow-soft">
      <video
        src="/brand/hero-reel.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* تظليل خفيف فوق عشان الـ nav يبان واضح، وتحت عشان الانتقال لباقي الصفحة يبقى ناعم */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
