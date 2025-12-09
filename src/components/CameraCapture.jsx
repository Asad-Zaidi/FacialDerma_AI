
import React from 'react';
import { FaCamera } from "react-icons/fa";

const CameraCapture = ({
    onImageCapture,
    onError,
    className = "",
    buttonText = "Camera",
    disabled = false
}) => {
    const handleCameraCapture = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();

            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100vw';
            modal.style.height = '100vh';
            modal.style.background = 'rgba(0,0,0,0.8)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '9999';

            video.style.maxWidth = '90vw';
            video.style.maxHeight = '70vh';
            modal.appendChild(video);

            const captureBtn = document.createElement('button');
            captureBtn.textContent = 'Capture';
            captureBtn.style.position = 'absolute';
            captureBtn.style.bottom = '10%';
            captureBtn.style.left = '50%';
            captureBtn.style.transform = 'translateX(-50%)';
            captureBtn.style.padding = '1em 2em';
            captureBtn.style.fontSize = '1.2em';
            captureBtn.style.background = '#2563eb';
            captureBtn.style.color = '#fff';
            captureBtn.style.border = 'none';
            captureBtn.style.borderRadius = '8px';
            captureBtn.style.cursor = 'pointer';
            modal.appendChild(captureBtn);

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.style.position = 'absolute';
            cancelBtn.style.top = '5%';
            cancelBtn.style.right = '5%';
            cancelBtn.style.padding = '0.5em 1em';
            cancelBtn.style.fontSize = '1em';
            cancelBtn.style.background = '#ef4444';
            cancelBtn.style.color = '#fff';
            cancelBtn.style.border = 'none';
            cancelBtn.style.borderRadius = '8px';
            cancelBtn.style.cursor = 'pointer';
            modal.appendChild(cancelBtn);

            document.body.appendChild(modal);

            captureBtn.onclick = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(blob => {
                    if (blob) {
                        const file = new File([blob], 'camera.jpg', { type: 'image/jpeg' });
                        if (onImageCapture) {
                            onImageCapture(file);
                        }
                    }
                }, 'image/jpeg', 0.95);
                stream.getTracks().forEach(track => track.stop());
                document.body.removeChild(modal);
            };

            cancelBtn.onclick = () => {
                stream.getTracks().forEach(track => track.stop());
                document.body.removeChild(modal);
            };
        } catch (err) {
            if (onError) {
                onError('Unable to access camera.');
            }
        }
    };

    return (
        <button
            onClick={handleCameraCapture}
            disabled={disabled}
            className={`bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-semibold py-2.5 px-4 rounded-full transition-all duration-300 text-xs md:text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            <FaCamera className="text-sm" />
            {buttonText}
        </button>
    );
};

export default CameraCapture;



// Usage in other component:
// import CameraCapture from '../components/CameraCapture';

// <CameraCapture
//     onImageCapture={(file) => {
//         setImage(file);
//         setErrorMessage(null);
//         setPrediction(null);
//         setShowResult(false);
//         setShowMap(false);
//         toast.success('Image captured from camera!');
//     }}
//     onError={(error) => {
//         toast.error(error);
//     }}
//     disabled={!hasPermission}
//     buttonText="Take Photo"
// />