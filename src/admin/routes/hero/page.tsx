import { defineRouteConfig } from "@medusajs/admin-sdk";
import { PuzzleSolid } from "@medusajs/icons";
import { Alert, Container } from "@medusajs/ui";
import React, { useEffect, useState } from "react";
import { Button, FocusModal, Heading, Input, Label, Text } from "@medusajs/ui";
import { Textarea } from "@medusajs/ui";
import Herocard from "./Herocard.js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";

interface PostAdminCreateHerosectionPayload {
  id: string;
  title: string;
  subtitle: string;
  firsttext: string;
  secondtext: string;
  image: string;
  index: number;
}

const fetchHeroSections = async () => {
  try {
    const response = await fetch("/admin/hero");
    if (!response.ok) {
      throw new Error("Failed to fetch hero sections");
    }
    const data = await response.json();
    console.log("Hero sections fetched successfully:", data.heroes);
    return data.heroes;
  } catch (error: any) {
    console.error("Error fetching hero sections:", error.message || error);
  }
};

const HeroSectionForm = ({
  setHeroSections,
}: {
  setHeroSections: React.Dispatch<
    React.SetStateAction<PostAdminCreateHerosectionPayload[]>
  >;
}) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [firstText, setFirstText] = useState("");
  const [secondText, setSecondText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  interface HeroSectionFormProps {
    setHeroSections: React.Dispatch<
      React.SetStateAction<PostAdminCreateHerosectionPayload[]>
    >;
  }

  interface HeroSectionPayload {
    id: string;
    title: string;
    subtitle: string;
    firsttext: string;
    secondtext: string;
    image: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: HeroSectionPayload = {
      id: "", // Provide a valid id here if needed
      title,
      subtitle,
      firsttext: firstText,
      secondtext: secondText,
      image,
    };

    try {
      const response = await fetch("/admin/hero", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create hero section");
      }

      const data = await response.json();
      console.log("Hero section created successfully:", data);

      // Fetch updated hero sections
      const updatedHeroSections = await fetchHeroSections();
      if (updatedHeroSections) {
        setHeroSections(updatedHeroSections);
      }

      // Close modal on success
      setIsModalOpen(false);
      setTitle("");
      setSubtitle("");
      setFirstText("");
      setSecondText("");
      setImage("");
    } catch (err: any) {
      console.error("Error creating hero section:", err.message || err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="heroForm" className="space-y-6" onSubmit={handleSubmit}>
      <FocusModal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <FocusModal.Trigger asChild>
          <Button onClick={() => setIsModalOpen(true)}>Add Hero</Button>
        </FocusModal.Trigger>
        <FocusModal.Content>
          <FocusModal.Header>
            <Button
              onClick={() =>
                document
                  .getElementById("heroForm")
                  ?.dispatchEvent(
                    new Event("submit", { cancelable: true, bubbles: true })
                  )
              }
              variant="primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              {error && <div className="text-red-500">{error}</div>}
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="title" className="text-ui-fg-subtle">
                  Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  maxLength={50}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="subtitle" className="text-ui-fg-subtle">
                  Subtitle
                </Label>
                <Textarea
                  id="subtitle"
                  value={subtitle}
                  maxLength={120}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="mt-1"
                  placeholder="Product description ..."
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="imageUpload" className="text-ui-fg-subtle">
                  Image Link
                </Label>
                <Input
                  id="imageUpload"
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
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
                  value={firstText}
                  maxLength={10}
                  onChange={(e) => setFirstText(e.target.value)}
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
                  maxLength={10}
                  value={secondText}
                  onChange={(e) => setSecondText(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </form>
  );
};

const CustomPage = () => {
  const [heroSections, setHeroSections] = useState<
    PostAdminCreateHerosectionPayload[]
  >([]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updateId, setUpdateId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchHeroSections().then((data) => {
      if (data) {
        setHeroSections(data);
      }
    });
  }, []);

  useEffect(() => {
    if (deleteId) {
      deleteHeroSection(deleteId);
    }
  }, [deleteId]);

  const handleDragEnd = (result: {
    source: { index: number };
    destination: { index: number } | null;
  }) => {
    const { source, destination } = result;

    if (!destination) return; // If dropped outside the list, ignore.

    // Reorder the items based on the source and destination index.
    const updatedSections = Array.from(heroSections);
    const [movedItem] = updatedSections.splice(source.index, 1);
    updatedSections.splice(destination.index, 0, movedItem);

    setHeroSections(updatedSections);
    console.log(`Moved from index ${source.index} to ${destination.index}`);
  };

  const deleteHeroSection = async (id: string) => {
    try {
      const response = await fetch(`/admin/hero/${id}`, {
        method: "DELETE",
      });

      console.log("Delete response:", response);
      if (response.status !== 204) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete hero section");
      }

      // const data = await response.json();
      // console.log("Hero section deleted successfully:", data);
      fetchHeroSections().then((data) => {
        if (data) {
          setHeroSections(data);
        }
      });
    } catch (error: any) {
      console.error("Error deleting hero section:", error.message || error);
    }
  };

  console.log(typeof heroSections[0]?.index);

  // useEffect(() => {
  //   const sortedHeroSections = [...heroSections].sort((a, b) => a.index - b.index);
  //   setHeroSections(sortedHeroSections);
  // }, [heroSections]);


  function AlertSuccess() {
    return <Alert variant="success">Data updated successfully!</Alert>;
  }

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  
  return (
    <>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Add herosection data here</Heading>
          <HeroSectionForm setHeroSections={setHeroSections} />
        </div>
      </Container>
      <div className="flex flex-col gap-2">
        {heroSections.length > 0 ? (
          heroSections.map((section, index) => (
            <Herocard
              key={heroSections[index].index}
              id={section.id}
              title={section.title}
              subtitle={section.subtitle}
              sectionIndex={section.index}
              firsttext={section.firsttext}
              secondtext={section.secondtext}
              setDeleteId={setDeleteId}
              setShowAlert={setShowAlert}
              image={section.image}
              setHeroSections={setHeroSections}
            />
          ))
        ) : (
          <Text>No Hero Sections Available</Text>
        )}
      </div>
    </>
  );
};

// export const config = defineRouteConfig({
//   label: "Hero Designer",
//   icon: PuzzleSolid,
// });

export default CustomPage;
