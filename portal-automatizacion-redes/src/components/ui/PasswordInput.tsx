import { useState } from "react";

// Si usas librería de iconos (Heroicons, Material Icons, etc.), puedes reemplazar el SVG.
export default function PasswordInput({
  value,
  onChange,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <input
        {...props}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        className={props.className || "input"}
        style={{
          ...props.style,
          paddingRight: "2.5rem"
        }}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        onClick={() => setShow(s => !s)}
        style={{
          position: "absolute",
          right: "0.5rem",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer"
        }}
      >
        {show ? (
          // ojo abierto
          <svg width={20} height={20} fill="#888" viewBox="0 0 576 512">
            <path d="M572.52 241.4C518.92 135.17 406.16 64 288 64C169.84 64 57.08 135.17 3.48 241.4C-1.16 250.31-1.16 261.7 3.48 270.6C57.08 376.83 169.84 448 288 448C406.16 448 518.92 376.83 572.52 270.6C577.16 261.7 577.16 250.31 572.52 241.4ZM288 400C202.98 400 128 339.02 84.65 256C128 172.98 202.98 112 288 112C373.02 112 448 172.98 491.35 256C448 339.02 373.02 400 288 400ZM288 176C238.98 176 200 214.98 200 264C200 313.02 238.98 352 288 352C337.02 352 376 313.02 376 264C376 214.98 337.02 176 288 176ZM288 304C270.33 304 256 289.67 256 272C256 254.33 270.33 240 288 240C305.67 240 320 254.33 320 272C320 289.67 305.67 304 288 304Z"/>
          </svg>
        ) : (
          // ojo cerrado
          <svg width={20} height={20} fill="#888" viewBox="0 0 640 512">
            <path d="M320 96C169.84 96 57.08 167.17 3.48 273.4C-1.16 282.31-1.16 293.7 3.48 302.6C57.08 408.83 169.84 480 320 480c28.48 0 56.17-3.56 83.03-10.04-.04-.02-.08-.03-.12-.05C476.13 501.31 536.31 512 574.01 512c8.49 0 15.99-6.97 16-15.5V336c0-26.51-21.49-48-48-48h-64V176c0-26.51-21.49-48-48-48H320zm0 256c-52.94 0-96-43.07-96-96s43.07-96 96-96 96 43.07 96 96-43.06 96-96 96z"/>
          </svg>
        )}
      </button>
    </div>
  );
}