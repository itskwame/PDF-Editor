import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'

const MAX_FREE_DOWNLOADS = 3
const MONTH_KEY = new Date().toISOString().slice(0, 7)
const USAGE_KEY = `freepdfflow-downloads-${MONTH_KEY}`
const DRAFT_KEY = 'freepdfflow-local-draft'
const TOOL_LABELS = ['Text', 'Signature', 'Date', 'Checkbox', 'Highlight', 'Shape', 'Image', 'Draw']
const SCALE = 1.35
const FONT_OPTIONS = [
  { label: 'Helvetica', value: 'Helvetica' },
  { label: 'Times', value: 'TimesRoman' },
  { label: 'Courier', value: 'Courier' },
]
const ALIGN_OPTIONS = ['left', 'center', 'right']

function readUsage() {
  if (typeof window === 'undefined') return 0
  return Number(window.localStorage.getItem(USAGE_KEY) || 0)
}

function saveUsage(count) {
  window.localStorage.setItem(USAGE_KEY, String(count))
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

function pdfColor(hex) {
  const value = hex.replace('#', '')
  const red = parseInt(value.slice(0, 2), 16) / 255
  const green = parseInt(value.slice(2, 4), 16) / 255
  const blue = parseInt(value.slice(4, 6), 16) / 255
  return rgb(red, green, blue)
}

function getPdfFontName(annotation) {
  const family = annotation.fontFamily || 'Helvetica'
  const bold = annotation.bold ? 'Bold' : ''
  const italic = annotation.italic ? 'Italic' : ''

  if (family === 'TimesRoman') {
    if (annotation.bold && annotation.italic) return StandardFonts.TimesRomanBoldItalic
    if (annotation.bold) return StandardFonts.TimesRomanBold
    if (annotation.italic) return StandardFonts.TimesRomanItalic
    return StandardFonts.TimesRoman
  }

  if (family === 'Courier') {
    if (annotation.bold && annotation.italic) return StandardFonts.CourierBoldOblique
    if (annotation.bold) return StandardFonts.CourierBold
    if (annotation.italic) return StandardFonts.CourierOblique
    return StandardFonts.Courier
  }

  if (bold && italic) return StandardFonts.HelveticaBoldOblique
  if (bold) return StandardFonts.HelveticaBold
  if (italic) return StandardFonts.HelveticaOblique
  return StandardFonts.Helvetica
}

function readDraftSummary() {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(DRAFT_KEY)
  if (!raw) return null

  try {
    const draft = JSON.parse(raw)
    return draft?.pdfData ? draft : null
  } catch {
    return null
  }
}

function uint8ToBase64(bytes) {
  let binary = ''
  const chunkSize = 0x8000

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  }

  return btoa(binary)
}

function base64ToUint8(base64) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

export default function Edit() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const canvasRefs = useRef({})
  const renderTasksRef = useRef({})
  const dragRef = useRef(null)
  const drawRef = useRef(null)
  const autosaveRef = useRef(null)

  const [pdfjs, setPdfjs] = useState(null)
  const [pdfDoc, setPdfDoc] = useState(null)
  const [pdfBytes, setPdfBytes] = useState(null)
  const [fileName, setFileName] = useState('edited-document.pdf')
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [tool, setTool] = useState('Text')
  const [annotations, setAnnotations] = useState([])
  const [history, setHistory] = useState({ past: [], future: [] })
  const [selectedId, setSelectedId] = useState(null)
  const [pendingImage, setPendingImage] = useState(null)
  const [imageReplaceTarget, setImageReplaceTarget] = useState(null)
  const [usage, setUsage] = useState(0)
  const [status, setStatus] = useState('Upload a PDF to begin editing.')
  const [isExporting, setIsExporting] = useState(false)
  const [draft, setDraft] = useState(null)
  const [lastSaved, setLastSaved] = useState(null)

  const downloadsLeft = Math.max(MAX_FREE_DOWNLOADS - usage, 0)
  const selected = useMemo(
    () => annotations.find((annotation) => annotation.id === selectedId),
    [annotations, selectedId],
  )

  useEffect(() => {
    setUsage(readUsage())
    setDraft(readDraftSummary())
    import('pdfjs-dist/legacy/build/pdf.mjs').then((module) => {
      module.GlobalWorkerOptions.workerSrc = ''
      setPdfjs(module)
    })
  }, [])

  useEffect(() => {
    if (router.query.tool === 'signature') {
      setTool('Signature')
    }
  }, [router.query.tool])

  useEffect(() => {
    if (!pdfDoc || !pages.length) return

    let cancelled = false

    async function renderPages() {
      for (const pageInfo of pages) {
        const canvas = canvasRefs.current[pageInfo.pageNumber]
        if (!canvas) continue

        if (renderTasksRef.current[pageInfo.pageNumber]) {
          renderTasksRef.current[pageInfo.pageNumber].cancel()
        }

        const page = await pdfDoc.getPage(pageInfo.pageNumber)
        if (cancelled) return

        const viewport = page.getViewport({ scale: SCALE, rotation: pageInfo.rotation || 0 })
        const context = canvas.getContext('2d')
        canvas.width = viewport.width
        canvas.height = viewport.height
        canvas.style.width = `${viewport.width}px`
        canvas.style.height = `${viewport.height}px`

        const task = page.render({ canvasContext: context, viewport })
        renderTasksRef.current[pageInfo.pageNumber] = task

        try {
          await task.promise
        } catch (error) {
          if (error?.name !== 'RenderingCancelledException') {
            setStatus('Could not render one of the PDF pages.')
          }
        }
      }
    }

    renderPages()

    return () => {
      cancelled = true
      Object.values(renderTasksRef.current).forEach((task) => task?.cancel?.())
    }
  }, [pdfDoc, pages])

  useEffect(() => {
    if (!pdfBytes || !pages.length) return

    window.clearTimeout(autosaveRef.current)
    autosaveRef.current = window.setTimeout(() => {
      try {
        const savedAt = new Date().toISOString()
        const draftPayload = {
          annotations,
          currentPage,
          fileName,
          pages,
          pdfData: uint8ToBase64(pdfBytes),
          savedAt,
        }

        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draftPayload))
        setDraft(draftPayload)
        setLastSaved(savedAt)
      } catch {
        setStatus('Autosave failed. Export your PDF to keep a finished copy.')
      }
    }, 700)

    return () => window.clearTimeout(autosaveRef.current)
  }, [annotations, currentPage, fileName, pages, pdfBytes])

  function commitAnnotations(updater, options = {}) {
    setAnnotations((items) => {
      const next = typeof updater === 'function' ? updater(items) : updater

      if (options.recordHistory !== false) {
        setHistory((current) => ({
          past: [...current.past.slice(-24), items],
          future: [],
        }))
      }

      return next
    })
  }

  function undo() {
    setHistory((current) => {
      if (!current.past.length) return current

      const previous = current.past[current.past.length - 1]
      setAnnotations(previous)
      setSelectedId(null)

      return {
        past: current.past.slice(0, -1),
        future: [annotations, ...current.future],
      }
    })
  }

  function redo() {
    setHistory((current) => {
      if (!current.future.length) return current

      const next = current.future[0]
      setAnnotations(next)
      setSelectedId(null)

      return {
        past: [...current.past, annotations],
        future: current.future.slice(1),
      }
    })
  }

  async function loadPdfBytes(bytes, nextFileName, restoredAnnotations = [], nextCurrentPage = 1) {
    if (!pdfjs) {
      setStatus('PDF tools are still loading. Try again in a moment.')
      return
    }

    const loadingTask = pdfjs.getDocument({ data: bytes, disableWorker: true })
    const loadedPdf = await loadingTask.promise
    const loadedPages = []

    for (let pageNumber = 1; pageNumber <= loadedPdf.numPages; pageNumber += 1) {
      const page = await loadedPdf.getPage(pageNumber)
      const viewport = page.getViewport({ scale: SCALE })
      loadedPages.push({
        pageNumber,
        rotation: 0,
        width: viewport.width,
        height: viewport.height,
      })
    }

    setPdfDoc(loadedPdf)
    setPdfBytes(bytes)
    setFileName(nextFileName)
    setPages(loadedPages)
    setCurrentPage(nextCurrentPage)
    setAnnotations(restoredAnnotations)
    setHistory({ past: [], future: [] })
    setSelectedId(null)
    setStatus(`${nextFileName} loaded. Choose a tool, then click the page.`)
  }

  async function handlePdfUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setStatus('Please choose a PDF file.')
      return
    }

    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    await loadPdfBytes(bytes, file.name.replace(/\.pdf$/i, '-edited.pdf'))
  }

  async function restoreDraft() {
    const savedDraft = readDraftSummary()
    if (!savedDraft) {
      setStatus('No saved draft found in this browser.')
      return
    }

    await loadPdfBytes(
      base64ToUint8(savedDraft.pdfData),
      savedDraft.fileName || 'edited-document.pdf',
      savedDraft.annotations || [],
      savedDraft.currentPage || 1,
    )
    setLastSaved(savedDraft.savedAt)
    setStatus(`Restored local draft from ${new Date(savedDraft.savedAt).toLocaleString()}.`)
  }

  function clearDraft() {
    window.localStorage.removeItem(DRAFT_KEY)
    setDraft(null)
    setLastSaved(null)
    setStatus('Local draft cleared.')
  }

  async function rotateCurrentPage() {
    if (!pdfDoc) return
    const pageInfo = pages.find((page) => page.pageNumber === currentPage)
    if (!pageInfo) return

    const nextRotation = ((pageInfo.rotation || 0) + 90) % 360
    const sourcePage = await pdfDoc.getPage(pageInfo.pageNumber)
    const viewport = sourcePage.getViewport({ scale: SCALE, rotation: nextRotation })

    setPages((items) =>
      items.map((page) =>
        page.pageNumber === currentPage
          ? { ...page, rotation: nextRotation, width: viewport.width, height: viewport.height }
          : page,
      ),
    )
    setStatus(`Page ${pageInfo.pageNumber} rotated. Autosave will update the draft.`)
  }

  function deleteCurrentPage() {
    if (!pages.length) return
    const remainingPages = pages.filter((page) => page.pageNumber !== currentPage)
    setPages(remainingPages)
    commitAnnotations((items) => items.filter((annotation) => annotation.pageNumber !== currentPage))
    setCurrentPage(remainingPages[0]?.pageNumber || 1)
    setSelectedId(null)
    setStatus('Page deleted from this edited copy.')
  }

  function moveCurrentPage(direction) {
    const index = pages.findIndex((page) => page.pageNumber === currentPage)
    const target = index + direction

    if (index < 0 || target < 0 || target >= pages.length) return

    setPages((items) => {
      const next = [...items]
      const [page] = next.splice(index, 1)
      next.splice(target, 0, page)
      return next
    })
    setStatus('Page order updated. Autosave will update the draft.')
  }

  function addAnnotation(pageNumber, event) {
    if (!pdfDoc) return
    if (tool === 'Draw') return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const id = crypto.randomUUID()

    let annotation = {
      id,
      pageNumber,
      type: tool,
      x,
      y,
      width: 150,
      height: 42,
      text: '',
      color: '#111827',
      fontSize: 18,
      fontFamily: 'Helvetica',
      bold: false,
      italic: false,
      alignment: 'left',
      opacity: 1,
      borderWidth: 2,
    }

    if (tool === 'Text') {
      annotation.text = window.prompt('Text to add:', 'New text') || 'New text'
    }

    if (tool === 'Signature') {
      annotation.text = window.prompt('Signature text:', 'Your Signature') || 'Your Signature'
      annotation.fontSize = 24
      annotation.fontFamily = 'TimesRoman'
      annotation.italic = true
      annotation.width = 220
      annotation.height = 52
    }

    if (tool === 'Date') {
      annotation.text = new Date().toLocaleDateString()
      annotation.width = 120
    }

    if (tool === 'Checkbox') {
      annotation.width = 28
      annotation.height = 28
    }

    if (tool === 'Highlight') {
      annotation.color = '#facc15'
      annotation.opacity = 0.45
      annotation.width = 190
      annotation.height = 32
    }

    if (tool === 'Shape') {
      annotation.color = '#2563eb'
      annotation.width = 160
      annotation.height = 90
    }

    if (tool === 'Image') {
      if (!pendingImage) {
        imageInputRef.current?.click()
        setStatus('Choose an image, then click the PDF page to place it.')
        return
      }

      annotation.image = pendingImage
      annotation.width = 180
      annotation.height = 120
      setPendingImage(null)
    }

    commitAnnotations((items) => [...items, annotation])
    setSelectedId(id)
  }

  function handleImageUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const imageData = String(reader.result)

      if (imageReplaceTarget) {
        commitAnnotations((items) =>
          items.map((annotation) =>
            annotation.id === imageReplaceTarget ? { ...annotation, image: imageData } : annotation,
          ),
        )
        setImageReplaceTarget(null)
        setStatus('Image replaced. Autosave will update the draft.')
        return
      }

      setPendingImage(imageData)
      setTool('Image')
      setStatus('Image ready. Click a PDF page to place it.')
    }
    reader.readAsDataURL(file)
  }

  function updateAnnotation(id, updates, options = {}) {
    commitAnnotations((items) =>
      items.map((annotation) =>
        annotation.id === id ? { ...annotation, ...updates } : annotation,
      ),
      options,
    )
  }

  function deleteSelected() {
    if (!selectedId) return
    commitAnnotations((items) => items.filter((annotation) => annotation.id !== selectedId))
    setSelectedId(null)
  }

  function startDrag(annotation, event) {
    event.stopPropagation()
    setSelectedId(annotation.id)
    setHistory((current) => ({
      past: [...current.past.slice(-24), annotations],
      future: [],
    }))
    dragRef.current = {
      id: annotation.id,
      startX: event.clientX,
      startY: event.clientY,
      initialX: annotation.x,
      initialY: annotation.y,
    }
  }

  function startResize(annotation, event) {
    event.stopPropagation()
    dragRef.current = {
      id: annotation.id,
      resize: true,
      startX: event.clientX,
      startY: event.clientY,
      initialWidth: annotation.width,
      initialHeight: annotation.height,
    }
  }

  function handlePointerMove(event) {
    const drag = dragRef.current
    if (!drag) return

    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY

    if (drag.resize) {
      updateAnnotation(drag.id, {
        width: Math.max(24, drag.initialWidth + deltaX),
        height: Math.max(24, drag.initialHeight + deltaY),
      }, { recordHistory: false })
      return
    }

    updateAnnotation(drag.id, {
      x: Math.max(0, drag.initialX + deltaX),
      y: Math.max(0, drag.initialY + deltaY),
    }, { recordHistory: false })
  }

  function stopPointerAction() {
    dragRef.current = null
    drawRef.current = null
  }

  function startDrawing(pageNumber, event) {
    if (tool !== 'Draw') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const id = crypto.randomUUID()
    const annotation = {
      id,
      pageNumber,
      type: 'Draw',
      x: 0,
      y: 0,
      width: rect.width,
      height: rect.height,
      color: '#ef4444',
      points: [{ x, y }],
    }

    drawRef.current = id
    commitAnnotations((items) => [...items, annotation])
    setSelectedId(id)
  }

  function continueDrawing(event) {
    if (!drawRef.current) return
    const pageLayer = event.currentTarget
    const rect = pageLayer.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    commitAnnotations((items) =>
      items.map((annotation) =>
        annotation.id === drawRef.current
          ? { ...annotation, points: [...annotation.points, { x, y }] }
          : annotation,
      ),
      { recordHistory: false },
    )
  }

  async function exportPdf() {
    if (!pdfBytes) {
      setStatus('Upload a PDF before exporting.')
      return
    }

    if (downloadsLeft <= 0) {
      setStatus('You have used your 3 free PDF downloads this month. Upgrade to keep downloading today.')
      return
    }

    setIsExporting(true)
    setStatus('Exporting your edited PDF...')

    try {
      const sourcePdf = await PDFDocument.load(pdfBytes)
      const outputPdf = await PDFDocument.create()
      const copiedPages = await outputPdf.copyPages(
        sourcePdf,
        pages.map((page) => page.pageNumber - 1),
      )

      copiedPages.forEach((page, index) => {
        if (pages[index]?.rotation) {
          page.setRotation(degrees(pages[index].rotation))
        }
        outputPdf.addPage(page)
      })

      const outputPages = outputPdf.getPages()

      for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
        const pageMeta = pages[pageIndex]
        const page = outputPages[pageIndex]
        if (!page) continue

        const pageAnnotations = annotations.filter(
          (annotation) => annotation.pageNumber === pageMeta.pageNumber,
        )

        for (const annotation of pageAnnotations) {

        const { width: pdfWidth, height: pdfHeight } = page.getSize()
        const scaleX = pdfWidth / pageMeta.width
        const scaleY = pdfHeight / pageMeta.height
        const x = annotation.x * scaleX
        const y = pdfHeight - (annotation.y + annotation.height) * scaleY
        const width = annotation.width * scaleX
        const height = annotation.height * scaleY

        if (['Text', 'Signature', 'Date'].includes(annotation.type)) {
          const font = await outputPdf.embedFont(getPdfFontName(annotation))
          const fontSize = annotation.fontSize * scaleY
          const textWidth = font.widthOfTextAtSize(annotation.text || '', fontSize)
          const textX =
            annotation.alignment === 'center'
              ? x + Math.max((width - textWidth) / 2, 0)
              : annotation.alignment === 'right'
                ? x + Math.max(width - textWidth, 0)
                : x

          page.drawText(annotation.text || '', {
            x: textX,
            y: y + height * 0.25,
            size: fontSize,
            font,
            color: pdfColor(annotation.color),
            opacity: annotation.opacity ?? 1,
          })
        }

        if (annotation.type === 'Checkbox') {
          page.drawRectangle({
            x,
            y,
            width,
            height,
            borderColor: rgb(0.1, 0.16, 0.26),
            borderWidth: annotation.borderWidth || 1.5,
          })
          page.drawText('X', {
            x: x + width * 0.22,
            y: y + height * 0.12,
            size: height * 0.75,
            color: rgb(0.1, 0.16, 0.26),
          })
        }

        if (annotation.type === 'Highlight') {
          page.drawRectangle({
            x,
            y,
            width,
            height,
            color: pdfColor(annotation.color),
            opacity: annotation.opacity ?? 0.35,
          })
        }

        if (annotation.type === 'Shape') {
          page.drawRectangle({
            x,
            y,
            width,
            height,
            borderColor: pdfColor(annotation.color),
            borderWidth: annotation.borderWidth || 2,
            opacity: annotation.opacity ?? 1,
          })
        }

        if (annotation.type === 'Image' && annotation.image) {
          const imageBytes = await fetch(annotation.image).then((response) => response.arrayBuffer())
          const image = annotation.image.startsWith('data:image/png')
            ? await outputPdf.embedPng(imageBytes)
            : await outputPdf.embedJpg(imageBytes)
          page.drawImage(image, { x, y, width, height, opacity: annotation.opacity ?? 1 })
        }

        if (annotation.type === 'Draw' && annotation.points?.length > 1) {
          for (let index = 1; index < annotation.points.length; index += 1) {
            const start = annotation.points[index - 1]
            const end = annotation.points[index]
            page.drawLine({
              start: { x: start.x * scaleX, y: pdfHeight - start.y * scaleY },
              end: { x: end.x * scaleX, y: pdfHeight - end.y * scaleY },
              thickness: annotation.borderWidth || 2,
              color: pdfColor(annotation.color),
              opacity: annotation.opacity ?? 1,
            })
          }
        }
        }
      }

      const bytes = await outputPdf.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), fileName)
      const nextUsage = usage + 1
      saveUsage(nextUsage)
      setUsage(nextUsage)
      setStatus(`Export complete. Free downloads left: ${Math.max(MAX_FREE_DOWNLOADS - nextUsage, 0)} of 3.`)
    } catch (error) {
      setStatus(`Export failed: ${error.message}`)
    } finally {
      setIsExporting(false)
    }
  }

  function renderAnnotation(annotation) {
    const isSelected = annotation.id === selectedId
    const commonStyle = {
      position: 'absolute',
      left: annotation.x,
      top: annotation.y,
      width: annotation.width,
      height: annotation.height,
      cursor: 'move',
      outline: isSelected ? '2px solid #2563eb' : '1px solid transparent',
      outlineOffset: 2,
      userSelect: 'none',
    }

    return (
      <div
        key={annotation.id}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => startDrag(annotation, event)}
        style={commonStyle}
      >
        {['Text', 'Signature', 'Date'].includes(annotation.type) ? (
          <div
            style={{
              color: annotation.color,
              fontFamily:
                annotation.fontFamily === 'TimesRoman'
                  ? 'Georgia, serif'
                  : annotation.fontFamily === 'Courier'
                    ? '"Courier New", monospace'
                    : 'Arial, sans-serif',
              fontSize: annotation.fontSize,
              fontStyle: annotation.italic ? 'italic' : 'normal',
              fontWeight: annotation.bold ? 800 : annotation.type === 'Signature' ? 600 : 500,
              lineHeight: `${annotation.height}px`,
              opacity: annotation.opacity ?? 1,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textAlign: annotation.alignment || 'left',
            }}
          >
            {annotation.text}
          </div>
        ) : null}

        {annotation.type === 'Checkbox' ? (
          <div
            style={{
              alignItems: 'center',
              border: `${annotation.borderWidth || 2}px solid #111827`,
              display: 'flex',
              fontSize: 22,
              fontWeight: 900,
              height: '100%',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            X
          </div>
        ) : null}

        {annotation.type === 'Highlight' ? (
          <div style={{ background: annotation.color, height: '100%', opacity: annotation.opacity ?? 0.45, width: '100%' }} />
        ) : null}

        {annotation.type === 'Shape' ? (
          <div style={{ border: `${annotation.borderWidth || 2}px solid ${annotation.color}`, height: '100%', opacity: annotation.opacity ?? 1, width: '100%' }} />
        ) : null}

        {annotation.type === 'Image' ? (
          <img alt="" src={annotation.image} style={{ height: '100%', objectFit: 'contain', opacity: annotation.opacity ?? 1, width: '100%' }} />
        ) : null}

        {annotation.type === 'Draw' ? (
          <svg height="100%" width="100%" viewBox={`0 0 ${annotation.width} ${annotation.height}`}>
            <polyline
              fill="none"
              points={(annotation.points || []).map((point) => `${point.x},${point.y}`).join(' ')}
              stroke={annotation.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={annotation.borderWidth || 2}
              opacity={annotation.opacity ?? 1}
            />
          </svg>
        ) : null}

        {isSelected ? (
          <button
            aria-label="Resize annotation"
            onPointerDown={(event) => startResize(annotation, event)}
            style={{
              background: '#2563eb',
              border: 0,
              borderRadius: 999,
              bottom: -8,
              cursor: 'nwse-resize',
              height: 16,
              position: 'absolute',
              right: -8,
              width: 16,
            }}
          />
        ) : null}
      </div>
    )
  }

  return (
    <main
      onPointerMove={handlePointerMove}
      onPointerUp={stopPointerAction}
      style={{ background: '#eef2f7', color: '#0f172a', minHeight: '100vh' }}
    >
      <header
        style={{
          alignItems: 'center',
          background: '#fff',
          borderBottom: '1px solid #dbe3ef',
          display: 'flex',
          gap: 16,
          justifyContent: 'space-between',
          padding: '14px 22px',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <div>
          <strong style={{ fontSize: 20 }}>FreePDFFlow</strong>
          <span style={{ color: '#64748b', marginLeft: 12 }}>{fileName}</span>
          <span style={{ color: '#64748b', marginLeft: 12 }}>
            {lastSaved ? `Autosaved ${new Date(lastSaved).toLocaleTimeString()}` : 'Autosave ready'}
          </span>
        </div>
        <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
          <button
            onClick={undo}
            disabled={!history.past.length}
            style={{
              background: history.past.length ? '#fff' : '#e2e8f0',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              color: '#0f172a',
              cursor: history.past.length ? 'pointer' : 'not-allowed',
              fontWeight: 800,
              padding: '10px 12px',
            }}
          >
            Undo
          </button>
          <button
            onClick={redo}
            disabled={!history.future.length}
            style={{
              background: history.future.length ? '#fff' : '#e2e8f0',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              color: '#0f172a',
              cursor: history.future.length ? 'pointer' : 'not-allowed',
              fontWeight: 800,
              padding: '10px 12px',
            }}
          >
            Redo
          </button>
          <span style={{ color: downloadsLeft ? '#166534' : '#b91c1c', fontWeight: 800 }}>
            Free downloads left: {downloadsLeft} of 3
          </span>
          <button
            onClick={exportPdf}
            disabled={!pdfBytes || isExporting}
            style={{
              background: !pdfBytes ? '#94a3b8' : downloadsLeft <= 0 ? '#b91c1c' : '#2563eb',
              border: 0,
              borderRadius: 8,
              color: '#fff',
              cursor: !pdfBytes ? 'not-allowed' : 'pointer',
              fontWeight: 900,
              padding: '11px 16px',
            }}
          >
            {isExporting ? 'Exporting...' : 'Download PDF'}
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '230px minmax(0, 1fr) 280px', minHeight: 'calc(100vh - 61px)' }}>
        <aside style={{ background: '#fff', borderRight: '1px solid #dbe3ef', padding: 16 }}>
          <input
            ref={fileInputRef}
            accept="application/pdf,.pdf"
            onChange={handlePdfUpload}
            style={{ display: 'none' }}
            type="file"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: '#0f172a',
              border: 0,
              borderRadius: 8,
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 900,
              padding: '12px 14px',
              width: '100%',
            }}
          >
            Choose PDF File
          </button>

          {draft ? (
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 10,
                marginTop: 12,
                padding: 12,
              }}
            >
              <p style={{ color: '#475569', fontSize: 13, lineHeight: 1.5, margin: '0 0 10px' }}>
                Saved draft from {new Date(draft.savedAt).toLocaleString()}
              </p>
              <button
                onClick={restoreDraft}
                style={{
                  background: '#2563eb',
                  border: 0,
                  borderRadius: 8,
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 900,
                  padding: '9px 10px',
                  width: '100%',
                }}
              >
                Restore draft
              </button>
              <button
                onClick={clearDraft}
                style={{
                  background: '#fff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 8,
                  color: '#475569',
                  cursor: 'pointer',
                  fontWeight: 800,
                  marginTop: 8,
                  padding: '8px 10px',
                  width: '100%',
                }}
              >
                Clear draft
              </button>
            </div>
          ) : null}

          <h2 style={{ fontSize: 13, margin: '22px 0 10px', textTransform: 'uppercase' }}>Pages</h2>
          {pages.length ? (
            <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
              <button
                onClick={rotateCurrentPage}
                style={{
                  background: '#fff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 800,
                  padding: '9px 10px',
                }}
              >
                Rotate page
              </button>
              <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
                <button
                  onClick={() => moveCurrentPage(-1)}
                  style={{
                    background: '#fff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 800,
                    padding: '9px 10px',
                  }}
                >
                  Move up
                </button>
                <button
                  onClick={() => moveCurrentPage(1)}
                  style={{
                    background: '#fff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 800,
                    padding: '9px 10px',
                  }}
                >
                  Move down
                </button>
              </div>
              <button
                onClick={deleteCurrentPage}
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 8,
                  color: '#b91c1c',
                  cursor: 'pointer',
                  fontWeight: 900,
                  padding: '9px 10px',
                }}
              >
                Delete page
              </button>
            </div>
          ) : null}
          <div style={{ display: 'grid', gap: 10 }}>
            {pages.map((page) => (
              <button
                key={page.pageNumber}
                onClick={() => setCurrentPage(page.pageNumber)}
                style={{
                  background: currentPage === page.pageNumber ? '#eff6ff' : '#f8fafc',
                  border: currentPage === page.pageNumber ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  borderRadius: 8,
                  cursor: 'pointer',
                  padding: 12,
                  textAlign: 'left',
                }}
              >
                Page {page.pageNumber}
                {page.rotation ? ` (${page.rotation} deg)` : ''}
              </button>
            ))}
          </div>
        </aside>

        <section style={{ overflow: 'auto', padding: 24 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {TOOL_LABELS.map((label) => (
              <button
                key={label}
                onClick={() => {
                  setTool(label)
                  if (label === 'Image' && !pendingImage) imageInputRef.current?.click()
                }}
                style={{
                  background: tool === label ? '#2563eb' : '#fff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 999,
                  color: tool === label ? '#fff' : '#334155',
                  cursor: 'pointer',
                  fontWeight: 800,
                  padding: '9px 13px',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <input
            ref={imageInputRef}
            accept="image/png,image/jpeg"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            type="file"
          />

          <p style={{ color: '#475569', fontWeight: 700, margin: '0 0 16px' }}>{status}</p>

          {!pages.length ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                alignItems: 'center',
                background: '#fff',
                border: '2px dashed #94a3b8',
                borderRadius: 16,
                cursor: 'pointer',
                display: 'flex',
                height: 360,
                justifyContent: 'center',
                margin: '40px auto',
                maxWidth: 720,
                textAlign: 'center',
              }}
            >
              <div>
                <h1 style={{ fontSize: 34, margin: 0 }}>Upload a PDF</h1>
                <p style={{ color: '#64748b', fontSize: 18 }}>Render, annotate, and export locally in your browser.</p>
              </div>
            </div>
          ) : null}

          {pages.map((page) => (
            <div
              key={page.pageNumber}
              style={{
                display: currentPage === page.pageNumber ? 'block' : 'none',
                margin: '0 auto',
                position: 'relative',
                width: page.width,
              }}
            >
              <div
                onClick={(event) => addAnnotation(page.pageNumber, event)}
                onPointerDown={(event) => startDrawing(page.pageNumber, event)}
                onPointerMove={continueDrawing}
                style={{
                  background: '#fff',
                  boxShadow: '0 18px 48px rgba(15, 23, 42, 0.18)',
                  height: page.height,
                  position: 'relative',
                  width: page.width,
                }}
              >
                <canvas ref={(canvas) => { canvasRefs.current[page.pageNumber] = canvas }} />
                <div style={{ inset: 0, position: 'absolute' }}>
                  {annotations
                    .filter((annotation) => annotation.pageNumber === page.pageNumber)
                    .map(renderAnnotation)}
                </div>
              </div>
            </div>
          ))}
        </section>

        <aside style={{ background: '#fff', borderLeft: '1px solid #dbe3ef', padding: 16 }}>
          <h2 style={{ fontSize: 18, marginTop: 0 }}>Settings</h2>
          {selected ? (
            <div style={{ display: 'grid', gap: 12 }}>
              <strong>{selected.type}</strong>

              {['Text', 'Signature', 'Date'].includes(selected.type) ? (
                <>
                  <label style={{ display: 'grid', gap: 6, fontWeight: 800 }}>
                    Text
                    <input
                      value={selected.text}
                      onChange={(event) => updateAnnotation(selected.id, { text: event.target.value })}
                      style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 10 }}
                    />
                  </label>
                  <label style={{ display: 'grid', gap: 6, fontWeight: 800 }}>
                    Font
                    <select
                      value={selected.fontFamily || 'Helvetica'}
                      onChange={(event) => updateAnnotation(selected.id, { fontFamily: event.target.value })}
                      style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 10 }}
                    >
                      {FONT_OPTIONS.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
                    <button
                      onClick={() => updateAnnotation(selected.id, { bold: !selected.bold })}
                      style={{
                        background: selected.bold ? '#2563eb' : '#fff',
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        color: selected.bold ? '#fff' : '#0f172a',
                        cursor: 'pointer',
                        fontWeight: 900,
                        padding: 10,
                      }}
                    >
                      Bold
                    </button>
                    <button
                      onClick={() => updateAnnotation(selected.id, { italic: !selected.italic })}
                      style={{
                        background: selected.italic ? '#2563eb' : '#fff',
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        color: selected.italic ? '#fff' : '#0f172a',
                        cursor: 'pointer',
                        fontStyle: 'italic',
                        fontWeight: 800,
                        padding: 10,
                      }}
                    >
                      Italic
                    </button>
                  </div>
                  <label style={{ display: 'grid', gap: 6, fontWeight: 800 }}>
                    Alignment
                    <select
                      value={selected.alignment || 'left'}
                      onChange={(event) => updateAnnotation(selected.id, { alignment: event.target.value })}
                      style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 10 }}
                    >
                      {ALIGN_OPTIONS.map((alignment) => (
                        <option key={alignment} value={alignment}>
                          {alignment}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label style={{ display: 'grid', gap: 6, fontWeight: 800 }}>
                    Font size
                    <input
                      min="8"
                      max="72"
                      type="number"
                      value={selected.fontSize}
                      onChange={(event) => updateAnnotation(selected.id, { fontSize: Number(event.target.value) })}
                      style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 10 }}
                    />
                  </label>
                </>
              ) : null}

              {selected.type === 'Image' ? (
                <button
                  onClick={() => {
                    setImageReplaceTarget(selected.id)
                    imageInputRef.current?.click()
                  }}
                  style={{
                    background: '#2563eb',
                    border: 0,
                    borderRadius: 8,
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 900,
                    padding: '11px 14px',
                  }}
                >
                  Replace image
                </button>
              ) : null}

              {selected.type !== 'Image' && selected.type !== 'Checkbox' ? (
                <label style={{ display: 'grid', gap: 6, fontWeight: 800 }}>
                  Color
                  <input
                    type="color"
                    value={selected.color}
                    onChange={(event) => updateAnnotation(selected.id, { color: event.target.value })}
                    style={{ height: 42 }}
                  />
                </label>
              ) : null}

              {['Shape', 'Draw', 'Checkbox'].includes(selected.type) ? (
                <label style={{ display: 'grid', gap: 6, fontWeight: 800 }}>
                  Border thickness
                  <input
                    min="1"
                    max="16"
                    type="number"
                    value={selected.borderWidth || 2}
                    onChange={(event) => updateAnnotation(selected.id, { borderWidth: Number(event.target.value) })}
                    style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 10 }}
                  />
                </label>
              ) : null}

              <label style={{ display: 'grid', gap: 6, fontWeight: 800 }}>
                Opacity
                <input
                  min="0.1"
                  max="1"
                  step="0.05"
                  type="range"
                  value={selected.opacity ?? 1}
                  onChange={(event) => updateAnnotation(selected.id, { opacity: Number(event.target.value) })}
                />
              </label>

              <label style={{ display: 'grid', gap: 6, fontWeight: 800 }}>
                Width
                <input
                  min="20"
                  type="number"
                  value={Math.round(selected.width)}
                  onChange={(event) => updateAnnotation(selected.id, { width: Number(event.target.value) })}
                  style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 10 }}
                />
              </label>
              <label style={{ display: 'grid', gap: 6, fontWeight: 800 }}>
                Height
                <input
                  min="20"
                  type="number"
                  value={Math.round(selected.height)}
                  onChange={(event) => updateAnnotation(selected.id, { height: Number(event.target.value) })}
                  style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 10 }}
                />
              </label>
              <button
                onClick={deleteSelected}
                style={{
                  background: '#dc2626',
                  border: 0,
                  borderRadius: 8,
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 900,
                  padding: '11px 14px',
                }}
              >
                Delete selected
              </button>
            </div>
          ) : (
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
              Select an annotation to edit its text, color, size, or delete it.
            </p>
          )}

          <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '22px 0' }} />
          <p style={{ color: '#475569', lineHeight: 1.6 }}>
            Usage count is local for this browser and increments only after a successful PDF export.
          </p>
        </aside>
      </div>
    </main>
  )
}
