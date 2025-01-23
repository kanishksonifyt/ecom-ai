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
  Loader
} from "@medusajs/icons";
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const fetchLoyaltyPoints = async (
  product_id: string
): Promise<string | null> => {
  try {
    const response = await axios.get(`/admin/point/${product_id}`);
    console.log(response, "this");

    // Assuming the `response.data.result` contains an array and we need the 'coins' value of the first result
    if (response.data && response.data) {
      return response.data.point.result[0];
    }

    // console.warn("No loyalty points found for the given product.");
    return null;
  } catch (error) {
    console.error("Error fetching loyalty points:", error);
    return null;
  }
};

const makeLoyaltyPoint = async (
  product_id: string,
  point: number,
  setter: any
) => {
  console.log(product_id, point);
  try {
    const response = await axios.post(`/admin/point/`, {
      coins: point,
      relatedto: "product",
      owner_id: product_id,
    });
    console.log("Loyalty point created:", response.data);
  } catch (error) {
    console.error("Error creating loyalty point:", error);
  }
};

const editPoints = async (data: any) => {
  try {
    const response = await axios.put(`/admin/point/${data.id}`, {
      coins: data.coins,
      relatedto: data.relatedto,
      owner_id: data.owner_id,
    });
    return response.data;
    console.log("Points updated:", response.data);
  } catch (error) {
    console.error("Error editing points:", error);
  }
};

interface DropdownMenuDemoProps {
  onEdit: () => void;
  id: string;
}

const DropdownMenuDemo = ({ id, setter }: { id: string; setter: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempLoyaltyPoints, setTempLoyaltyPoints] = useState<any | null>(null);

  useEffect(() => {
    // Fetch loyalty points when the component mounts
    const fetchPoints = async () => {
      if (id) {
        console.log(id, "this is product id");
        const response = await fetchLoyaltyPoints(id);
        if (response) {
          setTempLoyaltyPoints(response);
        }
      }
    };
    fetchPoints();
  }, [id]);

  const handleSave = async () => {
    if (tempLoyaltyPoints !== null) {
      try {
        const response = await editPoints(tempLoyaltyPoints);
        setter(response);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error saving loyalty points:", error);
      }
    }
  };

  return (
    <Drawer open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Drawer.Trigger asChild>
        <Button>Edit Loyalty Points</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Edit Loyalty Points</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-4">
          <Text className="pl-4">Loyalty Points</Text>
          <Input
            className="mt-2"
            type="number"
            onChange={(e) =>
              setTempLoyaltyPoints((prev: any) => ({
                ...prev,
                coins: parseInt(e.target.value, 10),
              }))
            }
            value={tempLoyaltyPoints?.coins || ""}
          />
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Drawer.Close>
          <Button
            disabled={
              tempLoyaltyPoints?.coins === undefined ||
              tempLoyaltyPoints?.coins === ""
            }
            onClick={handleSave}
          >
            Save
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};

const ProductWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const [loyaltyPoints, setLoyaltyPoints] = useState<any | null>(null);
  const [temployaltyPoints, settempLoyaltyPoints] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const productId = data.id; // Assuming `data.id` is the product ID
  const [loading, setloading] = useState(false)

  useEffect(() => {
    // Fetch loyalty points when the component mounts
    const fetchPoints = async () => {
      if (productId) {
        console.log(productId, "this is product id ");
        const response = await fetchLoyaltyPoints(productId);
        setLoyaltyPoints(response);
      }
    };
    fetchPoints();
  }, [productId]);

  useEffect(() => {
    console.log(loyaltyPoints, " this is loyalty point");
  }, [loyaltyPoints]);

  const [discount, setDiscount] = useState(0); // State to hold the discount value
  const debounceTimer = useRef<NodeJS.Timeout | null>(null); // useRef to persist debounce timer

  useEffect(() => {
    if (data.metadata?.discount) {
      setDiscount(data.metadata?.discount);
    }
  },[data.metadata]);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDiscount = parseInt(event.target.value, 10);
    setDiscount(newDiscount);
    setloading(true);

    // Clear the previous timeout (if any) before setting a new one
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    // Set a new timeout for 800ms
    debounceTimer.current = setTimeout(() => {
      axios
        .post(
          `/admin/products/${data.id}`,
          {
            metadata: {
              discount: newDiscount,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log("Discount updated:", res);
          setDiscount(newDiscount)
          setloading(false)
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    }, 700); // 800ms delay before API call
  };

  return (
    <>
      {/* <Container className="relative">
        {loading && <div className="absolute top-0 right-10 flex justify-center items-center gap-2 ">
          saving 
          <div className="animate-spin">
            < Loader/>
          </div>
        </div>}
        <Heading level="h3">Add Discount on Product</Heading>
        <div style={{ marginTop: "20px" }} className="flex flex-col">
          <label htmlFor="discount-slider" style={{ marginRight: "10px" }}>
            Discount: {discount}%
          </label>
          <input
            id="discount-slider"
            type="range"
            min="0"
            max="100"
            value={discount}
            onChange={handleSliderChange}
          />
        </div>
      </Container> */}
      <Container className="divide-y p-0 flex flex-col">
        <div className="flex items-start justify-between px-6 py-4 flex-col">
          <div className="flex justify-between items-center w-full">
            <Heading level="h2">Loyalty Points</Heading>
            {loyaltyPoints && (
              <DropdownMenuDemo id={data.id} setter={setLoyaltyPoints} />
            )}
          </div>
          <div className="flex gap-4 justify-center items-start p-0">
            <GiftSolid className="p-0 mt-1" />
            <span>{loyaltyPoints ? loyaltyPoints.coins : 0}</span>
          </div>
        </div>
        {!loyaltyPoints && (
          <div className="px-6 py-4">
            <Drawer open={isModalOpen} onOpenChange={setIsModalOpen}>
              <Drawer.Trigger asChild>
                <Button>Add loyalty Point to this product</Button>
              </Drawer.Trigger>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Edit Variant</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body className="p-4">
                  <Text className="pl-4">Loyalty Points</Text>
                  <Input
                    className="mt-2"
                    onChange={(e) =>
                      settempLoyaltyPoints(parseInt(e.target.value) || null)
                    }
                    value={temployaltyPoints !== null ? temployaltyPoints : ""}
                  />
                </Drawer.Body>
                <Drawer.Footer>
                  <Drawer.Close asChild>
                    <Button variant="secondary">Cancel</Button>
                  </Drawer.Close>
                  <Button
                    disabled={!temployaltyPoints}
                    onClick={() =>
                      temployaltyPoints !== null &&
                      makeLoyaltyPoint(
                        data.id,
                        temployaltyPoints,
                        setLoyaltyPoints
                      ).then((res) => setIsModalOpen(false))
                    }
                  >
                    Save
                  </Button>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer>
          </div>
        )}
      </Container>
    </>
  );
};

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product.details.side.before",
});

export default ProductWidget;
