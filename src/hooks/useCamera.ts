import { useCallback, useEffect, useRef, useState } from "react";

type UseCameraResult = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isCameraActive: boolean;
  isCameraLoading: boolean;
  cameraError: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureFrame: () => string | null;
};

const cameraConstraints: MediaStreamConstraints = {
  video: {
    facingMode: {
      ideal: "environment",
    },
    width: {
      ideal: 1280,
    },
    height: {
      ideal: 720,
    },
  },
  audio: false,
};

export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Este navegador não permite abrir a câmera.");
      return;
    }

    try {
      setIsCameraLoading(true);
      setCameraError(null);

      const stream = await navigator.mediaDevices.getUserMedia(
        cameraConstraints,
      );

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsCameraActive(true);
    } catch (error) {
      console.error(error);
      stopCamera();
      setCameraError("Não foi possível acessar a câmera.");
    } finally {
      setIsCameraLoading(false);
    }
  }, [stopCamera]);

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;

    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      return null;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.86);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    isCameraActive,
    isCameraLoading,
    cameraError,
    startCamera,
    stopCamera,
    captureFrame,
  };
}
