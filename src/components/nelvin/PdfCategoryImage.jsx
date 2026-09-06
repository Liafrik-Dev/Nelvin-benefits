import { db } from "@/services/api/base44Client";

import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// The uploaded PDF is public, and each page holds a single category image.
const PDF_URL = "https://media.db.com/files/public/6a5398f7ed23004e65369928/dee21a3c7_WebsiteImages.pdf";

// Slug of category → PDF page number (1-indexed, in document order)
export const CATEGORY_PDF_PAGE = {
  "restaurants-cafes": 10,
  "hotels-resorts": 9,
  "travel-airlines": 11,
  "entertainment": 4,
  "shopping-fashion": 8,
  "beauty-spa": 2,
  "healthcare": 6,
  "education": 3,
  "automotive": 1,
  "professional-services": 5,
  "home-services": 7,
};

// The PDF document is loaded once and shared across all PdfCategoryImage instances
let pdfDocPromise = null;
function getDocument() {
  if (!pdfDocPromise) {
    pdfDocPromise = pdfjsLib.getDocument(PDF_URL).promise;
  }
  return pdfDocPromise;
}

export default function PdfCategoryImage({ slug, className }) {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const pageNum = CATEGORY_PDF_PAGE[slug];

  useEffect(() => {
    if (!pageNum) return;
    let cancelled = false;

    (async () => {
      try {
        const pdf = await getDocument();
        const page = await pdf.getPage(pageNum);
        if (cancelled || !canvasRef.current) return;

        // Render at modest scale — it's a small card banner
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        if (!cancelled) setLoaded(true);
      } catch (err) {
        console.error("PdfCategoryImage render failed", err);
      }
    })();

    return () => { cancelled = true; };
  }, [pageNum]);

  if (!pageNum) return null;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: loaded ? "block" : "none",
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  );
}