import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Pencil } from "@medusajs/icons";
import { Container } from "@medusajs/ui";
import React, { useEffect, useState } from "react";
import { Button, FocusModal, Heading, Input, Label, Text } from "@medusajs/ui";
import Highlightcard from "./highlightcard.js";
import axios from "axios";
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
    // console.log("Catalog sections fetched successfully:", data);
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
  const [image, setImage] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responseImageLink, setResponseImageLink] = useState<string | null>(
    null
  );

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

        setResponseImageLink(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const resetForm = () => {
    setImage(null);
    setLink("");
    setError(null);
    setLoading(false);
    setResponseImageLink(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = { link, image: responseImageLink };

      const response = await fetch("/admin/catalog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create catalog section"
        );
      }

      const updatedSections = await fetchCatalogSections(); // Replace with your data fetching logic
      setcatalogSections(updatedSections);
      resetForm();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error creating catalog section:", err);
      setError("this is error :" + err.message || "Something went wrong");
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
        <form id="catalogForm" onSubmit={handleSubmit}>
          <FocusModal.Header>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              {error && <div className="text-red-500">{error}</div>}
              {/* <div className="flex flex-col gap-y-2">
                <Label htmlFor="imageUpload">Image URL</Label>
                <Input
                  id="imageUpload"
                  type="text"
                  value={image instanceof File ? "" : image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Enter image URL or upload"
                />
              </div> */}
              <div>
                <label htmlFor="image">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => document.getElementById("images")?.click()}
                    className="w-full h-[300px] border-ui-bg rounded-lg flex items-center justify-center p-0 overflow-hidden"
                  >
                    {responseImageLink ? (
                      <img
                        className="w-full h-full object-cover"
                        src={responseImageLink}
                        alt="Uploaded preview"
                      />
                    ) : loading ? (
                      "uploading..."
                    ) : (
                      "Upload Image"
                    )}
                  </Button>
                </label>
                <input
                  id="images"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file instanceof File) {
                      uploadImage(file);
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="link">Link</Label>
                <Input
                  id="link"
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Enter link"
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
        // console.log(data);
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
          // console.log("Catalog section deleted successfully");
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
                setCatalogSections={setcatalogSections}
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
