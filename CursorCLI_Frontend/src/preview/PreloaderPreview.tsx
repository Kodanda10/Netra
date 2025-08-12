import PreloaderSplash from "../components/PreloaderSplash";

export default function PreloaderPreview() {
  return (
    <div style={{ minHeight: "100vh", background: "#121212" }}>
      <PreloaderSplash
        src="/video/amogh_preloader.mp4"
        // poster="/images/amogh_preloader_poster.jpg"
        fallbackMs={3600}
        skipDelayMs={1500}
        onDone={() => {
          console.log("Preloader finished (preview)");
        }}
      />
    </div>
  );
}


