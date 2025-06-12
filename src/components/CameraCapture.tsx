
import React, { useState } from 'react';
import { Camera as CameraIcon, Image, Video, Trash2 } from 'lucide-react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useToast } from '@/hooks/use-toast';

interface CapturedMedia {
  id: string;
  type: 'photo' | 'video';
  data: string;
  timestamp: string;
}

const CameraCapture = () => {
  const [capturedMedia, setCapturedMedia] = useState<CapturedMedia[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const { toast } = useToast();

  const requestCameraPermissions = async () => {
    try {
      const permissions = await Camera.requestPermissions({
        permissions: ['camera', 'photos']
      });
      return permissions.camera === 'granted';
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  };

  const takePhoto = async () => {
    try {
      setIsCapturing(true);
      
      const hasPermission = await requestCameraPermissions();
      if (!hasPermission) {
        toast({
          title: "Permission Required",
          description: "Camera access is needed to take photos",
          variant: "destructive"
        });
        return;
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      if (image.dataUrl) {
        const newMedia: CapturedMedia = {
          id: Date.now().toString(),
          type: 'photo',
          data: image.dataUrl,
          timestamp: new Date().toISOString()
        };

        setCapturedMedia([newMedia, ...capturedMedia]);
        
        toast({
          title: "Photo Captured",
          description: "Photo saved successfully",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: "Camera Error",
        description: "Could not capture photo",
        variant: "destructive"
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const selectFromGallery = async () => {
    try {
      const hasPermission = await requestCameraPermissions();
      if (!hasPermission) {
        toast({
          title: "Permission Required",
          description: "Photo access is needed to select images",
          variant: "destructive"
        });
        return;
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      if (image.dataUrl) {
        const newMedia: CapturedMedia = {
          id: Date.now().toString(),
          type: 'photo',
          data: image.dataUrl,
          timestamp: new Date().toISOString()
        };

        setCapturedMedia([newMedia, ...capturedMedia]);
        
        toast({
          title: "Photo Selected",
          description: "Photo imported from gallery",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Gallery error:', error);
      toast({
        title: "Gallery Error",
        description: "Could not select photo",
        variant: "destructive"
      });
    }
  };

  const deleteMedia = (id: string) => {
    setCapturedMedia(capturedMedia.filter(media => media.id !== id));
    toast({
      title: "Media Deleted",
      description: "Photo has been removed",
      variant: "default"
    });
  };

  const getTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Camera & Media</h2>
        <p className="text-muted-foreground">Capture and share safety evidence</p>
      </div>

      {/* Camera Controls */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={takePhoto}
            disabled={isCapturing}
            className="bg-primary text-primary-foreground py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex flex-col items-center space-y-2"
          >
            <CameraIcon className="w-8 h-8" />
            <span>{isCapturing ? 'Capturing...' : 'Take Photo'}</span>
          </button>
          
          <button
            onClick={selectFromGallery}
            className="bg-secondary text-secondary-foreground py-4 rounded-lg font-medium hover:bg-secondary/80 transition-colors flex flex-col items-center space-y-2"
          >
            <Image className="w-8 h-8" />
            <span>Gallery</span>
          </button>
        </div>

        {/* Emergency Photo Button */}
        <button
          onClick={() => {
            takePhoto();
            toast({
              title: "Emergency Photo",
              description: "Photo captured and shared with emergency contacts",
              variant: "default"
            });
          }}
          className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
        >
          <CameraIcon className="w-6 h-6" />
          <span>EMERGENCY CAPTURE</span>
        </button>
      </div>

      {/* Media Gallery */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Media ({capturedMedia.length})</h3>
        
        {capturedMedia.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <Image className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No media captured yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {capturedMedia.map((media) => (
              <div key={media.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={media.data}
                    alt="Captured media"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => deleteMedia(media.id)}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="absolute bottom-2 left-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                  {getTimeAgo(media.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
