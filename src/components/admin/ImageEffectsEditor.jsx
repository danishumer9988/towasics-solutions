import { DEFAULT_IMAGE_EFFECTS } from '../../lib/imageEffects.jsx';
import { Field } from './ui';

export default function ImageEffectsEditor({ effects, onChange }) {
  const fx = { ...DEFAULT_IMAGE_EFFECTS, ...(effects || {}) };
  const update = (patch) => onChange({ ...fx, ...patch });

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={fx.enabled}
          onChange={(e) => update({ enabled: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
        />
        <span className="text-sm font-medium text-ink">
          Apply effect to this image
        </span>
      </label>

      {fx.enabled && (
        <div className="space-y-4 pt-4 border-t border-line">
          <Field label="Blur type">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => update({ type: 'box' })}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                  fx.type === 'box'
                    ? 'bg-brand-600 text-white'
                    : 'bg-white border border-line text-ink hover:bg-gray-50'
                }`}
              >
                <i className="fa-solid fa-circle-half-stroke mr-2" />
                Box Blur
              </button>
              <button
                type="button"
                onClick={() => update({ type: 'pixelate' })}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                  fx.type === 'pixelate'
                    ? 'bg-brand-600 text-white'
                    : 'bg-white border border-line text-ink hover:bg-gray-50'
                }`}
              >
                <i className="fa-solid fa-table-cells mr-2" />
                Pixelate
              </button>
            </div>
          </Field>

          <Slider
            label={fx.type === 'pixelate' ? 'Block size' : 'Blur radius'}
            value={fx.radius}
            min={0}
            max={40}
            step={1}
            unit="px"
            onChange={(v) => update({ radius: v })}
          />
          <Slider
            label="Brightness"
            value={fx.brightness}
            min={50}
            max={150}
            unit="%"
            onChange={(v) => update({ brightness: v })}
          />
          <Slider
            label="Contrast"
            value={fx.contrast}
            min={50}
            max={150}
            unit="%"
            onChange={(v) => update({ contrast: v })}
          />
          <Slider
            label="Saturation"
            value={fx.saturation}
            min={0}
            max={200}
            unit="%"
            onChange={(v) => update({ saturation: v })}
          />
          <Slider
            label="Sharpness"
            value={fx.sharpness}
            min={0}
            max={100}
            unit="%"
            onChange={(v) => update({ sharpness: v })}
            hint={
              fx.type === 'pixelate'
                ? 'Applied before pixelation — subtle effect'
                : 'Enhances edges before the blur is applied'
            }
          />
        </div>
      )}
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, unit = '', hint, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium text-ink-subtle">{label}</label>
        <span className="text-xs font-semibold text-ink tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-600 cursor-pointer"
      />
      {hint && <p className="text-[11px] text-ink-subtle mt-1">{hint}</p>}
    </div>
  );
}