import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Drawer,
  Heading,
  Input,
  Label,
  Alert,
  Textarea,
} from "@medusajs/ui";
import { XMarkMini, ArrowLongUp, ArrowDownMini } from "@medusajs/icons";
import axios from "axios";

const Herocard = ({
  id,
  title,
  subtitle,
  firsttext,
  secondtext,
  image,
  setShowAlert,
  key,
  sectionIndex,
  setHeroSections,
  setDeleteId,
}: {
  id: string;
  title: string;
  subtitle: string;
  firsttext: string;
  secondtext: string;
  image: string;
  sectionIndex: number;
  key: any;
  setShowAlert: (show: boolean) => void;
  setHeroSections: (heroSections: any) => void;
  setDeleteId: (id: string) => void;
}) => {
  // State for editing fields
  const [editTitle, setEditTitle] = useState(title);
  const [editSubtitle, setEditSubtitle] = useState(subtitle);
  const [editImage, setEditImage] = useState(image);
  const [editFirstText, setEditFirstText] = useState(firsttext);
  const [editSecondText, setEditSecondText] = useState(secondtext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    console.log("key", sectionIndex);
  }, [sectionIndex]);
  const updateHeroSection = async (id: string, payload: Partial<any>) => {
    try {
      const response = await fetch(`/admin/hero/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update hero section");
      }

      const data = await response.json();
      setHeroSections((prevSections: any) =>
        prevSections.map((section: any) =>
          section.id === id ? { ...section, ...payload } : section
        )
      );

      console.log("Hero section updated successfully:", data);

      return data;
    } catch (error: any) {
      console.error("Error updating hero section:", error.message || error);
    }
  };

  const handleSave = async () => {
    const payload = {
      title: editTitle,
      subtitle: editSubtitle,
      image: editImage,
      firsttext: editFirstText,
      secondtext: editSecondText,
    };

    const result = await updateHeroSection(id, payload);
    if (result) {
      setDrawerOpen(false); // Close the drawer after successful update
    }
  };

  const handleMove = (direction: "up" | "down") => {
    let newIndex = sectionIndex;
    setHeroSections((prevSections: any) => {
      const currentIndex = prevSections.findIndex(
        (section: any) => section.id === id
      );

      newIndex = currentIndex;
      if (direction === "up" && currentIndex > 0) {
        newIndex = currentIndex - 1;
      } else if (
        direction === "down" &&
        currentIndex < prevSections.length - 1
      ) {
        newIndex = currentIndex + 1;
      }

      if (newIndex !== currentIndex) {
        const updatedSections = [...prevSections];
        const [movedSection] = updatedSections.splice(currentIndex, 1);
        updatedSections.splice(newIndex, 0, movedSection);
        return updatedSections;
      }

      return prevSections;
    });

    const newvaible = newIndex ? newIndex + 1 : 0;

    axios
      .patch(`/admin/hero/${id}`, { newIndex: newvaible })
      .then((response) => {
        setShowAlert(true);
        return <Alert variant="success"> Index change successfully </Alert>;
      })
      .catch((error) => {
        console.error(
          "Error updating hero section order:",
          error.message || error
        );
      });
  };

 

  return (
    <div className="flex  w-full gap-2">
      <Container className="w-[9%] h-[250px] flex items-center justify-between flex-col">
        <Button
          onClick={() => handleMove("up")}
          variant="secondary"
          className="w-[50px] h-[50px]"
        >
          <ArrowLongUp />
        </Button>
        <Button
          onClick={() => handleMove("down")}
          variant="secondary"
          className="w-[50px] h-[50px]"
        >
          <ArrowDownMini />
        </Button>
      </Container>
      
      <Container className="divide-y p-0  h-[250px] flex flex-col item-center justify-center w-[90%]">
        <div className="flex items-center justify-between px-6 py-4 h-[50px]">
          <Heading level="h1">{title}</Heading>
          <div className="flex items-center justify-between px-6 py-4 w-[60%]">
            <Heading level="h3">{subtitle}</Heading>
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-2">
          <Container className="flex items-center justify-between h-[170px] object-cover aspect-[4/1] w-[300px] p-0 overflow-hidden">
            <img
              src={image}
              className="w-full h-full object-cover"
              alt="Card image"
            />
          </Container>
          <div className="flex items-center justify-between flex-col">
            <div className="px-6 py-4 w-full">
              <Button className="w-full">1. {firsttext}</Button>
            </div>
            <div className="px-6 py-4 w-full">
              <Button className="w-full">2. {secondtext}</Button>
            </div>
          </div>
          <div className="flex items-center justify-between flex-col gap-3">
            <Button onClick={() => setDeleteId(id)} variant="danger">
              Delete <XMarkMini />
            </Button>
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <Drawer.Trigger asChild>
                <Button>Edit Hero</Button>
              </Drawer.Trigger>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Edit Hero</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body className="p-4">
                  <div className="flex w-full max-w-lg flex-col gap-y-8">
                    <div className="flex flex-col gap-y-2">
                      <Label htmlFor="title" className="text-ui-fg-subtle">
                        Title
                      </Label>
                      <Input
                        id="title"
                        type="text"
                        value={editTitle}
                        maxLength={20}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <Label htmlFor="subtitle" className="text-ui-fg-subtle">
                        Subtitle
                      </Label>
                      <Textarea
                        id="subtitle"
                        value={editSubtitle}
                        maxLength={120}
                        onChange={(e) => setEditSubtitle(e.target.value)}
                        className="mt-1"
                        placeholder="Product description ..."
                      />
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <Label
                        htmlFor="imageUpload"
                        className="text-ui-fg-subtle"
                      >
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
                      <Label htmlFor="firstText" className="text-ui-fg-subtle">
                        First Text
                      </Label>
                      <Input
                        id="firstText"
                        type="text"
                        value={editFirstText}
                        maxLength={10}
                        onChange={(e) => setEditFirstText(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <Label htmlFor="secondText" className="text-ui-fg-subtle">
                        Second Text
                      </Label>
                      <Input
                        id="secondText"
                        type="text"
                        value={editSecondText}
                        maxLength={10}
                        onChange={(e) => setEditSecondText(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </Drawer.Body>
                <Drawer.Footer>
                  <Drawer.Close asChild>
                    <Button variant="secondary">Cancel</Button>
                  </Drawer.Close>
                  <Button onClick={handleSave}>Save</Button>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Herocard;
