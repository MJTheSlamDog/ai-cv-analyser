// lib/pdf2img.ts
export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

export async function convertPdfToImages(
    file: File
): Promise<PdfConversionResult[]> {
    try {
        if (typeof window === "undefined") {
        throw new Error("PDF to image conversion can only run in the browser");
        }

        // Import pdfjs only in the browser
        const pdfjsLib = await import("pdfjs-dist");
        const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.mjs?url");

        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;

        // Load PDF
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        const results: PdfConversionResult[] = [];

    // Loop through all pages
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 4 });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            if (!context) throw new Error("Failed to get 2D canvas context");

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";

            await page.render({ canvasContext: context, canvas, viewport }).promise;

            // Wrap toBlob in a promise
            const imageResult: PdfConversionResult = await new Promise((resolve) => {
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const baseName = file.name.replace(/\.pdf$/i, "");
                            const imageFile = new File([blob], `${baseName}-page${pageNum}.png`, {
                                type: "image/png",
                            });

                            resolve({
                                imageUrl: URL.createObjectURL(blob),
                                file: imageFile,
                            });
                        } else {
                            resolve({
                            imageUrl: "",
                            file: null,
                            error: `Failed to create image blob for page ${pageNum}`,
                            });
                        }
                    },
                    "image/png",
                    1.0
                );
            });

            results.push(imageResult);
        }

        return results;
    } catch (err) {
        return [
            {
                imageUrl: "",
                file: null,
                error: `Failed to convert PDF: ${(err as Error).message}`,
            },
        ];
    }
}