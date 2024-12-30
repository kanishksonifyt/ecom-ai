import React, { useState } from "react";
import {
  Container,
  Button,
  Drawer,
  Heading,
  Input,
  Label,
  Text
} from "@medusajs/ui";
import { XMarkMini } from "@medusajs/icons";

const Featuredcard = ({
  id,
  link,
  image,
  title,
  text,
  setfeaturedSections,
  setDeleteId,
}: {
  id: string;
  link: string;
  image: string;
  title: string;
  text: string;
  setfeaturedSections: (heroSections: any) => void;
  setDeleteId: (id: string) => void;
}) => {
  const [editLink, setEditLink] = useState(link);
  const [editImage, setEditImage] = useState(image);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [edittitle, setedittitle] = useState(title);
  const [edittext, setedittext] = useState(text);

  const updatecatalogSection = async (id: string, payload: Partial<any>) => {
    try {
      const response = await fetch(`/admin/featured/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("response", response.status);

      if (response.status !== 200) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update catalog section");
      }

      const data = await response.json();
      setfeaturedSections((prevSections: any) =>
        prevSections.map((section: any) =>
          section.id === id ? { ...section, ...payload } : section
        )
      );

      console.log("Catalog section updated successfully:", data);
      return data;
    } catch (error: any) {
      console.error("Error updating catalog section:", error);
    }
  };

  const handleSave = async () => {
    const payload = {
      image: editImage,
      link: editLink,
      title: edittitle,
      text: edittext,
    };

    const result = await updatecatalogSection(id, payload);
    if (result) {
      setDrawerOpen(false);
    }
  };

  return (
    <div className="flex w-full gap-2 h-[350px] flex-col">
    <Container className="divide-y p-0 h-[90%] max-h-[300px] flex items-center justify-between w-full relative overflow-hidden">
      <img src={image} alt="catalog" className="w-full h-full object-cover" />
      <Container className="flex flex-col items-start justify-center px-6 py-4 h-full w-full">
        <Container>
          <Heading level="h1" className="text-lg font-semibold">
            {title}
          </Heading>
          <Text>{text}</Text>
        </Container>
        <Heading level="h3" className="text-xs font-light text-gray-500">
          Description
        </Heading>
        <Text>{text}</Text>
        <Heading level="h2" className="text-sm font-medium">Link</Heading>
        <Text>{link}</Text>
      </Container>
    </Container>
    <Container className="flex items-center justify-between h-[15%]">
      {/* <Button variant="secondary" onClick={() => setDeleteId(id)}>
        Delete <XMarkMini />
      </Button> */}
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
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="title" className="text-ui-fg-subtle">
                  Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={edittitle}
                  onChange={(e) => setedittitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="text" className="text-ui-fg-subtle">
                 Button Text
                </Label>
                <Input
                  id="text"
                  type="text"
                  value={edittext}
                  onChange={(e) => setedittext(e.target.value)}
                  className="mt-1"
                />
              </div>
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

export default Featuredcard;
