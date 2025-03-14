import React from "react";

const AboutSection = ({ store }) => {
  return (
    <div>
      <h4 className="h4">About {store.name}</h4>
      <p>{store.aboutUs}</p>
    </div>
  );
};

export default AboutSection;
