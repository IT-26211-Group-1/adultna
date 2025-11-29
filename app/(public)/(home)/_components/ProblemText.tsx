import TextType from "../../../../components/TextType";

export function ProblemText() {
  return (
    <div className="max-w-5xl mx-auto text-center z-10 px-4 sm:px-6 w-full">
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair italic text-white leading-tight">
        <TextType
          cursorCharacter="|"
          cursorColor="#333"
          pauseDuration={1500}
          showCursor={true}
          text={[
            "Taking the first step into adulthood isn't as straightforward as it seems...",
            "It can be overwhelming, confusing, and downright intimidating...",
            "But you're not alone.",
          ]}
          typingSpeed={75}
        />
      </div>
    </div>
  );
}
