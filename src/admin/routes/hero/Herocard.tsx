import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Drawer,
  Heading,
  Input,
  ProgressTabs,
  FocusModal,
  toast,
  Label,
  Alert,
  Textarea,
} from "@medusajs/ui";
import { XMarkMini, ArrowLongUp, ArrowDownMini } from "@medusajs/icons";
import axios from "axios";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DotsSix, Link } from "@medusajs/icons";

const HeroSectionForm = ({
  setHeroSections,
  instaialdata,
  id,
}: {
  setHeroSections: (heroSections: any) => void;
  instaialdata: any;
  id: string;
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState<string>(instaialdata.title);
  const [subtitle, setSubtitle] = useState<string>(instaialdata.subtitle);
  const [firstText, setFirstText] = useState<string>(instaialdata.firstText);
  const [reponseimagelink, setResponseImageLink] = useState<string>(
    instaialdata.reponseimagelink
  );

  const [firstButtonRoute, setFirstButtonRoute] = useState<string>(
    instaialdata.firstButtonRoute
  );
  const [secondText, setSecondText] = useState<string>(instaialdata.secondText);
  const [secondButtonRoute, setSecondButtonRoute] = useState<string>(
    instaialdata.secondButtonRoute
  );
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
    setTitle(instaialdata.title);
    setSubtitle(instaialdata.subtitle);
    setFirstText(instaialdata.firstText);
    setResponseImageLink(instaialdata.reponseimagelink);
    setSecondText(instaialdata.secondText);
    setFirstButtonRoute(instaialdata.firstButtonRoute);
    setSecondButtonRoute(instaialdata.secoundbuttonroute);
  }, [instaialdata]);

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
    isLastTab = activeTab === tabs[tabs.length - 1];
  }, [title, subtitle, firstText, secondText]);

  const handleNext = () => {
    const currentTabIndex = tabs.indexOf(activeTab);

    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(
        tabs[currentTabIndex + 1] as "general" | "shipping" | "payment"
      );
    } else {
      handleSubmit(
        new Event("submit", { cancelable: true, bubbles: true }) as any
      );
    }
  };

  const submitvalidation = () => {
    switch (activeTab) {
      case "general":
        if (title) {
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
      if (title && subtitle) {
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

  const updateHeroSection = async (id: string, payload: Partial<any>) => {
    try {
      const response = await fetch(`/admin/hero/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update hero section");
      }

      const data = await response.json();
      setHeroSections((prevSections: any) =>
        prevSections.map((section: any) =>
          section.id === id ? { ...section, ...payload } : section
        )
      );

      // console.log("Hero section updated successfully:", data);

      return data;
    } catch (error: any) {
      console.error("Error updating hero section:", error.message || error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title,
      subtitle,
      firsttext: firstText,
      secondtext: secondText,
      image: reponseimagelink,
      firstbuttonroute: firstButtonRoute,
      secoundbuttonroute: secondButtonRoute,
    };

    try {
      const result = await updateHeroSection(id, payload);
      if (result) {
        setIsModalOpen(false);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async () => {
    if (image) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("image", image);

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

        setResponseImageLink(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  useEffect(() => {
    uploadImage();
  }, [image]);

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
            <Button onClick={() => setIsModalOpen(true)}>Edit Hero</Button>
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
                        loading ? (
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
                            <span className="text-ui-fg-subtle text-lg">
                              {loading ? "Uploading..." : "Upload Image"}
                            </span>
                          </>
                        ) : (
                          <img
                            className="w-full h-full object-cover"
                            src={reponseimagelink}
                            alt="image"
                          />
                        )
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
                          <span className="text-ui-fg-subtle text-lg">
                            {loading ? "Uploading..." : "Upload Image"}
                          </span>
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
                        setImage(file);
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
                </div>
                <div>
                  <Label htmlFor="firstButtonRoute">First Button Route</Label>
                  <Input
                    id="firstButtonRoute"
                    value={firstButtonRoute}
                    onChange={(e) => setFirstButtonRoute(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="secondButtonRoute">Second Button Route</Label>
                  <Input
                    id="secondButtonRoute"
                    value={secondButtonRoute}
                    onChange={(e) => setSecondButtonRoute(e.target.value)}
                  />
                </div>
                <div>
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
                    // console.log(title);
                    submitvalidation();
                    return;
                  }
                  if (validateCurrentTab()) handleNext();
                }}
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

const Herocard = ({
  id,
  title,
  subtitle,
  firsttext,
  secondtext,
  isDrawer,
  image,
  setShowAlert,
  key,
  secoundbuttonroute,
  firstbuttonroute,
  sectionIndex,
  setHeroSections,
  setDeleteId,
}: {
  id: string;
  title: string;
  subtitle: string;
  isDrawer: boolean;
  secoundbuttonroute: string;
  firstbuttonroute: string;
  firsttext: string;
  secondtext: string;
  image: string;
  sectionIndex: number;
  key: any;
  setShowAlert: (show: boolean) => void;
  setHeroSections: (heroSections: any) => void;
  setDeleteId: (id: string) => void;
}) => {
  // State for editing fields
  const [editTitle, setEditTitle] = useState(title);
  const [editSubtitle, setEditSubtitle] = useState(subtitle);
  const [editImage, setEditImage] = useState(image);
  const [editFirstText, setEditFirstText] = useState(firsttext);
  const [editsecoundbuttonroute, seteditSecoundbuttonroute] =
    useState(secoundbuttonroute);
  const [editfirstbuttonroute, seteditFirstbuttonroute] =
    useState(firstbuttonroute);
  const [editSecondText, setEditSecondText] = useState(secondtext);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: id,
    });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    // console.log("key", sectionIndex);
  }, [sectionIndex]);
  const updateHeroSection = async (id: string, payload: Partial<any>) => {
    try {
      const response = await fetch(`/admin/hero/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update hero section");
      }

      const data = await response.json();
      setHeroSections((prevSections: any) =>
        prevSections.map((section: any) =>
          section.id === id ? { ...section, ...payload } : section
        )
      );

      // console.log("Hero section updated successfully:", data);

      return data;
    } catch (error: any) {
      console.error("Error updating hero section:", error.message || error);
    }
  };

  const handleSave = async () => {
    const payload = {
      title: editTitle,
      subtitle: editSubtitle,
      image: editImage,
      firsttext: editFirstText,
      firstbuttonroute: editfirstbuttonroute,
      secoundbuttonroute: editsecoundbuttonroute,
      secondtext: editSecondText,
    };

    const result = await updateHeroSection(id, payload);
    if (result) {
      setDrawerOpen(false); // Close the drawer after successful update
    }
  };

  const handleMove = (direction: "up" | "down") => {
    let newIndex = sectionIndex;
    setHeroSections((prevSections: any) => {
      const currentIndex = prevSections.findIndex(
        (section: any) => section.id === id
      );

      newIndex = currentIndex;
      if (direction === "up" && currentIndex > 0) {
        newIndex = currentIndex - 1;
      } else if (
        direction === "down" &&
        currentIndex < prevSections.length - 1
      ) {
        newIndex = currentIndex + 1;
      }

      if (newIndex !== currentIndex) {
        const updatedSections = [...prevSections];
        const [movedSection] = updatedSections.splice(currentIndex, 1);
        updatedSections.splice(newIndex, 0, movedSection);
        return updatedSections;
      }

      return prevSections;
    });

    const newvaible = newIndex ? newIndex + 1 : 0;

    axios
      .patch(`/admin/hero/${id}`, { newIndex: newvaible })
      .then((response) => {
        setShowAlert(true);
        return <Alert variant="success"> Index change successfully </Alert>;
      })
      .catch((error) => {
        console.error(
          "Error updating hero section order:",
          error.message || error
        );
      });
  };

  return (
    <div style={style} className="flex  w-full gap-2">
      <Container
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={`w-[9%] h-full flex items-center justify-center ${
          isDrawer ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <DotsSix className="w-fit h-fit" />
      </Container>

      <Container className="divide-y p-0  h-[250px] flex flex-col item-center justify-center w-[90%]">
        <div className="flex items-center justify-between px-6 py-4 h-[50px]">
          <Heading level="h1">{title}</Heading>
          <div className="flex items-center justify-between px-6 py-4 w-[60%]">
            <Heading level="h3">{subtitle}</Heading>
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-2">
          <Container className="flex items-center justify-between h-[170px] object-cover aspect-[4/1] w-[300px] p-0 overflow-hidden">
            <img
              src={image}
              className="w-full h-full object-cover"
              alt="Card image"
            />
          </Container>
          <div className="flex items-center justify-between flex-col">
            <div className="px-6 py-4 w-full">
              <Button className="w-full">1. {firsttext}</Button>
            </div>
            <div className="px-6 py-4 w-full">
              <Button className="w-full">2. {secondtext}</Button>
            </div>
          </div>
          <div className="flex items-center justify-between flex-col gap-3">
            <Button onClick={() => setDeleteId(id)} variant="danger">
              Delete <XMarkMini />
            </Button>
            <HeroSectionForm
              setHeroSections={setHeroSections}
              instaialdata={{
                title,
                subtitle,
                firstText: firsttext,
                secondText: secondtext,
                reponseimagelink: image,
                firstButtonRoute: firstbuttonroute,
                secoundbuttonroute: secoundbuttonroute,
              }}
              id={id}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Herocard;
