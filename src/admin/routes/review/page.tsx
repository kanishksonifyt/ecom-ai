import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Pencil } from "@medusajs/icons";
import { Container } from "@medusajs/ui";
import React, { useEffect, useState } from "react";
import {
  Button,
  FocusModal,
  Heading,
  Input,
  Label,
  Text,
  Drawer,
  DatePicker,
  Switch,
} from "@medusajs/ui";
import Featuredcard from "./Featuredcard.js";

import axios from "axios";

interface PostAdminCreatereviewPayload {
  id: string;
  title: string;
  description: string;
  rating: number;
  user_name: string;
  date: Date;
  user_pic: string | null;
}

const fetchReview = async () => {
  try {
    const response = await fetch("/admin/review");
    if (!response) {
      throw new Error("Failed to fetch hero sections");
    }
    const data = await response.json();
    // console.log("Featured sections fetched successfully:", data);
    return data.reviews;
  } catch (error: any) {
    console.error("Error fetching hero sections:", error.message || error);
    return [];
  }
};

const deleteReview = async (id: string) => {
  console.log(id ," this is id")
  try {
    const response = await fetch(`/admin/review/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete review");
    }
    console.log("Review deleted successfully", response);
    console.log("Review deleted successfully");
  } catch (error: any) {
    console.error("Error deleting review:", error.message || error);
  }
};

function Addreview({
  setReview,
  review,
  selectedReview,
}: {
  setReview: React.Dispatch<
    React.SetStateAction<PostAdminCreatereviewPayload[]>
  >;
  review: PostAdminCreatereviewPayload[];
  selectedReview: PostAdminCreatereviewPayload | null;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [user_name, setUsername] = useState("");
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user_pic, setUser_pic] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRating(0);
    setUsername("");
    setDate(new Date());
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const payload: PostAdminCreatereviewPayload = {
      title,
      description,
      rating,
      user_name,
      date,
      user_pic,
    };

    try {
      const method = selectedReview ? "PATCH" : "POST"; // PUT if editing, POST if creating a new review
      const url = selectedReview
        ? `/admin/review/${selectedReview.id}`
        : "/admin/review";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save review");
      }

      const data = await response.json();

      // console.log("Review saved successfully:", data);
      if (selectedReview) {
        // Update review if it's an edit
        setReview(
          review.map((r) =>
            r.id === selectedReview.id ? { ...r, ...payload } : r
          )
        );
      } else {
        // Add new review if it's a creation
        setReview([...review, data]);
      }

      resetForm();
      setIsDrawerOpen(false); // Close the drawer after successful review creation or edit
    } catch (error: any) {
      setError(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to populate the form when a review is selected for editing
  useEffect(() => {
    if (selectedReview) {
      setTitle(selectedReview.title);
      setDescription(selectedReview.description);
      setRating(selectedReview.rating);
      setUsername(selectedReview.user_name);
      setDate(new Date(selectedReview.date));
      setIsDrawerOpen(true);
    }
  }, [selectedReview]);

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

        setUser_pic(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <Drawer.Trigger asChild>
        <Button onClick={() => setIsDrawerOpen(true)}>Add review</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>
            {selectedReview ? "Edit Review" : "Add Review"}
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-4">
          <form id="reviewForm" onSubmit={handleSubmit}>
            <Label>
              <Text>Title</Text>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Label>
            <Label>
              <Text>Description</Text>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Label>
            <Label>
              <Text>Rating</Text>
              <Input
                type="number"
                value={rating || ""}
                onChange={(e) => setRating(parseInt(e.target.value))}
              />
            </Label>
            <input
              type="file"
              id="user_pic"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  uploadImage(file);
                }
              }}
            />
            <Label className="mt-4" htmlFor="user_pic">
              User pic
            </Label>
            <Container className="flex flex-col gap-y-2 h-[80px]  w-[80px] p-0 overflow-hidden justify-center items-center">
              {user_pic ? (
                loading ? (
                  "uploading..."
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => document.getElementById("user_pic")?.click()}
                    className="text-gray-500 w-full h-full p-0"
                  >
                    <img
                      src={user_pic}
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
                  onClick={() => document.getElementById("user_pic")?.click()}
                  className="text-gray-500 w-full h-full "
                >
                  Click to upload user Pic
                </Button>
              )}
            </Container>
            <Label>
              <Text>User Name</Text>
              <Input
                value={user_name}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Label>
            <Label>
              <Text>Date</Text>
              <DatePicker
                value={date}
                onChange={(date) => setDate(date || new Date())}
              />
            </Label>
          </form>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Drawer.Close>
          <Button onClick={handleSubmit}>
            {selectedReview ? "Update" : "Save"}
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
}

const CustomPage = () => {
  const [review, setReview] = useState<PostAdminCreatereviewPayload[]>([]);
  const [selectedReview, setSelectedReview] =
    useState<PostAdminCreatereviewPayload | null>(null);

  useEffect(() => {
    // console.log("Fetching reviews...");
    fetchReview().then((data) => setReview(Array.isArray(data) ? data : []));
  }, []);

  const deleteReviewworkflow = async (id: string) => {
    deleteReview(id);
    setReview(review.filter((review) => review.id !== id));
  };

  return (
    <>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Manage review on homepage</Heading>
          <Addreview
            setReview={setReview}
            review={review}
            selectedReview={selectedReview}
          />
        </div>
      </Container>
      {review.map((review) => (
        <Container key={review.title} className="divide-y ">
          <div>
            <h2>Review</h2>
            <div className="flex justify-between">
              {review.user_pic && (
                <div className="flex gap-2 flex-col">
                  <strong>user Pic</strong>{" "}
                  <img
                    src={review.user_pic}
                    className="size-[80px] rounded object-cover"
                    alt=""
                  />
                </div>
              )}
              <div className="w-[70%]">
                <p>
                  <strong>Review:</strong> 2024-12-28T09:28:09.830Z
                </p>

                <p>
                  <strong>Description:</strong> {review.description}
                </p>
                <p>
                  <strong>Rating:</strong> {review.rating}
                </p>
                <p>
                  <strong>Title:</strong> {review.title}
                </p>

                <p>
                  <strong>User Name:</strong> {review.user_name}
                </p>
              </div>
              <div className="flex flex-col gap-2  ">
                <Button
                  variant="danger"
                  onClick={() => deleteReviewworkflow(review.id)}
                >
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setSelectedReview(review)}
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </Container>
      ))}
    </>
  );
};

const product_com = () => {
  return (
    <Container key={item.id} className="mt-2">
      <Heading level="h3" className="text-2xl mb-4">
        {item.title}
      </Heading>
      <Label htmlFor={`product-${item.id}`} className="space-y-2">
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
            <span className="text-gray-500">No Thumbnail Available</span>
          )}
        </div>
        <Text>
          <strong>Status:</strong> {item.status}
        </Text>
      </Label>
    </Container>
  );
};

// export const config = defineRouteConfig({
//   label: "Reviews",
//   icon: Pencil,
// });

export default CustomPage;
