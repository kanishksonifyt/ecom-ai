import { defineRouteConfig } from "@medusajs/admin-sdk";
import { PuzzleSolid } from "@medusajs/icons";
import { Alert, Container } from "@medusajs/ui";
import React, { useEffect, useState } from "react";
import {
  Button,
  FocusModal,
  Heading,
  Input,
  Label,
  Text,
  toast,
} from "@medusajs/ui";
import { Textarea } from "@medusajs/ui";
import Herocard from "./Herocard.js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import HeroSectionForm from "./HeroSectionForm";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface PostAdminCreateHerosectionPayload {
  id: string;
  title: string;
  subtitle: string;
  firsttext: string;
  secondtext: string;
  image: string;
  index: number;
  firstbuttonroute: string;
  secoundbuttonroute: string;
}

const fetchHeroSections = async () => {
  try {
    const response = await fetch("/admin/hero");
    if (!response.ok) {
      throw new Error("Failed to fetch hero sections");
    }
    const data = await response.json();
    // console.log("Hero sections fetched successfully:", data.heroes);
    return data.heroes;
  } catch (error: any) {
    console.error("Error fetching hero sections:", error.message || error);
  }
};

const CustomPage = () => {
  const [heroSections, setHeroSections] = useState<
    PostAdminCreateHerosectionPayload[]
  >([]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updateId, setUpdateId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const [isDrawer, setIsDrawer] = useState(false);
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
    // console.log(`Moved from index ${source.index} to ${destination.index}`);
  };

  const deleteHeroSection = async (id: string) => {
    try {
      const response = await fetch(`/admin/hero/${id}`, {
        method: "DELETE",
      });

      // console.log("Delete response:", response);
      if (response.status !== 204) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete hero section");
      }

      // const data = await response.json();
      // // console.log("Hero section deleted successfully:", data);
      fetchHeroSections().then((data) => {
        if (data) {
          setHeroSections(data);
        }
        toast.dismiss();
        toast.success("Success", {
          description: "Hero deleted successfully",
        });
      });
    } catch (error: any) {
      console.error("Error deleting hero section:", error.message || error);
    }
  };

  // console.log(typeof heroSections[0]?.index);

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

  useEffect(() => {
    fetchHeroSections().then((data) =>
      setHeroSections(Array.isArray(data) ? data : [])
    );
  }, []);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setIsDrawer(false);

    // console.log(active, over);

    if (over && active.id !== over.id) {
      setHeroSections((prevSections) => {
        const oldIndex = prevSections.findIndex(
          (section) => section.id === active.id
        );
        const newIndex = prevSections.findIndex(
          (section) => section.id === over.id
        );

        const updatedSections = arrayMove(prevSections, oldIndex, newIndex);

        axios
          .patch(`/admin/hero/${active.id}`, { newIndex: newIndex + 1 })
          .then((response) => {
            setShowAlert(true);
            toast.dismiss();
            toast.success("Success", {
              description: "Index updated successfully",
            });
          })
          .catch((error) => {
            console.error(
              "Error updating hero section order:",
              error.message || error
            );
          });

        return updatedSections;
      });
    }
  }

  return (
    <>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Add herosection data here</Heading>
          <HeroSectionForm setHeroSections={setHeroSections} />
        </div>
      </Container>
      <DndContext
        onDragStart={() => setIsDrawer(true)}
        onDragEnd={(event) => onDragEnd(event)}
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={heroSections}
          strategy={verticalListSortingStrategy}
        >
          {heroSections.length > 0 ? (
            heroSections.map((section, index) => (
              <Herocard
                key={heroSections[index].index}
                id={section.id}
                title={section.title}
                subtitle={section.subtitle}
                isDrawer={isDrawer}
                sectionIndex={section.index}
                firsttext={section.firsttext}
                secondtext={section.secondtext}
                firstbuttonroute={section.firstbuttonroute}
                secoundbuttonroute={section.secoundbuttonroute}
                setDeleteId={setDeleteId}
                setShowAlert={setShowAlert}
                image={section.image}
                setHeroSections={setHeroSections}
              />
            ))
          ) : (
            <Text>No Hero Sections Available</Text>
          )}
        </SortableContext>
      </DndContext>
    </>
  );
};

// export const config = defineRouteConfig({
//   label: "Hero Designer",
//   icon: PuzzleSolid,
// });

export default CustomPage;
