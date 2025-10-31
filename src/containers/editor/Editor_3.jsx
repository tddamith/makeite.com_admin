import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Plus, Type, Image as ImageIcon, Trash2, AlignLeft, AlignCenter, AlignRight, Lock, Unlock, Layers, Sparkles, Settings2, Upload, ArrowUpLeft } from "lucide-react";

// ---------- Types ----------
const defaultFonts = [
    { label: "Inter (Sans)", stack: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" },
    { label: "Playfair (Serif)", stack: "\"Playfair Display\", ui-serif, Georgia, Cambria, \"Times New Roman\", Times, serif" },
    { label: "Dancing Script (Hand)", stack: "\"Dancing Script\", ui-serif, Georgia, serif" },
    { label: "Montserrat (Sans)", stack: "Montserrat, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" },
    { label: "Cinzel (Display)", stack: "Cinzel, ui-serif, Georgia, serif" },
];

const fontLinks = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Dancing+Script:wght@400;600;700&family=Montserrat:wght@400;600;700&family=Playfair+Display:wght@400;600;700&display=swap');`;

const baseVariants = {
    none: { hidden: { opacity: 1, y: 0, scale: 1 }, show: { opacity: 1, y: 0, scale: 1 } },
    fade: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } },
    slideUp: { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } },
    pop: { hidden: { opacity: 0, scale: 0.88 }, show: { opacity: 1, scale: 1, transition: { duration: 0.45 } } },
};

// ---------- Helpers ----------
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ---------- Default Document ----------
const defaultLayers = [
    {
        id: "title",
        type: "text",
        name: "Title",
        text: "ONEderful News!",
        x: 540,
        y: 140,
        align: "center",
        color: "#1F7A29",
        fontFamily: defaultFonts[3].stack,
        fontSize: 56,
        weight: 700,
        letterSpacing: 0,
        lineHeight: 1.1,
        shadow: false,
        locked: false,
        animation: "slideUp",
    },
    {
        id: "subtitle",
        type: "text",
        name: "Subtitle",
        text: "Our little chick, Rehaya, is turning one!",
        x: 540,
        y: 220,
        align: "center",
        color: "#8a6f00",
        fontFamily: defaultFonts[1].stack,
        fontSize: 32,
        weight: 600,
        letterSpacing: 0,
        lineHeight: 1.2,
        shadow: false,
        locked: false,
        animation: "fade",
    },
    {
        id: "date",
        type: "text",
        name: "Date",
        text: "October 5th\n4.00 PM - 5.30 PM",
        x: 540,
        y: 420,
        align: "center",
        color: "#111827",
        fontFamily: defaultFonts[0].stack,
        fontSize: 36,
        weight: 700,
        letterSpacing: 0,
        lineHeight: 1.2,
        shadow: false,
        locked: false,
        animation: "pop",
    },
    {
        id: "venue",
        type: "text",
        name: "Venue",
        text: "Rehaya’s Chick Inn (Home)",
        x: 540,
        y: 540,
        align: "center",
        color: "#111827",
        fontFamily: defaultFonts[0].stack,
        fontSize: 28,
        weight: 500,
        letterSpacing: 0,
        lineHeight: 1.2,
        shadow: false,
        locked: false,
        animation: "fade",
    },
    {
        id: "footer",
        type: "text",
        name: "Footer",
        text: "Your presence will make the day egg-stra special",
        x: 540,
        y: 1500,
        align: "center",
        color: "#334155",
        fontFamily: defaultFonts[0].stack,
        fontSize: 22,
        weight: 500,
        letterSpacing: 0,
        lineHeight: 1.35,
        shadow: false,
        locked: false,
        animation: "fade",
    },
];

const defaultBg = {
    mode: "gradient", // 'solid' | 'gradient' | 'image'
    solid: "#fff7ed",
    gradientFrom: "#fff7ed",
    gradientTo: "#f1f5f9",
    image: "",
    imageFit: "cover", // contain | cover
    overlay: 0, // 0..0.6
};

// ---------- Main Component ----------
export default function InvitationDesigner() {
    const [layers, setLayers] = useState(defaultLayers);
    const [selectedId, setSelectedId] = useState(layers[0].id);
    const [bg, setBg] = useState(defaultBg);
    const [artboard, setArtboard] = useState({ w: 1080, h: 1600, radius: 28, padding: 28 });
    const [drag, setDrag] = useState({ id: null, ox: 0, oy: 0 });
    const nodeRef = useRef(null);

    // inject Google fonts
    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = fontLinks;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const selected = useMemo(() => layers.find(l => l.id === selectedId) || null, [layers, selectedId]);

    // Dragging
    function onMouseDown(e, id) {
        const rect = nodeRef.current.getBoundingClientRect();
        const layer = layers.find(l => l.id === id);
        if (!layer || layer.locked) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setDrag({ id, ox: x - layer.x, oy: y - layer.y });
    }

    function onMouseMove(e) {
        if (!drag.id) return;
        const rect = nodeRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setLayers(prev => prev.map(l => (l.id === drag.id ? { ...l, x: Math.max(0, Math.min(artboard.w, x - drag.ox)), y: Math.max(0, Math.min(artboard.h, y - drag.oy)) } : l)));
    }

    function onMouseUp() {
        if (drag.id) setDrag({ id: null, ox: 0, oy: 0 });
    }

    // Add / remove layers
    function addTextLayer() {
        const id = `text-${Math.random().toString(36).slice(2, 8)}`;
        const newLayer = {
            id,
            type: "text",
            name: "Text",
            text: "New text",
            x: artboard.w / 2,
            y: artboard.h / 2,
            align: "center",
            color: "#111827",
            fontFamily: defaultFonts[0].stack,
            fontSize: 36,
            weight: 600,
            letterSpacing: 0,
            lineHeight: 1.2,
            shadow: false,
            locked: false,
            animation: "none",
        };
        setLayers(l => [...l, newLayer]);
        setSelectedId(id);
    }

    async function addImageLayer(file) {
        if (!file) return;
        const src = await readFileAsDataURL(file);
        const id = `img-${Math.random().toString(36).slice(2, 8)}`;
        const newLayer = {
            id,
            type: "image",
            name: file.name || "Image",
            src,
            x: artboard.w / 2,
            y: artboard.h / 2,
            w: 420,
            h: 420,
            locked: false,
            animation: "pop",
        };
        setLayers(l => [...l, newLayer]);
        setSelectedId(id);
    }

    function removeLayer(id) {
        setLayers(l => l.filter(x => x.id !== id));
        if (selectedId === id) setSelectedId(layers[0]?.id || "");
    }

    function duplicateLayer(id) {
        const l = layers.find(x => x.id === id);
        if (!l) return;
        const copy = { ...l, id: `${l.id}-copy-${Math.random().toString(36).slice(2,6)}`, x: l.x + 20, y: l.y + 16, name: `${l.name} (copy)` };
        setLayers(prev => [...prev, copy]);
        setSelectedId(copy.id);
    }

    function updateSelected(patch) {
        if (!selected) return;
        setLayers(prev => prev.map(l => (l.id === selected.id ? { ...l, ...patch } : l)));
    }

    // Export PNG using html-to-image
    // async function exportPNG() {
    //     const { toPng } = await import("html-to-image");
    //     const node = nodeRef.current;
    //     const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 });
    //     const link = document.createElement("a");
    //     link.download = "invitation.png";
    //     link.href = dataUrl;
    //     link.click();
    // }

    function resetAll() {
        setLayers(defaultLayers);
        setBg(defaultBg);
        setSelectedId("title");
    }

    // Artboard background style
    const artboardBg = useMemo(() => {
        if (bg.mode === "solid") return { background: bg.solid };
        if (bg.mode === "gradient") return { background: `linear-gradient(180deg, ${bg.gradientFrom}, ${bg.gradientTo})` };
        if (bg.mode === "image") return { backgroundImage: `url(${bg.image})`, backgroundSize: bg.imageFit, backgroundPosition: "center" };
        return {};
    }, [bg]);

    return (
        <div className="min-h-screen w-full bg-slate-100 text-slate-800">
            <div className="mx-auto max-w-7xl p-4 md:p-6">
                <header className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Invitation Designer</h1>
                            <p className="text-sm text-slate-500">Edit text, fonts, colors, images, alignment & animations. Drag to reposition. Export as PNG.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={resetAll} className="rounded-xl bg-white px-3 py-2 text-sm shadow hover:shadow-md">Reset</button>
                        {/*<button onClick={exportPNG} className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm text-white shadow hover:shadow-lg"><Download className="h-4 w-4"/> Export PNG</button>*/}
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px,1fr]">
                    {/* Left panel */}
                    <aside className="rounded-2xl bg-white p-4 shadow">
                        <SectionLabel icon={<Layers className="h-4 w-4"/>} title="Layers" />
                        <div className="space-y-2">
                            {layers.map(l => (
                                <button key={l.id} onClick={() => setSelectedId(l.id)} className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm ${selectedId===l.id?"border-violet-500 bg-violet-50":"border-slate-200 hover:bg-slate-50"}`}>
                                    <div className="flex items-center gap-2">
                                        {l.type === "text" ? <Type className="h-4 w-4"/> : <ImageIcon className="h-4 w-4"/>}
                                        <span className="truncate">{l.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400">
                                        {l.locked ? <Lock className="h-4 w-4"/> : <Unlock className="h-4 w-4"/>}
                                    </div>
                                </button>
                            ))}
                            <div className="mt-2 flex items-center gap-2">
                                <button onClick={addTextLayer} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm text-white"><Plus className="h-4 w-4"/> Add Text</button>
                                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                                    <Upload className="h-4 w-4"/> Image
                                    <input type="file" accept="image/*" className="hidden" onChange={e => addImageLayer(e.target.files?.[0])}/>
                                </label>
                            </div>
                        </div>

                        <div className="my-6 h-px bg-slate-200" />

                        <SectionLabel icon={<Settings2 className="h-4 w-4"/>} title="Selected Layer" />
                        {!selected && <p className="text-sm text-slate-500">Pick a layer to edit.</p>}

                        {selected && selected.type === "text" && (
                            <div className="space-y-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-500">Content</label>
                                    <textarea value={selected.text} onChange={e=>updateSelected({text: e.target.value})} rows={3} className="w-full resize-none rounded-xl border border-slate-200 p-2 text-sm focus:border-violet-500 focus:outline-none"/>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-slate-500">Font size</label>
                                        <input type="range" min={12} max={96} value={selected.fontSize} onChange={e=>updateSelected({fontSize: Number(e.target.value)})} className="w-full"/>
                                        <div className="mt-1 text-xs text-slate-500">{selected.fontSize}px</div>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-slate-500">Weight</label>
                                        <input type="range" min={300} max={900} step={100} value={selected.weight} onChange={e=>updateSelected({weight: Number(e.target.value)})} className="w-full"/>
                                        <div className="mt-1 text-xs text-slate-500">{selected.weight}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-slate-500">Line height</label>
                                        <input type="range" min={0.9} max={2} step={0.05} value={selected.lineHeight} onChange={e=>updateSelected({lineHeight: Number(e.target.value)})} className="w-full"/>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-slate-500">Letter spacing</label>
                                        <input type="range" min={-1} max={4} step={0.1} value={selected.letterSpacing} onChange={e=>updateSelected({letterSpacing: Number(e.target.value)})} className="w-full"/>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-500">Font family</label>
                                    <select value={selected.fontFamily} onChange={e=>updateSelected({fontFamily: e.target.value})} className="w-full rounded-xl border border-slate-200 p-2 text-sm focus:border-violet-500 focus:outline-none">
                                        {defaultFonts.map(f => <option key={f.label} value={f.stack}>{f.label}</option>)}
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="mb-1 block text-xs font-medium text-slate-500">Color</label>
                                    <input type="color" value={selected.color} onChange={e=>updateSelected({color: e.target.value})} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={()=>updateSelected({align:"left"})} className={`rounded-xl border p-2 ${selected.align==='left'? 'border-violet-500 bg-violet-50':'border-slate-200'}`}><AlignLeft className="h-4 w-4"/></button>
                                    <button onClick={()=>updateSelected({align:"center"})} className={`rounded-xl border p-2 ${selected.align==='center'? 'border-violet-500 bg-violet-50':'border-slate-200'}`}><AlignCenter className="h-4 w-4"/></button>
                                    <button onClick={()=>updateSelected({align:"right"})} className={`rounded-xl border p-2 ${selected.align==='right'? 'border-violet-500 bg-violet-50':'border-slate-200'}`}><AlignRight className="h-4 w-4"/></button>
                                    <div className="ml-auto flex items-center gap-2">
                                        <button onClick={()=>updateSelected({locked: !selected.locked})} className="rounded-xl border border-slate-200 p-2">{selected.locked? <Lock className="h-4 w-4"/>:<Unlock className="h-4 w-4"/>}</button>
                                        <button onClick={()=>duplicateLayer(selected.id)} className="rounded-xl border border-slate-200 p-2"><Plus className="h-4 w-4"/></button>
                                        <button onClick={()=>removeLayer(selected.id)} className="rounded-xl border border-rose-200 p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4"/></button>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-500">Animation</label>
                                    <select value={selected.animation} onChange={e=>updateSelected({animation: e.target.value})} className="w-full rounded-xl border border-slate-200 p-2 text-sm focus:border-violet-500 focus:outline-none">
                                        <option value="none">None</option>
                                        <option value="fade">Fade</option>
                                        <option value="slideUp">Slide up</option>
                                        <option value="pop">Pop</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {selected && selected.type === "image" && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-slate-500">Width</label>
                                        <input type="range" min={80} max={artboard.w} value={selected.w} onChange={e=>updateSelected({w:Number(e.target.value)})} className="w-full"/>
                                        <div className="mt-1 text-xs text-slate-500">{Math.round(selected.w)} px</div>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-slate-500">Height</label>
                                        <input type="range" min={80} max={artboard.h} value={selected.h} onChange={e=>updateSelected({h:Number(e.target.value)})} className="w-full"/>
                                        <div className="mt-1 text-xs text-slate-500">{Math.round(selected.h)} px</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={()=>updateSelected({locked: !selected.locked})} className="rounded-xl border border-slate-200 p-2">{selected.locked? <Lock className="h-4 w-4"/>:<Unlock className="h-4 w-4"/>}</button>
                                    <button onClick={()=>duplicateLayer(selected.id)} className="rounded-xl border border-slate-200 p-2"><Plus className="h-4 w-4"/></button>
                                    <button onClick={()=>removeLayer(selected.id)} className="rounded-xl border border-rose-200 p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4"/></button>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-500">Replace image</label>
                                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                                        <Upload className="h-4 w-4"/> Upload
                                        <input type="file" accept="image/*" className="hidden" onChange={async e=>{
                                            const file = e.target.files?.[0];
                                            if (!file) return; const src = await readFileAsDataURL(file); updateSelected({src});
                                        }}/>
                                    </label>
                                </div>
                                <p className="text-xs text-slate-500">Tip: drag the image directly on the artboard to reposition.</p>
                            </div>
                        )}

                        <div className="my-6 h-px bg-slate-200" />

                        <SectionLabel icon={<Sparkles className="h-4 w-4"/>} title="Background" />
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <button onClick={()=>setBg({...bg, mode:'solid'})} className={`rounded-xl border px-3 py-1 ${bg.mode==='solid'? 'border-violet-500 bg-violet-50':'border-slate-200'}`}>Solid</button>
                                <button onClick={()=>setBg({...bg, mode:'gradient'})} className={`rounded-xl border px-3 py-1 ${bg.mode==='gradient'? 'border-violet-500 bg-violet-50':'border-slate-200'}`}>Gradient</button>
                                <button onClick={()=>setBg({...bg, mode:'image'})} className={`rounded-xl border px-3 py-1 ${bg.mode==='image'? 'border-violet-500 bg-violet-50':'border-slate-200'}`}>Image</button>
                            </div>

                            {bg.mode === 'solid' && (
                                <div className="flex items-center gap-2">
                                    <label className="mb-1 block text-xs font-medium text-slate-500">Color</label>
                                    <input type="color" value={bg.solid} onChange={e=>setBg({...bg, solid: e.target.value})}/>
                                </div>
                            )}

                            {bg.mode === 'gradient' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2">
                                        <label className="mb-1 block text-xs font-medium text-slate-500">From</label>
                                        <input type="color" value={bg.gradientFrom} onChange={e=>setBg({...bg, gradientFrom: e.target.value})}/>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="mb-1 block text-xs font-medium text-slate-500">To</label>
                                        <input type="color" value={bg.gradientTo} onChange={e=>setBg({...bg, gradientTo: e.target.value})}/>
                                    </div>
                                </div>
                            )}

                            {bg.mode === 'image' && (
                                <div className="space-y-2">
                                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                                        <Upload className="h-4 w-4"/> Upload background
                                        <input type="file" accept="image/*" className="hidden" onChange={async e=>{
                                            const file = e.target.files?.[0]; if (!file) return; const image = await readFileAsDataURL(file); setBg({...bg, image});
                                        }}/>
                                    </label>
                                    <div className="flex items-center gap-2 text-sm">
                                        <button onClick={()=>setBg({...bg, imageFit: 'cover'})} className={`rounded-xl border px-3 py-1 ${bg.imageFit==='cover'? 'border-violet-500 bg-violet-50':'border-slate-200'}`}>Cover</button>
                                        <button onClick={()=>setBg({...bg, imageFit: 'contain'})} className={`rounded-xl border px-3 py-1 ${bg.imageFit==='contain'? 'border-violet-500 bg-violet-50':'border-slate-200'}`}>Contain</button>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-slate-500">Overlay (darken)</label>
                                        <input type="range" min={0} max={0.6} step={0.02} value={bg.overlay} onChange={e=>setBg({...bg, overlay: Number(e.target.value)})} className="w-full"/>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-500">Width</label>
                                    <input type="number" value={artboard.w} onChange={e=>setArtboard({...artboard, w: Number(e.target.value)})} className="w-full rounded-xl border border-slate-200 p-2 text-sm"/>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-500">Height</label>
                                    <input type="number" value={artboard.h} onChange={e=>setArtboard({...artboard, h: Number(e.target.value)})} className="w-full rounded-xl border border-slate-200 p-2 text-sm"/>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-500">Radius</label>
                                    <input type="number" value={artboard.radius} onChange={e=>setArtboard({...artboard, radius: Number(e.target.value)})} className="w-full rounded-xl border border-slate-200 p-2 text-sm"/>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Canvas area */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex w-full items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-500"><ArrowUpLeft className="h-4 w-4"/> Drag any item in the canvas</div>
                            <div className="text-sm text-slate-500">Canvas: {artboard.w}×{artboard.h}px</div>
                        </div>

                        <div className="relative rounded-3xl bg-white p-4 shadow-lg">
                            <div
                                ref={nodeRef}
                                onMouseMove={onMouseMove}
                                onMouseUp={onMouseUp}
                                onMouseLeave={onMouseUp}
                                style={{ width: artboard.w, height: artboard.h, borderRadius: artboard.radius, ...artboardBg }}
                                className="relative overflow-hidden"
                            >
                                {bg.mode === 'image' && bg.overlay > 0 && (
                                    <div className="pointer-events-none absolute inset-0" style={{ background: `rgba(0,0,0,${bg.overlay})` }} />
                                )}

                                {layers.map((l) => (
                                    <motion.div
                                        key={l.id}
                                        initial={baseVariants[l.animation]?.hidden}
                                        animate={baseVariants[l.animation]?.show}
                                        transition={{ type: "spring", stiffness: 120, damping: 16 }}
                                        className={`absolute select-none ${selectedId===l.id? 'ring-2 ring-violet-400': ''}`}
                                        style={{ left: l.x, top: l.y, transform: "translate(-50%, -50%)" }}
                                        onMouseDown={(e)=>{ setSelectedId(l.id); onMouseDown(e, l.id); }}
                                    >
                                        {l.type === "text" ? (
                                            <div
                                                contentEditable={!l.locked}
                                                suppressContentEditableWarning
                                                onBlur={(e)=> updateSelected({ text: e.currentTarget.innerText })}
                                                className="outline-none"
                                                style={{
                                                    minWidth: 80,
                                                    maxWidth: artboard.w - 80,
                                                    color: l.color,
                                                    fontFamily: l.fontFamily,
                                                    fontSize: l.fontSize,
                                                    fontWeight: l.weight,
                                                    letterSpacing: `${l.letterSpacing}px`,
                                                    lineHeight: l.lineHeight,
                                                    textAlign: l.align,
                                                    textShadow: l.shadow ? "0 1px 0 rgba(0,0,0,.04)" : "none",
                                                    whiteSpace: "pre-wrap",
                                                    userSelect: l.locked ? "none" : "text",
                                                    cursor: l.locked ? "default" : "move",
                                                    padding: 4,
                                                    background: selectedId===l.id? "rgba(139,92,246,.06)":"transparent",
                                                    borderRadius: 10,
                                                }}
                                            >{l.text}</div>
                                        ) : (
                                            <img src={l.src} alt={l.name} style={{ width: l.w, height: l.h, objectFit: "contain", pointerEvents: "none" }} />
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SectionLabel({ icon, title }){
    return (
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {icon}
            <span>{title}</span>
        </div>
    );
}
