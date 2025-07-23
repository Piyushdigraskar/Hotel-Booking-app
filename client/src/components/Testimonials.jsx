import React from "react";
import Title from "./Title";

const Testimonials = () => {
  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 pt-20 pb-30">
      <Title
        title="What Our Guests Say!"
        subTitle="Every stay has a story — these are our favorites.
Let our guests inspire your next great escape."
      ></Title>
    </div>
  );
};

export default Testimonials;
