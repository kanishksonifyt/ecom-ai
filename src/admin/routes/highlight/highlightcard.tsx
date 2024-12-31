import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Drawer,
  Heading,
  FocusModal,
  Input,
  Label,
  Select,
  Text,
} from "@medusajs/ui";
import { XMarkMini } from "@medusajs/icons";
import axios from "axios";

const Highlightcard = ({
  id,
  link,
  image,
  filterData,
  product_id,
  sethighlightSections,
  setDeleteId,
}: {
  id: string;
  link: string;
  image: string;
  product_id: string;
  filterData: any;
  sethighlightSections: (heroSections: any) => void;
  setDeleteId: (id: string) => void;
}) => {
  // State for editing fields
  const [editLink, setEditLink] = useState(link);
  const [editImage, setEditImage] = useState(image);
  const [editProductId, setEditProductId] = useState<string | null>(product_id);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredIndData, setFilteredIndData] = useState(filterData);

  useEffect(()=>{
    setFilteredIndData(filterData)
  },[filterData])
  // const [deleteId, setDeleteId] = useState<string | null>(null);


  const updatehighlightSection = async (id: string, payload: Partial<any>) => {
    try {
      const response = await fetch(`/admin/highlight/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update highlight section"
        );
      }

      const data = await response.json();
      sethighlightSections((prevSections: any) =>
        prevSections.map((section: any) =>
          section.id === id ? { ...section, ...payload } : section
        )
      );

      console.log("Highlight section updated successfully:", data);
      return data;
    } catch (error: any) {
      console.error(
        "Error updating highlight section:",
        error.message || error
      );
    }
  };

  const uploadImage = async ( file : File) => {
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

        setEditImage(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSave = async () => {
    const payload = {
      image: editImage,
      link: editLink,
      product_id: editProductId,
    };

    const result = await updatehighlightSection(id, payload);
    if (result) {
      setDrawerOpen(false); // Close the drawer after successful update
    }
  };

  return (
    <div className="flex max-w-[300px] min-w-[250px] gap-2 h-[350px] flex-col">
      <Container className="divide-y p-0 h-[90%] max-h-[300px] flex flex-col item-center justify-center w-full relative overflow-hidden">
        <img
          src={image}
          alt="highlight"
          className="w-full h-full object-cover"
        />

        <Container className="flex items-center justify-between px-6 py-4 h-[50px]">
          <Heading level="h1">{link}</Heading>
        </Container>
      </Container>
      <Container className="flex items-center w-full justify-between h-[15%]">
        <Button
          variant="secondary"
          onClick={() => setDeleteId(id)}
          className=""
        >
          Delete <XMarkMini />
        </Button>
        <div>
          <FocusModal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <FocusModal.Trigger asChild>
              <Button onClick={() => setIsModalOpen(true)}>
                Add Highlight
              </Button>
            </FocusModal.Trigger>
            <FocusModal.Content className="overflow-y-auto">
              <form id="highlightForm" onSubmit={handleSave}>
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
                          onClick={() =>
                            document.getElementById("image")?.click()
                          }
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
                        onChange={(e) => setEditLink(e.target.value)}
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
                                  const searchValue =
                                    e.target.value.toLowerCase();
                                  const filteredData = filteredIndData.filter(
                                    (item :any) =>
                                      item.id
                                        .toLowerCase()
                                        .includes(searchValue)
                                  );
                                  setFilteredIndData(filteredData);
                                }}
                                className="mb-4"
                              />
                              {filteredIndData.map((item:any) => (
                                <Container
                                  key={item.id}
                                  onClick={() => setEditProductId(item.id)}
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
                        <Button
                          onClick={() => setEditProductId(null)}
                          className=""
                          type="button"
                        >
                          Remove Product
                        </Button>
                        {filteredIndData
                          .filter((item :any) => item.id === product_id)
                          .map((item :any) => (
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
                      </>
                    )}
                  </div>
                </FocusModal.Body>
              </form>
            </FocusModal.Content>
          </FocusModal>
        </div>
      </Container>
    </div>
  );
};

export default Highlightcard;
