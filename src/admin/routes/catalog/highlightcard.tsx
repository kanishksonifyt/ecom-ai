import React, { useState } from "react";
import { Container, Button, Drawer, Heading, Input, Label } from "@medusajs/ui";
import { XMarkMini, Spinner } from "@medusajs/icons";
import axios from "axios";

const HighlightCard = ({
  id,
  link,
  image,
  setCatalogSections,
  deleteId,
  setDeleteId,
  loading,
}: {
  id: string;
  link: string;
  image: string;
  setCatalogSections: (heroSections: any) => void;
  setDeleteId: (id: string) => void;
  deleteId: string;
  loading: boolean;
}) => {
  const [editLink, setEditLink] = useState(link);
  const [editImage, setEditImage] = useState(image);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const updateCatalogSection = async (id: string, payload: Partial<any>) => {
    try {
      const response = await fetch(`/admin/catalog/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update catalog section");
      }

      const updatedSection = await response.json();
      setCatalogSections((prevSections: any) =>
        prevSections.map((section: any) =>
          section.id === id ? { ...section, ...payload } : section
        )
      );

      // console.log("Catalog section updated successfully:", updatedSection);
      return updatedSection;
    } catch (error) {
      console.error("Error updating catalog section:", error);
    }
  };

  const handleSave = async () => {
    const payload = { image: editImage, link: editLink };
    const result = await updateCatalogSection(id, payload);
    if (result) {
      setDrawerOpen(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      // Simulate an image upload API call
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        "http://148.135.138.221:4000/upload/100",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization:
              "Bearer 5d92b8f69c9dda89f38c10fa6750376a25b53a9afd47e74951104769630d4ccc",
          },
        }
      );

      if (!response.data) {
        throw new Error("Failed to upload image");
      }

      setEditImage(response.data); // Assume the API returns the uploaded image URL
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-[300px] w-[30%] gap-2 h-[350px]">
      <Container className="divide-y p-0 h-[90%] max-h-[300px] flex flex-col justify-center relative overflow-hidden">
        <img
          src={image}
          alt="Catalog"
          className="w-full h-[80%] object-cover"
        />
        <Container className="flex items-center justify-between px-6 py-4">
          <Heading level="h1">{link}</Heading>
        </Container>
      </Container>
      <Container className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => setDeleteId(id)}
          disabled={loading && deleteId === id}
        >
          {loading && deleteId === id ? (
            <Spinner className="animate-spin" />
          ) : (
            <>
              Delete <XMarkMini />
            </>
          )}
        </Button>
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <Drawer.Trigger asChild>
            <Button>Edit</Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Edit Catalog</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="p-4">
              <div className="flex flex-col gap-y-4">
                <div>
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    type="text"
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="image">Click for update image</Label>
                  <input
                    id="image"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file instanceof File) {
                        handleImageUpload(file);
                      }
                    }}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => document.getElementById("image")?.click()}
                    disabled={uploading}
                    className="w-full p-0 h-[200px]"
                  >
                    {!uploading ? (
                      <img
                        src={editImage}
                        alt="Preview"
                        className="w-full h-full object-cover "
                      />
                    ) : (
                      <Button
                        variant="secondary"
                        className="w-full h-[200px] object-cover mt-2"
                        onClick={() =>
                          document.getElementById("image")?.click()
                        }
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Upload Image"}
                      </Button>
                    )}
                  </Button>
                  {/* {!loading ? (
                    <img
                      src={editImage}
                      alt="Preview"
                      className="w-full h-[200px] object-cover mt-2"
                    />
                  ) : <Button
                  variant="secondary"
                  className="w-full h-[200px] object-cover mt-2"
                  onClick={() => document.getElementById("image")?.click()}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Image"}
                </Button> } */}
                </div>
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Drawer.Close>
              <Button onClick={handleSave} disabled={uploading}>
                Save
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </Container>
    </div>
  );
};

export default HighlightCard;
