import { useState, useRef, useEffect } from "react";
import JSZip from "jszip";
import Scrollbar from "react-scrollbars-custom";
import { useDispatch, useSelector } from "react-redux";
import ArrowButton from "../../../components/arrowButton";
import { closeGenerateFileModal } from "../TemplateEditModal/redux/actions";

// JSZip imported directly from package.json dependency

// ─── Call Claude API ────────────────────────────────────────────────────────
// For local development, set your API key in .env:
//   REACT_APP_ANTHROPIC_API_KEY=sk-ant-...
//
// The "anthropic-dangerous-direct-browser-access" header allows direct
// browser calls during local development. Do NOT use this in production.
async function callClaude(systemPrompt, userPrompt) {
  const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Missing REACT_APP_ANTHROPIC_API_KEY in .env");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  if (data.error)
    throw new Error(data.error.message || JSON.stringify(data.error));
  return data.content?.map((b) => b.text || "").join("") || "";
}

// ─── Prompts ────────────────────────────────────────────────────────────────
const MANIFEST_SYSTEM = `You are a template analyzer. Given HTML code for an invitation/card template, extract all editable fields and output ONLY a valid JSON object (no markdown, no backticks, no explanation).

The JSON must follow this exact shape:
{
  "id": "template-v1",
  "name": "Template Name",
  "version": "1.0.0",
  "size": { "width": 600, "height": 840 },
  "fields": [
    { "id": "field_id", "label": "Field Label", "type": "text|color|font|image", "group": "GroupName", "default": "default value", "styles": ["color","fontSize","fontFamily"] }
  ],
  "fonts": ["Font1", "Font2"]
}

Rules:
- Identify all text content that users would want to customize (names, dates, venues, taglines, etc.)
- Identify color variables/values as "color" type fields  
- Identify font families as "font" type fields
- Identify image URLs as "image" type fields
- Group related fields logically (Names, Event, Venue, Details, Style, Media)
- The "id" should be snake_case, derived from the template name/content
- "styles" array for text fields: include from ["color","fontSize","fontFamily"] as appropriate
- Output ONLY the JSON, nothing else`;

const COMPONENT_SYSTEM = `You are a React JSX elements generator. Given an HTML/CSS template and its manifest JSON, generate ONLY the JSX elements that go inside the SECOND return() of this existing function (the JSX fallback path — NOT the dangerouslySetInnerHTML path).

Here is the full function you are generating FOR:

\`\`\`jsx
function InvitationTemplate({
  scale = 1,
  previewRef,
  elements,
  css,
  manifest,
  assetBaseUrl,
}) {
  const { data, editorMode, updateField } = useTemplate();
  const containerRef = useRef();

  const accent = data.accent_color || "#8b6843";
  const bg     = data.bg_color     || "#faf6ef";
  const dark   = data.text_dark    || "#2a1f14";
  const font   = data.font_family  || "Cormorant Garamond";

  const cardW = manifest?.size?.width  || 600;
  const cardH = manifest?.size?.height || 840;

  const Editable = ({ fieldId, tag: Tag = "span", style, className }) => {
    const isEdit = editorMode;
    return (
      <Tag
        contentEditable={isEdit}
        suppressContentEditableWarning
        data-field={fieldId}
        style={{
          ...style,
          outline: "none",
          cursor: isEdit ? "text" : "default",
          transition: "box-shadow 0.15s",
          borderRadius: 2,
        }}
        className={className}
        onFocus={(e) => {
          if (isEdit) e.target.style.boxShadow = \`0 0 0 1.5px \${accent}55\`;
        }}
        onBlur={(e) => {
          if (isEdit) {
            e.target.style.boxShadow = "none";
            updateField(fieldId, e.target.innerText);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur();
          }
        }}
      >
        {data[fieldId]}
      </Tag>
    );
  };

  const resolvedHtml = elements ? resolvePlaceholders(elements, data) : null;
  const resolvedCss  = css
    ? resolveAssetPaths(resolvePlaceholders(css, data), assetBaseUrl || window.location.origin + "/")
    : null;

  useEffect(() => { /* syncs data-field DOM nodes */ }, []);

  const cardStyle = {
    width: cardW,
    height: cardH,
    transform: \`scale(\${scale})\`,
    transformOrigin: "top left",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 40px 100px rgba(0,0,0,0.22)",
    flexShrink: 0,
    background: bg,
    zIndex: 0,
    fontFamily: \`'\${font}', serif\`,
  };

  // PATH 1 — HTML string from zip. Already complete. Do NOT generate for this.
  if (resolvedHtml) {
    return (
      <div ref={previewRef} style={cardStyle}>
        {resolvedCss && <style>{resolvedCss}</style>}
        <div
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: resolvedHtml }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  // PATH 2 — JSX fallback. THIS is what you generate.
  return (
    // ← YOUR GENERATED JSX GOES HERE
  );
}
\`\`\`

IMPORTANT: You are generating ONLY the content for PATH 2 — the JSX fallback return().
PATH 1 (dangerouslySetInnerHTML) is already complete. Do not generate anything for it.

Available variables in scope (all already defined, do not redefine):
- data        — object with all field values keyed by manifest field ids
- accent      — string, from data.accent_color
- bg          — string, from data.bg_color
- dark        — string, from data.text_dark
- font        — string, from data.font_family
- cardW       — number, card width in px
- cardH       — number, card height in px
- cardStyle   — object with width, height, scale transform, bg, fontFamily already set
- editorMode  — boolean
- previewRef  — ref, must be on the root div
- scale       — number (already inside cardStyle — do NOT use it again)
- Editable    — component: <Editable fieldId="..." tag="p" style={{...}} />

Rules:
1. Output ONLY the JSX starting with the root <div> — no imports, no exports, no function wrappers
2. Root <div> MUST be: <div ref={previewRef} style={cardStyle}>
3. Do NOT redefine or override width, height, transform, scale, background, or fontFamily on the root div — they are already in cardStyle
4. Do NOT add transform or scale anywhere in the output
5. Use inline styles only — no Tailwind, no CSS class names
6. Use <Editable fieldId="field_id" tag="tagname" style={{...}} /> for EVERY text field in the manifest — never hardcode the text value
7. For color/font fields — already applied via accent/bg/dark/font variables, use those in styles
8. For image fields — render conditionally: {data.image_field_id && <img src={data.image_field_id} alt="..." style={{...}} />}
9. Recreate the full visual design from the HTML/CSS faithfully using inline React styles
10. Convert CSS var(--x) to the matching JS variable (accent/bg/dark/font); for unmatched vars, inline the resolved hex/value
11. Static decorative elements (borders, ornaments, dividers, SVGs) are fine as plain JSX — they do not need Editable
12. Do NOT output markdown fences, backticks, or any explanation — raw JSX only
13. Do NOT add any "click to edit" hint UI
14. Do NOT add a semicolon after the closing root </div> tag — the JSX expression must not end with a semicolon

Output ONLY the raw JSX starting with: <div ref={previewRef} style={cardStyle}>`;

// ─── Main Component ─────────────────────────────────────────────────────────
export default function TemplateGenerator() {
  const [htmlInput, setHtmlInput] = useState(
    () => localStorage.getItem("oe_html") || "",
  );
  const [cssInput, setCssInput] = useState(
    () => localStorage.getItem("oe_css") || "",
  );
  const [inputTab, setInputTab] = useState("html"); // html | css
  const [manifest, setManifest] = useState(null);
  const [componentCode, setComponentCode] = useState("");
  const [step, setStep] = useState("idle"); // idle | generating-manifest | generating-component | done | error
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("manifest");
  const [copied, setCopied] = useState("");
  const fileInputRef = useRef(null);
  const [viewPointWidth, setViewPointWidth] = useState(0);
  const [viewPointHeight, setViewPointHeight] = useState(0);

  const dispatch = useDispatch();
  const { isOpenGenerateFileModal, fileData } = useSelector(
    ({ templateReducer }) => templateReducer,
  );

  // scrollbars start
  useEffect(() => {
    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);
    window.addEventListener("scroll", handleOnScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("scroll", handleOnScroll);
      window.removeEventListener("resize", updateWindowDimensions);
    };
  }, []);

  const updateWindowDimensions = () => {
    setViewPointWidth(window.innerWidth);
    setViewPointHeight(window.innerHeight);
  };

  const handleOnScroll = () => {
    let scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    let scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    let clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
  };
  // scrollbars end

  const isGenerating =
    step === "generating-manifest" || step === "generating-component";

  // ── Generate ──────────────────────────────────────────────────────────────
  const generate = async () => {
    if (!htmlInput.trim()) return;
    setError("");
    setManifest(null);
    setComponentCode("");

    try {
      // Step 1: Generate manifest
      setStep("generating-manifest");
      const templateInput = `Here is the HTML template:\n\n${htmlInput}${cssInput.trim() ? `\n\nAdditional CSS:\n\`\`\`css\n${cssInput}\n\`\`\`` : ""}`;
      const manifestRaw = await callClaude(MANIFEST_SYSTEM, templateInput);

      let manifestObj;
      try {
        const cleaned = manifestRaw
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        manifestObj = JSON.parse(cleaned);
      } catch {
        throw new Error(
          "Failed to parse manifest JSON. Raw output:\n" +
            manifestRaw.slice(0, 300),
        );
      }
      setManifest(manifestObj);

      // Step 2: Generate component
      setStep("generating-component");
      const compRaw = await callClaude(
        COMPONENT_SYSTEM,
        `HTML Template:\n${htmlInput}${cssInput.trim() ? `\n\nAdditional CSS:\n\`\`\`css\n${cssInput}\n\`\`\`` : ""}\n\nManifest JSON:\n${JSON.stringify(manifestObj, null, 2)}`,
      );
      const compCleaned = compRaw
        .replace(/^```[a-z]*\n?/m, "")
        .replace(/```\s*$/m, "")
        .trim();
      setComponentCode(compCleaned);

      setStep("done");
      setActiveTab("manifest");
    } catch (e) {
      setError(e.message || "Unknown error");
      setStep("error");
    }
  };

  // ── Load HTML file ────────────────────────────────────────────────────────
  const loadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    // Extract <style> blocks into CSS tab
    const styleMatch = text.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    if (styleMatch) {
      setCssInput(styleMatch[1].trim());
      setHtmlInput(text.replace(/<style[^>]*>[\s\S]*?<\/style>/i, "").trim());
    } else {
      setHtmlInput(text);
    }
    e.target.value = "";
  };

  // ── Copy ──────────────────────────────────────────────────────────────────
  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1800);
  };

  // ── Download ZIP ──────────────────────────────────────────────────────────
  const downloadZip = async () => {
    if (!manifest || !componentCode) return;
    try {
      const zip = new JSZip();
      const templateId = manifest.id || "template";
      const folder = zip.folder(templateId);
      folder.file("manifest.json", JSON.stringify(manifest, null, 2));
      folder.file("template-elements.jsx", componentCode);
      if (cssInput.trim()) folder.file("template.css", cssInput);
      folder.file(
        "README.md",
        `# ${manifest.name}\n\nGenerated template package.\n\n## Files\n- \`manifest.json\` — field definitions and metadata\n- \`template-elements.jsx\` — JSX return content for InvitationTemplate\n${cssInput.trim() ? "- `template.css` — original CSS styles\n" : ""}\n## Usage\nPaste the contents of \`template-elements.jsx\` inside the return() of your InvitationTemplate function.\n\nThe following variables must be available in scope:\n- data, accent, bg, dark, font, editorMode, previewRef, scale, Editable\n`,
      );
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${templateId}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError("ZIP generation failed: " + e.message);
    }
  };

  // ─── Styles ──────────────────────────────────────────────────────────────
  const S = {
    root: {
      minHeight: "100vh",
      background: "#0c0c0f",
      color: "#e8e6e0",
      fontFamily: "'DM Mono', 'Fira Code', 'Courier New', monospace",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      padding: "24px 32px 20px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logoRow: { display: "flex", alignItems: "center", gap: 12 },
    logoIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: "linear-gradient(135deg, #7c5cfc, #c084fc)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
    },
    logoText: {
      fontSize: 15,
      fontWeight: 600,
      letterSpacing: "0.05em",
      color: "#f0eee8",
    },
    logoSub: {
      fontSize: 11,
      color: "#6b6a68",
      marginTop: 2,
      letterSpacing: "0.08em",
    },
    body: { flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 },
    panel: {
      padding: "28px 28px",
      borderRight: "1px solid rgba(255,255,255,0.05)",
    },
    panelRight: { padding: "28px 28px" },
    label: {
      fontSize: 10,
      letterSpacing: "0.12em",
      color: "#7c5cfc",
      textTransform: "uppercase",
      marginBottom: 10,
      display: "block",
    },
    textarea: {
      width: "100%",
      height: 340,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 10,
      color: "#d8d6d0",
      fontFamily: "inherit",
      fontSize: 12,
      lineHeight: 1.6,
      padding: 16,
      resize: "none",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.2s",
    },
    btnRow: { display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" },
    btn: (color) => ({
      padding: "9px 18px",
      borderRadius: 8,
      border: "none",
      cursor: "pointer",
      fontSize: 12,
      fontFamily: "inherit",
      letterSpacing: "0.06em",
      fontWeight: 600,
      background:
        color === "purple"
          ? "linear-gradient(135deg, #7c5cfc, #9b7bfe)"
          : color === "green"
            ? "linear-gradient(135deg, #22c55e, #16a34a)"
            : "rgba(255,255,255,0.07)",
      color: color === "ghost" ? "#9ca3af" : "#fff",
      transition: "opacity 0.15s, transform 0.1s",
    }),
    statusBar: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginTop: 14,
      padding: "10px 14px",
      borderRadius: 8,
      background: "rgba(124,92,252,0.08)",
      border: "1px solid rgba(124,92,252,0.18)",
    },
    spinner: {
      width: 14,
      height: 14,
      border: "2px solid rgba(124,92,252,0.3)",
      borderTopColor: "#7c5cfc",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    },
    tabRow: { display: "flex", gap: 4, marginBottom: 16 },
    tab: (active) => ({
      padding: "7px 14px",
      borderRadius: 7,
      border: "none",
      cursor: "pointer",
      fontSize: 11,
      fontFamily: "inherit",
      letterSpacing: "0.08em",
      fontWeight: 600,
      background: active ? "rgba(124,92,252,0.2)" : "transparent",
      color: active ? "#c084fc" : "#6b6a68",
      borderBottom: active ? "1px solid #7c5cfc" : "1px solid transparent",
      transition: "all 0.15s",
    }),
    codeBlock: {
      position: "relative",
      background: "rgba(0,0,0,0.4)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 10,
      overflow: "hidden",
    },
    pre: {
      margin: 0,
      padding: "16px",
      fontSize: 11.5,
      lineHeight: 1.7,
      color: "#c9c7c1",
      overflowX: "auto",
      overflowY: "auto",
      maxHeight: 420,
      whiteSpace: "pre-wrap",
      wordBreak: "break-all",
    },
    copyBtn: {
      position: "absolute",
      top: 8,
      right: 8,
      padding: "4px 10px",
      borderRadius: 5,
      border: "1px solid rgba(255,255,255,0.1)",
      background: "rgba(0,0,0,0.6)",
      color: "#9ca3af",
      fontSize: 10,
      fontFamily: "inherit",
      cursor: "pointer",
      letterSpacing: "0.06em",
    },
    errorBox: {
      marginTop: 14,
      padding: "12px 16px",
      borderRadius: 8,
      background: "rgba(239,68,68,0.08)",
      border: "1px solid rgba(239,68,68,0.25)",
      color: "#fca5a5",
      fontSize: 12,
      lineHeight: 1.6,
    },
    manifestPill: (group) => {
      const colors = {
        Names: "#7c5cfc",
        Event: "#06b6d4",
        Venue: "#f59e0b",
        Details: "#ec4899",
        Style: "#22c55e",
        Media: "#f97316",
      };
      const c = colors[group] || "#6b6a68";
      return {
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.1em",
        background: c + "22",
        color: c,
        marginRight: 6,
        textTransform: "uppercase",
      };
    },
  };

  const statusMessages = {
    "generating-manifest": "Analyzing template & extracting fields...",
    "generating-component": "Generating React preview component...",
    done: "Generation complete ✓",
    error: "Generation failed",
  };

  return (
    <>
      <div
        className={`flex flex-col mt-[-150px] ml-[200px] fixed z-[999] animate_animated p-8 bg-white overflow-hidden shadow-md w-full h-full  ${
          isOpenGenerateFileModal
            ? "block animate__fadeInUp "
            : "none animate__fadeOutDown"
        }`}
      >
        <div className="flex flex-row items-center gap-3 mb-8">
          <ArrowButton onClick={() => dispatch(closeGenerateFileModal())} />
          <div className="font-manrope text-black text-sm font-extrabold items-center">
            Back
          </div>
        </div>
        <div style={S.root}>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } } * { box-sizing: border-box }`}</style>
          {/* Header */}
          <header style={S.header}>
            <div style={S.logoRow}>
              <div style={S.logoIcon}>⚡</div>
              <div>
                <div style={S.logoText}>Template Generator</div>
                <div style={S.logoSub}>HTML → Manifest + PreviewCard</div>
              </div>
            </div>
            {step === "done" && (
              <button style={S.btn("green")} onClick={downloadZip}>
                ↓ Download ZIP
              </button>
            )}
          </header>
          {/* Body */}{" "}
          <Scrollbar
            onScroll={handleOnScroll}
            renderView={(props) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  overflowX: "hidden",
                  margin: "20px",
                }}
              />
            )}
            style={{
              height: viewPointHeight - 150,
              marginBottom: 20,
            }}
          >
            <div style={S.body}>
              {/* Left: Input */}
              <div style={S.panel}>
                <span style={S.label}>01 — Paste Template Code</span>

                {/* HTML / CSS tab switcher */}
                <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                  {[
                    { key: "html", label: "HTML", color: "#f97316" },
                    { key: "css", label: "CSS", color: "#06b6d4" },
                  ].map(({ key, label, color }) => (
                    <button
                      key={key}
                      onClick={() => setInputTab(key)}
                      style={{
                        padding: "5px 14px",
                        borderRadius: 7,
                        border: "none",
                        cursor: "pointer",
                        fontSize: 11,
                        fontFamily: "inherit",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        background:
                          inputTab === key ? color + "22" : "transparent",
                        color: inputTab === key ? color : "#6b6a68",
                        borderBottom:
                          inputTab === key
                            ? `1px solid ${color}`
                            : "1px solid transparent",
                        transition: "all 0.15s",
                      }}
                    >
                      {label}
                      {key === "html" && htmlInput && (
                        <span
                          style={{ marginLeft: 5, fontSize: 9, opacity: 0.6 }}
                        >
                          ●
                        </span>
                      )}
                      {key === "css" && cssInput && (
                        <span
                          style={{ marginLeft: 5, fontSize: 9, opacity: 0.6 }}
                        >
                          ●
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {inputTab === "html" && (
                  <textarea
                    style={S.textarea}
                    value={htmlInput}
                    onChange={(e) => setHtmlInput(e.target.value)}
                    placeholder={`<!doctype html>\n<html>\n  <head>...</head>\n  <body>\n    <!-- Your invitation/card template -->\n  </body>\n</html>`}
                    spellCheck={false}
                  />
                )}
                {inputTab === "css" && (
                  <textarea
                    style={{
                      ...S.textarea,
                      borderColor: "rgba(6,182,212,0.2)",
                    }}
                    value={cssInput}
                    onChange={(e) => setCssInput(e.target.value)}
                    placeholder={`:root {\n  --bg: #faf6ef;\n  --accent: #8b6843;\n}\n\n.invitation {\n  /* your styles here */\n}`}
                    spellCheck={false}
                  />
                )}

                <div style={S.btnRow}>
                  <button
                    style={{
                      ...S.btn("purple"),
                      opacity:
                        isGenerating || (!htmlInput.trim() && !cssInput.trim())
                          ? 0.5
                          : 1,
                    }}
                    onClick={generate}
                    disabled={
                      isGenerating || (!htmlInput.trim() && !cssInput.trim())
                    }
                  >
                    {isGenerating ? "Generating..." : "⚡ Generate"}
                  </button>
                  <button
                    style={S.btn("ghost")}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Open File
                  </button>
                  <button
                    style={{
                      ...S.btn("ghost"),
                      opacity: !htmlInput && !cssInput ? 0.4 : 1,
                    }}
                    onClick={() => {
                      setHtmlInput("");
                      setCssInput("");
                      setManifest(null);
                      setComponentCode("");
                      setStep("idle");
                      setError("");
                    }}
                    disabled={!htmlInput && !cssInput}
                  >
                    Clear
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".html,.htm"
                    style={{ display: "none" }}
                    onChange={loadFile}
                  />
                </div>

                {/* Status */}
                {step !== "idle" && step !== "error" && (
                  <div style={S.statusBar}>
                    {isGenerating && <div style={S.spinner} />}
                    <span style={{ fontSize: 12, color: "#c084fc" }}>
                      {statusMessages[step]}
                    </span>
                    {step === "done" && manifest && (
                      <span
                        style={{
                          fontSize: 11,
                          color: "#6b6a68",
                          marginLeft: "auto",
                        }}
                      >
                        {manifest.fields?.length} fields extracted
                      </span>
                    )}
                  </div>
                )}

                {error && (
                  <div style={S.errorBox}>
                    <strong>Error:</strong> {error}
                  </div>
                )}

                {/* Manifest field preview */}
                {manifest && (
                  <div style={{ marginTop: 20 }}>
                    <span style={S.label}>
                      Extracted Fields ({manifest.fields?.length})
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        maxHeight: 160,
                        overflowY: "auto",
                      }}
                    >
                      {manifest.fields?.map((f) => (
                        <div
                          key={f.id}
                          style={{
                            padding: "5px 10px",
                            borderRadius: 6,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            fontSize: 11,
                          }}
                        >
                          <span style={S.manifestPill(f.group)}>{f.group}</span>
                          <span style={{ color: "#e8e6e0" }}>{f.label}</span>
                          <span style={{ color: "#4b4a48", marginLeft: 5 }}>
                            · {f.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Output */}
              <div style={S.panelRight}>
                <span style={S.label}>02 — Generated Output</span>

                {!manifest && !componentCode && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 400,
                      flexDirection: "column",
                      gap: 16,
                      opacity: 0.35,
                    }}
                  >
                    <div style={{ fontSize: 48 }}>📦</div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#6b6a68",
                        textAlign: "center",
                        lineHeight: 1.8,
                      }}
                    >
                      Paste an HTML template on the left
                      <br />
                      and click Generate to extract fields
                    </div>
                  </div>
                )}

                {(manifest || componentCode) && (
                  <>
                    <div style={S.tabRow}>
                      <button
                        style={S.tab(activeTab === "manifest")}
                        onClick={() => setActiveTab("manifest")}
                      >
                        manifest.json
                      </button>
                      <button
                        style={S.tab(activeTab === "component")}
                        onClick={() => setActiveTab("component")}
                      >
                        template-elements.jsx
                      </button>
                    </div>

                    {activeTab === "manifest" && manifest && (
                      <div style={S.codeBlock}>
                        <pre style={S.pre}>
                          {JSON.stringify(manifest, null, 2)}
                        </pre>
                        <button
                          style={S.copyBtn}
                          onClick={() =>
                            copy(JSON.stringify(manifest, null, 2), "manifest")
                          }
                        >
                          {copied === "manifest" ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    )}

                    {activeTab === "component" && componentCode && (
                      <div style={S.codeBlock}>
                        <pre style={S.pre}>{componentCode}</pre>
                        <button
                          style={S.copyBtn}
                          onClick={() => copy(componentCode, "component")}
                        >
                          {copied === "component" ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    )}

                    {activeTab === "component" &&
                      !componentCode &&
                      isGenerating && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: 200,
                            gap: 12,
                            opacity: 0.6,
                          }}
                        >
                          <div style={S.spinner} />
                          <span style={{ fontSize: 12 }}>
                            Generating component...
                          </span>
                        </div>
                      )}
                  </>
                )}

                {step === "done" && manifest && componentCode && (
                  <div
                    style={{
                      marginTop: 16,
                      padding: "14px 18px",
                      borderRadius: 10,
                      background: "rgba(34,197,94,0.07)",
                      border: "1px solid rgba(34,197,94,0.2)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: "#86efac",
                        fontWeight: 600,
                        marginBottom: 8,
                      }}
                    >
                      ✓ Ready to download
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#4ade80",
                        lineHeight: 1.8,
                      }}
                    >
                      ZIP includes:
                      <br />
                      <span style={{ color: "#6b6a68" }}>
                        📄 {manifest.id}/manifest.json
                        <br />
                        ⚛️ {manifest.id}/template-elements.jsx
                        <br />
                        {cssInput.trim() && (
                          <span>
                            🎨 {manifest.id}/template.css
                            <br />
                          </span>
                        )}
                        📝 {manifest.id}/README.md
                      </span>
                    </div>
                    <button
                      style={{ ...S.btn("green"), marginTop: 12 }}
                      onClick={downloadZip}
                    >
                      ↓ Download {manifest.id}.zip
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Scrollbar>
        </div>
      </div>
    </>
  );
}
