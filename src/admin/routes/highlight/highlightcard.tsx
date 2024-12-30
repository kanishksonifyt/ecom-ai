import React, { useState } from "react";
import {
  Container,
  Button,
  Drawer,
  Heading,
  Input,
  Label,
  Select,
  Text,

} from "@medusajs/ui";
import { XMarkMini } from "@medusajs/icons";

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
        throw new Error(errorData.message || "Failed to update highlight section");
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
      console.error("Error updating highlight section:", error.message || error);
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
        <img src={image} alt="highlight" className="w-full h-full object-cover" />

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
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <Drawer.Trigger asChild>
            <Button>Edit Highlight</Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Edit Highlight</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="p-4">
              <div className="flex w-full max-w-lg flex-col gap-y-8">
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="link" className="text-ui-fg-subtle">
                    Link
                  </Label>
                  <Input
                    id="link"
                    type="text"
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
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
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="mt-1"
                  />
                </div>
                {!editProductId ? (
                  <div className="w-full">
                    <Select>
                      <Select.Trigger>
                        <Select.Value placeholder="Select a product" />
                      </Select.Trigger>
                      <Select.Content>
                        {filterData.map((item :any) => (
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
                      </Select.Content>
                    </Select>
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={() => setEditProductId(null)}
                      className=""
                    >
                      Remove Product
                    </Button>
                    {filterData
                      .filter((item :any ) => item.id === editProductId )
                      .map((item:any) => (
                        <Container key={item.id} className="h-[200px] overflow-x-auto">
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
            </Drawer.Body>
            <Drawer.Footer className="flex justify-between h-32">
              <Drawer.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Drawer.Close>
              <Button onClick={handleSave}>Save</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </Container>
    </div>
  );
};

export default Highlightcard;
