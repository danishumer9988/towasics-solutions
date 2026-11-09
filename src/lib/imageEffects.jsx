import { useState } from 'react';

export const DEFAULT_IMAGE_EFFECTS = {
  enabled: false,
  type: 'box',
  radius: 4,            // Updated
  brightness: 100,
  contrast: 100,
  saturation: 100,
  sharpness: 80,        // Updated
};

export const getImageUrl = (entry) =>
  typeof entry === 'string' ? entry : entry?.url || '';

export function resolveImageEffects(project, entry) {
  if (entry && typeof entry === 'object' && 'effects' in entry) {
    return entry.effects?.enabled ? entry.effects : null;
  }
  if (project?.blurImage) {
    return { ...DEFAULT_IMAGE_EFFECTS, enabled: true };
  }
  return null;
}

export function useImageEffect(effects) {
  const [filterId] = useState(
    () => `fx-${Math.random().toString(36).slice(2, 11)}`
  );

  if (!effects || !effects.enabled) {
    return { filterStyle: {}, svgDefs: null };
  }

  const {
    type = 'box',
    radius = 0,
    brightness = 100,
    contrast = 100,
    saturation = 100,
    sharpness = 0,
  } = effects;

  if (type === 'box' && sharpness === 0) {
    const parts = [];
    if (radius > 0)         parts.push(`blur(${radius}px)`);
    if (brightness !== 100) parts.push(`brightness(${brightness}%)`);
    if (contrast !== 100)   parts.push(`contrast(${contrast}%)`);
    if (saturation !== 100) parts.push(`saturate(${saturation}%)`);
    if (parts.length === 0) return { filterStyle: {}, svgDefs: null };
    return { filterStyle: { filter: parts.join(' ') }, svgDefs: null };
  }

  const nodes = [];
  let last = 'SourceGraphic';

  if (sharpness > 0) {
    const d = sharpness / 100;
    const c = 1 + 4 * d;
    const e = -d;
    nodes.push(
      <feConvolveMatrix
        key="sharp"
        in={last}
        result="sharp"
        order="3"
        preserveAlpha="true"
        kernelMatrix={`0 ${e} 0 ${e} ${c} ${e} 0 ${e} 0`}
      />
    );
    last = 'sharp';
  }

  if (radius > 0) {
    if (type === 'box') {
      nodes.push(
        <feGaussianBlur key="blur" in={last} stdDeviation={radius / 2} result="blur" />
      );
      last = 'blur';
    } else {
      const R = Math.max(4, Math.round(radius));
      const half = R / 2;

      nodes.push(
        <feFlood key="flood" x={half} y={half} width="1" height="1" result="flood" />
      );
      nodes.push(
        <feComposite key="comp1" in="flood" in2="flood" width={R} height={R} result="tileSrc" />
      );
      nodes.push(<feTile key="tile" in="tileSrc" result="tile" />);
      nodes.push(
        <feComposite key="comp2" in={last} in2="tile" operator="in" result="masked" />
      );
      nodes.push(
        <feMorphology key="dilate" in="masked" operator="dilate" radius={half} result="pixelated" />
      );
      last = 'pixelated';
    }
  }

  if (saturation !== 100) {
    nodes.push(
      <feColorMatrix key="sat" in={last} type="saturate" values={saturation / 100} result="sat" />
    );
    last = 'sat';
  }

  if (brightness !== 100 || contrast !== 100) {
    const b = brightness / 100;
    const c = contrast / 100;
    const slope = b * c;
    const intercept = 0.5 * (1 - c);
    nodes.push(
      <feComponentTransfer key="bc" in={last}>
        <feFuncR type="linear" slope={slope} intercept={intercept} />
        <feFuncG type="linear" slope={slope} intercept={intercept} />
        <feFuncB type="linear" slope={slope} intercept={intercept} />
      </feComponentTransfer>
    );
  }

  if (nodes.length === 0) return { filterStyle: {}, svgDefs: null };

  const svgDefs = (
    <svg
      width="0"
      height="0"
      style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        <filter id={filterId} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
          {nodes}
        </filter>
      </defs>
    </svg>
  );

  return { filterStyle: { filter: `url(#${filterId})` }, svgDefs };
}