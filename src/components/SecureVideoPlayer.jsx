import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player/youtube';
import { MdPlayArrow, MdPause, MdVolumeUp, MdVolumeOff, MdFullscreen } from 'react-icons/md';

export default function SecureVideoPlayer({ videoSrc }) {
  const [isFocused, setIsFocused] = useState(true);
  const [watermarkPos, setWatermarkPos] = useState({ top: '10%', left: '10%' });
  
  // Player Controls State
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  const userName = localStorage.getItem('userName') || 'Student';
  const userId = 'ID: ' + Math.floor(Math.random() * 10000);

  useEffect(() => {
    const handleBlur = () => {
      setIsFocused(false);
      setPlaying(false); // إيقاف الفيديو عند الخروج من النافذة
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
    }, 4000);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    if (!isSeeking) {
      setPlayed(state.played);
    }
  };

  const handleDuration = (dur) => {
    setDuration(dur);
  };

  const handleSeekMouseDown = (e) => {
    setIsSeeking(true);
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e) => {
    setIsSeeking(false);
    playerRef.current.seekTo(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        alert(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        width: '100%', 
        backgroundColor: '#000', 
        borderRadius: document.fullscreenElement ? '0' : 'var(--radius-md)', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {!isFocused && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 50, display: 'flex', 
          justifyContent: 'center', alignItems: 'center', color: 'red', flexDirection: 'column',
          textAlign: 'center', padding: '20px'
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
        color: 'rgba(255, 255, 255, 0.5)',
        zIndex: 5,
        pointerEvents: 'none',
        transition: 'all 4s linear',
        userSelect: 'none',
        fontSize: '1rem',
        fontWeight: 'bold',
        textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
        opacity: playing ? 1 : 0.3
      }}>
        {userName} <br /> {userId}
      </div>

      {/* الفيديو الفعلي باستخدام ReactPlayer */}
      <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
        <ReactPlayer
          ref={playerRef}
          url={videoSrc || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
          playing={playing}
          volume={volume}
          muted={muted}
          onProgress={handleProgress}
          onDuration={handleDuration}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          config={{
            youtube: {
              playerVars: { 
                controls: 0,          // إخفاء تحكم يوتيوب بالكامل
                modestbranding: 1, 
                rel: 0, 
                showinfo: 0,
                disablekb: 1,         // إيقاف اختصارات الكيبورد ليوتيوب
                iv_load_policy: 3     // إخفاء التعليقات التوضيحية
              }
            }
          }}
        />

        {/* الدرع الشفاف (Click Shield) لمنع أي تفاعل مباشر مع إطار يوتيوب */}
        <div 
          onClick={handlePlayPause}
          onContextMenu={(e) => e.preventDefault()}
          onDoubleClick={toggleFullScreen}
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            zIndex: 10,
            cursor: 'pointer',
            backgroundColor: 'transparent' // شفاف تماماً
          }}
          title="انقر للتشغيل أو الإيقاف"
        />
      </div>

      {/* لوحة التحكم المخصصة للمنصة */}
      <div style={{
        backgroundColor: '#1a1d24',
        padding: '10px 15px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        borderTop: '1px solid #333',
        zIndex: 20
      }}>
        <button 
          onClick={handlePlayPause} 
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
        >
          {playing ? <MdPause size={28} color="var(--primary-color)" /> : <MdPlayArrow size={28} color="var(--primary-color)" />}
        </button>

        {/* شريط التقدم */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#ccc', fontSize: '0.85rem' }}>{formatTime(played * duration)}</span>
          <input
            type="range"
            min={0}
            max={1}
            step="any"
            value={played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            style={{ 
              flex: 1, 
              cursor: 'pointer',
              accentColor: 'var(--primary-color)' 
            }}
          />
          <span style={{ color: '#ccc', fontSize: '0.85rem' }}>{formatTime(duration)}</span>
        </div>

        {/* التحكم بالصوت */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <button onClick={toggleMute} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}>
            {muted || volume === 0 ? <MdVolumeOff size={24} /> : <MdVolumeUp size={24} />}
          </button>
          <input 
            type="range" 
            min={0} 
            max={1} 
            step="any" 
            value={volume} 
            onChange={handleVolumeChange} 
            style={{ width: '60px', cursor: 'pointer', accentColor: 'white' }}
          />
        </div>

        {/* زر ملء الشاشة */}
        <button onClick={toggleFullScreen} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}>
          <MdFullscreen size={28} />
        </button>
      </div>
    </div>
  );
}
