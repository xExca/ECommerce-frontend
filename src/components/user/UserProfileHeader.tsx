import { Icon } from "@iconify/react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import axios from "@/api/axios";
import { useAuth } from "@/context/AuthContext";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { imageUrl } from "@/lib/helpers/imageUrl";

type UserProfileHeaderProps = {
  fullName: string;
  email: string;
  croppedUrl: string;
  originalUrl: string;
  userId: string;
};

export default function UserProfileHeader({ fullName, email, croppedUrl, originalUrl, userId }: UserProfileHeaderProps) {
  const { updateUser } = useAuth();
  const [profileImage, setProfileImage] = useState(originalUrl || "placehold.co/100x100");

  const [avatarVersion, setAvatarVersion] = useState("");

  const [editImage, setEditImage] = useState(profileImage);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  // console.log("croppedAreaPixels", croppedAreaPixels);
  // console.log('crop', crop);
  // console.log('zoom', zoom);

  const objectUrlRef = useRef<string | null>(null);

  const onCropComplete = (_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    const file = e.target.files?.[0];
    if (!file) return;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;

    setSelectedFile(file);
    setEditImage(objectUrl);
  };

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    const getCropAvatar = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(`/api/users/avatar`);

        if (response.status === 200) {
          const { zoom, crop, croppedAreaPixels } = response.data.avatarCrop;
          setCrop(crop ?? { x: 0, y: 0 });
          setZoom(zoom ?? 1);
          setCroppedAreaPixels(croppedAreaPixels ?? null);
        }
        
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };

    if (isDialogOpen) {
      getCropAvatar();
    }
  }, [isDialogOpen]);

  const handleSaveProfilePicture = async () => {
    if (!croppedAreaPixels || !userId || !editImage) {
      console.error("Missing required data for cropping");
      return;
    }

    try {
      const formData = new FormData();

      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }
      formData.append("cropArea", JSON.stringify({ crop, zoom, croppedAreaPixels }));

      const response = await axios.post("/api/users/avatar", formData);

      if (response.status === 200) {
        if(response.data.message ==  "Avatar updated successfully") {
          const { originalUrl, croppedUrl, updatedAt } = response.data.picture;

          updateUser({
            picture: { 
              croppedUrl: croppedUrl,
              originalUrl: originalUrl,
            },
          });

          setAvatarVersion(updatedAt);
          setProfileImage(originalUrl);
        } else if (response.data.message == "Crop area updated successfully") {
          const { message, updatedAt } = response.data;

          console.log(message);
          setAvatarVersion(updatedAt);
        }
        setIsDialogOpen(false);

      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  return (
    <>
      {/* Cover */}
      <div className="relative h-60">
        <img
          src="https://img.freepik.com/free-vector/night-landscape-with-lake-mountains-trees-coast-vector-cartoon-illustration-nature-scene-with-coniferous-forest-river-shore-rocks-moon-stars-dark-sky_107791-8253.jpg?w=1480"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute -bottom-16 left-8">
          <div className="relative w-[180px] h-[180px] rounded-full overflow-hidden border-4 border-white bg-white">
            <img alt={fullName} src={croppedUrl === "" ? "https://placehold.co/100x100" : `${imageUrl(croppedUrl)}?v=${avatarVersion}`} className="w-full h-full object-cover"/>
          </div>

          <button
            type="button"
            className="absolute bottom-0 left-[125px] h-10 w-10 rounded-full bg-white shadow border flex items-center justify-center"
            onClick={() => setIsDialogOpen(true)}
          >
            <Icon icon="lucide:camera" className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="pt-12 px-6">
        <h1 className="text-2xl font-semibold">{fullName}</h1>
        <p>{email}</p>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile Photo</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6">
            <div className="flex justify-center">
              <div className="relative w-80 h-80 bg-transparent">
                <Cropper
                  image={editImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative w-fit">
                <Button variant="outline" type="button">
                  <Icon icon="lucide:upload" className="mr-2" />
                  Upload photo
                </Button>

                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="px-8 flex flex-col gap-2">
              <label className="text-sm font-medium">Zoom</label>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(value) => setZoom(value[0])}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfilePicture}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
