import { ref } from "vue";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";

export const photos = ref<string[]>([]);
export const videoStream = ref<MediaStream | null>(null);
export const videoElement = ref<HTMLVideoElement | null>(null);

export const startCameraPreview = async () => {
  if (Capacitor.getPlatform() === "web") {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // usa cámara trasera si hay
        audio: false
      });

      videoStream.value = stream;

      if (videoElement.value) {
        videoElement.value.srcObject = stream;

        // Necesario en móviles
        videoElement.value.setAttribute("playsinline", "true");
        videoElement.value.setAttribute("muted", "true");

        // Asegurar autoplay
        await videoElement.value.play().catch(err => {
          console.warn("El navegador bloqueó autoplay, espera interacción:", err);
        });
      }
    } catch (err) {
      console.error("Error al iniciar la cámara en web:", err);
    }
  }
};


export const stopCameraPreview = () => {
  if (videoStream.value) {
    videoStream.value.getTracks().forEach((track) => track.stop());
    videoStream.value = null;
  }
};

export const takePhoto = async () => {
  if (Capacitor.getPlatform() === "web") {
    if (videoElement.value) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = videoElement.value.videoWidth;
      canvas.height = videoElement.value.videoHeight;
      ctx.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height);
      photos.value.push(canvas.toDataURL("image/png"));
    }
  } else {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 90,
    });

    if (photo.dataUrl) {
      photos.value.push(photo.dataUrl);
    }
  }
};

export const removePhoto = (index: number) => {
  photos.value.splice(index, 1);
};
