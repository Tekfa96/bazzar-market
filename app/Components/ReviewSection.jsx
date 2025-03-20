import React, { useEffect } from "react";
import { Rating as ReactRating } from "@smastrom/react-rating";
import { useState } from "react";
import { Textarea } from "@/components/UI/textarea";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/UI/button";
import ReviewList from "./ReviewList";
import { addNewReview, getStoreReviews } from "../(utils)/GlobalApi";
import { toast } from "sonner";
const ReviewSection = ({ store }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setreviewText] = useState();
  const [reviewList, setreviewList] = useState();
  const { user } = useUser();

  const handleSubmit = () => {
    const data = {
      email: user.primaryEmailAddress.emailAddress,
      profileImage: user?.imageUrl,
      userName: user?.fullName,
      star: rating,
      reviewText: reviewText,
      storeSlug: store.slug,
    };
    //console.log(data);
    addNewReview(data).then((res) => {
      //console.log(res);
      toast.success("Review Added !");
    });
  };

  const getReviewList = () => {
    getStoreReviews(store.slug).then((res) => {
      console.log(res);
      setreviewList(res?.reviews);
    });
  };

  useEffect(() => {
    store && getReviewList();
  }, [store]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 md:gap-10 mt-10">
      {/* POST REVIEWS */}
      <div className="flex flex-col gap-2 p-5 bg-white shadow-md shadow-slate-900/5 min-w-full rounded-xl ">
        <h4 className="h4 mb-0">Add your review</h4>
        <ReactRating
          style={{ maxWidth: 100 }}
          value={rating}
          onChange={setRating}
        />
        <Textarea
          onChange={(e) => setreviewText(e.target.value)}
          className="mt-2"
        />
        <Button
          onClick={() => handleSubmit()}
          disabled={rating == 0 || !reviewText}
          className="rounded-md"
        >
          Submit
        </Button>
      </div>
      {/* REVIEWS LIST*/}
      <div>
        <ReviewList reviewList={reviewList} />
      </div>
    </div>
  );
};

export default ReviewSection;
