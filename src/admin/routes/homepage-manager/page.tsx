import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Link, Pencil, DotsSix } from "@medusajs/icons";
import {
  Container,
  Button,
  Drawer,
  Heading,
  Input,
  Label,
  toast,
  Text,
} from "@medusajs/ui";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Card from "./Card";

// Interfaces for payloads
interface PostAdminCreatereviewPayload {
  id: string;
  title: string;
  route: string;
}

interface PostAdminMangeroutePayload extends PostAdminCreatereviewPayload {
  index: number;
}

// Fetch home data
const fetchHome = async () => {
  try {
    const response = await fetch("/admin/home");
    if (!response.ok) {
      throw new Error("Failed to fetch home sections");
    }
    const data = await response.json();
    return data.heroes;
  } catch (error) {
    console.error("Error fetching home sections:", error);
    return [];
  }
};

// Delete a review
const deleteReview = async (id: string) => {
  try {
    const response = await fetch(`/admin/home/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete review");
    }
    console.log("Review deleted successfully");
  } catch (error) {
    console.error("Error deleting review:", error);
  }
};

// Routes configuration
const routes = [
  { name: "HeroSection", path: "/hero" },
  { name: "CatalogSection", path: "/catalog" },
  { name: "HighlightSection", path: "/highlight" },
  { name: "ReviewSection", path: "/review" },
  { name: "FeaturedSection", path: "/featured" },
  { name: "Product on Homepage", path: "/items" },
];

// Add and update routes component
const AddOrUpdateRoute = ({ isUpdate = false, initialData = null }: any) => {
  const [title, setTitle] = useState<string>(initialData?.title || "");
  const [route, setRoute] = useState<string>(initialData?.route || "");
  const [text, setText] = useState<string>(initialData?.text || "");
  const [redirect, setRedirect] = useState<string>(initialData?.redirect || "");
  const [index = 0, setIndex] = useState<number>(initialData?.index || 0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSubmit = async () => {
    try {
      const url = isUpdate ? `/admin/home/${initialData.id}` : "/admin/home";
      const method = isUpdate ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, route, index, text, redirect }),
      });
      if (!response.ok) {
        throw new Error("Failed to save route");
      }
      setIsDrawerOpen(false);
      console.log(`${isUpdate ? "Route updated" : "Route added"} successfully`);
    } catch (error) {
      console.error(`Error ${isUpdate ? "updating" : "adding"} route:`, error);
    }
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <Drawer.Trigger asChild>
        <Button>{isUpdate ? "Update Route" : "Add Route"}</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>
            {isUpdate ? "Update Route" : "Add New Route"}
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-4 flex flex-col gap-5">
          <Label>
            <Text>Title</Text>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
          </Label>
          <Label>
            <Text>Route</Text>
            <Input
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              placeholder="Route"
            />
          </Label>
          {isUpdate && (
            <>
              <Label>
                <Text>Redirect</Text>
                <Input
                  value={redirect}
                  onChange={(e) => setRedirect(e.target.value)}
                  placeholder="Redirect"
                />
              </Label>
              <Label>
                <Text>Text on Button</Text>
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Text"
                />
              </Label>
            </>
          )}
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Drawer.Close>
          <Button
            onClick={handleSubmit}
            variant="primary"
            disabled={!title || !route}
          >
            Save
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};

const CustomPage = () => {
  const [home, setHome] = useState<PostAdminMangeroutePayload[]>([]);
  const [isDrawer, setIsDrawer] = useState(false);
  const navigate = useNavigate();

  const deleteroute = async (id: string) => {
    await deleteReview(id);
    setHome((prevRoutes) => prevRoutes.filter((route) => route.id !== id));
  };

  const handleMove = (direction: "up" | "down", id: string) => {
    setHome((prevSections) => {
      const currentIndex = prevSections.findIndex(
        (section) => section.id === id
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
          .then(() => console.log("Index updated successfully"))
          .catch((error) => console.error("Error updating index:", error));

        return updatedSections;
      }
      return prevSections;
    });
  };

  useEffect(() => {
    fetchHome().then((data) => setHome(Array.isArray(data) ? data : []));
  }, []);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setIsDrawer(false);

    console.log(active, over);

    // toast.loading("Updating index", {
    //   description: "Updating index of the section",
    // })

    if (over && active.id !== over.id) {
      setHome((prevSections) => {
        const oldIndex = prevSections.findIndex(
          (section) => section.id === active.id
        );
        const newIndex = prevSections.findIndex(
          (section) => section.id === over.id
        );

        const updatedSections = arrayMove(prevSections, oldIndex, newIndex);

        axios
          .patch(`/admin/home/${active.id}`, { newIndex: newIndex + 1 })
          .then(() => {
            toast.dismiss();
            toast.success("Success", {
              description: "Index updated successfully",
            });
          })
          .catch((error) => {
            toast.dismiss();
            console.error("Error updating index:", error);
          });

        return updatedSections;
      });
    }
  }

  console.log(home);

  return (
    <>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Manage Homepage</Heading>
          <AddOrUpdateRoute />
        </div>
      </Container>
      <div className="flex flex-col gap-2 overflow-x-hidden px-2 py-2">
        <DndContext
          onDragStart={() => setIsDrawer(true)}
          onDragEnd={(event) => onDragEnd(event)}
          collisionDetection={closestCenter}
        >
          <SortableContext items={home} strategy={verticalListSortingStrategy}>
            {home.map((route) => (
              <Card
                key={route.id}
                route={route}
                deleteroute={deleteroute}
                navigate={navigate}
                AddOrUpdateRoute={AddOrUpdateRoute}
                setHome={setHome}
                isDrawer={isDrawer}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
};

export const config = defineRouteConfig({
  label: "Homepage Manager",
  icon: Pencil,
});

export default CustomPage;
