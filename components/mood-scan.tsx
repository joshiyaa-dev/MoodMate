'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, ScanFace, Check, X } from 'lucide-react';
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import {
  classifyExpression,
  ExpressionStabilizer,
  EXPRESSION_LABELS,
  type Blendshapes,
  type ExpressionKey,
} from '@/lib/expression';

interface MoodScanProps {
  /** Called when the user accepts a scanned expression. */
  onAccept?: (expression: ExpressionKey, confidence: number) => void;
  onClose?: () => void;
}

/**
 * Real-time on-device expression estimation.
 * Uses MediaPipe FaceLandmarker (52 blendshapes) + weighted expression scoring
 * + temporal stabilization. Video never leaves the device; nothing is stored.
 */
export default function MoodScan({ onAccept, onClose }: MoodScanProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'running' | 'error'>('idle');
  const [error, setError] = useState('');
  const [reading, setReading] = useState<{ label: string; confidence: number; key: ExpressionKey } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const stabilizerRef = useRef(new ExpressionStabilizer(0.12));
  const runningRef = useRef(false);
  const readingRef = useRef<{ label: string; confidence: number; key: ExpressionKey } | null>(null);

  const stop = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus('idle');
  }, []);

  useEffect(() => () => stop(), [stop]);

  const tick = useCallback(async () => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;
    if (!video || !landmarker || !runningRef.current) return;

    if (video.readyState >= 2 && video.currentTime > 0) {
      try {
        const result = landmarker.detectForVideo(video, performance.now());
        const cats = result.faceBlendshapes?.[0]?.categories;
        if (cats && cats.length > 0) {
          const shapes: Blendshapes = {};
          for (const c of cats) shapes[c.categoryName] = c.score;
          const raw = classifyExpression(shapes);
          const stable = stabilizerRef.current.update(raw);
          const nextReading = { label: stable.label, confidence: stable.confidence, key: stable.key };
          readingRef.current = nextReading;
          setReading(nextReading);
          drawFaceMesh(result);
        }
      } catch {
        /* transient frame errors ignored */
      }
    }
    rafRef.current = requestAnimationFrame(() => void tick());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawFaceMesh = (result: any) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const faces: Array<Array<{ x: number; y: number }>> = result.faceLandmarks ?? [];
    ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
    for (const face of faces) {
      for (let i = 0; i < face.length; i += 4) {
        const p = face[i];
        ctx.fillRect((1 - p.x) * canvas.width - 1, p.y * canvas.height - 1, 2.4, 2.4);
      }
    }
  };

  const start = async () => {
    setError('');
    setStatus('loading');
    try {
      if (!landmarkerRef.current) {
        const fileset = await FilesetResolver.forVisionTasks('/mediapipe/wasm');
        landmarkerRef.current = await FaceLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: '/models/face_landmarker.task', delegate: 'GPU' },
          runningMode: 'VIDEO',
          numFaces: 1,
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: false,
        });
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      stabilizerRef.current = new ExpressionStabilizer(0.12);
      runningRef.current = true;
      setStatus('running');
      void tick();
    } catch (e) {
      const message =
        e instanceof DOMException && e.name === 'NotAllowedError'
          ? 'Camera permission denied. You can still check in manually — the scan is optional.'
          : e instanceof Error && /createFromOptions|FilesetResolver|wasm|task/i.test(e.message)
            ? 'Face model failed to load. Run "npm run setup-face-assets" and reload.'
            : 'Camera could not start.';
      setError(message);
      setStatus('error');
      stop();
    }
  };

  const accept = () => {
    if (readingRef.current && onAccept) {
      onAccept(readingRef.current.key, readingRef.current.confidence);
    }
    stop();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ScanFace className="h-5 w-5 text-pink-500" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Mood Scan</h3>
        </div>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          ON-DEVICE · NOTHING UPLOADED
        </span>
      </div>

      <div className="relative mx-auto aspect-video w-full max-w-md overflow-hidden rounded-xl bg-slate-900">
        <video ref={videoRef} playsInline muted className="absolute inset-0 h-full w-full scale-x-[-1] object-cover" />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-slate-300">
            <Camera size={36} />
            <p className="text-sm">Optional: let Mood Mate estimate your current expression to pre-fill your check-in.</p>
            <button onClick={() => void start()} className="flex items-center gap-2 rounded-full bg-pink-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-pink-400">
              <ScanFace size={16} /> Start mood scan
            </button>
          </div>
        )}
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-300">Loading face model…</div>
        )}
        {status === 'running' && reading && (
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-bold text-white backdrop-blur">
              Estimated expression: {reading.label}
            </span>
            <span className="rounded-full bg-slate-900/60 px-3 py-1 text-[10px] font-semibold text-cyan-200 backdrop-blur">
              confidence {reading.confidence}% · not a diagnosis
            </span>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-3 text-xs text-rose-500">{error}</p>
      )}

      {status === 'running' && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button onClick={accept} disabled={!reading || reading.key === 'neutral'} className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40">
            <Check size={14} /> Use this mood
          </button>
          <button onClick={stop} className="flex items-center gap-1.5 rounded-full bg-slate-600 px-4 py-2 text-xs font-bold text-white hover:bg-slate-500">
            <X size={14} /> Stop scan
          </button>
        </div>
      )}

      <p className="mt-3 text-center text-[10px] leading-relaxed text-slate-400">
        Expression estimation reads facial muscle signals in real time on this device only. It is an observation, not a measurement of your feelings or a medical assessment.
      </p>
      {onClose && status !== 'running' && (
        <button onClick={onClose} className="mx-auto mt-2 block text-xs font-semibold text-slate-400 hover:text-slate-200">
          Close
        </button>
      )}
    </div>
  );
}
