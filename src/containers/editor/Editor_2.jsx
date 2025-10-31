import React, { useEffect, useMemo, useRef, useState } from "react";

// React Online HTML Editor – no external deps
// Features: Live preview, HTML/CSS/JS tabs, sandbox toggle, autosave, import/export, wrap toggle, dark mode
// Tip: This is a single-file component. Drop it into any React app (Vite/CRA/Next) and render <OnlineHtmlEditor />

export default function OnlineHtmlEditor() {
    const [html, setHtml] = useState(() => localStorage.getItem("oe_html") || defaultHtml);
    const [css, setCss] = useState(() => localStorage.getItem("oe_css") || defaultCss);
    const [js, setJs] = useState(() => localStorage.getItem("oe_js") || defaultJs);
    const [active, setActive] = useState("HTML");
    const [allowScripts, setAllowScripts] = useState(false);
    const [wrap, setWrap] = useState(true);
    const [dark, setDark] = useState(() => localStorage.getItem("oe_theme") === "dark");
    const [status, setStatus] = useState("Saved");
    const fileInputRef = useRef(null);

    // Autosave
    useEffect(() => {
        const id = setTimeout(() => {
            localStorage.setItem("oe_html", html);
            localStorage.setItem("oe_css", css);
            localStorage.setItem("oe_js", js);
            localStorage.setItem("oe_theme", dark ? "dark" : "light");
            setStatus("Saved");
        }, 400);
        return () => clearTimeout(id);
    }, [html, css, js, dark]);

    // Debounced status "Typing…"
    useEffect(() => {
        setStatus("Typing…");
        const id = setTimeout(() => setStatus("Saved"), 600);
        return () => clearTimeout(id);
    }, [html, css, js]);

    // Build the preview document
    const srcDoc = useMemo(() => {
        const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Preview</title>
<style>html,body{margin:0;padding:1rem;box-sizing:border-box;} ${css}</style>
</head>
<body>
${html}
<script>${js}</script>
</body>
</html>`;
        return doc;
    }, [html, css, js]);

    const download = () => {
        const blob = new Blob([srcDoc], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "online-editor-export.html";
        a.click();
        URL.revokeObjectURL(url);
    };

    const openFile = () => fileInputRef.current?.click();

    const onFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const text = await file.text();
        // naive split: try to extract <style> and <script> blocks
        const styleMatch = text.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        const scriptMatch = text.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        setCss(styleMatch ? styleMatch[1] : "");
        setJs(scriptMatch ? scriptMatch[1] : "");
        setHtml(bodyMatch ? bodyMatch[1] : text);
        e.target.value = "";
    };

    // const resetAll = () => {
    //     if (!confirm("Reset the editor to the starter template?")) return;
    //     setHtml(defaultHtml);
    //     setCss(defaultCss);
    //     setJs(defaultJs);
    // };

    const charCount = (html?.length || 0) + (css?.length || 0) + (js?.length || 0);

    const editorValue = active === "HTML" ? html : active === "CSS" ? css : js;
    const setEditorValue = active === "HTML" ? setHtml : active === "CSS" ? setCss : setJs;

    return (
        <div className={"min-h-screen w-full " + (dark ? "bg-neutral-900 text-neutral-100" : "bg-neutral-50 text-neutral-900")}>
            <header className="flex items-center justify-between px-4 py-3 border-b border-neutral-300/50 dark:border-neutral-800/60">
                <div className="flex items-center gap-3">
                    <Logo />
                    <div className="text-sm opacity-70">React Online HTML Editor</div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn" onClick={() => setDark(d => !d)} title="Toggle theme">{dark ? "Light" : "Dark"}</button>
                    <div className="w-px h-6 bg-neutral-300/70 dark:bg-neutral-700" />
                    <button className="btn" onClick={openFile} title="Open .html file">Open</button>
                    <input ref={fileInputRef} type="file" accept=".html,.htm,.txt" className="hidden" onChange={onFileChange} />
                    <button className="btn" onClick={download} title="Download as HTML">Download</button>
                    {/*<button className="btn" onClick={resetAll} title="Reset to starter">Reset</button>*/}
                </div>
            </header>

            <div className="px-4 pt-3 pb-1 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 flex-wrap">
                    {(["HTML","CSS","JS"]).map(tab => (
                        <button
                            key={tab}
                            className={"tab " + (active === tab ? "tab-active" : "")}
                            onClick={() => setActive(tab)}
                        >{tab}</button>
                    ))}
                    <span className="ml-2 opacity-70">{status}</span>
                </div>
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={wrap} onChange={e=>setWrap(e.target.checked)} /> <span>Wrap</span></label>
                    <label className="flex items-center gap-2 cursor-pointer" title="Allow running <script> in preview (use with care)"><input type="checkbox" checked={allowScripts} onChange={e=>setAllowScripts(e.target.checked)} /> <span>Allow scripts</span></label>
                    <span className="opacity-70">{charCount.toLocaleString()} chars</span>
                </div>
            </div>

            <main className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-4 pt-2">
                <section className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <textarea
              spellCheck={false}
              value={editorValue}
              onChange={(e) => setEditorValue(e.target.value)}
              className={
                  "w-full h-[60vh] lg:h-[80vh] p-4 outline-none font-mono text-sm bg-transparent " +
                  (wrap ? "whitespace-pre-wrap" : "whitespace-pre")
              }
              placeholder={
                  active === "HTML"
                      ? "Write HTML here…"
                      : active === "CSS"
                          ? "Write CSS here…"
                          : "Write JavaScript here…"
              }
          />
                </section>

                <section className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col">
                    <div className="px-3 py-2 text-xs border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                        <span className="opacity-70">Live Preview</span>
                        <span className="opacity-60">Sandbox: {allowScripts ? "scripts enabled" : "scripts blocked"}</span>
                    </div>
                    <iframe
                        title="preview"
                        className="w-full grow bg-white"
                        sandbox={allowScripts ? "allow-scripts allow-same-origin" : "allow-same-origin"}
                        srcDoc={srcDoc}
                    />
                </section>
            </main>

            <footer className="px-4 pb-6 text-xs opacity-70">
                Pro tip: Toggle the JS tab and enable "Allow scripts" if you need interactivity. For safer previews, keep scripts disabled.
            </footer>

            {/* Styles local to the component using Tailwind classes + a few utility classes */}
            <style>{`
        .btn { @apply px-3 py-1.5 rounded-xl text-sm border border-neutral-300/70 dark:border-neutral-700 hover:shadow-sm active:scale-[.98]; }
        .tab { @apply px-3 py-1 rounded-xl border border-transparent hover:border-neutral-300/70 dark:hover:border-neutral-700; }
        .tab-active { @apply bg-neutral-200/70 dark:bg-neutral-800/60 border-neutral-300/70 dark:border-neutral-700; }
      `}</style>
        </div>
    );
}

function Logo() {
    return (
        <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 shadow" />
            <span className="font-semibold">HTMLEdit</span>
        </div>
    );
}

const defaultHtml = `\n<h1>Hello, world! 👋</h1>\n<p>Edit the HTML, CSS, and JS tabs — your changes will appear on the right.</p>\n<button id="btn">Click me</button>\n`;

const defaultCss = `\n:root { color-scheme: light dark; }\nbody { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }\nh1 { font-size: 2rem; margin: 0 0 .5rem; }\nbutton { padding: .5rem 1rem; border-radius: .75rem; border: 1px solid #ddd; }\n`;

const defaultJs = `\nconst btn = document.getElementById('btn');\nif (btn) btn.addEventListener('click', () => alert('JS is running! If you didn\'t see this, enable \'Allow scripts\' above.'));\n`;

