import React, { useContext, useState, useEffect } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { updatePortfolio, uploadImage } from '../../api/portfolio.api';
import toast from 'react-hot-toast';
import { Save, Loader2, Upload, X } from 'lucide-react';

const AboutEditor = () => {
  const { portfolio, refetch } = useContext(PortfolioContext);
  const [formData, setFormData] = useState({
    name: '', tagline: '', bio: '', email: '', phone: '', aboutImage: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0, initWidth: 0, initHeight: 0 });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropImageLoad = (e) => {
    const img = e.target;
    const containerSize = 300;
    let w = img.naturalWidth;
    let h = img.naturalHeight;
    let initWidth, initHeight;

    if (w / h > 1) {
      initHeight = containerSize;
      initWidth = containerSize * (w / h);
    } else {
      initWidth = containerSize;
      initHeight = containerSize * (h / w);
    }

    setImageSize({
      width: w,
      height: h,
      initWidth,
      initHeight
    });
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - offset.x,
      y: e.touches[0].clientY - offset.y
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleCropSave = async () => {
    setIsUploading(true);
    
    const containerSize = 300;
    const canvasSize = 400;
    const scale = canvasSize / containerSize;
    
    const w = imageSize.initWidth * zoom;
    const h = imageSize.initHeight * zoom;
    const left = (containerSize - w) / 2 + offset.x;
    const top = (containerSize - h) / 2 + offset.y;
    
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    const img = new Image();
    img.src = cropImageSrc;
    img.onload = async () => {
      ctx.drawImage(img, left * scale, top * scale, w * scale, h * scale);
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error('Failed to crop image');
          setIsUploading(false);
          return;
        }
        
        const croppedFile = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
        const data = new FormData();
        data.append('image', croppedFile);
        
        try {
          const result = await uploadImage(data);
          setFormData(prev => ({ ...prev, aboutImage: result.url }));
          toast.success("Image cropped and uploaded! Don't forget to save.");
          setCropImageSrc(null);
        } catch (error) {
          toast.error('Failed to upload image');
        } finally {
          setIsUploading(false);
        }
      }, 'image/jpeg', 0.9);
    };
  };

  useEffect(() => {
    if (portfolio) {
      setFormData({
        name: portfolio.name || '',
        tagline: portfolio.tagline || '',
        bio: portfolio.bio || '',
        email: portfolio.email || '',
        phone: portfolio.phone || '',
        aboutImage: portfolio.aboutImage || ''
      });
    }
  }, [portfolio]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updatePortfolio(formData);
      toast.success('Profile updated successfully');
      refetch();
    } catch (error) {
      const errorMsg = error.response?.data?.errors 
        ? error.response.data.errors.map(err => `${err.field}: ${err.message}`).join(', ') 
        : (error.response?.data?.message || 'Failed to update profile');
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">About / Bio</h2>
        <p className="text-sm opacity-60">Update your personal information and bio.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass p-6 md:p-8 rounded-2xl border border-white/5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-accent outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Tagline / Title</label>
            <input required type="text" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-accent outline-none transition-colors" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 opacity-80">Profile Image</label>
          <div className="flex gap-4 items-center">
            <input type="text" placeholder="e.g. https://imgur.com/your-image.png" value={formData.aboutImage} onChange={e => setFormData({...formData, aboutImage: e.target.value})} className="flex-1 px-4 py-3 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-accent outline-none transition-colors" />
            <div className="relative">
              <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-default" />
              <button type="button" disabled={isUploading} className="px-6 py-3 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-accent transition-colors flex items-center gap-2 font-medium">
                {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                Upload
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 opacity-80">Biography</label>
          <textarea required rows={6} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-accent outline-none transition-colors resize-y"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Email Contact</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-accent outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Phone Number</label>
            <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-accent outline-none transition-colors" />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Changes
          </button>
        </div>
      </form>

      {cropImageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass w-full max-w-md rounded-2xl p-6 border border-white/10 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Crop Profile Image</h3>
              <button onClick={() => setCropImageSrc(null)} className="p-1 hover:bg-white/10 rounded-full cursor-pointer"><X size={20} /></button>
            </div>
            
            <div 
              className="relative w-[300px] h-[300px] bg-black/30 border border-white/10 rounded-xl overflow-hidden cursor-move select-none touch-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              <img 
                src={cropImageSrc} 
                alt="Crop preview" 
                onLoad={handleCropImageLoad}
                style={{
                  position: 'absolute',
                  width: `${imageSize.initWidth * zoom}px`,
                  height: `${imageSize.initHeight * zoom}px`,
                  left: `${(300 - imageSize.initWidth * zoom) / 2 + offset.x}px`,
                  top: `${(300 - imageSize.initHeight * zoom) / 2 + offset.y}px`,
                  pointerEvents: 'none',
                  maxWidth: 'none'
                }}
              />
              
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
                  borderRadius: '50%',
                  width: '280px',
                  height: '280px',
                  left: '10px',
                  top: '10px',
                  border: '2px dashed rgba(255, 255, 255, 0.5)'
                }}
              />
            </div>
            
            <p className="text-xs opacity-60 mt-3 text-center">Drag to center your face inside the circle</p>
            
            <div className="w-full mt-6 space-y-2">
              <div className="flex justify-between text-xs opacity-80">
                <span>Zoom</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="0.05" 
                value={zoom} 
                onChange={(e) => setZoom(parseFloat(e.target.value))} 
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>
            
            <div className="w-full flex gap-3 mt-6">
              <button 
                type="button" 
                onClick={() => setCropImageSrc(null)} 
                className="flex-1 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleCropSave}
                disabled={isUploading}
                className="flex-1 py-2.5 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
              >
                {isUploading ? <Loader2 className="animate-spin" size={16} /> : 'Save & Crop'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutEditor;
