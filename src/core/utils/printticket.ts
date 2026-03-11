// utils/printQueueNumber58.ts
export function printQueueNumber58({
  qNumber,
  widthMm = 58, // Xprinter 58mm roll
  paddingMm = 4, // inner padding
  qnumBottomMm = 4, // margin under the number (in mm)
  footerTopMm = 2, // margin above the footer (in mm)
  tailMm = 16, // extra feed after footer (in mm)
}: {
  qNumber: string;
  widthMm?: number;
  paddingMm?: number;
  qnumBottomMm?: number;
  footerTopMm?: number;
  tailMm?: number;
}) {
  // Hidden iframe to avoid popup blockers
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    console.error("Unable to access print frame.");
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Queue Ticket</title>
  <style>
    @page { size: ${widthMm}mm auto; margin: 0; }
    @media print { html, body { margin: 0; } }
    html, body {
      margin: 0;
      padding: 0;
      width: ${widthMm}mm;
      background: #ffffff; /* avoid dark-mode bleed */
      color: #000;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      font-family: ui-monospace, Menlo, Monaco, Consolas, 'Courier New', monospace;
    }

    .ticket {
      box-sizing: border-box;
      padding: ${paddingMm}mm;
      /* keep a bottom padding just in case the browser trims margins */
      padding-bottom: ${Math.max(tailMm, paddingMm)}mm;
    }

    .qnum {
      text-align: center;
      font-size: 48px;   /* large and clear */
      font-weight: 900;
      letter-spacing: 2px;
      margin: 10mm 0 ${qnumBottomMm}mm; /* bottom margin under the number */
    }

    /* 1 break line after the number */
    .after-number {
      height: 0;
      line-height: 0;
      margin: 0;
      padding: 0;
    }

    .footer {
      text-align: center;
      margin-top: ${footerTopMm}mm;   /* margin above footer text */
      font-size: 8.5px;               /* microtext */
      line-height: 1.25;
      color: #333;
      letter-spacing: 0.2px;
      white-space: pre-line;          /* preserve line breaks in footer content */
      margin-bottom: 10px;
    }

    /* 2 break lines after the footer */
    .after-footer {
      height: 0;
      line-height: 0;
      margin: 0;
      padding: 0;
    }

    /* Optional: extra feed beyond padding to ensure clean tear */
    .tail {
      height: ${tailMm}mm;
    }
  </style>
</head>
<body>
  <div class="ticket">
    <!-- Queue Number -->
    <div class="qnum">${qNumber}</div>

    <!-- exactly 1 line break after the queue number -->
    <div class="after-number"><br /></div>

    <!-- Footer microtext -->
    <div class="footer">
CENRO BISLIG
Espiritu St. Mangagoy Bislig City Surigao Del Sur.
    </div>

    <!-- at least 2 line breaks after the footer text -->
    <div class="after-footer"><br /><br /></div>
     

    <!-- small extra feed area -->
    <div class="tail"></div>
  </div>
</body>
</html>`);
  doc.close();

  const win = iframe.contentWindow!;
  setTimeout(() => {
    try {
      win.focus();
      win.print();
    } finally {
      setTimeout(() => {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }, 300);
    }
  }, 80);
}
