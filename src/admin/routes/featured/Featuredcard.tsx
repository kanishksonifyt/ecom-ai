import React, { useState } from "react";
import {
  Container,
  Button,
  FocusModal,
  Heading,
  Input,
  Label,
  Text,
} from "@medusajs/ui";
import { XMarkMini } from "@medusajs/icons";
import axios from "axios";

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
  const [drawerOpen, setFocusModalOpen] = useState(false);
  const [edittitle, setedittitle] = useState(title);
  const [edittext, setedittext] = useState(text);
  const [loading, setLoading] = useState(false);

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
        throw new Error(
          errorData.message || "Failed to update catalog section"
        );
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
      setFocusModalOpen(false);
    }
  };

  const uploadImage = async (file: File) => {
    if (file) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("image", file);

        const response = await axios.post(
          "http://148.135.138.221:4000/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization:
                "Bearer 5d92b8f69c9dda89f38c10fa6750376a25b53a9afd47e74951104769630d4ccc",
            },
          }
        );
        console.log("response", response);
        setEditImage(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
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
          <Heading level="h2" className="text-sm font-medium">
            Link
          </Heading>
          <Text>{link}</Text>
        </Container>
      </Container>
      <Container className="flex items-center justify-between h-[15%]">
        {/* <Button variant="secondary" onClick={() => setDeleteId(id)}>
        Delete <XMarkMini />
      </Button> */}
        <FocusModal open={drawerOpen} onOpenChange={setFocusModalOpen}>
          <FocusModal.Trigger asChild>
            <Button>Edit catalog</Button>
          </FocusModal.Trigger>
          <FocusModal.Content>
            <FocusModal.Header>
              <FocusModal.Title>Edit Featured</FocusModal.Title>
            </FocusModal.Header>
            <FocusModal.Body className="p-4 px-36 overflow-y-auto">
              <div className="flex w-full  flex-col gap-y-8 ">
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="link" className="text-ui-fg-subtle">
                    Redirect To
                  </Label>
                  <Input
                    id="link"
                    type="text"
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      uploadImage(file);
                    }
                  }}
                />
                  <Label htmlFor="image">Click for Change image </Label >
                <Container className="flex flex-col gap-y-2 h-[200px] p-0 overflow-hidden justify-center items-center">
                  {editImage ? (
                    loading ? (
                      "uploading..."
                    ) : (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          document.getElementById("image")?.click()
                        }
                        className="text-gray-500 w-full h-full p-0"
                      >
                        <img
                          src={editImage}
                          alt="highlight"
                          className="w-full h-full object-cover"
                        />
                      </Button>
                    )
                  ) : loading ? (
                    "uploading..."
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => document.getElementById("image")?.click()}
                      className="text-gray-500 w-full h-full"
                    >
                      Click to upload image
                    </Button>
                  )}
                </Container>
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
            </FocusModal.Body>
            <FocusModal.Footer className="flex justify-between ">
              <FocusModal.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </FocusModal.Close>
              <Button onClick={handleSave}>Save</Button>
            </FocusModal.Footer>
          </FocusModal.Content>
        </FocusModal>
      </Container>
    </div>
  );
};

export default Featuredcard;
