import React, { useEffect, useRef } from 'react';
import { initOfficeScene } from '../three/OfficeScene';

export function Stage3D({
  agents,
  selectedAgentId,
  onSelectAgent,
  theme,
  timePhase = 'morning',
  onWebGLFallback
}) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const agentsRef = useRef(agents);
  agentsRef.current = agents;

  const getThemeTokens = () => {
    if (typeof window === 'undefined') return {};
    const styles = getComputedStyle(document.documentElement);
    const keys = [
      'bg', 'surface', 'ink', 'ink2', 'line', 'wall', 'accent', 'ok', 'signal', 'idle',
      'z-ceo', 'z-plan', 'z-write', 'z-prod', 'z-pub', 'z-lunch', 'z-ps', 'z-pool', 'z-dorm'
    ];
    const tokens = {};
    keys.forEach(k => {
      tokens[k] = styles.getPropertyValue(`--${k}`).trim();
    });
    return tokens;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let sceneInstance = null;
    try {
      sceneInstance = initOfficeScene(canvas, {
        onSelectAgent,
        getAgentsData: () => agentsRef.current,
        getThemeTokens
      });
    } catch (err) {
      console.warn('Gagal menginisialisasi Three.js 3D:', err);
    }

    if (!sceneInstance) {
      if (onWebGLFallback) {
        setTimeout(() => onWebGLFallback(), 0);
      }
      return;
    }

    sceneRef.current = sceneInstance;

    const resizeObserver = new ResizeObserver(() => {
      if (sceneRef.current) {
        sceneRef.current.resize();
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
      if (sceneRef.current) {
        sceneRef.current.destroy();
        sceneRef.current = null;
      }
    };
  }, [onSelectAgent, onWebGLFallback]);

  // Sync state changes with 3D scene
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.sync(agents, selectedAgentId, timePhase);
    }
  }, [agents, selectedAgentId, timePhase]);

  // Sync time phase changes (Pagi, Siang, Sore, Malam, Tidur)
  useEffect(() => {
    if (sceneRef.current && timePhase) {
      sceneRef.current.setTimePhase(timePhase);
    }
  }, [timePhase]);

  // Focus on selected agent
  useEffect(() => {
    if (sceneRef.current && selectedAgentId) {
      sceneRef.current.focus(selectedAgentId);
    }
  }, [selectedAgentId]);

  // Theme changes
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.applyTheme();
    }
  }, [theme]);

  const handleResetCamera = () => {
    if (sceneRef.current) {
      sceneRef.current.resetCamera();
    }
  };

  return (
    <div className="stage" id="stage">
      <canvas
        ref={canvasRef}
        id="cv"
        role="img"
        aria-label="Denah kantor 3D interaktif. Klik karakter untuk membuka detail tugas."
      />
      <div className="stage-tools">
        <button
          type="button"
          className="ghost"
          id="reset-cam"
          onClick={handleResetCamera}
        >
          Reset kamera
        </button>
      </div>
      <p className="hint">
        Seret untuk memutar, scroll atau cubit untuk zoom, klik kanan atau dua jari untuk menggeser, klik karakter untuk membuka detail.
      </p>
    </div>
  );
}
