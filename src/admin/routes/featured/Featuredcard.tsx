import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  FocusModal,
  Heading,
  Input,
  Label,
  Drawer,
  DropdownMenu,
  Text,
} from "@medusajs/ui";
import { XMarkMini } from "@medusajs/icons";
import axios from "axios";

interface AddImageToCatalogProps {
  setCatalogImage: (newImageData: any) => void; // Define the expected type
}

interface CatalogItem {
  id: string; // Adjust the type according to your data structure
  [key: string]: any;
}

interface CatalogProps {
  catalogData: CatalogItem[];
  setCatalogData: React.Dispatch<React.SetStateAction<CatalogItem[]>>;
}

export function AddImageToCatalog({ setCatalogImage }: AddImageToCatalogProps) {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const uploadImage = async (file: File) => {
    if (!file) return;

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

      const uploadedImage = response.data;
      setImage(uploadedImage); // Set the image in the local state
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImage("");
    setLink("");
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = axios
        .post("/admin/catalogfeatured", {
          link: link,
          image: image,
        })
        .then((res) => {
          console.log(res.data.catalogfeatured);

          const responseData = res.data.catalogfeatured; // Assuming the response contains data
          setCatalogImage((prev: any) => [...prev, responseData]); // Append new data to the catalog images
          resetForm();
          setDrawerOpen(false);
        }) as any;
    } catch (err: any) {
      console.error("Error creating catalog section:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <Drawer.Trigger asChild>
        <Button>Add Image to Catalog</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Add Image to Catalog</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-4">
          <div className="flex flex-col gap-y-4">
            <div>
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="image">Click to upload an image</Label>
              <input
                id="image"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file instanceof File) {
                    uploadImage(file);
                  }
                }}
              />
              <Button
                variant="secondary"
                onClick={() => document.getElementById("image")?.click()}
                disabled={loading}
                className="w-full p-0 h-[200px]"
              >
                {!loading ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "Uploading..."
                )}
              </Button>
            </div>
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Drawer.Close>
          <Button onClick={handleSubmit}>Save</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
}

const Featuredcard = ({
  id,
  link,
  image,
  title,
  text,
  type,
  setfeaturedSections,
  setDeleteId,
}: {
  id: string;
  link: string;
  image: string;
  title: string;
  text: string;
  type: string;
  setfeaturedSections: (heroSections: any) => void;
  setDeleteId: (id: string) => void;
}) => {
  const [editLink, setEditLink] = useState(link);
  const [editImage, setEditImage] = useState(image);
  const [drawerOpen, setFocusModalOpen] = useState(false);
  const [edittitle, setedittitle] = useState(title);
  const [edittext, setedittext] = useState(text);
  const [loading, setLoading] = useState(false);
  const [useCatalog, setUseCatalog] = useState(type ? true : false); // New state to switch between upload and catalog
  const [catalogImages, setCatalogImages] = useState<string[]>([]); // Store catalog images

  const updatecatalogSection = async (id: string) => {
    try {
      const response = await axios.put(`/admin/featured/${id}`, {
        image: useCatalog ? "" : editImage,
        link: editLink,
        title: edittitle,
        text: edittext,
        type: useCatalog ? "catalog" : "video",
      });

      // if (response.status !== 200) {
      //   const errorData = await response.json();
      //   throw new Error(
      //     errorData.message || "Failed to update catalog section"
      //   );
      // }

      const data = (await response.status) == 201;
      setfeaturedSections((prevSections: any) =>
        prevSections.map((section: any) =>
          section.id === id ? { ...section, image: useCatalog ? "" : editImage,
            link: editLink,
            title: edittitle,
            text: edittext,
            type: useCatalog ? "catalog" : "video", } : section
        )
      );
      return data;
    } catch (error: any) {
      console.error("Error updating catalog section:", error);
    }
  };

  const handleSave = async () => {
    if (!editImage && !useCatalog) {
      console.error("Image must be provided when not using a catalog");
      return;
    }

    // const payload = {
    //   image: useCatalog ? "" : editImage,
    //   link: editLink,
    //   title: edittitle,
    //   text: edittext,
    //   type: useCatalog ? "catalog" : "video",
    // };

    const result = await updatecatalogSection(id);
    if (result) {
      setFocusModalOpen(false);
    }
  };

  const uploadVideo = async (file: File) => {
    console.log("image uploder run");
    if (file) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("video", file);

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
        setEditImage(response.data.url);
        setLoading(false);
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  const fetchCatalogImages = async () => {
    try {
      const response = await axios.get("/admin/catalogfeatured/");
      console.log(response);
      setCatalogImages(response.data.catalogfeatureds); // Assuming this API returns a list of image URLs
    } catch (error) {
      console.error("Error fetching catalog images:", error);
    }
  };

  useEffect(()=>{
    fetchCatalogImages()
  },[])

  const deleteCatalog = (
    id: string,
    setCatalogData: React.Dispatch<React.SetStateAction<CatalogItem[]>>
  ) => {
    fetch(`/admin/catalogfeatured/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete catalog item");
        }
        console.log("Delete response:", response);
        // Update state to remove the deleted item
        setCatalogData((prevData) => prevData.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting catalog item:", error);
      });
  };

  return (
    <div className="flex w-full gap-2 h-[350px] flex-col">
      <Container className="divide-y p-0 h-[90%] max-h-[300px] flex items-center justify-between w-full relative overflow-hidden">
        <div  className="w-full h-full object-cover" >
           {type == "catalog" ?   <div className="flex flex-wrap">
            {catalogImages.map((data: any, index: any) => (
                        <div
                          key={index[index]}
                          className="w-[50%] rounded-t-2 overflow-hidden p-0"
                        >
                          <img
                            key={index}
                            src={data.image}
                            className="h-16 w-full object-cover cursor-pointer "
                            // onClick={() => setEditImage(imageUrl)}
                          />
                         
                        </div>
                      ))}
            </div> : <video autoPlay muted loop src={image}></video> }
           
          

        </div>
        <Container className="flex flex-col items-start justify-center px-6 py-4 h-full w-full">
          <Container>
            <Heading level="h1" className="text-lg font-semibold">
              {title}
            </Heading>
            <Text>{text}</Text>
          </Container>
          <Heading level="h3" className="text-xs font-light text-gray-500">
            Description
          </Heading>
          <Text>{text}</Text>
          <Heading level="h2" className="text-sm font-medium">
            Link
          </Heading>
          <Text>{link}</Text>
        </Container>
      </Container>
      <Container className="flex items-center justify-end h-[15%]">
        {/* <Button variant="secondary" onClick={() => setDeleteId(id)}>
          Delete <XMarkMini />
        </Button> */}
        <FocusModal open={drawerOpen} onOpenChange={setFocusModalOpen}>
          <FocusModal.Trigger asChild>
            <Button>Edit catalog</Button>
          </FocusModal.Trigger>
          <FocusModal.Content>
            <FocusModal.Header>
              <FocusModal.Title>Edit Featured</FocusModal.Title>
            </FocusModal.Header>
            <FocusModal.Body className="p-4 px-36 overflow-y-auto">
              <div className="flex w-full flex-col gap-y-8">
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="link" className="text-ui-fg-subtle">
                    Redirect To
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
                  <DropdownMenu>
                    <DropdownMenu.Trigger asChild>
                      <Button>Select type of featured section</Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item
                        onClick={() => {
                          setUseCatalog(true);
                          fetchCatalogImages();
                        }}
                        className="gap-x-2"
                      >
                        use catalog
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item
                        onClick={() => setUseCatalog(false)}
                        className="gap-x-2"
                      >
                        use video
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu>
                </div>

                {useCatalog ? (
                  <div className="flex flex-col gap-y-2   px-2">
                    <div className="flex justify-between w-full sticky  mt-1">
                      <Label htmlFor="catalogImages" className="">
                        <Heading level="h1">Add images on catalog</Heading>
                      </Label>

                      <AddImageToCatalog setCatalogImage={setCatalogImages} />
                    </div>
                    <Container className="flex gap-2 overflow-y-2 justify-around w-full flex-wrap max-h-[70vh] overflow-y-auto overflow-x-hidden">
                      {catalogImages.map((data: any, index: any) => (
                        <Container
                          key={index[index]}
                          className="w-1/3 rounded-t-2 overflow-hidden p-0"
                        >
                          <img
                            key={index}
                            src={data.image}
                            className="h-32 w-full object-cover cursor-pointer "
                            // onClick={() => setEditImage(imageUrl)}
                          />
                          <Container className="flex rounded-t-none ">
                            <div className="w-[80%] h-full">{data.link}</div>
                            <Button
                              onClick={() =>
                                deleteCatalog(data.id, setCatalogImages)
                              }
                              variant="danger"
                            >
                              Delete
                            </Button>
                          </Container>
                        </Container>
                      ))}
                    </Container>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      id="image"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          uploadVideo(file);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => document.getElementById("image")?.click()}
                      className="text-gray-500 w-full h-full rounded overflow-hidden"
                    >
                      Click to upload video
                    </Button>
                    {/* <Label htmlFor="image">Click to Change video</Label> */}
                    {editImage ? (
                      loading ? (
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={true}
                          onClick={() =>
                            document.getElementById("image")?.click()
                          }
                          className="text-gray-500 w-full h-[60px] rounded overflow-hidden"
                        >
                          uploading...
                        </Button>
                      ) : (
                        <video
                          src={editImage}
                          autoPlay
                          loop
                          controls
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : loading ? (
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={true}
                        onClick={() =>
                          document.getElementById("image")?.click()
                        }
                        className="text-gray-500 w-full h-[60px] rounded overflow-hidden"
                      >
                        uploading...
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          document.getElementById("image")?.click()
                        }
                        className="text-gray-500 w-full h-full rounded overflow-hidden"
                      >
                        Click to upload video
                      </Button>
                    )}
                  </>
                )}

                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="title" className="text-ui-fg-subtle">
                    Title
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={edittitle}
                    onChange={(e) => setedittitle(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="text" className="text-ui-fg-subtle">
                    Button Text
                  </Label>
                  <Input
                    id="text"
                    type="text"
                    value={edittext}
                    onChange={(e) => setedittext(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </FocusModal.Body>
            <FocusModal.Footer className="flex justify-between ">
              <FocusModal.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </FocusModal.Close>
              <Button onClick={() => handleSave()}>Save</Button>
            </FocusModal.Footer>
          </FocusModal.Content>
        </FocusModal>
      </Container>
    </div>
  );
};

export default Featuredcard;
