import JSZip from "jszip";
// Unzip function to extract text-based files from a ZIP URL
// export const unzipTemplate = async (zipUrl) => {
//   console.log("Unzipping template from URL:", zipUrl);
//   const zip = new JSZip();

//   // 1. Download ZIP as arrayBuffer
//   const response = await fetch(zipUrl);
//   console.log("Fetched ZIP response:", response);
//   const arrayBuffer = await response.arrayBuffer();

//   // 2. Load ZIP
//   const loadedZip = await zip.loadAsync(arrayBuffer);
//   console.log("Loaded ZIP contents:", loadedZip.files);

//   let extracted = {};

//   // 3. Loop through all files
//   for (const fileName of Object.keys(loadedZip.files)) {
//     const file = loadedZip.files[fileName];
//     console.log("Processing file:", fileName, file);

//     // Only read text-based files (html, css, js, json, txt...)
//     if (!file.dir) {
//       const content = await file.async("string");
//       extracted[fileName] = content;
//     }
//   }

//   return extracted;
// };

export async function extractTemplate(fileUrl) {
  try {
    const res = await fetch(fileUrl);
    console.log("Fetched ZIP file:", res);
    const blob = await res.blob();

    const zip = await JSZip.loadAsync(blob);

    let html = "";
    let css = "";
    let js = "";
    let theme = "";

    for (const fileName of Object.keys(zip.files)) {
      const file = zip.files[fileName];

      if (fileName.endsWith(".html")) {
        html = await file.async("string");
      }
      if (fileName.endsWith(".css")) {
        css = await file.async("string");
      }
      if (fileName.endsWith(".js")) {
        js = await file.async("string");
      }
      if (fileName.includes("theme.json")) {
        theme = await file.async("string");
      }
    }

    return { html, css, js, theme };
  } catch (e) {
    console.error("ZIP extract error:", e);
    throw e;
  }
}
