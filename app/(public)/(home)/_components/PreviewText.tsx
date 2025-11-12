import TextType from "../../../../components/TextType";

export function PreviewText() {
  return (
    <div className="w-full flex flex-col items-start justify-center gap-3 sm:gap-4 md:gap-5 text-left px-4 sm:px-0">
      <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl text-black leading-tight font-playfair">
        That&apos;s where we come in,
      </h2>
      <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight font-playfair">
        <TextType
          cursorCharacter="|"
          cursorColor="#333"
          pauseDuration={1500}
          showCursor={true}
          text={[
            "Centralized tools to help you thrive.",
            "We've got you covered.",
          ]}
          textColors={["#595880"]}
          typingSpeed={75}
        />
      </h2>
      <p className="text-base sm:text-lg md:text-lg lg:text-xl text-ultraViolet leading-relaxed font-inter max-w-sm sm:max-w-md md:max-w-lg">
        We aim to equip you with AI-guided roadmaps, centralized government
        guides, and tools for your personal growth. Bridging the gap between the
        person you are and the adult you aspire to be; because adulthood is a
        journey, and your focus is on the path going forward.
      </p>
    </div>
  );
}
