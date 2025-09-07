import TextType from "../../../../components/TextType";

export function PreviewText() {
    return (
    <div className="flex-1 flex flex-col items-start justify-center top-10 gap-2 z-10 max-w-2xl text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-black leading-tight font-playfair">
                That's where we come in,
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight font-playfair">
                <TextType
                    text={["Centralized tools to help you thrive.", "We've got you covered."]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor={true}
                    cursorCharacter="|"
                    cursorColor="#333"
                    textColors={["#595880"]}
                />
            </h2>
            <p className="text-lg md:text-xl text-ultraViolet max-w-xl leading-relaxed font-inter">
                We aim to equip you with AI-guided roadmas, centralized government guides, and tools for your personal growth. Bridging the gap between the person you are and the adult you aspire to be; because adulthood is a journey, and your focus is on the path going forward.
            </p>
        </div>
    );
}
