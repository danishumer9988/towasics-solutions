import { forwardRef } from 'react';
import { useImageEffect } from '../../lib/imageEffects.jsx';

const PROTECT = {
  draggable: false,
  onDragStart: (e) => e.preventDefault(),
  onContextMenu: (e) => e.preventDefault(),
};

const EffectImage = forwardRef(function EffectImage(
  {
    src,
    alt = '',
    effects = null,
    className = '',
    style = {},
    fallback = '/assets/slider.png',
    ...imgProps
  },
  ref
) {
  const { filterStyle, svgDefs } = useImageEffect(effects);

  const filterValue = filterStyle?.filter;
  const hasEffect = !!filterValue;
  const cssVars = hasEffect ? { '--fx-filter': filterValue } : {};

  return (
    <>
      {svgDefs}
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={hasEffect ? `effect-image ${className}` : className}
        style={{ ...cssVars, ...style }}
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop
          if (fallback) e.target.src = fallback;
        }}
        {...PROTECT}
        {...imgProps}
      />
    </>
  );
});

export default EffectImage;