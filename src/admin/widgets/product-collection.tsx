import { defineWidgetConfig } from "@medusajs/admin-sdk";
import {
  Container,
  Heading,
  DropdownMenu,
  Drawer,
  Text,
  Prompt,
  IconButton,
  Checkbox,
  Label,
  Button,
  Input,
} from "@medusajs/ui";
import {
  GiftSolid,
  EllipsisHorizontal,
  PencilSquare,
  Plus,
  Trash,
} from "@medusajs/icons";
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";
import { useState, useEffect } from "react";
import axios from "axios";

export function DrawerDemo({
  imgispresent,
  data,
  setTempimage,
  tempimage,
}: {
  data: any;
  imgispresent: boolean;
  setTempimage: any;
  tempimage: string;
}) {
  //   const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(tempimage);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const uploadImage = async (file: File) => {
    if (file) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("image", file);

        const response = await axios.post(
          `https://storage.themajesticpeacock.com/upload/100`,
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

  const handleSubmit = (id: string) => {
    axios
      .post(
        `/admin/collections/${id}`,
        {
          metadata: {
            img: image,
          },
        },
        {
          headers: {
            "Content-Type": "application/json", // Explicitly set the Content-Type header
          },
        }
      )
      .then((res) => {
        //console.log(res);
        setTempimage(image);
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  return (
    <Drawer open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Drawer.Trigger asChild>
        <Button>
          {imgispresent ? "Manage Image" : "Add image (recommended)"}
        </Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>
            {imgispresent ? "Manage Image" : "Add image (recommended)"}
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-4">
          {/* <Heading level="h3">Add Link</Heading>
          <Input
            id="link"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="mt-1"
          /> */}
          <div className="mt-2">
            <label htmlFor="image">
              <Button
                type="button"
                variant="secondary"
                onClick={() => document.getElementById("images")?.click()}
                className="w-full h-[300px] border-ui-bg rounded-lg flex items-center justify-center p-0 overflow-hidden"
              >
                {image ? (
                  <img
                    className="w-full h-full object-cover"
                    src={image}
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
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Drawer.Close>
          <Button onClick={() => handleSubmit(data.id)}>Save</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
}

const CategoryManager = ({
  categories,
  collection,
  setCollection,
}: {
  categories: any;
  collection: any;
  setCollection: any;
}) => {
  const [categoryStates, setCategoryStates] = useState<{
    [key: string]: boolean;
  }>(
    // Initialize state to track which categories are selected
    {}
  );

  useEffect(() => {
    setCategoryStates(() =>
      categories.reduce((acc: any, category: any) => {
        acc[category.id] = collection.metadata?.categories?.some(
          (existingCategory: any) => existingCategory.id === category.id
        );
        return acc;
      }, {})
    );
  }, [collection, categories]);

  // console.log(collection.metadata?.categories , categoryStates)

  const addData = (newCategory: any) => {
    // Ensure categories is an array before adding the new category
    const updatedCategories = [
      ...(collection.metadata.categories || []), // Fallback to an empty array
      {
        name: newCategory.name,
        image: newCategory.metadata?.img,
        id: newCategory.id,
      },
    ];

    axios
      .post(
        `/admin/collections/${collection.id}`,
        {
          metadata: {
            categories: updatedCategories,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log("Category added successfully:", res.data.collection);
        setCollection(res.data.collection);
      })
      .catch((error) => {
        console.error("Error adding category:", error.message);
      });
  };

  const removeData = (categoryId: string) => {
    // Ensure categories is an array before filtering
    const updatedCategories = (collection.metadata.categories || []).filter(
      (category: any) => category.id !== categoryId
    );

    axios
      .post(
        `/admin/collections/${collection.id}`,
        {
          metadata: {
            categories: updatedCategories,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log("Category removed successfully:", res.data.collection);
        setCollection(res.data.collection);
      })
      .catch((error) => {
        console.error("Error removing category:", error.message);
      });
  };

  const toggleCategory = (item: any) => {
    const isPresent = categoryStates[item.id];

    if (!isPresent) {
      addData(item);
      // null
    } else {
      removeData(item.id);
    }

    // Update the category state
    setCategoryStates((prev) => ({
      ...prev,
      [item.id]: !isPresent,
    }));
  };

  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button>Edit Categories</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Edit Categories</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-4 relative w-full">
          <div className="absolute top-1 w-[39vw]">
            <Input placeholder="Search" id="search-input" type="search" />
          </div>

          <div className="mt-10 p-1 h-[70vh] overflow-x-hidden flex gap-3 flex-wrap justify-around">
            {categories.map((item: any, index: number) => {
              const isPresent = categoryStates[item.id];

              return (
                <Container
                  key={index}
                  className="h-[300px] w-[200px] flex flex-col items-center justify-between p-3 border rounded-md shadow-md"
                >
                  <Label
                    htmlFor={`category_${index}`}
                    className="w-full text-center"
                  >
                    <div className="text-sm font-medium mb-2">
                      <span>Title: </span>
                      {item.name}
                    </div>
                    <img
                      src={item.metadata?.img || "/default-image.jpg"}
                      className="w-full h-[200px] object-cover rounded-md mb-3"
                      alt={`${item.name} image`}
                    />
                    <Checkbox
                      id={`category_${index}`}
                      checked={isPresent}
                      onClick={() => toggleCategory(item)} // Use toggleCategory here
                      className="mt-3"
                    />
                  </Label>
                </Container>
              );
            })}
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Drawer.Close>
          <Button>Save</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};

const ProductcategoryWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  // const tempImage = tempimage ?? null;
  const [tempImage, setTempImage] = useState<string | null>(
    (data.metadata?.img as string) || null
  );

  const [categories, setCategories] = useState([]);
  const [collection, setCollection] = useState<DetailWidgetProps<AdminProduct>>(
    []
  );

  //console.log(data.metadata);

  const category = () => {
    axios.get(`/admin/product-categories`).then((res) => {
      //console.log(res.data.product_categories);
      setCategories(res.data.product_categories);
    });
  };

  useEffect(() => {
    category();
  }, []);

  useEffect(() => {
    if (data) {
      setCollection(data);
    } else {
      setCollection([]);
    }
  }, []);

  useEffect(() => {
    console.log(typeof collection, collection.metadata?.categories);
  }, [collection, collection.metadata]);

  return (
    <div className="flex gap-3">
      <div className="flex flex-col max-w-[300px]">
        <Container className="divide-y flex flex-col min-h-[100px] gap-4">
          <div className="flex justify-end ">
            <DrawerDemo
              setTempimage={setTempImage}
              tempimage={tempImage ?? ""}
              imgispresent={!!data.metadata?.img}
              data={data}
            />
          </div>

          {tempImage && (
            <Container className=" p-0 overflow-hidden">
              <img
                src={tempImage}
                className="w-full h-full object-cover"
                alt="Product Category"
              />
            </Container>
          )}
        </Container>
      </div>
      <Container>
        <div className="flex justify-end">
          <CategoryManager
            categories={categories}
            collection={data}
            setCollection={setCollection}
          />
        </div>
        <div className="h-[85%] mt-[2%] w-full flex flex-wrap p-2 gap-2">
          {Array.isArray(collection?.metadata?.categories) &&
            collection?.metadata?.categories.map((item: any, index: number) => (
              <Container
                key={index}
                className="h-[300px] w-[200px] flex flex-col items-center justify-between p-3 border rounded-md shadow-md"
              >
                <div className="text-sm font-medium mb-2">
                  <span>Title: </span>
                  {item.name}
                </div>
                <img
                  src={item.image || "/default-image.jpg"}
                  className="w-full h-[200px] object-cover rounded-md mb-3"
                  alt={`${item.name} image`}
                />
              </Container>
            ))}
        </div>
      </Container>
    </div>
  );
};

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product_collection.details.after",
});

export default ProductcategoryWidget;
