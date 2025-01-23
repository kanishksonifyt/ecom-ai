import React, { useEffect, useState } from "react";
import {
  Button,
  FocusModal,
  Heading,
  Input,
  Label,
  Text,
  Container,
  Toaster,
  toast,
  Textarea,
  ProgressTabs,
} from "@medusajs/ui";
import axios from "axios";

interface PostAdminCreateHerosectionPayload {
  id: string;
  title: string;
  subtitle: string;
  firsttext: string;
  secondtext: string;
  firstbuttonroute?: string;
  secoundbuttonroute?: string;
  image: string;
  index: number;
}

const fetchHeroSections = async () => {
  try {
    const response = await fetch("/admin/hero");
    if (!response.ok) {
      throw new Error("Failed to fetch hero sections");
    }
    const data = await response.json();
    // console.log("Hero sections fetched successfully:", data.heroes);
    return data.heroes;
  } catch (error: any) {
    console.error("Error fetching hero sections:", error.message || error);
  }
};

const HeroSectionForm = ({
  setHeroSections,
}: {
  setHeroSections: React.Dispatch<
    React.SetStateAction<PostAdminCreateHerosectionPayload[]>
  >;
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [firstText, setFirstText] = useState("");
  const [firstButtonRoute, setFirstButtonRoute] = useState("");
  const [secondButtonRoute, setSecondButtonRoute] = useState("");
  const [reponseimagelink, setResponseImageLink] = useState("");
  const [secondText, setSecondText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCurrentTabCompleted, setIsCurrentTabCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "general" | "shipping" | "payment"
  >("general");
  const [status, setStatus] = useState<{
    general: string;
    shipping: string;
    payment: string;
  }>({
    general: "idle",
    shipping: "idle",
    payment: "idle",
  });

  const tabs = ["general", "shipping", "payment"];

  let isLastTab: any;

  useEffect(() => {
    if (title.length >= 10 && subtitle.length >= 10) {
      setStatus((prev) => ({ ...prev, general: "completed" }));
    } else {
      setStatus((prev) => ({ ...prev, general: "idle" }));
    }

    if (reponseimagelink) {
      setStatus((prev) => ({ ...prev, shipping: "completed" }));
    } else {
      setStatus((prev) => ({ ...prev, shipping: "idle" }));
    }

    if (firstText && secondText) {
      setStatus((prev) => ({ ...prev, payment: "completed" }));
    } else {
      setStatus((prev) => ({ ...prev, payment: "idle" }));
    }

    setIsCurrentTabCompleted(status[activeTab] === "completed");
    // console.log("isCurrentTabCompleted", isCurrentTabCompleted);
    // // console.log("isLastTab", isLastTab);
    // // console.log("activeTab", activeTab);
    isLastTab = activeTab === tabs[tabs.length - 1];
  }, [title, subtitle, firstText, secondText]);

  const handleNext = () => {
    const currentTabIndex = tabs.indexOf(activeTab);

    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(
        tabs[currentTabIndex + 1] as "general" | "shipping" | "payment"
      );
    } else {
      // On last tab, save the data
      document
        .getElementById("heroForm")
        ?.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
    }
  };

  const submitvalidation = () => {
    switch (activeTab) {
      case "general":
        if (title.trim().length < 10) {
          toast.error(
            "Title must be at least 10 characters long in the General tab"
          );
        } else if (subtitle.trim().length < 10) {
          toast.error(
            "Subtitle must be at least 10 characters long in the General tab"
          );
        }
        break;
      case "shipping":
        if (!reponseimagelink) {
          toast.error("Please fill the Image field in the Shipping tab");
        }
        break;
      case "payment":
        if (!firstText.trim()) {
          toast.error("Please fill the First Text field in the Payment tab");
        } else if (!secondText.trim()) {
          toast.error("Please fill the Second Text field in the Payment tab");
        }
        break;
      default:
        toast.error("Please fill all fields");
    }
  };

  const validateCurrentTab = () => {
    if (activeTab === "general") {
      if (title.trim() && subtitle.trim()) {
        setStatus((prev) => ({ ...prev, general: "completed" }));
        return true;
      }
    } else if (activeTab === "shipping") {
      if (reponseimagelink) {
        setStatus((prev) => ({ ...prev, shipping: "completed" }));
        return true;
      }
    } else if (activeTab === "payment") {
      if (firstText && secondText) {
        setStatus((prev) => ({ ...prev, payment: "completed" }));
        return true;
      }
    }
    setStatus((prev) => ({ ...prev, [activeTab]: "error" }));
    return false;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      id: "",
      title,
      subtitle,
      firsttext: firstText,
      secondtext: secondText,
      image: reponseimagelink,
      firstbuttonroute: firstButtonRoute,
      secoundbuttonroute: secondButtonRoute,
    };

    try {
      const response = await fetch("/admin/hero", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create hero section");
      }

      const updatedHeroSections = await fetchHeroSections();
      if (updatedHeroSections) setHeroSections(updatedHeroSections);

      setIsModalOpen(false);
      setTitle("");
      setSubtitle("");
      setFirstText("");
      setSecondText("");
      setFirstButtonRoute("");
      setSecondButtonRoute("");
      setImage(null);
      setResponseImageLink("");
      setActiveTab("general")
      toast.dismiss();
      toast.success("Success", {
        description: "Hero section created successfully",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async () => {
    if (image) {
      // const convertToBase64 = (file: File): Promise<string> => {
      //     return new Promise((resolve, reject) => {
      //         const reader = new FileReader();
      //         reader.readAsDataURL(file);
      //         reader.onload = () => resolve(reader.result as string);
      //         reader.onerror = (error) => reject(error);
      //     });
      // };

      if (image) {
        try {
          setLoading(true);
          // const base64Image = await convertToBase64(image);
          const formData = new FormData();
          formData.append("image", image);

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

          setResponseImageLink(response.data);
          toast.dismiss();
          toast.success("Success", {
            description: "Image uploaded successfully",
          });
          setLoading(false);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    }
  };

  useEffect(() => {
    uploadImage();
  }, [image]);

  // console.log("status", isCurrentTabCompleted);
  return (
    <form id="heroForm" onSubmit={handleSubmit}>
      <FocusModal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ProgressTabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "general" | "shipping" | "payment")
          }
        >
          <FocusModal.Trigger asChild>
            <Button onClick={() => setIsModalOpen(true)}>Add Hero</Button>
          </FocusModal.Trigger>
          <FocusModal.Content>
            <FocusModal.Header className="flex gap-0 p-0 px-2">
              <Container className="p-0 rounded-none h-full mx-3 border-t-none border-r-0">
                <ProgressTabs.List>
                  <ProgressTabs.Trigger disabled={true} value="general">
                    Give info
                  </ProgressTabs.Trigger>
                  <ProgressTabs.Trigger disabled={true} value="shipping">
                    Image
                  </ProgressTabs.Trigger>
                  <ProgressTabs.Trigger disabled={true} value="payment">
                    Button Text
                  </ProgressTabs.Trigger>
                </ProgressTabs.List>
              </Container>
            </FocusModal.Header>

            <FocusModal.Body className=" pt-10 px-32">
              <ProgressTabs.Content value="general">
                <div className="flex flex-col gap-y-2 mb-3">
                  <Label htmlFor="title" className="text-ui-fg-subtle ">
                    Title
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    maxLength={50}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 font-bold text-xl h-fit"
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="subtitle" className="text-ui-fg-subtle">
                    Subtitle
                  </Label>
                  <Textarea
                    id="subtitle"
                    value={subtitle}
                    maxLength={120}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="mt-1 h-[200px] resize-none font-semibold text-lg"
                    placeholder="Product description ..."
                  />
                </div>
              </ProgressTabs.Content>

              <ProgressTabs.Content value="shipping">
                <div>
                  <label htmlFor="image">
                    <Button
                      variant="secondary"
                      onClick={() => document.getElementById("image")?.click()}
                      className="w-full h-[300px] border-ui-bg rounded-lg flex items-center justify-center p-0 overflow-hidden"
                    >
                      {reponseimagelink ? (
                        <img
                          className="w-full h-full object-cover"
                          src={reponseimagelink}
                          alt="image"
                        />
                      ) : (
                        <>
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="15"
                              fill="none"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M13.056 9.944v1.334c0 .982-.796 1.778-1.778 1.778H3.722a1.777 1.777 0 0 1-1.778-1.778V9.944M4.389 5.5 7.5 8.611 10.611 5.5M7.5 8.611V1.944"
                              ></path>
                            </svg>
                          </div>
                          <Text className="text-ui-fg-subtle text-lg">
                            {loading ? "Uploading..." : "Upload Image"}
                          </Text>
                        </>
                      )}
                    </Button>
                  </label>
                  <input
                    id="image"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImage(file); // Update the state with the file name or handle the file
                        // console.log("Selected file:", file);
                      }
                    }}
                  />
                </div>
              </ProgressTabs.Content>

              <ProgressTabs.Content value="payment">
                <div>
                  <Label htmlFor="firstText">First Text</Label>
                  <Input
                    id="firstText"
                    value={firstText}
                    onChange={(e) => setFirstText(e.target.value)}
                  />
                  <div className="mt-4">
                    <Label htmlFor="firstButtonRoute">First Button Route</Label>
                    <Input
                      id="firstButtonRoute"
                      value={firstButtonRoute}
                      onChange={(e) => setFirstButtonRoute(e.target.value)}
                    />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="secondButtonRoute">
                      Second Button Route
                    </Label>
                    <Input
                      id="secondButtonRoute"
                      value={secondButtonRoute}
                      onChange={(e) => setSecondButtonRoute(e.target.value)}
                    />
                  </div>
                  <Label htmlFor="secondText">Second Text</Label>

                  <Input
                    id="secondText"
                    value={secondText}
                    onChange={(e) => setSecondText(e.target.value)}
                  />
                </div>
              </ProgressTabs.Content>
            </FocusModal.Body>

            <FocusModal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  const currentTabIndex = tabs.indexOf(activeTab);
                  if (currentTabIndex > 0) {
                    setActiveTab(
                      tabs[currentTabIndex - 1] as
                        | "general"
                        | "shipping"
                        | "payment"
                    );
                  }
                }}
                disabled={tabs.indexOf(activeTab) === 0}
              >
                Previous
              </Button>
              <Button
                onClick={() => {
                  if (!isCurrentTabCompleted) {
                    submitvalidation();
                    return;
                  }
                  
                  if (validateCurrentTab()) handleNext();
                }}
                // disabled={!isCurrentTabCompleted}
              >
                {isLastTab ? (loading ? "Saving..." : "Save") : "Continue"}
              </Button>
            </FocusModal.Footer>
          </FocusModal.Content>
        </ProgressTabs>
      </FocusModal>
    </form>
  );
};

export default HeroSectionForm;
