import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Pencil } from "@medusajs/icons";
import { Container } from "@medusajs/ui";
import React, { useEffect, useState } from "react";
import { Button, FocusModal, Heading, Input, Label, Text } from "@medusajs/ui";
import Highlightcard from "./highlightcard.js";

interface PostAdminCreateCatalogsectionPayload {
  image: string;
  link: string;
}

const fetchCatalogSections = async () => {
  try {
    const response = await fetch("/admin/catalog");
    if (!response.ok) {
      throw new Error("Failed to fetch hero sections");
    }
    const data = await response.json();
    console.log("Catalog sections fetched successfully:", data);
    return data.catalogs;
  } catch (error: any) {
    console.error("Error fetching hero sections:", error.message || error);
  }
};

type CatalogSectionFormProps = {
  setcatalogSections: React.Dispatch<
    React.SetStateAction<PostAdminCreateCatalogsectionPayload[]>
  >;
};

const HighlightSectionForm: React.FC<CatalogSectionFormProps> = ({
  setcatalogSections,
}) => {
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetForm = () => {
    setImage("");
    setLink("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: PostAdminCreateCatalogsectionPayload = { link, image };

    try {
      const response = await fetch("/admin/catalog", {
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
      console.log("Catalog section created successfully:", data);

      // Fetch updated hero sections
      const updatedHeroSections = await fetchCatalogSections();
      if (updatedHeroSections) {
        setcatalogSections(updatedHeroSections);
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
        <Button onClick={() => setIsModalOpen(true)}>Add Catalog</Button>
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
  const [catalogSections, setcatalogSections] = useState<
    PostAdminCreateCatalogsectionPayload[]
  >([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updateId, setUpdateId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchCatalogSections().then((data) => {
      if (data) {
        console.log(data);
        setcatalogSections(data);
      }
    });
  }, []);

  useEffect(() => {
    if (deleteId) {
      setLoading(true);
      const deleteCatalogSection = async () => {
        try {
          const response = await fetch(`/admin/catalog/${deleteId}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Failed to delete hero section");
          }
          console.log("Catalog section deleted successfully");
          const updatedHeroSections = await fetchCatalogSections();
          if (updatedHeroSections) {
            setcatalogSections(updatedHeroSections);
            setLoading(false);
          }
        } catch (error: any) {
          console.error("Error deleting hero section:", error.message || error);
        }
      };
      deleteCatalogSection();
    }
  }, [deleteId]);

  return (
    <>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Add Catalog here</Heading>
          <HighlightSectionForm setcatalogSections={setcatalogSections} />
        </div>
      </Container>
      <Container className="min-h-[70vh] h-fit w-full">
        <div className="flex flex-wrap gap-10 items-center justify-center">
          {catalogSections.length > 0 ? (
            catalogSections.map((section, index) => (
              <Highlightcard
                id={section.id}
                link={section.link}
                deleteId={deleteId || ""}
                image={section.image}
                key={section.image} // Use a unique key (like ID)
                setcatalogSections={setcatalogSections}
                setDeleteId={setDeleteId}
                loading={loading}
              />
            ))
          ) : (
            <Text>No Catalog Sections Available</Text>
          )}
        </div>
      </Container>
    </>
  );
};

// export const config = defineRouteConfig({
//   label: "Catalog",
//   icon: Pencil,
// });

export default CustomPage;
