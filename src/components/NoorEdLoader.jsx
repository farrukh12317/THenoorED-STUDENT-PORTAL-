import "./NoorEdLoader.css";

/**
 * The NoorEd Academy – animated shining logo loader.
 * Pure SVG + CSS (no images, no JS libraries), works as a server component.
 */
export default function NoorEdLoader() {
  return (
    <div className="ne-loader" role="status" aria-label="Loading">
      <svg viewBox="310 235 400 390" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="ne-cap" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7ccf1a" />
            <stop offset="1" stopColor="#3f9a00" />
          </linearGradient>
          <linearGradient id="ne-page" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#4fa800" />
            <stop offset="1" stopColor="#4fa800" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="ne-glow">
            <stop offset="0" stopColor="#fff9b0" stopOpacity="0.95" />
            <stop offset="0.5" stopColor="#c8f04a" stopOpacity="0.45" />
            <stop offset="1" stopColor="#c8f04a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ne-shine-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>

          {/* Whole logo, defined once and reused for the shine mask */}
          <g id="ne-logo">
            {/* Book – left side */}
            <g id="ne-pages-left">
              <path d="M352 366 L380 354 Q445 372 497 420 Q420 390 352 366Z" fill="url(#ne-page)" />
              <path d="M343 392 L372 385 Q440 396 502 434 Q420 413 343 392Z" fill="#006b2b" />
              <path d="M327 424 L346 412 Q430 424 502 448 Q512 452 522 450 Q430 432 327 424Z" fill="#f0d818" />
            </g>
            {/* Book – right side (mirrored) */}
            <use href="#ne-pages-left" transform="translate(1014 0) scale(-1 1)" />

            {/* Bulb */}
            <path
              d="M470 312 L507 328 L545 312 L540 345 Q535 365 520 378 L520 398 Q507 408 495 398 L495 378 Q478 362 473 345 Z"
              fill="#006b2b"
            />

            {/* Cap */}
            <g className="ne-cap">
              <path d="M440 288 L507 255 L575 290 L507 326 Z" fill="url(#ne-cap)" />
              <path d="M505 288 L565 298 L567 332" fill="none" stroke="#006b2b" strokeWidth="7" strokeLinejoin="round" />
              <circle cx="505" cy="288" r="8" fill="#006b2b" />
              <circle cx="567" cy="339" r="8" fill="#006b2b" />
            </g>

            {/* Wordmark */}
            <text x="328" y="456" fontFamily="'Barlow Condensed','Arial Narrow',Arial,sans-serif" fontWeight="800" fontSize="15" fill="#006b2b">
              THE
            </text>
            <text
              x="328"
              y="535"
              textLength="362"
              lengthAdjust="spacingAndGlyphs"
              fontFamily="'Barlow Condensed','Arial Narrow',Arial,sans-serif"
              fontWeight="800"
              fontSize="104"
            >
              <tspan fill="#006b2b">Noor</tspan>
              <tspan fill="#55a400">Ed</tspan>
            </text>
            <rect x="325" y="541" width="362" height="22" fill="#4fa800" />
            <text
              x="342"
              y="557"
              textLength="328"
              fontFamily="Arial,sans-serif"
              fontWeight="700"
              fontSize="13"
              fill="#fff"
            >
              A C A D E M Y
            </text>
          </g>

          {/* Alpha mask = logo silhouette, so the shine only lands on the logo */}
          <mask id="ne-mask" maskUnits="userSpaceOnUse" x="300" y="230" width="420" height="360" style={{ maskType: "alpha" }}>
            <use href="#ne-logo" />
          </mask>
        </defs>

        {/* Soft pulsing light behind the bulb */}
        <circle className="ne-glow" cx="507" cy="365" r="70" fill="url(#ne-glow)" />

        <use href="#ne-logo" className="ne-logo" />

        {/* Moving shine */}
        <g mask="url(#ne-mask)">
          <rect className="ne-shine" x="300" y="230" width="90" height="360" fill="url(#ne-shine-grad)" />
        </g>

        {/* Sparkle */}
        <path className="ne-spark" d="M507 281 l3 -9 3 9 9 3 -9 3 -3 9 -3 -9 -9 -3z" fill="#fff" />

        {/* Loading dots */}
        <g fill="#4fa800">
          <circle className="ne-dot" cx="487" cy="592" r="5" />
          <circle className="ne-dot ne-d2" cx="507" cy="592" r="5" />
          <circle className="ne-dot ne-d3" cx="527" cy="592" r="5" />
        </g>
      </svg>
    </div>
  );
}