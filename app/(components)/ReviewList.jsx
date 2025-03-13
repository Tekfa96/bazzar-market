import Image from "next/image";
import React from "react";
import { Rating as ReactRating } from "@smastrom/react-rating";

const ReviewList = ({ reviewList }) => {
  return (
    <div className="flex flex-col gap-5">
      {reviewList ? (
        reviewList.map((review, i) => (
          <div key={i} className="flexStart gap-2 p-4 bg-white rounded-xl">
            <Image
              src={review.profileImage}
              alt="profileImage"
              width={41}
              height={41}
              className="rounded-full"
            />
            <div>
              <h5 className="h5 mb-0 flexStart gap-2 capitalize">
                {review.userName}
                <p className="text-xs">
                  {new Date(review.createdAt).toLocaleString()}
                </p>
              </h5>
              <p>{review.reviewText}</p>
              <ReactRating
                style={{ maxWidth: 80 }}
                value={review.star}
                isDisabled={true}
                className="mt-1"
              />
            </div>
          </div>
        ))
      ) : (
        <div>...Loading</div>
      )}
    </div>
  );
};

export default ReviewList;
