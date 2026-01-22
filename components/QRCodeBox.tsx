"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

export function QRCodeBox({ value }: { value: string }) {
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    QRCode.toDataURL(value, { margin: 1, width: 720 }).then(setDataUrl);
  }, [value]);

  if (!dataUrl) return <div>Generating QR…</div>;

  return <img src={dataUrl} alt="QR" />;
}
