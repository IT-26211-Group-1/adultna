"use client";

import dynamic from "next/dynamic";

const TextType = dynamic(() => import("./TextTypeClient"), {
  ssr: false,
  loading: () => <div className="inline-block">Loading...</div>,
});

export default TextType;
