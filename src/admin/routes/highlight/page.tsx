import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Pencil } from "@medusajs/icons";
import { Container } from "@medusajs/ui";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  FocusModal,
  Heading,
  Input,
  Label,
  Drawer,
  Text,
  Select,
  Switch,
} from "@medusajs/ui";
import Highlightcard from "./highlightcard.js";

interface PostAdminCreateHighlightsectionPayload {
  id: string;
  image: string;
  link: string;
  product_id: string; // Add this line
}

const fetchHighlightSections = async () => {
  try {
    const response = await fetch("/admin/highlight");
    if (!response.ok) {
      throw new Error("Failed to fetch hero sections");
    }
    const data = await response.json();
    // console.log("Hero sections fetched successfully:", data);
    // console.log("Hero sections fetched successfully:", data.highlights);
    return data.highlights;
  } catch (error: any) {
    console.error("Error fetching hero sections:", error.message || error);
  }
};

type HighlightSectionFormProps = {
  sethighlightSections: React.Dispatch<
    React.SetStateAction<PostAdminCreateHighlightsectionPayload[]>
  >;
};

const HighlightSectionForm: React.FC<HighlightSectionFormProps> = ({
  sethighlightSections,
}) => {
  const [image, setImage] = useState("");

  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredIndData, setFilteredIndData] = useState<any[]>([]);
  const [product_id, setProduct_id] = useState("");

  const fetchFeaturedSections = async () => {
    try {
      const response = await fetch("/admin/product");
      if (!response.ok) {
        throw new Error("Failed to fetch featured sections");
      }
      const data = await response.json();
      return data.result.products;
    } catch (error: any) {
      console.error(
        "Error fetching featured sections:",
        error.message || error
      );
      return [];
    }
  };

  useEffect(() => {
    fetchFeaturedSections().then((data) => {
      if (data) {
        setFilteredIndData(data);
      }
    });
  }, []);

  const resetForm = () => {
    setImage("");
    setLink("");
    setError(null);
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

        setImage(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const uploadvideo = async (file: File) => {
    if (file) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("image", file);

        const response = await axios.post(
          "http://148.135.138.221:4000/upload-video",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization:
                "Bearer 5d92b8f69c9dda89f38c10fa6750376a25b53a9afd47e74951104769630d4ccc",
            },
          }
        );

        setImage(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      id: "",
      link,
      image,
    };

    try {
      const response = await fetch("/admin/highlight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create highlight section"
        );
      }

      const data = await response.json();
      // console.log("Highlight section created successfully:", data);

      fetchHighlightSections().then((data) => {
        if (data) {
          sethighlightSections(data);
        }
      });
      resetForm();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error creating highlight section:", err.message || err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <FocusModal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <FocusModal.Trigger asChild>
          <Button onClick={() => setIsModalOpen(true)}>Add Highlight</Button>
        </FocusModal.Trigger>
        <FocusModal.Content className="overflow-y-auto">
          <form id="highlightForm" onSubmit={handleSubmit}>
            <FocusModal.Header>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </FocusModal.Header>
            <FocusModal.Body className="flex flex-col items-center py-16">
              <div className="flex w-full max-w-lg flex-col gap-y-8">
                {error && <div className="text-red-500">{error}</div>}
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
                <Container className="flex flex-col gap-y-2 h-[200px] p-0 overflow-hidden justify-center items-center">
                  {image ? (
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
                          src={image}
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
                  <Label htmlFor="link" className="text-ui-fg-subtle">
                    Redirect Link
                  </Label>
                  <Input
                    id="link"
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="mt-1"
                  />
                </div>

                {!product_id ? (
                  <div className="w-full">
                    <Drawer>
                      <Drawer.Trigger>
                        <Button type="button" className="w-full">
                          Select product
                        </Button>
                      </Drawer.Trigger>
                      <Drawer.Content>
                        <Drawer.Header>
                          <Drawer.Title>Drawer Title</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body className="overflow-y-auto">
                          <Input
                            type="text"
                            placeholder="Search by ID"
                            onChange={(e) => {
                              const searchValue = e.target.value.toLowerCase();
                              const filteredData = filteredIndData.filter(
                                (item) =>
                                  item.id.toLowerCase().includes(searchValue)
                              );
                              setFilteredIndData(filteredData);
                            }}
                            className="mb-4"
                          />
                          {filteredIndData.map((item) => (
                            <Container
                              key={item.id}
                              onClick={() => setProduct_id(item.id)}
                              className="mt-2"
                            >
                              <Heading level="h3" className="text-2xl mb-4">
                                {item.title}
                              </Heading>
                              <Label
                                htmlFor={`product-${item.id}`}
                                className="space-y-2"
                              >
                                <Text>
                                  <strong>ID:</strong> {item.id}
                                </Text>
                                <Text>
                                  <strong>Description:</strong>{" "}
                                  {item.description}
                                </Text>
                                <div className="flex items-center space-x-4">
                                  <strong>Thumbnail:</strong>
                                  {item.thumbnail ? (
                                    <img
                                      src={item.thumbnail}
                                      alt="Thumbnail"
                                      className="w-20 h-20 object-cover rounded-md"
                                    />
                                  ) : (
                                    <span className="text-gray-500">
                                      No Thumbnail Available
                                    </span>
                                  )}
                                </div>
                                <Text>
                                  <strong>Status:</strong> {item.status}
                                </Text>
                              </Label>
                            </Container>
                          ))}
                        </Drawer.Body>
                        <Drawer.Footer>Footer</Drawer.Footer>
                      </Drawer.Content>
                    </Drawer>
                  </div>
                ) : (
                  <>
                    <Button onClick={() => setProduct_id(null)} className="">
                      Remove Product
                    </Button>
                    {filteredIndData
                      .filter((item) => item.id === product_id)
                      .map((item) => (
                        <Container key={item.id} className="">
                          <Heading level="h3" className="text-2xl mb-4">
                            {item.title}
                          </Heading>
                          <Label
                            htmlFor={`product-${item.id}`}
                            className="space-y-2"
                          >
                            <Text>
                              <strong>ID:</strong> {item.id}
                            </Text>
                            <Text>
                              <strong>Description:</strong> {item.description}
                            </Text>
                            <div className="flex items-center space-x-4">
                              <strong>Thumbnail:</strong>
                              {item.thumbnail ? (
                                <img
                                  src={item.thumbnail}
                                  alt="Thumbnail"
                                  className="w-20 h-20 object-cover rounded-md"
                                />
                              ) : (
                                <span className="text-gray-500">
                                  No Thumbnail Available
                                </span>
                              )}
                            </div>
                            <Text>
                              <strong>Status:</strong> {item.status}
                            </Text>
                          </Label>
                        </Container>
                      ))}
                  </>
                )}
              </div>
            </FocusModal.Body>
          </form>
        </FocusModal.Content>
      </FocusModal>
    </div>
  );
};

const Addredirect = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [route, setRoute] = useState("");
  const [redirect, setRedirect] = useState("");
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const isUpdate = !!redirect;

  const fetchRouteData = async () => {
    try {
      const response = await fetch(`/admin/home/01JG6HH2SRR40N5ESFWXZ44FRY`);
      if (!response.ok) {
        throw new Error("Failed to fetch route data");
      }
      const data = await response.json();
      setTitle(data.home.result.title);
      setRoute(data.home.result.route);
      setIndex(data.home.result.index);
      setRedirect(data.home.result.redirect);
      setText(data.home.result.text);
      // console.log("Route data fetched successfully:", data.home.result);
    } catch (error) {
      console.error("Error fetching route data:", error);
    }
  };

  useEffect(() => {
    fetchRouteData();
  }, []);

  const handleSubmit = async () => {
    try {
      const url = `/admin/home/01JG6HH2SRR40N5ESFWXZ44FRY`;
      const method = "PUT";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, redirect, title, route, index }),
      });
      if (!response.ok) {
        throw new Error("Failed to save route");
      }
      setIsDrawerOpen(false);
      // console.log(`"Route updated"  successfully`);
    } catch (error) {
      console.error(`Error updating  route:`, error);
    }
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <Drawer.Trigger asChild>
        <Button>GO TO</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Update Route</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-4 flex flex-col gap-5">
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
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Drawer.Close>
          <Button
            disabled={!title || !route || !redirect || !text}
            onClick={handleSubmit}
            variant="primary"
          >
            Save
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};

const CustomPage = () => {
  const [highlightSections, sethighlightSections] = useState<
    PostAdminCreateHighlightsectionPayload[]
  >([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updateId, setUpdateId] = useState<string | null>(null);
  const [filteredIndData, setFilteredIndData] = useState<any[]>([]);

  useEffect(() => {
    fetchHighlightSections().then((data) => {
      if (data) {
        // console.log(data);
        sethighlightSections(data);
      }
    });
  }, []);

  useEffect(() => {
    if (deleteId) {
      const deleteHeroSection = async () => {
        try {
          const response = await fetch(`/admin/highlight/${deleteId}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Failed to delete hero section");
          }
          // console.log("Hero section deleted successfully");
          const updatedHeroSections = await fetchHighlightSections();
          if (updatedHeroSections) {
            sethighlightSections(updatedHeroSections);
          }
        } catch (error: any) {
          console.error("Error deleting hero section:", error.message || error);
        }
      };
      deleteHeroSection();
    }
  }, [deleteId]);

  const fetchFeaturedSections = async () => {
    try {
      const response = await fetch("/admin/product");
      if (!response.ok) {
        throw new Error("Failed to fetch featured sections");
      }
      const data = await response.json();
      return data.result.products;
    } catch (error: any) {
      console.error(
        "Error fetching featured sections:",
        error.message || error
      );
      return [];
    }
  };

  useEffect(() => {
    fetchFeaturedSections().then((data) => {
      if (data) {
        setFilteredIndData(data);
      }
    });
  }, []);

  return (
    <>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Add Highlights here</Heading>
          <div className="flex gap-4">
            <Addredirect />
            <HighlightSectionForm sethighlightSections={sethighlightSections} />
          </div>
        </div>
      </Container>
      <div className="flex flex-wrap gap-10 items-center justify-center">
        {highlightSections.length > 0 ? (
          highlightSections.map((section) => (
            <Highlightcard
              id={section.id}
              product_id={section.product_id}
              link={section.link}
              filterData={filteredIndData}
              image={section.image}
              key={section.image} // Use a unique key (like ID)
              sethighlightSections={sethighlightSections}
              setDeleteId={setDeleteId}
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
//   label: "Highlights",
//   icon: Pencil,
// });

export default CustomPage;
