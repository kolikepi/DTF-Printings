'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer, Rect } from 'react-konva';
import Konva from 'konva';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Upload,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Trash2,
  Download,
  Move,
  FlipHorizontal,
  FlipVertical,
} from 'lucide-react';

// Product mockup templates with predefined print zones
const MOCKUP_TEMPLATES = [
  {
    id: 'white-tshirt',
    name: 'White T-Shirt',
    nameAl: 'Bluzë e bardhë',
    image: '/mockups/white_tshirt.png',
    printAreas: {
      'front-center': { x: 0.30, y: 0.25, w: 0.40, h: 0.35, label: 'Front Center', labelAl: 'Qendër, para' },
      'left-chest': { x: 0.30, y: 0.22, w: 0.18, h: 0.12, label: 'Left Chest', labelAl: 'Gjoksi majtas' },
      'full-front': { x: 0.20, y: 0.18, w: 0.60, h: 0.50, label: 'Full Front', labelAl: 'Pjesa e përparme' },
    },
  },
  {
    id: 'black-tshirt',
    name: 'Black T-Shirt',
    nameAl: 'Bluzë e zezë',
    image: '/mockups/black_tshirt.png',
    printAreas: {
      'front-center': { x: 0.30, y: 0.25, w: 0.40, h: 0.35, label: 'Front Center', labelAl: 'Qendër, para' },
      'left-chest': { x: 0.30, y: 0.22, w: 0.18, h: 0.12, label: 'Left Chest', labelAl: 'Gjoksi majtas' },
      'full-front': { x: 0.20, y: 0.18, w: 0.60, h: 0.50, label: 'Full Front', labelAl: 'Pjesa e përparme' },
    },
  },
  {
    id: 'black-hoodie',
    name: 'Black Hoodie',
    nameAl: 'Hoodie e zezë',
    image: '/mockups/black_hoodie.png',
    printAreas: {
      'front-center': { x: 0.28, y: 0.30, w: 0.44, h: 0.30, label: 'Front Center', labelAl: 'Qendër, para' },
      'left-chest': { x: 0.28, y: 0.26, w: 0.18, h: 0.12, label: 'Left Chest', labelAl: 'Gjoksi majtas' },
      'full-front': { x: 0.18, y: 0.22, w: 0.64, h: 0.45, label: 'Full Front', labelAl: 'Pjesa e përparme' },
    },
  },
  {
    id: 'gray-sweatshirt',
    name: 'Gray Sweatshirt',
    nameAl: 'Sweatshirt gri',
    image: '/mockups/gray_sweatshirt.png',
    printAreas: {
      'front-center': { x: 0.28, y: 0.28, w: 0.44, h: 0.32, label: 'Front Center', labelAl: 'Qendër, para' },
      'left-chest': { x: 0.28, y: 0.24, w: 0.18, h: 0.12, label: 'Left Chest', labelAl: 'Gjoksi majtas' },
      'full-front': { x: 0.18, y: 0.20, w: 0.64, h: 0.48, label: 'Full Front', labelAl: 'Pjesa e përparme' },
    },
  },
  {
    id: 'white-polo',
    name: 'White Polo',
    nameAl: 'Polo e bardhë',
    image: '/mockups/white_polo.png',
    printAreas: {
      'front-center': { x: 0.30, y: 0.28, w: 0.40, h: 0.30, label: 'Front Center', labelAl: 'Qendër, para' },
      'left-chest': { x: 0.30, y: 0.24, w: 0.18, h: 0.12, label: 'Left Chest', labelAl: 'Gjoksi majtas' },
      'full-front': { x: 0.22, y: 0.20, w: 0.56, h: 0.44, label: 'Full Front', labelAl: 'Pjesa e përparme' },
    },
  },
];

interface DesignState {
  image: HTMLImageElement | null;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

function useImage(src: string): [HTMLImageElement | null, string] {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [status, setStatus] = useState<string>('loading');

  useEffect(() => {
    if (!src) { setImage(null); setStatus('idle'); return; }
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { setImage(img); setStatus('loaded'); };
    img.onerror = () => { setImage(null); setStatus('error'); };
    img.src = src;
    return () => { img.onload = null; img.onerror = null; };
  }, [src]);

  return [image, status];
}

export default function MockupDesigner() {
  const { lang } = useLanguage();
  const stageRef = useRef<Konva.Stage>(null);
  const designRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 600 });
  const [selectedTemplate, setSelectedTemplate] = useState(MOCKUP_TEMPLATES[0]);
  const [selectedPrintArea, setSelectedPrintArea] = useState('front-center');
  const [designSrc, setDesignSrc] = useState<string>('');
  const [designState, setDesignState] = useState<DesignState>({
    image: null, x: 0, y: 0, width: 200, height: 200, rotation: 0, scaleX: 1, scaleY: 1,
  });
  const [showPrintZone, setShowPrintZone] = useState(true);
  const [isSelected, setIsSelected] = useState(false);

  const [mockupImage, mockupStatus] = useImage(selectedTemplate.image);
  const [designImage, designStatus] = useImage(designSrc);

  // Responsive canvas sizing
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('mockup-canvas-container');
      if (container) {
        const w = Math.min(container.offsetWidth, 700);
        setCanvasSize({ width: w, height: w });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Attach transformer to design
  useEffect(() => {
    if (isSelected && transformerRef.current && designRef.current) {
      transformerRef.current.nodes([designRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, designSrc]);

  // Center design in print area when loading or changing template/area
  useEffect(() => {
    if (!designImage) return;
    const area = selectedTemplate.printAreas[selectedPrintArea as keyof typeof selectedTemplate.printAreas];
    if (!area) return;

    const zoneW = area.w * canvasSize.width;
    const zoneH = area.h * canvasSize.height;
    const zoneX = area.x * canvasSize.width;
    const zoneY = area.y * canvasSize.height;

    // Fit design within print zone maintaining aspect ratio
    const imgRatio = designImage.naturalWidth / designImage.naturalHeight;
    let fitW = zoneW * 0.8;
    let fitH = fitW / imgRatio;
    if (fitH > zoneH * 0.8) {
      fitH = zoneH * 0.8;
      fitW = fitH * imgRatio;
    }

    setDesignState({
      image: designImage,
      x: zoneX + (zoneW - fitW) / 2,
      y: zoneY + (zoneH - fitH) / 2,
      width: fitW,
      height: fitH,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    });
    setIsSelected(true);
  }, [designImage, selectedTemplate, selectedPrintArea, canvasSize]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev?.target?.result;
      if (typeof result === 'string') {
        setDesignSrc(result);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be re-uploaded
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRotate = (deg: number) => {
    setDesignState(prev => ({ ...prev, rotation: (prev.rotation + deg) % 360 }));
  };

  const handleScale = (factor: number) => {
    setDesignState(prev => ({
      ...prev,
      scaleX: Math.max(0.1, prev.scaleX * factor),
      scaleY: Math.max(0.1, prev.scaleY * factor),
    }));
  };

  const handleFlip = (axis: 'x' | 'y') => {
    if (axis === 'x') {
      setDesignState(prev => ({ ...prev, scaleX: prev.scaleX * -1 }));
    } else {
      setDesignState(prev => ({ ...prev, scaleY: prev.scaleY * -1 }));
    }
  };

  const handleRemoveDesign = () => {
    setDesignSrc('');
    setDesignState({ image: null, x: 0, y: 0, width: 200, height: 200, rotation: 0, scaleX: 1, scaleY: 1 });
    setIsSelected(false);
  };

  const handleExport = useCallback(() => {
    if (!stageRef.current) return;
    // Deselect to hide transformer during export
    setIsSelected(false);
    setShowPrintZone(false);
    setTimeout(() => {
      if (!stageRef.current) return;
      const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
      const a = document.createElement('a');
      a.href = uri;
      a.download = `elev8-mockup-${selectedTemplate.id}.png`;
      a.click();
      setShowPrintZone(true);
    }, 100);
  }, [selectedTemplate.id]);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setDesignState(prev => ({
      ...prev,
      x: e.target.x(),
      y: e.target.y(),
    }));
  };

  const handleTransformEnd = () => {
    const node = designRef.current;
    if (!node) return;
    setDesignState(prev => ({
      ...prev,
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
    }));
  };

  const currentPrintArea = selectedTemplate.printAreas[selectedPrintArea as keyof typeof selectedTemplate.printAreas];

  const texts = {
    title: lang === 'sq' ? 'Dizajnuesi i mockup-eve' : 'Mockup Designer',
    subtitle: lang === 'sq'
      ? 'Ngarko logon ose dizajnin tënd dhe shiko live si do të duket në produkt.'
      : 'Upload your logo or design and see a live preview on the product.',
    uploadDesign: lang === 'sq' ? 'Ngarko dizajnin' : 'Upload Design',
    changeDesign: lang === 'sq' ? 'Ndrysho dizajnin' : 'Change Design',
    selectProduct: lang === 'sq' ? 'Zgjidh produktin' : 'Select Product',
    printArea: lang === 'sq' ? 'Zona e printimit' : 'Print Area',
    tools: lang === 'sq' ? 'Mjetet' : 'Tools',
    rotateLeft: lang === 'sq' ? 'Rrotullo majtas' : 'Rotate Left',
    rotateRight: lang === 'sq' ? 'Rrotullo djathtas' : 'Rotate Right',
    zoomIn: lang === 'sq' ? 'Zmadho' : 'Zoom In',
    zoomOut: lang === 'sq' ? 'Zvogëlo' : 'Zoom Out',
    flipH: lang === 'sq' ? 'Pasqyro horizontalisht' : 'Flip Horizontal',
    flipV: lang === 'sq' ? 'Pasqyro vertikalisht' : 'Flip Vertical',
    remove: lang === 'sq' ? 'Hiq dizajnin' : 'Remove Design',
    download: lang === 'sq' ? 'Shkarko mockup-in' : 'Download Mockup',
    dragHint: lang === 'sq'
      ? 'Kliko dhe tërhiq për të lëvizur. Përdor dorezat për të ndryshuar madhësinë dhe rotacionin.'
      : 'Click and drag to move. Use handles to resize and rotate.',
    uploadHint: lang === 'sq'
      ? 'Ngarko një skedar PNG me sfond transparent për rezultat më të mirë.'
      : 'Upload a PNG file with transparent background for best results.',
    showZone: lang === 'sq' ? 'Shfaq zonën' : 'Show Zone',
    hideZone: lang === 'sq' ? 'Fshih zonën' : 'Hide Zone',
    requestQuote: lang === 'sq' ? 'Kërko ofertë' : 'Request Quote',
    orderNow: lang === 'sq' ? 'Porosit tani' : 'Order Now',
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-[1400px] px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {texts.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{texts.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
          {/* Canvas Area */}
          <div>
            <Card className="overflow-hidden">
              <div id="mockup-canvas-container" className="w-full bg-gray-50 flex items-center justify-center p-4">
                <Stage
                  ref={stageRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  onClick={(e: Konva.KonvaEventObject<MouseEvent>) => {
                    // Deselect when clicking on empty area
                    if (e.target === e.target.getStage()) {
                      setIsSelected(false);
                    }
                  }}
                >
                  <Layer>
                    {/* Background */}
                    <Rect x={0} y={0} width={canvasSize.width} height={canvasSize.height} fill="#f9fafb" />

                    {/* Product mockup image */}
                    {mockupImage && mockupStatus === 'loaded' && (
                      <KonvaImage
                        image={mockupImage}
                        x={0}
                        y={0}
                        width={canvasSize.width}
                        height={canvasSize.height}
                        listening={false}
                      />
                    )}

                    {/* Print zone indicator */}
                    {showPrintZone && currentPrintArea && (
                      <Rect
                        x={currentPrintArea.x * canvasSize.width}
                        y={currentPrintArea.y * canvasSize.height}
                        width={currentPrintArea.w * canvasSize.width}
                        height={currentPrintArea.h * canvasSize.height}
                        stroke="#2563EB"
                        strokeWidth={1.5}
                        dash={[8, 4]}
                        cornerRadius={4}
                        opacity={0.6}
                        listening={false}
                      />
                    )}

                    {/* User's design overlay */}
                    {designImage && designStatus === 'loaded' && (
                      <KonvaImage
                        ref={designRef}
                        image={designImage}
                        x={designState.x}
                        y={designState.y}
                        width={designState.width}
                        height={designState.height}
                        rotation={designState.rotation}
                        scaleX={designState.scaleX}
                        scaleY={designState.scaleY}
                        draggable
                        onClick={() => setIsSelected(true)}
                        onTap={() => setIsSelected(true)}
                        onDragEnd={handleDragEnd}
                        onTransformEnd={handleTransformEnd}
                        offsetX={0}
                        offsetY={0}
                      />
                    )}

                    {/* Transformer for resize/rotate */}
                    {isSelected && designSrc && (
                      <Transformer
                        ref={transformerRef}
                        rotateEnabled={true}
                        enabledAnchors={[
                          'top-left', 'top-right', 'bottom-left', 'bottom-right',
                          'middle-left', 'middle-right', 'top-center', 'bottom-center',
                        ]}
                        borderStroke="#2563EB"
                        borderStrokeWidth={2}
                        anchorStroke="#2563EB"
                        anchorFill="#fff"
                        anchorSize={10}
                        anchorCornerRadius={2}
                        boundBoxFunc={(oldBox: any, newBox: any) => {
                          if (Math.abs(newBox.width) < 20 || Math.abs(newBox.height) < 20) return oldBox;
                          return newBox;
                        }}
                      />
                    )}
                  </Layer>
                </Stage>
              </div>

              {/* Hint text below canvas */}
              {designSrc && (
                <div className="px-4 py-3 bg-blue-50 border-t border-blue-100">
                  <p className="text-xs text-blue-700 flex items-center gap-2">
                    <Move className="h-3.5 w-3.5 flex-shrink-0" />
                    {texts.dragHint}
                  </p>
                </div>
              )}
            </Card>

            {/* Action buttons under canvas */}
            {designSrc && (
              <div className="flex flex-wrap gap-3 mt-4">
                <Button onClick={handleExport} className="flex-1 min-w-[140px]">
                  <Download className="h-4 w-4 mr-2" /> {texts.download}
                </Button>
                <Button variant="outline" asChild className="flex-1 min-w-[140px]">
                  <a href="/quote">{texts.requestQuote}</a>
                </Button>
                <Button variant="outline" asChild className="flex-1 min-w-[140px]">
                  <a href="/products">{texts.orderNow}</a>
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar Controls */}
          <div className="space-y-5">
            {/* Upload */}
            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-3">{texts.uploadDesign}</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.svg,.webp"
                onChange={handleFileUpload}
                className="hidden"
                id="mockup-design-upload"
              />
              <label htmlFor="mockup-design-upload" className="block">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">
                    {designSrc ? texts.changeDesign : texts.uploadDesign}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{texts.uploadHint}</p>
                </div>
              </label>
            </Card>

            {/* Product Selection */}
            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-3">{texts.selectProduct}</h3>
              <div className="grid grid-cols-3 gap-2">
                {MOCKUP_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedTemplate.id === tpl.id
                        ? 'border-primary shadow-md'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={tpl.image}
                      alt={lang === 'sq' ? tpl.nameAl : tpl.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedTemplate.id === tpl.id && (
                      <div className="absolute inset-0 bg-primary/10 flex items-end">
                        <span className="w-full text-[10px] font-medium text-center bg-primary text-white py-0.5">
                          {lang === 'sq' ? tpl.nameAl : tpl.name}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </Card>

            {/* Print Area Selection */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">{texts.printArea}</h3>
                <button
                  onClick={() => setShowPrintZone(!showPrintZone)}
                  className="text-xs text-primary hover:underline"
                >
                  {showPrintZone ? texts.hideZone : texts.showZone}
                </button>
              </div>
              <div className="flex flex-col gap-1.5">
                {Object.entries(selectedTemplate.printAreas).map(([key, area]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPrintArea(key)}
                    className={`px-3 py-2 text-sm rounded-md text-left transition-all ${
                      selectedPrintArea === key
                        ? 'bg-primary text-white font-medium'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    {lang === 'sq' ? (area as any).labelAl : (area as any).label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Tools */}
            {designSrc && (
              <Card className="p-5">
                <h3 className="font-semibold text-sm mb-3">{texts.tools}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleRotate(-15)} title={texts.rotateLeft}>
                    <RotateCcw className="h-4 w-4 mr-1.5" />
                    <span className="text-xs">-15°</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleRotate(15)} title={texts.rotateRight}>
                    <RotateCw className="h-4 w-4 mr-1.5" />
                    <span className="text-xs">+15°</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleScale(1.15)} title={texts.zoomIn}>
                    <ZoomIn className="h-4 w-4 mr-1.5" />
                    <span className="text-xs">{texts.zoomIn}</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleScale(0.85)} title={texts.zoomOut}>
                    <ZoomOut className="h-4 w-4 mr-1.5" />
                    <span className="text-xs">{texts.zoomOut}</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleFlip('x')} title={texts.flipH}>
                    <FlipHorizontal className="h-4 w-4 mr-1.5" />
                    <span className="text-xs">{lang === 'sq' ? 'Pasqyro H' : 'Flip H'}</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleFlip('y')} title={texts.flipV}>
                    <FlipVertical className="h-4 w-4 mr-1.5" />
                    <span className="text-xs">{lang === 'sq' ? 'Pasqyro V' : 'Flip V'}</span>
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full mt-3"
                  onClick={handleRemoveDesign}
                >
                  <Trash2 className="h-4 w-4 mr-1.5" /> {texts.remove}
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
