interface CornerNetworkProps {
  className?: string;
}

/** Decorative, code-drawn knowledge-network motif used across the workspace. */
export default function CornerNetwork({ className = '' }: CornerNetworkProps) {
  return <svg aria-hidden="true" viewBox="0 0 420 280" fill="none" className={className}>
    <defs><linearGradient id="network-line" x1="12" y1="10" x2="390" y2="250" gradientUnits="userSpaceOnUse"><stop stopColor="#7653D6" /><stop offset="1" stopColor="#F05B8D" /></linearGradient><radialGradient id="network-node"><stop stopColor="#F582AC" /><stop offset="1" stopColor="#7653D6" /></radialGradient></defs>
    <g stroke="url(#network-line)" strokeLinecap="round">
      <path d="M20 26 96 74l71-45 70 67 74-47 91 63" strokeWidth="2.5" />
      <path d="m96 74-25 87 116 34 50-99 61 113 104-97" strokeWidth="2.5" />
      <path d="m71 161 62 73 54-39 79 42 32-28 83 48" strokeWidth="2" />
      <path d="m167 29 20 166 79 42 45-188" strokeWidth="2" />
      <path d="m20 26 51 135 62 73" strokeWidth="1.5" opacity=".8" />
      <path d="m237 96 98 46 67-30" strokeWidth="1.5" opacity=".8" />
      <path d="m133 234 92 14 41-11" strokeWidth="1.5" opacity=".75" />
    </g>
    <g fill="url(#network-node)"><circle cx="20" cy="26" r="6" /><circle cx="96" cy="74" r="10" /><circle cx="167" cy="29" r="7" /><circle cx="237" cy="96" r="11" /><circle cx="311" cy="49" r="8" /><circle cx="402" cy="112" r="10" /><circle cx="71" cy="161" r="7" /><circle cx="187" cy="195" r="10" /><circle cx="298" cy="209" r="8" /><circle cx="335" cy="142" r="6" /><circle cx="133" cy="234" r="8" /><circle cx="266" cy="237" r="7" /><circle cx="381" cy="257" r="9" /></g>
  </svg>;
}
