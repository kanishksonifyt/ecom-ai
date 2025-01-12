import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Container, Button, Heading } from "@medusajs/ui";
import axios from "axios";
import { DotsSix, Link } from "@medusajs/icons";

const Card = ({
  route,
  deleteroute,
  setHome,
  isDrawer,
  AddOrUpdateRoute,
  navigate,
}: {
  route: any;
  deleteroute: any;
  setHome: any;
  isDrawer: boolean;
  navigate: any;
  AddOrUpdateRoute: any;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: route.id,
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleMove = (direction: "up" | "down", id: string) => {
    setHome((prevSections: any) => {
      const currentIndex = prevSections.findIndex(
        (section: any) => section.id === id
      );
      let newIndex = currentIndex;

      if (direction === "up" && currentIndex > 0) {
        newIndex -= 1;
      } else if (
        direction === "down" &&
        currentIndex < prevSections.length - 1
      ) {
        newIndex += 1;
      }

      if (newIndex !== currentIndex) {
        const updatedSections = [...prevSections];
        const [movedSection] = updatedSections.splice(currentIndex, 1);
        updatedSections.splice(newIndex, 0, movedSection);

        axios
          .patch(`/admin/home/${id}`, { newIndex: newIndex + 1 })
          .then(() => {
            // console.log("Index updated successfully")
          })
          .catch((error : any) => console.error("Error updating index:", error));

        return updatedSections;
      }
      return prevSections;
    });
  };

  return (
    <div style={style} className="flex w-full gap-2" key={route.id}>
      <Container
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={`w-[9%] h-[100px] flex items-center justify-center ${isDrawer ? "cursor-grabbing" : "cursor-grab"}`}
      >
        <DotsSix className="w-fit h-fit" />
      </Container>
      <Container className="divide-y p-0 h-[100px] flex items-center justify-center w-[90%] px-5">
        <div className="flex items-center justify-around w-full px-6 py-4 h-[50px]">
          <Heading level="h1">{route.title}</Heading>
          <Button
            variant="secondary"
            onClick={() => navigate(route.route)}
            className="w-[50px] h-[50px]"
          >
            <Link />
          </Button>
        </div>
        <div className="flex items-center justify-between w-fit px-6 py-4 h-[50px]">
          {/* <Button variant="danger" onClick={() => deleteroute(route.id)}>
            Delete
          </Button> */}
           <AddOrUpdateRoute isUpdate={true} initialData={route} />
        </div>
      </Container>
    </div>
  );
};

export default Card;
