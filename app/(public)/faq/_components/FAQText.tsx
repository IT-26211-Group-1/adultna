export function FAQText() {
  return (
    <section className="w-full min-h-[220px] sm:min-h-[320px] mt-30 py-6 sm:py-10 bg-none relative flex flex-col gap-4 px-4 md:px-22 max-w-6xl mx-auto">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl text-ultra-violet leading-tight font-playfair text-center">
        You Have Questions.
        <br />
        <span className="text-crayola-orange italic">
          We Have
          <svg
            aria-hidden="true"
            className="inline size-10 align-middle mx-1"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M12 1.5a.75.75 0 0 1 .75.75V4.5a.75.75 0 0 1-1.5 0V2.25A.75.75 0 0 1 12 1.5ZM5.636 4.136a.75.75 0 0 1 1.06 0l1.592 1.591a.75.75 0 0 1-1.061 1.06l-1.591-1.59a.75.75 0 0 1 0-1.061Zm12.728 0a.75.75 0 0 1 0 1.06l-1.591 1.592a.75.75 0 0 1-1.06-1.061l1.59-1.591a.75.75 0 0 1 1.061 0Zm-6.816 4.496a.75.75 0 0 1 .82.311l5.228 7.917a.75.75 0 0 1-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 0 1-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 0 1-1.247-.606l.569-9.47a.75.75 0 0 1 .554-.68ZM3 10.5a.75.75 0 0 1 .75-.75H6a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10.5Zm14.25 0a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H18a.75.75 0 0 1-.75-.75Zm-8.962 3.712a.75.75 0 0 1 0 1.061l-1.591 1.591a.75.75 0 1 1-1.061-1.06l1.591-1.592a.75.75 0 0 1 1.06 0Z"
              fillRule="evenodd"
            />
          </svg>
          Answers.
        </span>
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-ultra-violet leading-relaxed font-inter text-center">
        We&#39;ve compiled a list of the most frequently asked questions to help 
        you get the information you need. We hope that this section provides you 
        clarity and confidence in using our services.
      </p>
    </section>
  );
}
