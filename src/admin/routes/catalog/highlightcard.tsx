import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Drawer,
  Heading,
  Input,
  Label,
  Textarea,
} from "@medusajs/ui";
import { XMarkMini,Spinner } from "@medusajs/icons";
import axios from "axios";

const Highlightcard = ({
  id,
  link,
  image,
  setcatalogSections,
  deleteId,
  setDeleteId,
  loading,
}: {
  id: string;
  link: string;
  image: string;
  setcatalogSections: (heroSections: any) => void;
  setDeleteId: (id: string) => void;
  deleteId: string;
  loading: boolean;
}) => {
  // State for editing fields
  const [editLink, setEditLink] = useState(link);
  const [editImage, setEditImage] = useState(image);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const updatecatalogSection = async (id: string, payload: Partial<any>) => {
    try {
      const response = await fetch(`/admin/catalog/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update catalog section");
      }

      const data = await response.json();
      setcatalogSections((prevSections: any) =>
        prevSections.map((section: any) =>
          section.id === id ? { ...section, ...payload } : section
        )
      );

      console.log("catalog section updated successfully:", data);
      return data;
    } catch (error: any) {
      console.error("Error updating catalog section:", error.message || error);
    }
  };

  const handleSave = async () => {
    const payload = {
      image: editImage,
      link: editLink,
    };

    const result = await updatecatalogSection(id, payload);
    if (result) {
      setDrawerOpen(false); // Close the drawer after successful update
    }
  };

  return (
    <div className="flex  max-w-[300px] min-w-[250px] w-[30%] gap-2 h-[350px]  flex-col">
      <Container className="divide-y p-0  h-[90%] max-h-[300px] flex flex-col item-center justify-center w-full relative overflow-hidden">
        <img src={image} alt="catalog" className="w-full h-full object-cover" />

        <Container className="flex items-center justify-between px-6 py-4 h-[50px]">
          <Heading level="h1">{link}</Heading>
        </Container>
      </Container>
      <Container className="flex items-center w- justify-between  h-[15%]">
        <Button
          variant="secondary"
          onClick={() => setDeleteId(id)}
          className=""
        >
          {loading && deleteId == id ? <>
            <Spinner className="animate-spin" />
          </> : <>Delete <XMarkMini /></>}
        </Button>
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <Drawer.Trigger asChild>
            <Button>Edit catalog</Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Edit catalog</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="p-4">
              <div className="flex w-full max-w-lg flex-col gap-y-8">
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="link" className="text-ui-fg-subtle">
                    Link
                  </Label>
                  <Input
                    id="link"
                    type="text"
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="imageUpload" className="text-ui-fg-subtle">
                    Image Link
                  </Label>
                  <Input
                    id="imageUpload"
                    type="text"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Container className="h-[300px] w-full overflow-hidden p-0">
                  <img
                    src={editImage}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </Container>
              </div>
            </Drawer.Body>
            <Drawer.Footer className="flex justify-between h-32">
              <Drawer.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Drawer.Close>
              <Button onClick={handleSave}>Save</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </Container>
    </div>
  );
};

export default Highlightcard;
