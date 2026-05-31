import React, { useState, useEffect, useRef } from 'react';

export default function SecureVideoPlayer({ videoSrc }) {
  const [isFocused, setIsFocused] = useState(true);
  const [watermarkPos, setWatermarkPos] = useState({ top: '10%', left: '10%' });
  const videoRef = useRef(null);
  
  const userName = localStorage.getItem('userName') || 'Student';
  const userId = 'ID: ' + Math.floor(Math.random() * 10000);

  useEffect(() => {
    const handleBlur = () => {
      setIsFocused(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
    
    const handleFocus = () => {
      setIsFocused(true);
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    // Dynamic watermark interval
    const interval = setInterval(() => {
      setWatermarkPos({
        top: Math.random() * 80 + '%',
        left: Math.random() * 80 + '%',
      });
    }, 3000);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', backgroundColor: 'black', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      {!isFocused && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 10, display: 'flex', 
          justifyContent: 'center', alignItems: 'center', color: 'red', flexDirection: 'column'
        }}>
          <h2>النافذة غير نشطة!</h2>
          <p>تم إيقاف تشغيل الفيديو لأسباب أمنية. يرجى النقر هنا للمتابعة.</p>
        </div>
      )}
      
      {/* Dynamic Watermark */}
      <div style={{
        position: 'absolute',
        top: watermarkPos.top,
        left: watermarkPos.left,
        color: 'rgba(255, 255, 255, 0.4)',
        zIndex: 5,
        pointerEvents: 'none',
        transition: 'all 3s linear',
        userSelect: 'none',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        textShadow: '1px 1px 2px black'
      }}>
        {userName} <br /> {userId}
      </div>

      <video 
        ref={videoRef}
        src={videoSrc || "https://www.w3schools.com/html/mov_bbb.mp4"} 
        controls 
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        style={{ width: '100%', height: 'auto', display: 'block' }} 
      />
    </div>
  );
}
