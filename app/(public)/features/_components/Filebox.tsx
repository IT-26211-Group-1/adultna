"use client";

import Link from "next/link";
import { FeatureImage } from "./FeatureImage";

export function Filebox() {
  return (
    <section
      className="w-full py-16 relative px-4 md:px-22 max-w-7xl mx-auto bg-transparent"
      id="filebox-section"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl text-gray-900 leading-tight font-playfair">
            Keep Your Documents{" "}
            <span className="text-adult-green">Safe and Sorted</span>
          </h2>
          <p className="text-base text-gray-600 leading-relaxed font-inter">
            AdultNa makes document management easy. Store, organize, and track
            your important files securely—so you never lose a document or miss a
            renewal again.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">
                Secure cloud storage for important documents
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">
                Safe and reliable document storage
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">
                Encrypted cloud storage for peace of mind
              </span>
            </div>
          </div>
          <Link
            className="mt-6 bg-adult-green text-white px-6 py-3 rounded-lg font-medium font-inter hover:bg-adult-green/90 transition-colors inline-flex items-center gap-2"
            href="/filebox"
          >
            Explore Adulting Filebox <span>→</span>
          </Link>
        </div>

        {/* Right Content */}
        <div className="relative h-80 md:h-96">
          <FeatureImage
            alt="Document organization and management features"
            src="/AdultingFilebox-Feature.png"
          />
        </div>
      </div>
    </section>
  );
}
