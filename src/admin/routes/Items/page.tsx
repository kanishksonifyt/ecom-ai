import React, { useEffect, useState } from "react";
import {
  Button,
  FocusModal,
  Heading,
  Input,
  Label,
  Text,
  Container,
  Drawer,
  Switch,
} from "@medusajs/ui";


interface PostAdminCreateFeaturedsectionPayload {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  status: string;
  discountable: boolean;
  handle: string;
  created_at: string;
  updated_at: string;
  weight: string;
}

interface PostAdminCreateFilterdataPayload
  extends PostAdminCreateFeaturedsectionPayload {
  handler_id: string;
}

interface PostAdminCreatedataPayload {
  id: string;
  product_id: string;
}

const fetchFeaturedSections = async () => {
  try {
    const response = await fetch("/admin/product");
    if (!response.ok) {
      throw new Error("Failed to fetch hero sections");
    }
    const data = await response.json();
    console.log("Featured sections fetched successfully:", data);
    console.log("Featured sections fetched successfully:", data);
    return data.result.products;
  } catch (error: any) {
    console.error("Error fetching hero sections:", error.message || error);
  }
};

type FeaturedSectionFormProps = {
  setfeaturedSections: React.Dispatch<
    React.SetStateAction<PostAdminCreateFeaturedsectionPayload[]>
  >;
};

const fetchdata = async () => {
  try {
    const response = await fetch("/admin/showonhome/");
    if (!response.ok) {
      throw new Error("Failed to fetch hero sections");
    }
    const data = await response.json();
    console.log("data fetched successfully:", data);
    console.log("data fetched successfully:", data);
    return data.showonhome;
  } catch (error: any) {
    console.error("Error fetching hero sections:", error.message || error);
  }
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
      console.log("Route data fetched successfully:", data.home.result);

    } catch (error) {
      console.error("Error fetching route data:", error);
    }
  };

  useEffect(() => {
    fetchRouteData();
  }, []);
  fetchRouteData();

  const handleSubmit = async () => {
    try {
      const url = `/admin/home/01JG6HJB5Y3NM19PVPDSZP683N`;
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
      console.log(`"Route updated"  successfully`);
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
          {title}sjvhbds
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
          <Button onClick={handleSubmit} variant="primary">
            Save
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};

const HighlightSectionForm = ({
  setfeaturedSections,
  featuredSections,
  filteredindsData,
}: {
  setfeaturedSections: React.Dispatch<
    React.SetStateAction<PostAdminCreateFeaturedsectionPayload[]>
  >;
  featuredSections: PostAdminCreateFeaturedsectionPayload[];
  filteredindsData: PostAdminCreateFilterdataPayload[];
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState<
    PostAdminCreateFeaturedsectionPayload[]
  >([]);
  const [selectedproductid, setSelectedproductid] = useState<string | null>(
    null
  );

  const [filteredindData, setfilteredData] = useState<
    PostAdminCreateFeaturedsectionPayload[]
  >([]);
  const [data, setData] = useState<PostAdminCreatedataPayload[]>([]);

  useEffect(() => {
    fetchFeaturedSections().then((data) => {
      if (data) {
        console.log(data);
        setProduct(data);
      }
    });
  }, []);

  useEffect(() => {
    fetchdata().then((data) => {
      if (data) {
        console.log(data);
        setData(data);
      }
    });
  }, [featuredSections]);

  useEffect(() => {
    fetchdata().then((data) => {
      if (data) {
        console.log(data);
        setData(data);
      }
    });
  }, []);

  const addproductonhomepage = async (product_id: string) => {
    try {
      const response = await fetch(`/admin/showonhome/${product_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to add product on homepage");
      }
      console.log("Product added on homepage successfully");
      const updatedHeroSections = await fetchFeaturedSections();
      if (updatedHeroSections) {
        const filteredData: PostAdminCreateFeaturedsectionPayload[] =
          updatedHeroSections.filter(
            (section: PostAdminCreateFeaturedsectionPayload) =>
              !data.some(
                (item: PostAdminCreatedataPayload) =>
                  item.product_id === section.id
              )
          );
        setfilteredData(filteredData);
        setfeaturedSections(filteredData);
        setProduct(filteredData);
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Error fetching hero sections:", error.message || error);
    }
  };

  const removeProductFromHomepage = async (id: string) => {
    try {
      const response = await fetch(`/admin/showonhome/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to remove product from homepage");
      }
      console.log("Product removed from homepage successfully");
      const updatedHeroSections = await fetchFeaturedSections();
      if (updatedHeroSections) {
        setProduct(updatedHeroSections);
      }
      window.location.reload();
    } catch (error: any) {
      console.error(
        "Error removing product from homepage:",
        error.message || error
      );
    }
  };

  useEffect(() => {}, [product]);

  useEffect(() => {
    const filteredData = product.filter(
      (section) => !data.some((item) => item.product_id === section.id)
    );
    console.log(filteredData, "sdjvhbdsbvb");
    setfilteredData(filteredData);
  }, [data, product]);

  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button>Edit Variant</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Edit Variant</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-4 overflow-y-scroll ">
          <Heading level="h1">
            Select products which you want to show on home page{" "}
          </Heading>
          {filteredindData.map((item) => (
            <Container key={item.id} className="mt-2">
              <Switch
                id="manage-inventory"
                onCheckedChange={(checked) => {
                  if (checked) {
                    addproductonhomepage(item.id);
                  } else {
                    removeProductFromHomepage(item.id);
                  }
                }}
              />
              <Heading level="h3" className="text-2xl  mb-4">
                {item.title}
              </Heading>
              <Label htmlFor="manage-inventory" className="space-y-2">
                <Text className="">
                  <strong>ID:</strong> {item.id}
                </Text>
                <Text className="">
                  <strong>Description:</strong> {item.description}
                </Text>
                <div className="flex items-center space-x-4">
                  <strong className="">Thumbnail:</strong>
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
                <Text className="">
                  <strong>Status:</strong> {item.status}
                </Text>
                <Text className="">
                  <strong>Discountable:</strong>{" "}
                  {item.discountable ? "Yes" : "No"}
                </Text>
                <Text className="">
                  <strong>Handle:</strong> {item.handle}
                </Text>
                <Text className="">
                  <strong>Added At:</strong>{" "}
                  {new Date(item.created_at).toLocaleString()}
                </Text>
                <Text className="">
                  <strong>Weight:</strong> {item.weight}g
                </Text>
              </Label>
            </Container>
          ))}
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

const CustomPage = () => {
  const [featuredSections, setfeaturedSections] = useState<
    PostAdminCreateFeaturedsectionPayload[]
  >([]);
  const [filteredindData, setfilteredData] = useState<
    PostAdminCreateFilterdataPayload[]
  >([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updateId, setUpdateId] = useState<string | null>(null);
  const [data, setData] = useState<PostAdminCreatedataPayload[]>([]);

  useEffect(() => {
    fetchFeaturedSections().then((data) => {
      if (data) {
        console.log(data);
        setfeaturedSections(data);
      }
    });
  }, []);

  const deleteFeaturedSection = async (id: string) => {
    try {
      const response = await fetch(`/admin/showonhome/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete hero section");
      }
      console.log("Featured section deleted successfully");
      window.location.reload();
      fetchdata().then((data) => {
        if (data) {
          console.log(data);
          setData(data);
        }
      });
      const updatedHeroSections = await fetchFeaturedSections();
      if (updatedHeroSections) {
        setfeaturedSections(updatedHeroSections);
      }
    } catch (error: any) {
      console.error("Error deleting hero section:", error.message || error);
    }
  };

  useEffect(() => {
    fetchdata().then((data) => {
      if (data) {
        console.log(data);
        setData(data);
      }
    });
  }, []);

  const filteredData = () =>
    featuredSections
      .filter((section) => data.some((item) => item.product_id === section.id))
      .map((section) => ({
        ...section,
        handler_id:
          data.find((item) => item.product_id === section.id)?.id || "",
      }));

  useEffect(() => {
    const data = filteredData();
    if (data) {
      console.log(data, "that isdata");
      setfilteredData(data);
    }
  }, [data]);

  

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Add / Delete product on homepage</Heading>
       <div className="flex gap-4">
        <Addredirect />
        <HighlightSectionForm
          setfeaturedSections={setfeaturedSections}
          featuredSections={featuredSections}
          filteredindsData={filteredindData}
        />
       </div>
      </div>
      {filteredindData.map((item, index) => {
        return (
          <Container key={item.id} className="mt-2">
            <Heading level="h3" className="text-2xl  mb-4">
              {item.title}
            </Heading>
            <Label htmlFor="manage-inventory" className="space-y-2">
              <Text className="">
                <strong>ID:</strong> {item.id}
              </Text>
              <Text className="">
                <strong>Description:</strong> {item.description}
              </Text>
              <div className="flex items-center space-x-4">
                <strong className="">Thumbnail:</strong>
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt="Thumbnail"
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-500">No Thumbnail Available</span>
                )}
              </div>
              <Text className="">
                <strong>Status:</strong> {item.status}
              </Text>
              <Text className="">
                <strong>Discountable:</strong>{" "}
                {item.discountable ? "Yes" : "No"}
              </Text>
              <Text className="">
                <strong>Handle:</strong> {item.handle}
              </Text>
              <Text className="">
                <strong>Added At:</strong>{" "}
                {new Date(item.created_at).toLocaleString()}
              </Text>
              <Text className="">
                <strong>Weight:</strong> {item.weight}g
              </Text>
              <Button onClick={() => deleteFeaturedSection(item.handler_id)}>
                remove
              </Button>
            </Label>
          </Container>
        );
      })}
    </Container>
  );
};

export default CustomPage;
