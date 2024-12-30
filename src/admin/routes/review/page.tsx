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
  title: string;
  description: string;
  rating: number;
  user_name: string;
  date: Date;
}

const fetchReview = async () => {
  try {
    const response = await fetch("/admin/review");
    if (!response.ok) {
      throw new Error("Failed to fetch hero sections");
    }
    const data = await response.json();
    console.log("Featured sections fetched successfully:", data);
    return data.reviews;
  } catch (error: any) {
    console.error("Error fetching hero sections:", error.message || error);
    return [];
  }
};

const deleteReview = async (id: string) => {
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

      console.log("Review saved successfully:", data);
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
            <h2>Details</h2>
            <div className="flex justify-between">
              <div>
                <p>
                  <strong>Created At:</strong> 2024-12-28T09:28:09.830Z
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

// export const config = defineRouteConfig({
//   label: "Reviews",
//   icon: Pencil,
// });

export default CustomPage;
