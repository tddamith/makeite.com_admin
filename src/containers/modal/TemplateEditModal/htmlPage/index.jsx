import React, { useEffect, useMemo, useRef, useState } from "react";
import Scrollbar from "react-scrollbars-custom";

// React Online HTML Editor – no external deps
// Features: Live preview, HTML/CSS/JS tabs, sandbox toggle, autosave, import/export, wrap toggle, dark mode
// Tip: This is a single-file component. Drop it into any React app (Vite/CRA/Next) and render <OnlineHtmlEditor />

export default function OnlineHtmlEditor() {
  const [html, setHtml] = useState(
    () => localStorage.getItem("oe_html") || defaultHtml
  );
  const [css, setCss] = useState(
    () => localStorage.getItem("oe_css") || defaultCss
  );
  const [js, setJs] = useState(
    () => localStorage.getItem("oe_js") || defaultJs
  );
  const [active, setActive] = useState("HTML");
  const [allowScripts, setAllowScripts] = useState(false);
  const [viewPointWidth, setViewPointWidth] = useState(0);
  const [viewPointHeight, setViewPointHeight] = useState(0);
  const [wrap, setWrap] = useState(true);
  const [dark, setDark] = useState(
    () => localStorage.getItem("oe_theme") === "dark"
  );
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

  const charCount =
    (html?.length || 0) + (css?.length || 0) + (js?.length || 0);

  const editorValue = active === "HTML" ? html : active === "CSS" ? css : js;
  const setEditorValue =
    active === "HTML" ? setHtml : active === "CSS" ? setCss : setJs;

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

  return (
    <div
      className={
        "min-h-screen w-full " +
        (dark
          ? "bg-neutral-900 text-neutral-100"
          : "bg-neutral-50 text-neutral-900")
      }
    >
      <header className="flex items-center justify-between px-4 py-3 border-b border-neutral-300/50 dark:border-neutral-800/60">
        <div className="flex items-center gap-3">
          <Logo />
          <div className="text-sm opacity-70">React Online HTML Editor</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn"
            onClick={() => setDark((d) => !d)}
            title="Toggle theme"
          >
            {dark ? "Light" : "Dark"}
          </button>
          <div className="w-px h-6 bg-neutral-300/70 dark:bg-neutral-700" />
          <button className="btn" onClick={openFile} title="Open .html file">
            Open
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".html,.htm,.txt"
            className="hidden"
            onChange={onFileChange}
          />
          <button className="btn" onClick={download} title="Download as HTML">
            Download
          </button>
          {/*<button className="btn" onClick={resetAll} title="Reset to starter">Reset</button>*/}
        </div>
      </header>

      <div className="px-4 pt-3 pb-1 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 flex-wrap">
          {["HTML", "CSS", "JS"].map((tab) => (
            <button
              key={tab}
              className={"tab " + (active === tab ? "tab-active" : "")}
              onClick={() => setActive(tab)}
            >
              {tab}
            </button>
          ))}
          <span className="ml-2 opacity-70">{status}</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={wrap}
              onChange={(e) => setWrap(e.target.checked)}
            />{" "}
            <span>Wrap</span>
          </label>
          <label
            className="flex items-center gap-2 cursor-pointer"
            title="Allow running <script> in preview (use with care)"
          >
            <input
              type="checkbox"
              checked={allowScripts}
              onChange={(e) => setAllowScripts(e.target.checked)}
            />{" "}
            <span>Allow scripts</span>
          </label>
          <span className="opacity-70">{charCount.toLocaleString()} chars</span>
        </div>
      </div>

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
          height: viewPointHeight - 250,
          padding: "15px",
        }}
      >
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
              <span className="opacity-60">
                Sandbox: {allowScripts ? "scripts enabled" : "scripts blocked"}
              </span>
            </div>
            <iframe
              title="preview"
              className="w-full grow bg-white"
              sandbox={
                allowScripts
                  ? "allow-scripts allow-same-origin"
                  : "allow-same-origin"
              }
              srcDoc={srcDoc}
            />
          </section>
        </main>

        <footer className="px-4 pb-6 text-xs opacity-70">
          Pro tip: Toggle the JS tab and enable "Allow scripts" if you need
          interactivity. For safer previews, keep scripts disabled.
        </footer>
      </Scrollbar>

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

const defaultHtml = `\n<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>25th Anniversary — Invitation</title>

  <!-- Google fonts used for elegant script + serif heading -->
  <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:wght@400;700;900&family=Montserrat:wght@300;500;700&display=swap" rel="stylesheet">

  <style>
    :root{
      --bg:#073a32;    /* deep green background */
      --accent:#e8c76a; /* gold */
      --muted: rgba(255,255,255,0.06);
      --card-w: 720px;
      --card-h: 850px;
      --pad:40px;
    }

    html,body{height:100%;}
    body{
      margin:0;
      font-family: 'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
      background: linear-gradient(180deg, #052f2a 0%, #08383a 100%);
      display:flex;
      align-items:center;
      justify-content:center;
      padding:40px;
      color:white;
    }

    /* Card */
    .invitation{
      width:var(--card-w);
      height:var(--card-h);
      background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.02) 100%), var(--bg);
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      border-radius:8px;
      position:relative;
      overflow:hidden;
      border:3px solid rgba(232,199,106,0.06);
      padding:48px;
      box-sizing:border-box;
    }

    /* Thin gold frame lines */
    .invitation:before, .invitation:after{
      content:"";
      position:absolute;
      border:2px solid var(--accent);
      pointer-events:none;
    }
    .invitation:before{
      inset:18px 18px 18px 18px;
      border-radius:4px;
    }
    .invitation:after{
      top:48px; left:48px; right:48px; bottom:48px;
      border-width:1px;
      border-color: rgba(232,199,106,0.18);
      border-radius:2px;
    }

    /* Decorative uploaded image used as subtle texture on bottom-right (preview only) */
    .texture{
      position:absolute;
      right:-40px;
      bottom:-40px;
      width:520px;
      height:520px;
      background-image: url('/mnt/data/1090c8fc-64b7-4535-a114-6c0abb64bd7e.png');
      background-size: cover;
      background-position:center;
      opacity:0.06;
      transform: rotate(6deg) scale(1.1);
      pointer-events:none;
    }

    .header{
      text-align:center;
      margin-top:8px;
    }
    .couple-names{
      font-family: 'Great Vibes', cursive;
      color:var(--accent);
      font-size:56px;
      letter-spacing:0.8px;
      line-height:0.85;
      margin:6px 0 4px 0;
    }
    .surname{
      display:block;
      font-size:48px;
      margin-top:8px;
    }

    .divider{
      width:220px; height:10px; margin:18px auto;
      display:flex; align-items:center; justify-content:center;
    }
    .divider:before, .divider:after{content:""; flex:1; height:2px; background:linear-gradient(90deg, transparent, rgba(232,199,106,0.6), transparent);}

    .big-title{
      font-family:'Playfair Display', serif;
      font-weight:700;
      color: #ffffff;
      font-size:44px;
      text-align:center;
      margin: 8px 0 22px 0;
      letter-spacing:2px;
    }

    /* Date/box */
    .date-row{
      display:flex;
      align-items:stretch;
      gap:30px;
      justify-content:center;
      margin:18px 0 30px 0;
    }
    .date-number{
      background: linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.03));
      min-width:140px; min-height:120px;
      display:flex; align-items:center; justify-content:center;
      font-family:'Playfair Display', serif;
      font-size:88px; color:var(--accent);
      border-left:4px solid rgba(232,199,106,0.04);
      box-shadow: inset 0 2px 0 rgba(255,255,255,0.02);
    }
    .date-info{
      min-width:320px;
      padding:18px 22px;
      display:flex; flex-direction:column; justify-content:center;
      background: rgba(0,0,0,0.04);
      border-radius:4px;
      border-left:4px solid rgba(232,199,106,0.06);
      font-size:16px; letter-spacing:0.8px;
    }
    .date-info .line{margin-bottom:6px;}

    /* Description */
    .desc{
      text-align:center;
      font-style:italic;
      margin:36px 70px;
      color:rgba(255,255,255,0.9);
      letter-spacing:1px;
      font-size:18px;
    }

    .ornament{width:220px; margin:22px auto; height:18px;}

    .rsvp{
      text-align:center; margin-top:28px; font-size:15px; letter-spacing:1px;
    }

    /* Footer small credits */
    .footer-small{position:absolute; bottom:28px; width:100%; text-align:center; font-size:13px; color:rgba(255,255,255,0.6);}

    /* Responsive tweaks */
    @media (max-width:800px){
      .invitation{transform:scale(0.88); transform-origin:center;}
    }
    @media (max-width:520px){
      :root{--card-w:340px; --card-h:540px;}
      .invitation{width:340px; height:640px; padding:18px}
      .couple-names{font-size:34px}
      .surname{font-size:26px}
      .big-title{font-size:24px}
      .date-row{flex-direction:column; gap:12px}
      .date-number{font-size:54px; min-width:100%; min-height:90px}
      .date-info{min-width:unset}
      .desc{margin:18px 12px}
    }

    /* Editable field styles (for JS editing) */
    .editable{outline: none; border-bottom:1px dashed rgba(255,255,255,0.06);}

  </style>
</head>
<body>

  <div class="invitation" id="invitation">

    <!-- subtle texture using uploaded file (preview only) -->
    <div class="texture" aria-hidden="true"></div>

    <div class="header">
      <div style="font-size:20px; color:var(--accent);"> <strong>Michelle &amp; Daniel</strong></div>
      <h1 class="couple-names">Michelle &amp; Daniel <span class="surname">Walker</span></h1>

      <div class="divider" aria-hidden></div>

      <div class="big-title">25TH ANNIVERSARY</div>
    </div>

    <div class="date-row">
      <div class="date-number">24</div>
      <div class="date-info">
        <div class="line"><strong>THURSDAY, SEPTEMBER</strong></div>
        <div class="line">AT 8:00 PM</div>
        <div class="line">500 LUXE LANE, LOS ANGELES</div>
      </div>
    </div>

    <div class="desc">JOIN US FOR AN OPULENT NIGHT HONORING 25 YEARS OF LOVE AND COMMITMENT.</div>

    <div class="ornament">
      <!-- small ornamental flourish made in CSS using gradient lines -->
      <svg width="220" height="18" viewBox="0 0 220 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M10 9 H105" stroke="#e8c76a" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M115 9 H210" stroke="#e8c76a" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="110" cy="9" r="3" fill="#e8c76a" />
      </svg>
    </div>

    <div class="rsvp">
      <div style="font-weight:600;">RSVP BY 17 SEPTEMBER</div>
      <div style="margin-top:6px;">WALKERS25@INVITATION.COM</div>
    </div>

    <div class="footer-small">Made with ♥ — Edit the text in this file to customize the invitation</div>

  </div>

  <!-- Small script to make some fields editable in-browser (optional) -->
  <script>
    // Make some blocks editable quickly for live edits
    // Click any text to edit; click outside to save changes to localStorage
    (function(){
      const editableSelectors = ['.couple-names','.surname','.big-title','.date-number','.date-info','.desc','.rsvp div:first-child','.rsvp div:last-child'];
      editableSelectors.forEach((sel)=>{
        const el = document.querySelector(sel);
        if(!el) return;
        el.setAttribute('contenteditable','true');
        el.classList.add('editable');
        // load saved
        const key = 'invitation_'+sel;
        const saved = localStorage.getItem(key);
        if(saved) el.innerHTML = saved;
        el.addEventListener('blur', ()=> localStorage.setItem(key, el.innerHTML));
      });
    })();
  </script>

</body>
</html>
\n`;

const defaultCss = `\n:root { color-scheme: light dark; }\nbody { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }\nh1 { font-size: 2rem; margin: 0 0 .5rem; }\nbutton { padding: .5rem 1rem; border-radius: .75rem; border: 1px solid #ddd; }\n`;

const defaultJs = `\nconst btn = document.getElementById('btn');\nif (btn) btn.addEventListener('click', () => alert('JS is running! If you didn\'t see this, enable \'Allow scripts\' above.'));\n`;

// const defaultHtml = `\n<h1>Hello, world! 👋</h1>\n<p>Edit the HTML, CSS, and JS tabs — your changes will appear on the right.</p>\n<button id="btn">Click me</button>\n`;

// const defaultCss = `\n:root { color-scheme: light dark; }\nbody { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }\nh1 { font-size: 2rem; margin: 0 0 .5rem; }\nbutton { padding: .5rem 1rem; border-radius: .75rem; border: 1px solid #ddd; }\n`;

// const defaultJs = `\nconst btn = document.getElementById('btn');\nif (btn) btn.addEventListener('click', () => alert('JS is running! If you didn\'t see this, enable \'Allow scripts\' above.'));\n`;
