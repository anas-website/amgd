import { jsPDF } from 'jspdf';

/**
 * One-page landscape PDF: title, optional subtitle lines, viewport screenshot, spec lines.
 * Pass a JPEG data URL (e.g. from viewerSnapshotCanvas).
 */
export function exportConfiguratorPdfReport({
    snapshotDataUrl,
    imageWidth,
    imageHeight,
    title,
    subtitleLines = [],
    specLines = [],
    filename = 'model-report.pdf',
}) {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 11;
    let y = margin;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(28, 32, 38);
    doc.text(title, margin, y + 6);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(90, 96, 106);
    for (const line of subtitleLines) {
        doc.text(String(line), margin, y + 4);
        y += 4;
    }
    y += 4;
    doc.setTextColor(0, 0, 0);

    const headerBottom = y;
    const iw = imageWidth > 0 ? imageWidth : 16;
    const ih = imageHeight > 0 ? imageHeight : 9;
    const aspect = iw / ih;
    const maxW = pageW - 2 * margin;
    const maxH = pageH - headerBottom - margin - 18;
    let imgWmm = maxW;
    let imgHmm = maxW / aspect;
    if (imgHmm > maxH) {
        imgHmm = maxH;
        imgWmm = maxH * aspect;
    }
    const imgX = margin + (maxW - imgWmm) / 2;
    if (!snapshotDataUrl) {
        throw new Error('snapshot');
    }
    doc.addImage(snapshotDataUrl, 'JPEG', imgX, headerBottom, imgWmm, imgHmm);

    let specY = headerBottom + imgHmm + 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(45, 55, 72);
    
    const colWidth = maxW / 2;
    for (let i = 0; i < specLines.length; i++) {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const currentY = specY + (row * 4.2);
        if (currentY > pageH - margin - 4) break;
        doc.text(String(specLines[i]), margin + (col * colWidth), currentY);
    }

    doc.save(filename);
}
