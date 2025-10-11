import TextType from "../../../../components/TextType";

export function ProblemText() {
  return (
    <div
      className="max-w-l m-auto text-center z-10"
      style={{
        fontFamily: "Playfair Display",
        color: "#FFFF",
        fontSize: "45px",
        fontStyle: "italic",
      }}
    >
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
  );
}
