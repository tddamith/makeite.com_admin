import React, { useState } from "react";

export default function Editor() {
    const [data, setData] = useState({
        headline: "ONEderful News!",
        subtitle: "Our little chick, Rehaya is turning one!",
        align: "center",
        font: "'Poppins', sans-serif",
        fontSize: 36,
        animate: "fade"
    });

    const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
    <style>
      @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
      @keyframes slideUp { from { transform:translateY(40px); opacity:0;} to {transform:translateY(0); opacity:1;} }
      .animate-fade { animation: fadeIn 1s ease-in-out; }
      .animate-slide { animation: slideUp 1s ease-in-out; }
      text {
        font-family: ${data.font};
        font-size: ${data.fontSize}px;
        text-anchor: ${data.align === "center" ? "middle" : data.align === "right" ? "end" : "start"};
      }
    </style>

    <rect width="100%" height="100%" fill="#fff8ee" />
    <text x="${data.align === "center" ? 300 : data.align === "right" ? 560 : 40}" y="180"
          class="animate-${data.animate}" fill="#6CB63F">
      ${data.headline}
    </text>
    <text x="${data.align === "center" ? 300 : data.align === "right" ? 560 : 40}" y="230"
          class="animate-${data.animate}" fill="#333">
      ${data.subtitle}
    </text>
  </svg>`;

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <label>Headline</label>
                <input value={data.headline} onChange={e=>setData({...data, headline:e.target.value})}/>

                <label>Subtitle</label>
                <input value={data.subtitle} onChange={e=>setData({...data, subtitle:e.target.value})}/>

                <label>Font family</label>
                <select value={data.font} onChange={e=>setData({...data, font:e.target.value})}>
                    <option value="'Poppins', sans-serif">Poppins</option>
                    <option value="'Playfair Display', serif">Playfair Display</option>
                    <option value="'Lobster', cursive">Lobster</option>
                    <option value="'Inter', sans-serif">Inter</option>
                </select>

                <label>Font size</label>
                <input type="range" min="18" max="72" value={data.fontSize}
                       onChange={e=>setData({...data, fontSize:Number(e.target.value)})}/>

                <label>Alignment</label>
                <select value={data.align} onChange={e=>setData({...data, align:e.target.value})}>
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                </select>

                <label>Animation</label>
                <select value={data.animate} onChange={e=>setData({...data, animate:e.target.value})}>
                    <option value="fade">Fade In</option>
                    <option value="slide">Slide Up</option>
                    <option value="none">None</option>
                </select>
            </div>

            {/* Real-time preview */}
            <div dangerouslySetInnerHTML={{ __html: svg }} style={{ background:"#f8f8f8", textAlign:"center" }}/>
        </div>
    );
}
