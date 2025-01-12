import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Pencil } from "@medusajs/icons";
import { Container } from "@medusajs/ui";
import React, { useEffect, useState } from "react";
import { Button, FocusModal, Heading, Input, Label, Text } from "@medusajs/ui";
import Featuredcard from "./Featuredcard.js";

interface PostAdminCreateFeaturedsectionPayload {
  image: string;
  link: string;
  title: string;
  text: string;
}

const fetchFeaturedSections = async () => {
  try {
    const response = await fetch("/admin/featured");
    if (!response.ok) {
      throw new Error("Failed to fetch hero sections");
    }
    const data = await response.json();
    // console.log("Featured sections fetched successfully:", data);
    // console.log("Featured sections fetched successfully:", data);
    return data.featureds;
  } catch (error: any) {
    console.error("Error fetching hero sections:", error.message || error);
  }
};

type FeaturedSectionFormProps = {
  setfeaturedSections: React.Dispatch<
    React.SetStateAction<PostAdminCreateFeaturedsectionPayload[]>
  >;
};

const HighlightSectionForm: React.FC<FeaturedSectionFormProps> = ({
  setfeaturedSections,
}) => {
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [title, settitle] = useState("");
  const [text, settext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetForm = () => {
    setImage("");
    setLink("");
    settitle("");
    settext("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: PostAdminCreateFeaturedsectionPayload = {
      title,
      text,
      link,
      image,
    };

    try {
      // console.log("Payload", payload);
      const response = await fetch("/admin/featured", {
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
      // console.log("Featured section created successfully:", data);

      // Fetch updated hero sections
      const updatedHeroSections = await fetchFeaturedSections();
      if (updatedHeroSections) {
        setfeaturedSections(updatedHeroSections);
      }

      // Reset form and close modal
      resetForm();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error creating hero section:", err.message || err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FocusModal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <FocusModal.Trigger asChild>
        <Button onClick={() => setIsModalOpen(true)}>Add Featured</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <form id="heroForm" onSubmit={handleSubmit}>
          <FocusModal.Header>
            <Button type="submit" variant="primary" disabled={loading}>
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
                  onChange={(e) => settitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="text" className="text-ui-fg-subtle">
                  Text
                </Label>
                <Input
                  id="text"
                  type="text"
                  value={text}
                  onChange={(e) => settext(e.target.value)}
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
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="link" className="text-ui-fg-subtle">
                  Link
                </Label>
                <Input
                  id="link"
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </FocusModal.Body>
        </form>
      </FocusModal.Content>
    </FocusModal>
  );
};

const CustomPage = () => {
  const [featuredSections, setfeaturedSections] = useState<
    PostAdminCreateFeaturedsectionPayload[]
  >([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updateId, setUpdateId] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedSections().then((data) => {
      if (data) {
        // console.log(data);
        setfeaturedSections(data);
      }
    });
  }, []);

  useEffect(() => {
    if (deleteId) {
      const deleteFeaturedSection = async () => {
        try {
          const response = await fetch(`/admin/featured/${deleteId}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Failed to delete hero section");
          }
          // console.log("Featured section deleted successfully");
          const updatedHeroSections = await fetchFeaturedSections();
          if (updatedHeroSections) {
            setfeaturedSections(updatedHeroSections);
          }
        } catch (error: any) {
          console.error("Error deleting hero section:", error.message || error);
        }
      };
      deleteFeaturedSection();
    }
  }, [deleteId]);

  return (
    <>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Manage Featured here</Heading>
          {/* <HighlightSectionForm setfeaturedSections={setfeaturedSections} /> */}
        </div>
      </Container>
      <div className="flex flex-wrap gap-10 items-center justify-center">
        {featuredSections.length > 0 ? (
          featuredSections.map((section) => (
            <Featuredcard
              id={section.id}
              link={section.link}
              text={section.text}
              title={section.title}
              image={section.image}
              key={section.image} // Use a unique key (like ID)
              setfeaturedSections={setfeaturedSections}
              setDeleteId={setDeleteId}
            />
          ))
        ) : (
          <Text>No Featured Sections Available</Text>
        )}
      </div>
    </>
  );
};

// export const config = defineRouteConfig({
//   label: "Featured",
//   icon: Pencil,
// });

export default CustomPage;
