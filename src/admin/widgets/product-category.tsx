import { defineWidgetConfig } from "@medusajs/admin-sdk";
import {
  Container,
  Heading,
  DropdownMenu,
  Drawer,
  Text,
  Prompt,
  IconButton,
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
    data : any,
  imgispresent: boolean;
  setTempimage: any;
  tempimage: string;
}) {
  //   const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(tempimage);
  const [isModalOpen , setIsModalOpen] = useState(false)

  const uploadImage = async (file: File) => {
    if (file) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("image", file);

        const response = await axios.post(
          "http://148.135.138.221:4000/upload/100",
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
        `/admin/product-categories/${id}`,
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
        console.log(res);
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
          <Button onClick={()=>handleSubmit(data.id)}>Save</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
}

const ProductcategoryWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
//   const tempImage = tempimage ?? null;
  const [tempImage, setTempImage] = useState<string | null>(data.metadata?.img || null);


  console.log(data.metadata);

  return (
  <div className="flex flex-col" >
  
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
          <img src={tempImage} className="w-full h-full object-cover" alt="Product Category" />
        </Container>
      )}
    </Container>
  </div>
  );
};

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product_category.details.side.before",
});

export default ProductcategoryWidget;
